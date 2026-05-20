export interface CodeBlock {
  language: string;
  filename?: string;
  content: string;
}

export interface ArticleSection {
  heading?: string;
  body: string;
  code?: CodeBlock;
  note?: string;
}

export interface Article {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  readingTime: string;
  sections: ArticleSection[];
  draft?: boolean;
}

export const articles: Record<string, Article> = {
  "config-driven-ml-experiments": {
    slug: "config-driven-ml-experiments",
    title: "Config-Driven ML Experiments: Hypotheses as Code",
    date: "2026-04-15",
    category: "ML Engineering",
    tags: ["Python", "XGBoost", "PostgreSQL", "MLOps"],
    summary:
      "How moving experiment definitions into YAML config files, rather than code, keeps the training loop stable and makes hypothesis iteration a single command.",
    readingTime: "8 min",
    sections: [
      {
        heading: "When hardcoded stops scaling",
        body: "Early in the project, the training script was intentionally minimal. One symbol, one feature set, one target definition. All hardcoded. The goal was to move fast and understand the domain: what features had signal, what target horizons were realistic, whether the data pipeline was even producing clean input. Premature abstraction at that stage would have slowed down the thing that actually mattered, which was learning whether the approach was viable at all.\n\nOnce the pipeline was stable and the hypothesis space started expanding (more symbols, different timeframes, different feature combinations), the hardcoded approach stopped working. Not because it was naive, but because it had served its purpose and the problem had changed. The question was no longer whether to introduce a separation between experiment definition and execution. That was already clear. The interesting question was what form that separation should take for this specific problem.\n\nA lot of ML experiment tracking tooling (MLflow, W&B, etc.) solves a different problem: logging and comparison after the fact. What was needed here was upstream control. A way to define what to test before running it, with enough structure that the runner could consume any valid experiment without modification. That meant treating each hypothesis as a first-class artifact: a YAML file that fully specifies the experiment, feeding a generic runner that knows nothing about which symbol or feature set it's evaluating.",
      },
      {
        heading: "The experiment config",
        body: "Each experiment config defines everything the runner needs: what data to use, which features to calculate, how to define the prediction target, position sizing, and training parameters. Nothing is hardcoded in the runner.",
        code: {
          language: "yaml",
          filename: "experiments/btc-xgb-4h-momentum.yaml",
          content: `experiment_id: btc-xgb-4h-momentum
symbol: BTC/USDT
timeframe: 4h
model_type: xgboost

feature_groups:
  - momentum
  - volume
  - volatility

target:
  type: binary
  horizon: 3        # bars forward to measure
  threshold: 0.008  # 0.8% move required for a 1 label

position:
  size: 0.02        # 2% of portfolio per trade
  hold_max: 6       # exit after 6 bars regardless

training:
  train_ratio: 0.70
  min_samples: 1000
  early_stopping_rounds: 50`,
        },
      },
      {
        heading: "The runner",
        body: "The runner has one job: load a config, run the pipeline, report the result. It never needs to know which symbol you're testing or what features you've selected. Those are the config's concern.",
        code: {
          language: "python",
          filename: "runner.py",
          content: `import sys
import yaml
from src.pipeline import ExperimentPipeline

def run(config_path: str) -> None:
    with open(config_path) as f:
        config = yaml.safe_load(f)

    pipeline = ExperimentPipeline(config)
    result = pipeline.run()

    if result.gate_passed:
        print(
            f"✓ {config['experiment_id']} registered — "
            f"Sharpe: {result.sharpe:.2f}, "
            f"WR: {result.win_rate:.1%}, "
            f"vs B&H: {result.alpha:+.1%}"
        )
    else:
        print(f"✗ Gate failures: {', '.join(result.failures)}")

if __name__ == "__main__":
    run(sys.argv[1])`,
        },
        note: "A new hypothesis is a single command: python runner.py experiments/btc-xgb-4h-momentum.yaml. No code review required, no merge needed, no risk of breaking an existing model.",
      },
      {
        heading: "Feature groups as named contracts",
        body: "Feature groups are named collections of indicators registered in a central dictionary. A config references groups by name, and the FeaturePipeline resolves them to a concrete list of column names. This matters because the same feature list needs to be calculated identically at training time, backtest time, and live inference time. Saving the resolved feature names alongside the model ensures this. Even if you later rename or reorganise a group, models trained against the old definition will still resolve correctly.",
        code: {
          language: "python",
          filename: "src/features.py",
          content: `import pandas as pd
import talib

FEATURE_GROUPS: dict[str, list[str]] = {
    "momentum":   ["rsi_14", "rsi_7", "macd_signal", "macd_hist", "roc_10"],
    "volume":     ["obv_ratio", "vwap_deviation", "volume_zscore"],
    "volatility": ["atr_pct", "bb_width", "daily_range_pct"],
    "trend":      ["ema_cross_9_21", "ema_cross_21_55", "adx_14"],
}

class FeaturePipeline:
    def __init__(self, feature_groups: list[str]):
        self.feature_names = [
            name
            for group in feature_groups
            for name in FEATURE_GROUPS[group]
        ]

    def fit_transform(self, df: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
        features = self._calculate_all(df)
        metadata = {
            "feature_names": self.feature_names,
            "n_features": len(self.feature_names),
        }
        return features[self.feature_names].dropna(), metadata

    def transform(self, df: pd.DataFrame, metadata: dict) -> pd.DataFrame:
        # Use saved feature names, not current group definitions
        self.feature_names = metadata["feature_names"]
        return self._calculate_all(df)[self.feature_names].dropna()

    def _calculate_all(self, df: pd.DataFrame) -> pd.DataFrame:
        result = df.copy()
        result["rsi_14"] = talib.RSI(df["close"], timeperiod=14)
        result["rsi_7"]  = talib.RSI(df["close"], timeperiod=7)
        # ... rest of indicator calculations
        return result`,
        },
      },
      {
        heading: "Tracking results in PostgreSQL",
        body: "Every training run is a row in the database: config, metrics, whether it passed the gate, which model file it produced. This makes it possible to query across all experiments: find every model with a Sharpe above 1.0, find all BTC experiments that passed the gate, compare different feature group combinations on the same symbol. A JSON registry or flat files would make this kind of analysis much harder.",
        code: {
          language: "sql",
          content: `CREATE TABLE experiments (
    experiment_id  TEXT PRIMARY KEY,
    config         JSONB        NOT NULL,
    created_at     TIMESTAMPTZ  DEFAULT now()
);

CREATE TABLE model_results (
    id             SERIAL PRIMARY KEY,
    experiment_id  TEXT         REFERENCES experiments(experiment_id),
    model_path     TEXT,
    train_from     TIMESTAMPTZ,
    train_to       TIMESTAMPTZ,
    metrics        JSONB,
    gate_passed    BOOLEAN,
    gate_failures  TEXT[],
    trained_at     TIMESTAMPTZ  DEFAULT now()
);

-- Find all experiments that passed the gate, sorted by Sharpe
SELECT
    experiment_id,
    metrics->>'sharpe'   AS sharpe,
    metrics->>'win_rate' AS win_rate,
    metrics->>'alpha'    AS alpha,
    trained_at
FROM model_results
WHERE gate_passed = true
ORDER BY (metrics->>'sharpe')::float DESC;`,
        },
      },
      {
        heading: "What this buys you",
        body: "After running many training iterations, the config-driven approach made a few things clear that would have been difficult to see otherwise.\n\nReproducibility is the first one. Every model can be rebuilt exactly from its config file. There's no mental state to reconstruct about what settings were active that day.\n\nIteration speed is the second. Trying a new feature combination doesn't require a code change, a review, or any risk of breaking existing models. Write the YAML, run the command.\n\nAnalysis is the third. Because every result is in PostgreSQL with a consistent schema, it's straightforward to query across all experiments. Which feature groups appear most often in passing models? Which timeframes produce the most reliable results? Which symbols have enough volume for the model's minimum trade count? These are SQL queries, not grepping through log files.\n\nThe pattern isn't specific to trading. Any problem with multiple hypothesis variations: A/B testing infrastructure, hyperparameter search, recommendation model variants. All benefit from the same separation between experiment definition and execution engine.",
      },
    ],
  },

  "ml-model-training-setup": {
    slug: "ml-model-training-setup",
    title: "A Practical Setup for Training ML Models on Market Data",
    date: "2026-04-22",
    category: "ML Engineering",
    tags: ["Python", "XGBoost", "Alpaca", "Data Engineering"],
    summary:
      "The setup decisions that matter most when training ML models on market data, from data acquisition and target definition through chronological splits, feature engineering, and validation that reflects real trading.",
    readingTime: "12 min",
    sections: [
      {
        heading: "What this covers",
        body: "Most ML tutorials train on static datasets where train/test split is random and the target variable is given. Market data breaks both assumptions. The data is time-ordered, so a random split leaks future information into training. Defining whether a price move happened has to be done carefully to avoid encoding information the model wouldn't have had at prediction time.\n\nThis covers the setup decisions that matter: data acquisition and normalisation, defining a prediction target without leakage, feature engineering that stays honest about lookback windows, chronological splitting, training XGBoost, and validation that tells you whether the model actually works rather than whether it memorised the training set.",
      },
      {
        heading: "Data acquisition",
        body: "Alpaca provides free OHLCV data for US equities and crypto. The key thing when pulling historical bars is to request adjusted data. Corporate actions like splits and dividends create discontinuities in the raw price series that produce false signals for momentum features.",
        code: {
          language: "python",
          filename: "src/collectors/alpaca.py",
          content: `import alpaca_trade_api as tradeapi
import pandas as pd
from datetime import datetime, timezone

class AlpacaCollector:
    def __init__(self, api_key: str, secret_key: str):
        self.api = tradeapi.REST(
            api_key, secret_key,
            base_url="https://data.alpaca.markets"
        )

    def get_bars(
        self,
        symbol: str,
        timeframe: str,  # "1Day", "1Hour", "4Hour"
        start: str,
        end: str,
    ) -> pd.DataFrame:
        bars = self.api.get_bars(
            symbol,
            timeframe,
            start=start,
            end=end,
            adjustment="all",  # split + dividend adjusted
        ).df

        bars.index = bars.index.tz_convert("UTC")
        bars.columns = [c.lower() for c in bars.columns]

        return bars[["open", "high", "low", "close", "volume"]]`,
        },
        note: "Always normalise timestamps to UTC before storing. Mixing naive and tz-aware datetimes is a reliable source of hard-to-find bugs in backtesting.",
      },
      {
        heading: "Defining the target: the most important decision",
        body: "The target variable is a forward-looking quantity: does price rise by at least X% over the next N bars? There are two ways to get this wrong.\n\nThe first is calculating forward returns on the full dataset before splitting. If you do this, the test set's target was calculated using data from within the test period, which is fine. But if you ever normalise features using the full dataset's statistics (mean, std), those statistics encode information from the test period and contaminate training. The safest habit is to calculate everything within each split.\n\nThe second mistake is using a single forward bar's return as the target. A single bar is noisy. A horizon of 3-5 bars with a minimum threshold (0.8%–1.5% depending on the asset) produces cleaner signal.",
        code: {
          language: "python",
          filename: "src/targets.py",
          content: `import numpy as np
import pandas as pd

def binary_target(
    close: pd.Series,
    horizon: int,
    threshold: float,
) -> pd.Series:
    """
    Returns 1 if price rises >= threshold% over the next
    horizon bars, else 0. NaN for the final horizon rows
    where the forward return cannot be calculated.
    """
    forward_return = close.shift(-horizon) / close - 1
    return (forward_return >= threshold).astype("Int64")

# --- Usage ---

split_idx = int(len(df) * 0.70)
train_df  = df.iloc[:split_idx].copy()
test_df   = df.iloc[split_idx:].copy()

# Calculate targets independently within each split
train_df["target"] = binary_target(train_df["close"], horizon=3, threshold=0.008)
test_df["target"]  = binary_target(test_df["close"],  horizon=3, threshold=0.008)

# Drop rows at the end of each split where target is NaN
train_df = train_df.dropna(subset=["target"])
test_df  = test_df.dropna(subset=["target"])`,
        },
      },
      {
        heading: "Feature engineering and the lookback window rule",
        body: "Every feature must use only data available at the time of the prediction. The lookback window rule: if a feature uses the last N bars, it must be calculated using a rolling window, never a full-series normalisation. This is where most implementations silently leak.\n\nVolume z-score is the classic trap. Normalising volume by the full series mean and standard deviation uses future statistics. Normalising by a rolling 20-bar mean uses only past data. The model result can look completely different.",
        code: {
          language: "python",
          filename: "src/features.py",
          content: `import pandas as pd
import numpy as np
import talib

def momentum_features(df: pd.DataFrame) -> pd.DataFrame:
    out = pd.DataFrame(index=df.index)
    out["rsi_14"]    = talib.RSI(df["close"], timeperiod=14)
    out["rsi_7"]     = talib.RSI(df["close"], timeperiod=7)
    out["macd_hist"] = talib.MACD(df["close"])[2]
    out["roc_10"]    = talib.ROC(df["close"], timeperiod=10)
    return out

def volume_features(df: pd.DataFrame) -> pd.DataFrame:
    out = pd.DataFrame(index=df.index)

    rolling_mean = df["volume"].rolling(20).mean()
    rolling_std  = df["volume"].rolling(20).std()

    # Correct: rolling normalisation (past data only)
    out["volume_zscore"] = (df["volume"] - rolling_mean) / rolling_std

    # Wrong: full-series normalisation (leaks future statistics)
    # out["volume_zscore"] = (df["volume"] - df["volume"].mean()) / df["volume"].std()

    obv = talib.OBV(df["close"], df["volume"])
    out["obv_ratio"] = obv / obv.rolling(20).mean()

    return out

def volatility_features(df: pd.DataFrame) -> pd.DataFrame:
    out = pd.DataFrame(index=df.index)
    out["atr_pct"]        = talib.ATR(df["high"], df["low"], df["close"], 14) / df["close"]
    out["bb_width"]       = (talib.BBANDS(df["close"])[0] - talib.BBANDS(df["close"])[2]) / df["close"]
    out["daily_range_pct"] = (df["high"] - df["low"]) / df["close"]
    return out`,
        },
      },
      {
        heading: "The chronological split",
        body: "Never shuffle time series data. A random split will place future observations in the training set, and the model will learn patterns that include information it wouldn't have had at prediction time. The result looks like a high-performing model but degrades immediately in live trading.\n\nChronological split: everything before the split date trains the model, everything after tests it. Some practitioners add a gap between train and test equal to the maximum feature lookback period (e.g., 55 bars for a 55-period EMA) to ensure no feature calculation in the test set uses data from the training period.",
        code: {
          language: "python",
          filename: "src/splitting.py",
          content: `import pandas as pd

def chronological_split(
    df: pd.DataFrame,
    train_ratio: float = 0.70,
    gap_bars: int = 0,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Split by time position, not randomly.
    gap_bars: bars to drop at the start of test to avoid any
    feature calculation overlap with the training window.
    """
    n = len(df)
    split = int(n * train_ratio)

    train = df.iloc[:split]
    test  = df.iloc[split + gap_bars:]

    return train, test

# --- Example ---
train, test = chronological_split(df, train_ratio=0.70, gap_bars=55)

print(f"Train: {train.index[0]} → {train.index[-1]} ({len(train)} bars)")
print(f"Test:  {test.index[0]} → {test.index[-1]} ({len(test)} bars)")`,
        },
        note: "Walk-forward validation takes this further: train on months 1-12, test on month 13, then train on 1-13, test on 14, and so on. This gives you a realistic picture of how the model holds up as time passes and the training window shifts.",
      },
      {
        heading: "Training XGBoost",
        body: "XGBoost works well for tabular market data. It handles the non-linear relationships between features naturally, doesn't require feature scaling, and the early stopping mechanism prevents overfitting without requiring you to guess the right number of estimators. Keep max_depth shallow (3-5) to reduce overfitting. Financial features tend to interact in low-order ways.",
        code: {
          language: "python",
          filename: "src/training.py",
          content: `import xgboost as xgb
import numpy as np
from dataclasses import dataclass

@dataclass
class TrainingResult:
    model: xgb.XGBClassifier
    feature_names: list[str]
    feature_metadata: dict
    predictions: np.ndarray
    probas: np.ndarray
    y_test: np.ndarray

def train(
    train_df,
    test_df,
    feature_names: list[str],
    feature_metadata: dict,
    config: dict,
) -> TrainingResult:
    target = "target"

    X_train = train_df[feature_names].dropna()
    y_train = train_df.loc[X_train.index, target]

    X_test  = test_df[feature_names].dropna()
    y_test  = test_df.loc[X_test.index, target]

    model = xgb.XGBClassifier(
        n_estimators=500,
        learning_rate=0.05,
        max_depth=4,           # shallow to reduce overfit
        subsample=0.8,
        colsample_bytree=0.8,
        min_child_weight=5,    # minimum samples per leaf
        early_stopping_rounds=config.get("early_stopping_rounds", 50),
        eval_metric="logloss",
        random_state=42,
        verbosity=0,
    )

    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=False,
    )

    predictions = model.predict(X_test)
    probas      = model.predict_proba(X_test)[:, 1]

    return TrainingResult(
        model=model,
        feature_names=feature_names,
        feature_metadata=feature_metadata,
        predictions=predictions,
        probas=probas,
        y_test=y_test.values,
    )`,
        },
      },
      {
        heading: "Validation that reflects real trading",
        body: "Accuracy on the test set is a weak signal for trading models. A model that predicts 1 every time on a bull market has high accuracy and loses money the moment the market turns. The metrics that matter are Sharpe ratio (risk-adjusted return), win rate (what fraction of trades are profitable), and comparison to buy-and-hold (does the model actually add alpha, or is it just capturing the market trend).",
        code: {
          language: "python",
          filename: "src/validation.py",
          content: `import numpy as np
import pandas as pd

def sharpe_ratio(returns: pd.Series, periods_per_year: int = 252) -> float:
    if returns.std() == 0:
        return 0.0
    return (returns.mean() / returns.std()) * np.sqrt(periods_per_year)

def backtest(
    test_df: pd.DataFrame,
    probas: np.ndarray,
    entry_threshold: float = 0.60,
    horizon: int = 3,
) -> dict:
    """
    Simulate entering on signal, holding for horizon bars.
    """
    close = test_df["close"].iloc[-len(probas):]
    signals = (probas >= entry_threshold).astype(int)

    # Forward return over the holding period
    forward_return = close.pct_change(horizon).shift(-horizon)

    strategy_returns = forward_return * signals
    buy_hold_returns = forward_return

    strat  = strategy_returns.dropna()
    buyhold = buy_hold_returns.dropna()

    return {
        "sharpe":          round(sharpe_ratio(strat), 3),
        "win_rate":        round((strat > 0).mean(), 4),
        "total_return":    round((1 + strat).prod() - 1, 4),
        "buy_hold_return": round((1 + buyhold).prod() - 1, 4),
        "alpha":           round(((1 + strat).prod() - 1) - ((1 + buyhold).prod() - 1), 4),
        "n_trades":        int(signals.sum()),
        "signal_rate":     round(signals.mean(), 4),
    }`,
        },
      },
      {
        heading: "What to expect from the first run",
        body: "Capital protection models tend to validate well. These identify conditions where holding cash beats holding the asset. Bear markets and high-volatility sideways periods have strong feature signatures that a gradient boosted model can identify reliably.\n\nGenerating consistent alpha is harder. Markets are adversarial in a way that most ML datasets are not: when a pattern is profitable, other participants find it and arbitrage it away. This is why the evaluation loop matters more than the model architecture. A weak model that you can evaluate honestly and iterate on quickly will outperform a sophisticated model trained once on a static dataset.\n\nStart simple: one symbol, one timeframe, two or three feature groups. Build the evaluation infrastructure first. Then expand.",
        note: "The three most common mistakes in the first few attempts are: calculating forward returns on the full dataset before splitting, using full-series feature normalisation instead of rolling windows, and evaluating on accuracy instead of Sharpe. Fix these before worrying about model architecture.",
      },
    ],
  },


  "trading-platform-architecture": {
    slug: "trading-platform-architecture",
    title: "Architecture of a Systematic Trading Platform",
    date: "2026-04-29",
    category: "System Design",
    tags: ["Python", "PostgreSQL", "XGBoost", "FastAPI", "Architecture"],
    summary:
      "A walkthrough of the four subsystems in a systematic trading platform: data ingestion, feature calculation, experiment-driven training, and broker execution. Plus the design constraints that shaped each one before the first line of code.",
    readingTime: "10 min",
    sections: [
      {
        heading: "What this system is",
        body: "This platform started as two parallel experiments. One was learning where different ML approaches break down across equity and crypto markets. The other was a harder question to answer in the abstract: how far can AI-assisted development take you on a genuinely complex engineering problem? Algorithmic trading is a good test for both. The feedback loop is honest. A model that looks good in training will tell you quickly in paper trading whether it is actually good or whether it got lucky on one historical window.\n\nThe system that grew out of that work has four main subsystems. A data pipeline pulls from Polygon for equities (WebSocket live feed and REST historical) and from CoinGecko and GeckoTerminal for crypto market data, with Binance as the primary crypto gap filler. Equity orders route through Alpaca. Crypto orders route through Binance. A centralized feature pipeline transforms raw OHLCV data into model-ready features. An experiment-driven training infrastructure runs hypotheses defined in YAML configs and tracks all results in PostgreSQL. Broker execution integrations push orders through each broker behind a shared interface, with a validation layer and a local ledger that tracks what the system intended versus what actually executed.\n\nThe YAML experiment config pattern is covered in depth in [Config-Driven ML Experiments: Hypotheses as Code](/articles/config-driven-ml-experiments). The core XGBoost training setup is covered in depth in [A Practical Setup for Training ML Models on Market Data](/articles/ml-model-training-setup). This article describes how the four subsystems fit together and the design constraints that shaped the boundaries between them.",
      },
      {
        heading: "Design constraints known before writing any code",
        body: "Four constraints were clear from the start. Each one had a direct architectural consequence.\n\nData integrity. Market data from four sources with different schemas, update frequencies, and reliability characteristics would need to arrive at a single canonical representation. Any gap in the data reaching model training would corrupt feature calculations in ways that could be hard to detect until a model produced inexplicable results.\n\nFeature consistency. Whatever features were calculated during training needed to be calculated identically during backtesting and live inference. This sounds simple. It is harder to maintain than it looks as the feature library grows and as different parts of the pipeline make different assumptions about lookback windows and rolling periods.\n\nEvaluation rigour. Financial markets are non-stationary. Standard ML evaluation metrics do not map to trading performance. The evaluation layer needed to measure what actually mattered: Sharpe ratio, win rate relative to a benchmark, and alpha against buy-and-hold.\n\nExecution safety. Moving from paper trading to live trading means real orders. The execution layer needed to validate orders before submission and maintain its own record of positions so that a discrepancy between what the system believed and what the broker reported could be caught immediately.",
      },
      {
        heading: "How the subsystems connect",
        body: "Data flows in one direction through the system. Collectors ingest from each source and normalize into a canonical OHLCV schema stored in PostgreSQL. The feature pipeline reads from that schema and computes features on demand, saving metadata at training time to guarantee identical calculation at inference. The training runner reads from the feature pipeline, trains a model, runs it through a three-tier gate, and commits passing models to a models directory. The execution layer loads a gate-passing model, generates signals through the same feature pipeline used in training, and submits orders to the broker.\n\nNo subsystem reaches across another's boundary. The execution layer does not know how features are calculated. The feature pipeline does not know what model will consume its output. The training runner does not know which broker will execute the resulting signals. These clean interfaces were a deliberate choice: the most likely thing to change in a system like this is a data source. Binance's WebSocket volume stream broke mid-project. Replacing it touched one collector class and nothing else in the pipeline.",
        code: {
          language: "python",
          filename: "pipeline/runner.py",
          content: `import yaml
from pipeline.data import DataPipeline
from pipeline.features import FeaturePipeline
from pipeline.training import Trainer
from pipeline.gate import ModelGate
from pipeline.registry import ModelRegistry

def run(config_path: str) -> RunResult:
    with open(config_path) as f:
        config = yaml.safe_load(f)

    # 1. Data: ensure coverage, run quality checks
    data = DataPipeline()
    data.ensure_coverage(config["symbol"], config["timeframe"])
    df = data.load(config["symbol"], config["timeframe"])
    quality_errors = data.check_quality(df)
    if quality_errors:
        return RunResult.failed(quality_errors)

    # 2. Features: fit and save metadata for inference parity
    features = FeaturePipeline(config["feature_groups"])
    X, metadata = features.fit_transform(df)

    # 3. Training: chronological split, XGBoost, gate metrics
    result = Trainer(config).train(X, metadata)

    # 4. Gate: three-tier validation before any model touches execution
    gate_result = ModelGate().run(result, config)
    if not gate_result.passed:
        return RunResult.gate_failed(gate_result.failures)

    # 5. Registry: commit model + metadata together
    ModelRegistry().commit(result, metadata, config)
    return RunResult.success(result)`,
        },
      },
      {
        heading: "The experiment config as the organizing principle",
        body: "The YAML experiment config is the central artifact that ties training to execution. An experiment defines a symbol, timeframe, model type, feature groups, target definition, position sizing, and training parameters. The runner consumes any valid config without modification. All results are tracked in PostgreSQL against the config that produced them.\n\nThe practical effect of this design is that the training codebase stays stable as the number of experiments grows. Adding a new hypothesis is a new file, not a code change. At a few dozen configs, the separation between experiment definition and execution keeps the codebase from accumulating branching logic that makes it hard to trust any individual result. This pattern is covered in depth in [Config-Driven ML Experiments: Hypotheses as Code](/articles/config-driven-ml-experiments).",
      },
      {
        heading: "Hardware and continuous operation",
        body: "Training runs on dedicated hardware with an RTX 4090. Most XGBoost training runs are fast enough that GPU acceleration is not the bottleneck, but it matters for larger multi-class architectures and for batch training across many configs simultaneously.\n\nThe data collectors and paper trading sessions run continuously. Collectors include gap-filling routines that detect missing windows and backfill them on a schedule. Paper trading consumes live market data through the same feature pipeline used in training, which is the only way to trust that what was measured in backtest reflects what would be seen in execution.",
      },
    ],
  },

  "data-normalization-multi-source": {
    slug: "data-normalization-multi-source",
    title: "Multi-Source Market Data: Normalization, Gap Filling, and Integrity Checks",
    date: "2026-05-06",
    category: "Data Engineering",
    tags: ["Python", "PostgreSQL", "Polygon", "Binance", "Data Engineering"],
    summary:
      "How a trading platform ingests market data from four sources with different schemas, handles source failures mid-project without touching the rest of the pipeline, detects and fills gaps continuously, and validates data quality before it reaches model training.",
    readingTime: "11 min",
    sections: [
      {
        heading: "The multi-source problem",
        body: "The platform pulls market data from four sources, split between equities and crypto.\n\nFor equities: Polygon is the primary source. A WebSocket connection streams live 1-minute bars during market hours. REST endpoints fill historical data and backfill gaps. Timestamps are UTC, the schema is clean JSON, and volume coverage is near-complete.\n\nFor crypto: two sources handle live data. CoinGecko REST provides 5-minute OHLCV bars on a cron schedule running every five minutes. GeckoTerminal provides 1-minute OHLCV live and is the primary historical backfill source. Both are free tier with no paid API contracts. Binance serves as the third crypto source: REST endpoints for gap-filling recent windows, and the execution API for submitting crypto orders.\n\nEach source has a distinct format challenge. Polygon and CoinGecko use clean JSON with UTC timestamps. Binance returns kline data as arrays rather than objects, so field access is positional by index, and timestamps are millisecond epoch integers that need conversion to UTC before storage. GeckoTerminal has more variable response latency and a schema that changed at least once mid-project.\n\nThe normalization challenge was not just format conversion. It was designing a pipeline where each source's data arrived at PostgreSQL in a canonical form that the feature pipeline could query without knowing which source produced a given row.",
      },
      {
        heading: "The adapter pattern",
        body: "Each source has a dedicated collector class that inherits from a shared abstract base. The base defines the interface: fetch a symbol-timeframe pair for a date range, normalize the raw response into the canonical schema, and store the result. The collector handles the raw fetch. The normalizer handles schema conversion. Nothing downstream knows or cares which collector produced a given row.",
        code: {
          language: "python",
          filename: "collectors/base.py",
          content: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
import pandas as pd

@dataclass
class OHLCVBar:
    symbol:    str
    timeframe: str
    source:    str
    timestamp: datetime  # always UTC
    open:      float
    high:      float
    low:       float
    close:     float
    volume:    float
    vwap:      float | None = None

class BaseCollector(ABC):
    source: str

    @abstractmethod
    def fetch(
        self,
        symbol: str,
        timeframe: str,
        start: datetime,
        end: datetime,
    ) -> list[OHLCVBar]: ...

    def normalize(self, raw: dict) -> OHLCVBar: ...

    def store(self, bars: list[OHLCVBar], session) -> int:
        # Upsert by (symbol, timeframe, source, timestamp)
        # Returns count of new rows inserted
        ...`,
        },
        note: "The source field on every row matters when the same symbol is covered by multiple collectors. It lets quality checks compare coverage across sources and detect when one source's data diverges from another's.",
      },
      {
        heading: "Handling source failures",
        body: "Midway through the project, the Binance WebSocket volume stream started returning inconsistent readings on some symbols, with reported volume 10x the expected values. The cause was not clear from the API documentation and debugging the WebSocket integration would have taken time with an uncertain outcome.\n\nThe decision was to replace it. The REST historical endpoint was reliable. WebSocket was only adding live updates. Switching to polling the REST endpoint on a short interval sacrificed a small amount of latency for reliability. The change touched one collector class. The PostgreSQL schema was unchanged. The feature pipeline was unchanged. Models already trained on Binance data continued to work.\n\nThis is the practical value of the adapter boundary in a project like this. Data sources are not permanent. APIs change, rate limits change, reliability changes. Each source being an interchangeable unit means you can respond to those changes without rewriting the pipeline around them. When a source proves unreliable, you replace the collector and move on.\n\nA separate discovery came after the WebSocket fix was in place. Binance.US USD pairs had structural low volume coverage: around 7.6% of expected trading volume, because most crypto activity flows through USDT pairs rather than USD. This was not a data quality error. It was a characteristic of the market. Volume-based features calculated from Binance.US USD data were unreliable regardless of how clean the ingestion was. The response was to exclude volume features from the crypto feature set. Crypto models train on 12 features. Equity models train on 14. The same FeaturePipeline handles both, configured differently by experiment.",
      },
      {
        heading: "Gap detection and continuous filling",
        body: "Collectors do not run as single historical dumps. They run continuously and include a gap filler that detects missing windows and schedules backfills.\n\nA gap is any expected bar that is absent from the database. For a symbol with 1-hour bars, the gap filler queries the expected timestamps for a trailing window and compares them against what is in PostgreSQL. Missing timestamps are grouped into contiguous ranges and fetched as batch requests from the source.",
        code: {
          language: "python",
          filename: "collectors/gap_filler.py",
          content: `from datetime import datetime, timezone, timedelta
import pandas as pd

def find_gaps(
    symbol: str,
    timeframe: str,
    source: str,
    lookback_days: int,
    session,
) -> list[tuple[datetime, datetime]]:
    now   = datetime.now(timezone.utc)
    start = now - timedelta(days=lookback_days)

    freq_map = {"1h": "1h", "4h": "4h", "1d": "1D"}
    expected = pd.date_range(start=start, end=now, freq=freq_map[timeframe], tz="UTC")

    existing = {
        row.timestamp
        for row in session.query(OHLCVRow.timestamp)
        .filter_by(symbol=symbol, timeframe=timeframe, source=source)
        .filter(OHLCVRow.timestamp >= start)
        .all()
    }

    missing = [ts for ts in expected if ts not in existing]
    if not missing:
        return []

    # Group into contiguous ranges to minimise API calls
    gaps, range_start, prev = [], missing[0], missing[0]
    for ts in missing[1:]:
        if ts - prev > pd.Timedelta(freq_map[timeframe]):
            gaps.append((range_start, prev))
            range_start = ts
        prev = ts
    gaps.append((range_start, prev))
    return gaps`,
        },
        note: "Gap filler schedule is per-source. Polygon fills on a short schedule during market hours. CoinGecko runs on the 5-minute cron cadence but is rate-limited on the free tier, so backfilling large windows requires spreading requests. GeckoTerminal is the primary route for deeper crypto historical backfills.",
      },
      {
        heading: "Quality checks before training",
        body: "Gap filling is necessary but not sufficient. Data can be present and still wrong. Prices with zero volume across a window. Timestamps out of order. Suspiciously flat close prices that suggest a stale feed. A zero-volume bar is more likely a feed error than a genuinely tradeless period.\n\nThe training runner runs quality checks against raw OHLCV data before any feature calculation. These checks are a hard gate: training does not proceed on data that fails.",
        code: {
          language: "python",
          filename: "pipeline/quality.py",
          content: `import pandas as pd

def check_data_quality(
    df: pd.DataFrame,
    min_bars: int = 1000,
    max_gap_pct: float = 0.02,
    min_volume_coverage: float = 0.95,
) -> list[str]:
    failures = []

    if len(df) < min_bars:
        failures.append(f"insufficient data: {len(df)} bars, need {min_bars}")

    if not df["timestamp"].is_monotonic_increasing:
        failures.append("timestamps not monotonically increasing")

    expected_count = (
        (df["timestamp"].max() - df["timestamp"].min())
        / pd.Timedelta("1h") + 1
    )
    gap_pct = 1 - len(df) / expected_count
    if gap_pct > max_gap_pct:
        failures.append(
            f"gap rate {gap_pct:.1%} exceeds threshold {max_gap_pct:.1%}"
        )

    volume_coverage = (df["volume"] > 0).mean()
    if volume_coverage < min_volume_coverage:
        failures.append(
            f"volume coverage {volume_coverage:.1%} below threshold {min_volume_coverage:.1%}"
        )

    return failures`,
        },
        note: "A training run that fails a quality check is logged with the failure reason and skipped. The model is not trained. This is preferable to training on bad data and discovering the problem after the model passes the gate.",
      },
    ],
  },

  "training-pipeline-fail-fast": {
    slug: "training-pipeline-fail-fast",
    title: "Model Training Pipelines and the Fail-Fast Methodology",
    date: "2026-05-13",
    category: "ML Engineering",
    tags: ["Python", "XGBoost", "PostgreSQL", "MLOps"],
    summary:
      "How the training pipeline enforces feature consistency across training, backtesting, and live inference, why a three-tier model gate is the right checkpoint for this domain, and what fail-fast means in practice when iterating across dozens of experiment configurations.",
    readingTime: "10 min",
    sections: [
      {
        heading: "The feature consistency problem",
        body: "Early in the project, training runs produced models that looked reasonable in isolation but were difficult to compare across experiments. Sharpe ratios were inconsistent in ways that did not track cleanly with changes to the experiment configs. Some of the variance was expected randomness. Some of it was a real problem that took time to find.\n\nThe root cause was that training and backtesting were computing rolling features from different starting points in the historical data. Training computed features over the full historical dataset before the split. Backtesting computed the same features from the start of the backtest window. The two calculations used different lookback windows for the initial bars, which produced different feature distributions at the edges. The models were not being evaluated on features computed the same way they had been trained.\n\nThis is a subtle form of evaluation inconsistency. It does not corrupt the training set by exposing it to future data. It corrupts the comparison between training performance and backtest performance by making them measure slightly different things. The result is that backtest metrics are not a reliable predictor of paper trading performance, which defeats the purpose of running backtests.",
      },
      {
        heading: "FeaturePipeline as the single source of truth",
        body: "The fix was a centralized FeaturePipeline class that is the only thing in the system allowed to compute features. Training calls it. Backtesting calls it. Live inference calls it. They all call it the same way with the same inputs.\n\nThe pipeline saves feature metadata at training time: the exact list of feature names, the feature groups used, and the resolved column ordering. At inference time, the saved metadata is loaded and used to replicate the exact calculation. Even if a feature group definition changes between a model's training run and a later inference run, the saved metadata ensures the original features are reproduced correctly.",
        code: {
          language: "python",
          filename: "pipeline/features.py",
          content: `from dataclasses import dataclass
import pandas as pd

@dataclass
class FeatureMetadata:
    feature_names: list[str]
    groups: list[str]
    n_features: int
    computed_at: str  # ISO timestamp of training run

class FeaturePipeline:
    def __init__(self, feature_groups: list[str]):
        self.feature_groups = feature_groups
        self.feature_names  = self._resolve(feature_groups)

    def fit_transform(
        self, df: pd.DataFrame
    ) -> tuple[pd.DataFrame, FeatureMetadata]:
        features = self._compute(df)
        metadata = FeatureMetadata(
            feature_names=self.feature_names,
            groups=self.feature_groups,
            n_features=len(self.feature_names),
            computed_at=pd.Timestamp.utcnow().isoformat(),
        )
        return features[self.feature_names].dropna(), metadata

    def transform(
        self, df: pd.DataFrame, metadata: FeatureMetadata
    ) -> pd.DataFrame:
        # Use saved names from training, not current group definitions
        self.feature_names = metadata.feature_names
        return self._compute(df)[self.feature_names].dropna()

    def _resolve(self, groups: list[str]) -> list[str]:
        return [name for g in groups for name in FEATURE_GROUPS[g]]

    def _compute(self, df: pd.DataFrame) -> pd.DataFrame:
        # Indicator calculations for all registered groups
        ...`,
        },
        note: "The metadata file is as important as the model file. A model loaded without its metadata cannot be used correctly. The training runner saves both to the same directory and the execution layer loads both together.",
      },
      {
        heading: "The three-tier model gate",
        body: "Every training run ends at the gate. No model reaches paper trading without passing all three tiers.\n\nTier one is sanity checks: does the model file exist, are metrics populated, does the training data meet minimum coverage requirements. There is no point evaluating performance on a model that did not save correctly or on data that was below the minimum threshold. The gate fails here and logs the reason.\n\nTier two is performance checks: is total return positive, is Sharpe above a minimum threshold, is win rate in a plausible range, does the strategy beat buy-and-hold. These thresholds are conservative. The goal is not to pass the best models. It is to reject models that could not possibly be useful in execution.\n\nTier three is statistical checks: is the test sample large enough for the reported metrics to be reliable, are the returns statistically significant. A model that shows a Sharpe of 1.2 on 40 test trades has not demonstrated anything.",
        code: {
          language: "python",
          filename: "pipeline/gate.py",
          content: `from dataclasses import dataclass

@dataclass
class GateResult:
    passed: bool
    failures: list[str]

def run_gate(result: TrainingResult, config: dict) -> GateResult:
    failures = []

    # Tier 1: Sanity
    if not result.model_path.exists():
        failures.append("model file missing")
    if result.metrics is None:
        failures.append("metrics not populated")
    if result.n_train_samples < config["training"].get("min_samples", 500):
        failures.append(f"insufficient training data: {result.n_train_samples} samples")
    if failures:
        return GateResult(passed=False, failures=failures)

    # Tier 2: Performance
    m = result.metrics
    if m["total_return"] <= 0:
        failures.append(f"negative return: {m['total_return']:.2%}")
    if m["sharpe"] < 0.5:
        failures.append(f"Sharpe below threshold: {m['sharpe']:.2f}")
    if not (0.45 <= m["win_rate"] <= 0.75):
        failures.append(f"win rate out of range: {m['win_rate']:.1%}")
    if m["alpha"] < 0:
        failures.append(f"negative alpha vs buy-and-hold: {m['alpha']:.2%}")
    if failures:
        return GateResult(passed=False, failures=failures)

    # Tier 3: Statistical
    if result.n_test_samples < 100:
        failures.append(f"test sample too small: {result.n_test_samples} trades")
    if m.get("p_value") and m["p_value"] > 0.05:
        failures.append(f"returns not statistically significant: p={m['p_value']:.3f}")

    return GateResult(passed=not failures, failures=failures)`,
        },
      },
      {
        heading: "What fail-fast means for this domain",
        body: "Fail-fast in software engineering usually means catching errors early so they do not propagate. In ML experiment iteration it means something slightly different: run the cheap checks before the expensive ones, and stop any experiment that cannot produce a useful result before investing compute in it.\n\nData quality checks run before feature calculation. Feature calculation runs before model training. The gate runs after training but before any model reaches paper trading. Each step is a checkpoint. An experiment with a misconfigured target definition or insufficient data fails immediately with a clear reason. The researcher reads the log, fixes the config, and reruns. No waiting for a slow training run to complete before discovering the run was invalid from the start.\n\nThis also shapes how you think about experiment iteration. Rather than carefully designing each config before running it, you can move faster and let the gate be the filter. Write a reasonable config, run it, read the gate output. If it fails at the sanity tier, fix the config. If it fails at the performance tier, the model trained but was not strong enough. If it passes, it earned its way to paper trading. The gate is not just a safety check. It is the feedback mechanism that makes rapid iteration trustworthy.",
      },
      {
        heading: "What the results showed",
        body: "Capital protection models trained reliably and consistently. These are models configured to identify conditions where holding cash is better than holding the asset. Bear markets and high-volatility sideways periods have strong feature signatures that XGBoost identifies well. The gate pass rate for capital protection configs across different symbols and timeframes was significantly higher than for alpha-generating configs.\n\nGenerating consistent positive alpha is harder. The difficulty is not the model architecture or the feature set. A pattern that generates alpha attracts capital, which arbitrages the pattern away. The right response to this is not a more sophisticated model but a faster iteration loop. The config system and the gate were built for exactly this. The gate enforces that any model reaching execution has earned it. The logging infrastructure keeps a complete record of every experiment that did not pass, which is as informative as the ones that did.",
      },
    ],
  },

  "backtest-variants": {
    slug: "backtest-variants",
    title: "Backtest Variants: Walk-Forward, Regime Testing, and Window Sampling",
    date: "2026-05-20",
    category: "ML Engineering",
    tags: ["Python", "Backtesting", "Statistics", "XGBoost"],
    summary:
      "Why a single train/test holdout is not enough for financial models, and how three complementary backtest approaches give a more complete picture of model robustness before any strategy reaches paper trading.",
    readingTime: "9 min",
    sections: [
      {
        heading: "Why a single holdout is not enough",
        body: "The standard ML evaluation approach: split chronologically, train on the earlier portion, test on the later portion, report metrics. This is the minimum requirement. For financial models it is not sufficient on its own.\n\nA single holdout window samples one market regime. If the training data runs from 2021 to 2023 and the test window is late 2023, the model is evaluated on whatever conditions existed in that specific period. If that period happened to be low-volatility and the model was trained on high-volatility data, the reported metrics reflect that particular transition, not the model's general reliability across market conditions.\n\nThree complementary approaches fill this out. Walk-forward validation tests whether performance holds as the training window advances. Regime testing asks whether performance holds across structurally different market conditions. Window sampling tests whether reported metrics are sensitive to the specific holdout dates chosen. Together they answer three distinct questions that a single holdout cannot.",
      },
      {
        heading: "Walk-forward validation",
        body: "Walk-forward validation advances the training window in time and tests on the subsequent period repeatedly. Rather than training once on 70% and testing on 30%, you train on months 1 through 12, test on month 13, then train on months 1 through 13, test on month 14, and so on. The result is a series of performance scores across many windows rather than one score on one window.\n\nA model that produces consistent Sharpe ratios across many walk-forward windows is more trustworthy than one that performs well on a single holdout. The variance of the walk-forward scores is informative on its own. High variance means performance is sensitive to which window it is evaluated on.",
        code: {
          language: "python",
          filename: "backtesting/walk_forward.py",
          content: `from datetime import datetime
from typing import Generator
import pandas as pd

def walk_forward_splits(
    df: pd.DataFrame,
    initial_train_months: int = 12,
    test_months: int = 1,
    step_months: int = 1,
) -> Generator[tuple[pd.DataFrame, pd.DataFrame], None, None]:
    train_end = df.index[0] + pd.DateOffset(months=initial_train_months)

    while True:
        test_end = train_end + pd.DateOffset(months=test_months)
        if test_end > df.index[-1]:
            break

        train = df[df.index < train_end]
        test  = df[(df.index >= train_end) & (df.index < test_end)]

        if len(train) > 0 and len(test) > 0:
            yield train, test

        train_end += pd.DateOffset(months=step_months)

# Usage: collect Sharpe across all windows
sharpes = []
for train_df, test_df in walk_forward_splits(df, initial_train_months=12):
    model, metadata = train(train_df, config)
    metrics = backtest(test_df, model, metadata)
    sharpes.append(metrics["sharpe"])

print(f"Walk-forward Sharpe: mean={sum(sharpes)/len(sharpes):.2f}, "
      f"std={pd.Series(sharpes).std():.2f}, "
      f"negative windows={sum(s < 0 for s in sharpes)}/{len(sharpes)}")`,
        },
      },
      {
        heading: "Regime testing",
        body: "Markets move through structurally different conditions: bull markets with persistent upward trend and low volatility, bear markets with sustained drawdown, and sideways markets with no clear direction and high intraday noise. Each regime has different feature distributions and different optimal strategies.\n\nA model trained and tested predominantly in bull-market data can look strong and then fail the moment the regime changes. Regime testing partitions the test period by market condition and evaluates performance on each partition separately. The goal is to understand which regimes the model is actually reliable in, not just whether it looks good across the averaged result.",
        code: {
          language: "python",
          filename: "backtesting/regime.py",
          content: `import numpy as np
import pandas as pd

def classify_regime(df: pd.DataFrame, window: int = 50) -> pd.Series:
    trend = df["close"].rolling(window).mean().pct_change()

    regime = pd.Series("sideways", index=df.index)
    regime[trend >  0.002] = "bull"
    regime[trend < -0.002] = "bear"
    return regime

def evaluate_by_regime(
    df: pd.DataFrame,
    probas: np.ndarray,
    entry_threshold: float,
    horizon: int,
) -> dict[str, dict]:
    regime = classify_regime(df)
    forward_return = df["close"].pct_change(horizon).shift(-horizon)
    signals = (probas >= entry_threshold).astype(int)
    results = {}

    for r in ["bull", "bear", "sideways"]:
        mask = (regime == r).values[-len(probas):]
        if mask.sum() < 20:
            results[r] = {"n": int(mask.sum()), "skipped": "insufficient samples"}
            continue
        strat = forward_return.iloc[-len(probas):][mask] * signals[mask]
        results[r] = {
            "n":        int(mask.sum()),
            "sharpe":   round(sharpe_ratio(strat.dropna()), 3),
            "win_rate": round(float((strat > 0).mean()), 4),
        }
    return results`,
        },
        note: "Capital protection models show their strongest performance in bear and sideways regimes, which is consistent with what they are designed to identify. A model that shows strong performance only in bull regimes is not a capital protection model regardless of what its config says.",
      },
      {
        heading: "Window sampling",
        body: "Walk-forward tells you whether performance persists through time. Regime testing tells you whether it holds across market conditions. Window sampling asks a different question: how sensitive is this model to the specific dates chosen for the train/test boundary?\n\nThe approach: take the full data range and generate multiple splits by varying the split date within a range. Train on each prefix, test on a following window of fixed length, and compare the distribution of results across split points. A robust model shows similar metrics regardless of where the boundary falls. A fragile model shows high variance, which indicates that the reported performance depends on which specific bars ended up in the test set.\n\nThis is particularly useful for shorter backtests where a single unusually good or bad period can dominate the result. Window sampling exposes that sensitivity before the model reaches paper trading rather than after.",
      },
      {
        heading: "Putting the three approaches together",
        body: "A model that passes the gate on a single holdout has earned a provisional result. The three backtest variants turn that provisional result into something more meaningful.\n\nWalk-forward answers: does performance persist as time advances? Regime testing answers: does performance depend on market conditions? Window sampling answers: does performance depend on the specific holdout chosen?\n\nA model that produces consistent results across all three is worth paper trading. A model that passes the gate but shows high walk-forward variance or strong regime dependence is worth understanding better before committing to execution. The information is not a reason to disqualify the model. It is context for interpreting the gate result and setting realistic expectations for what paper trading will show.",
      },
    ],
  },

  "containers-should-just-work": {
    slug: "containers-should-just-work",
    title: "Containers Should Just Work",
    date: "2026-05-20",
    draft: true,
    category: "Infrastructure",
    tags: ["Infrastructure", "DevOps", "Self-Hosting", "Coolify", "Proxmox"],
    summary:
      "The friction that pushed me off managed deploy platforms, how I got to running a private cloud on six servers, and what I actually gained from owning the full stack.",
    readingTime: "7 min",
    sections: [
      {
        body: "For years Vercel and Netlify were the obvious choices. Push to git, get a deploy. That workflow is genuinely good, and I used it without complaint until the builds started failing for reasons I could not easily debug.\n\nThe specific frustration was not one incident, it was a pattern. A build breaks. You dig through documentation, blog posts, GitHub issues, trying to nail down what configuration is wrong. Eventually you find it: a known issue with the specific combination of library, architecture, and functionality you are using. Fix it, ship, repeat. It happened enough times that I had to be honest about what the tool was actually costing me.\n\nThe thing that bothered me most was the principle. An app should run in a container and just work. If I can build a Docker container locally and it runs cleanly, that should be the contract. That promise is what containers exist to make. But Vercel and Netlify have their own opinions about structure layered on top, and if your app does not fit neatly into those expectations, you are fighting the service. Not your code or your dependencies, but the deploy target's assumptions about how things should be built.\n\nNetlify was a different experience but the same story. Seemingly simple apps working fine until they did not. Add one feature too many and suddenly you are fighting the tool instead of shipping.",
      },
      {
        heading: "A framework that kept moving",
        body: "Next.js compounded this because it was the default, and every major version brought enough structural shifts that I was relearning the same framework on a schedule. The deeper cost was not the relearning. It was the patterns.\n\nOver time I would develop a set of code patterns that were readable, clean, abstracted to the level that let me build quickly and confidently. Then a new version would arrive and a non-trivial number of those abstractions were burned. Not deprecated gradually, just no longer the right way. Instead of building features I was re-architecting to fit the new model. That is not a one-time tax, it compounds across every version.\n\nFor a while the answer was to not upgrade. But that cycle is its own problem. Stay three or four versions behind and the community has moved on. The docs quietly stop covering your version. When something breaks, the answers and blog posts are all written against the newer API, not yours. Finding solutions becomes genuinely harder. It does not feel good to be that far behind, and the longer you wait the worse the eventual upgrade becomes.\n\nWhen something did not work it was also hard to know if it was your code, a framework behavior, or an interaction between the two. That combination of unpredictable debugging surface, version churn that burns your investment, and the upgrade trap is not a foundation for building with confidence.",
      },
      {
        heading: "The math on staging and prototyping",
        body: "The other pressure was cost. Not production cost, which is defensible, but the cost of running staging environments and prototypes. Twenty to fifty dollars a month per environment adds up if you are building actively. And with fully managed infrastructure there is always the background worry about a misconfigured resource or an unexpected traffic spike generating a bill you did not plan for. I had read enough incident writeups to take that seriously.\n\nHetzner and Linode gave me more control. Predictable prices, no surprise bills. But the cost per server still felt high for throwaway prototyping. I wanted to spin up a staging instance for an experiment, run it for a few days or indefinitely if the idea had legs, and scale it into something real without the economics forcing a decision before the idea was ready.",
      },
      {
        heading: "Starting with an old MacBook Pro",
        body: "The first step was unglamorous. I flashed Proxmox onto an old MacBook Pro, ran TrueNAS and Ubuntu Server as VMs, and started deploying Docker containers onto it by rsyncing repos and running them manually. Fragile and slow, but it worked, and it taught me more about what is actually happening underneath managed deploys than years of using them had.\n\nOnce I had enough confidence in the approach I invested in a proper rack. Ubuntu Server on Proxmox as the host, Coolify installed on top. Two more MacBook Pros running Ubuntu Server joined as worker nodes. Hetzner stayed as the production server. The architecture settled into local rack for staging and prototyping, Hetzner for anything public-facing.",
      },
      {
        heading: "What Coolify gave back",
        body: "Coolify was the piece that made it practical. It gives you the git-push-to-deploy workflow without any of the platform dependency. Deployments are defined in the same way, environment variables are managed in one place, and the behavior is predictable. The difference is that when a build fails, you can actually debug it. The logs are complete, the environment is yours, and nothing is hidden behind a managed abstraction.\n\nThe production databases stay on managed services. Mongo Atlas and Supabase for anything that needs uptime guarantees and proper backups. Self-hosting a database that a production app depends on is a different commitment than self-hosting the app layer.",
      },
      {
        heading: "What the stack actually looks like",
        body: "Six servers total, with Coolify managing deployments across them. Gitea for source control, because GitHub has had enough reliability issues over the past few years that a local mirror is worth having, and because some projects involve large model files that GitHub does not handle well. Plausible for analytics. Uptime Kuma for monitoring with Discord and Slack webhooks. Beszel for hardware metrics. n8n and Windmill for automation. Portainer as a container management layer. Nextcloud for file storage. Pi-hole for DNS, with Ansible playbooks to provision and harden new servers.\n\nI also host CMS and CRM instances for a few small business clients. The right fit is use cases where cost matters more than enterprise uptime guarantees — content sites, internal tools, lightweight apps where an occasional maintenance window is acceptable. Anything that needs redundant infrastructure or formal SLA coverage I route to managed hosting.\n\nI tried Woodpecker CI before settling here. It works and the concept is right: a self-hosted CI pipeline that integrates cleanly with Gitea. But coming from Travis CI and CircleCI it felt rough. The documentation had gaps and the configuration model required more investment than I wanted to make at that point. Coolify's built-in CI covered what I needed without a separate system.",
      },
      {
        heading: "What you actually gain",
        body: "The direct benefit is cost. Six servers running staging, analytics, automation, monitoring, file storage, and client services costs less than I was paying for two Vercel projects and a handful of managed services.\n\nThe less obvious benefit is context. Running your own infrastructure teaches you things about deployment, networking, and operations that are hard to learn when the complexity is hidden. When a container fails to start, you debug it. When a service is unreachable, you trace the network path. When a deployment breaks, you have full access to the environment. That operational knowledge changes how you write application code and how you make architectural decisions.\n\nThis is not an argument for everyone to self-host everything. Managed platforms solve real problems and the setup cost is not zero. But if you have hit the ceiling of what you can debug on a managed platform, or you are spending more on staging environments than you want to, the investment is worth understanding.",
      },
    ],
  },

  "broker-integrations-alpaca-binance": {
    slug: "broker-integrations-alpaca-binance",
    title: "Broker Integrations: Order Execution and Trade Protection in Alpaca and Binance",
    date: "2026-05-27",
    category: "System Design",
    tags: ["Python", "Alpaca", "Binance", "Trading", "System Design"],
    summary:
      "How the platform integrates with Alpaca for equity trading and Binance for crypto, the validation layer that sits between model signals and submitted orders, and how a local ledger catches discrepancies between what the system intended and what the broker actually executed.",
    readingTime: "10 min",
    sections: [
      {
        heading: "The two-broker architecture",
        body: "Alpaca handles US equities. Binance handles crypto. The split was driven by fees first.\n\nAlpaca charges 0.25% per crypto trade. Binance charges 0.10%. At the position sizing and signal frequency the models generate, that 60% fee reduction is not a marginal improvement. It is the difference between a strategy that produces alpha and one that the fee structure consumes. Once the math was clear, routing crypto through Binance was the only reasonable choice.\n\nFor equities, Alpaca is commission-free and has a paper trading environment that mirrors the live API exactly. The feedback loop from paper to live is clean: same API shapes, same fill behavior, no surprises in the transition. Fractional share support matters for position sizing at small experiment scale.\n\nBinance also has better liquidity and tighter spreads for crypto. The trade-off is a more complex API with more surface area for configuration errors.\n\nBoth integrations sit behind a shared ExecutionClient interface. Signals from the model layer flow into the interface. The interface dispatches to the appropriate broker based on the asset class of the symbol. Neither the model layer nor the signal generator knows which broker is being used.",
      },
      {
        heading: "Paper trading as the required first step",
        body: "No model moves directly from gate-passing to live trading. Paper trading is mandatory first.\n\nAlpaca's paper environment is a close approximation of live trading. Orders are filled at live market prices. The API returns the same response shapes as live. Position tracking behaves identically. The main difference is that no real money changes hands. A model can run in paper mode for days or weeks and produce a realistic assessment of execution behavior before any live capital is at risk.\n\nBinance does not have a built-in paper trading mode for futures. The platform handles this by running the execution layer against a simulated order book that fills orders at live market prices but tracks positions locally rather than submitting to Binance. This is less faithful than Alpaca's paper mode but sufficient for validating that the signal-to-order path is working correctly.\n\nPaper trading also surfaces execution timing issues that backtesting cannot. A backtest assumes you can trade at the close price of the bar that generated the signal. In practice there is latency between signal generation and order submission, and orders may fill at a worse price than the assumed entry. Paper trading with live prices makes this visible before it affects a real position.",
      },
      {
        heading: "Order validation before submission",
        body: "Every order passes through a validation layer before it reaches the broker. The validation layer runs four checks.\n\nPosition size: the order must not exceed the configured maximum position size for the experiment, expressed as a fraction of total portfolio value. Duplicate position: if the portfolio already holds a position in the symbol, a new entry order is rejected. The platform does not add to existing positions. Exposure limit: total open position value must not exceed the configured maximum total exposure. Price sanity: for limit orders, the limit price is compared against the last known market price. An order priced more than a configurable percentage away from the current market is likely a stale signal or a calculation error.",
        code: {
          language: "python",
          filename: "execution/validator.py",
          content: `class OrderRejection(Exception):
    pass

def validate_order(
    request: OrderRequest,
    portfolio: PortfolioState,
    config: dict,
) -> None:
    max_position_pct  = config["position"]["size"]
    max_exposure_pct  = config["position"].get("max_exposure", 0.5)
    max_price_dev_pct = config["position"].get("price_deviation_pct", 0.03)

    position_value = request.qty * portfolio.last_price(request.symbol)
    position_pct   = position_value / portfolio.total_value

    if position_pct > max_position_pct:
        raise OrderRejection(
            f"position size {position_pct:.1%} exceeds limit {max_position_pct:.1%}"
        )

    if request.side == "buy" and portfolio.has_position(request.symbol):
        raise OrderRejection(f"duplicate position: already holding {request.symbol}")

    current_exposure = portfolio.total_position_value / portfolio.total_value
    if current_exposure + position_pct > max_exposure_pct:
        raise OrderRejection(
            f"exposure limit exceeded: current {current_exposure:.1%} + new {position_pct:.1%}"
        )

    if request.order_type == "limit" and request.limit_price is not None:
        last_price = portfolio.last_price(request.symbol)
        deviation  = abs(request.limit_price - last_price) / last_price
        if deviation > max_price_dev_pct:
            raise OrderRejection(
                f"stale limit price: {deviation:.1%} from market"
            )`,
        },
        note: "Rejected orders are logged with their rejection reason. This creates a record of signals that were valid from the model's perspective but blocked by the execution layer, which is useful for diagnosing whether position sizing or exposure limits are misaligned with the experiment's expected signal frequency.",
      },
      {
        heading: "The local ledger",
        body: "The local ledger is a PostgreSQL table that tracks every order the platform has submitted and what the broker reported back. Its purpose is to maintain the platform's own record of what it believes its positions to be, independently of the broker's representation.\n\nEvery submitted order is written to the ledger with a pending status. When the broker confirms execution, the ledger is updated with the actual fill price and quantity. Before any new order is submitted, the ledger is reconciled against the broker's current positions.",
        code: {
          language: "python",
          filename: "execution/ledger.py",
          content: `def reconcile(
    broker_positions: dict[str, float],
    ledger_positions: dict[str, float],
    tolerance: float = 0.001,
) -> list[str]:
    discrepancies = []
    all_symbols = set(broker_positions) | set(ledger_positions)

    for symbol in all_symbols:
        broker_qty = broker_positions.get(symbol, 0.0)
        ledger_qty = ledger_positions.get(symbol, 0.0)
        delta      = broker_qty - ledger_qty

        if abs(delta) > tolerance:
            discrepancies.append(
                f"{symbol}: broker={broker_qty:.4f}, "
                f"ledger={ledger_qty:.4f}, delta={delta:+.4f}"
            )

    return discrepancies

def assert_parity(broker_positions, ledger_positions) -> None:
    discrepancies = reconcile(broker_positions, ledger_positions)
    if discrepancies:
        # Halt order submission until manually resolved
        raise LedgerParityError(
            "position mismatch detected before order submission:\\n"
            + "\\n".join(discrepancies)
        )`,
        },
      },
      {
        heading: "What discrepancies tell you",
        body: "Any discrepancy between the ledger and the broker halts new order submission and triggers an alert. The system should not continue trading if what it believes about its positions does not match what the broker reports. Discrepancies arise from partial fills, order timeouts, broker-side rejections that were not communicated cleanly, and network interruptions during order confirmation. The right response in all cases is to stop, reconcile manually, and restart from a known-good state.\n\nThe ledger also provides an audit trail for every position the platform has ever held. This is important for analysing execution performance separately from model performance. A model with a strong backtest Sharpe that shows degraded performance in paper trading is worth investigating at the ledger level. The gap between expected entry price from the backtest and actual fill price from the ledger is often part of the story. Slippage on entry compounds across many trades and is invisible until you have a ledger to measure it against.",
      },
    ],
  },
};

export const articleOrder = [
  "containers-should-just-work",
  "config-driven-ml-experiments",
  "ml-model-training-setup",
  "trading-platform-architecture",
  "data-normalization-multi-source",
  "training-pipeline-fail-fast",
  "backtest-variants",
  "broker-integrations-alpaca-binance",
];

export const articleSeries: Record<string, string> = {
  "config-driven-ml-experiments": "trading-platform",
  "ml-model-training-setup": "trading-platform",
  "trading-platform-architecture": "trading-platform",
  "data-normalization-multi-source": "trading-platform",
  "training-pipeline-fail-fast": "trading-platform",
  "backtest-variants": "trading-platform",
  "broker-integrations-alpaca-binance": "trading-platform",
};

export function getPublishedArticles(includeDrafts = false): Article[] {
  return articleOrder
    .map((slug) => articles[slug])
    .filter((a): a is Article => Boolean(a) && (includeDrafts || !a.draft))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
