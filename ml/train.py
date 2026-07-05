# train.py
import os
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_absolute_error, r2_score, accuracy_score, classification_report

_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DIR = os.path.join(_THIS_DIR, "datasets", "raw")
MODELS_DIR = os.path.join(_THIS_DIR, "models")

def engineer_features():
    import sys as _sys
    _sys.stderr.write("Loading datasets for feature engineering...\n")
    
    # Load raw data
    suppliers_df = pd.read_csv(os.path.join(RAW_DIR, "suppliers.csv"))
    financial_df = pd.read_csv(os.path.join(RAW_DIR, "financial_history.csv"))
    delivery_df = pd.read_csv(os.path.join(RAW_DIR, "delivery_history.csv"))
    quality_df = pd.read_csv(os.path.join(RAW_DIR, "quality_history.csv"))
    compliance_df = pd.read_csv(os.path.join(RAW_DIR, "compliance.csv"))
    events_df = pd.read_csv(os.path.join(RAW_DIR, "external_events.csv"))
    predictions_df = pd.read_csv(os.path.join(RAW_DIR, "predictions.csv"))
    
    features_list = []
    
    for _, s in suppliers_df.iterrows():
        s_id = s["supplier_id"]
        
        # Financial Features (Last 6 Months Average)
        s_fin = financial_df[financial_df["supplier_id"] == s_id].sort_values("month")
        recent_fin = s_fin.tail(6)
        
        avg_revenue = recent_fin["revenue"].mean()
        avg_expenses = recent_fin["expenses"].mean()
        avg_cash_flow = recent_fin["cash_flow"].mean()
        avg_margin = recent_fin["profit_margin"].mean()
        avg_current_ratio = recent_fin["current_ratio"].mean()
        avg_debt_ratio = recent_fin["debt_ratio"].mean()
        avg_working_capital = recent_fin["working_capital"].mean()
        
        # Revenue trend (last month vs 6 months ago)
        rev_trend = (s_fin.iloc[-1]["revenue"] - s_fin.iloc[-6]["revenue"]) / max(1, s_fin.iloc[-6]["revenue"])
        
        # Delivery Features (Last 6 Months Average)
        s_del = delivery_df[delivery_df["supplier_id"] == s_id].sort_values("month")
        recent_del = s_del.tail(6)
        
        avg_delay = recent_del["delay_days"].mean()
        max_delay = recent_del["delay_days"].max()
        late_rate = (recent_del["delay_days"] > 0).mean()
        
        # Quality Features
        s_qual = quality_df[quality_df["supplier_id"] == s_id].sort_values("month")
        recent_qual = s_qual.tail(6)
        
        avg_inspect = recent_qual["inspection_score"].mean()
        avg_defect = recent_qual["defect_rate"].mean()
        avg_return = recent_qual["return_rate"].mean()
        total_complaints = recent_qual["complaints"].sum()
        
        # Compliance Features
        s_comp = compliance_df[compliance_df["supplier_id"] == s_id].sort_values("month")
        recent_comp = s_comp.tail(6)
        
        gst = int(s_comp.iloc[-1]["gst_compliant"])
        iso9 = int(s_comp.iloc[-1]["iso9001"])
        iso14 = int(s_comp.iloc[-1]["iso14001"])
        avg_audit = recent_comp["audit_score"].mean()
        total_violations = recent_comp["violations"].sum()
        
        # External Event Features
        s_evts = events_df[events_df["supplier_id"] == s_id]
        event_count = len(s_evts)
        event_impact = s_evts["impact_score"].sum()
        
        # Targets (from predictions file)
        s_pred = predictions_df[predictions_df["supplier_id"] == s_id].iloc[0]
        
        features_list.append({
            "supplier_id": s_id,
            "avg_revenue": avg_revenue,
            "avg_expenses": avg_expenses,
            "avg_cash_flow": avg_cash_flow,
            "avg_margin": avg_margin,
            "avg_current_ratio": avg_current_ratio,
            "avg_debt_ratio": avg_debt_ratio,
            "avg_working_capital": avg_working_capital,
            "rev_trend": rev_trend,
            "avg_delay": avg_delay,
            "max_delay": max_delay,
            "late_rate": late_rate,
            "avg_inspect": avg_inspect,
            "avg_defect": avg_defect,
            "avg_return": avg_return,
            "total_complaints": total_complaints,
            "gst_compliant": gst,
            "iso9001": iso9,
            "iso14001": iso14,
            "avg_audit": avg_audit,
            "total_violations": total_violations,
            "event_count": event_count,
            "event_impact": event_impact,
            
            # Targets for models
            "target_trust": s_pred["trust_score"],
            "target_risk": s_pred["risk_level"],
            "target_failure": s_pred["failure_probability"],
            "target_delay": s_pred["delivery_delay_prediction"]
        })
        
    return pd.DataFrame(features_list)

def train_and_save():
    os.makedirs(MODELS_DIR, exist_ok=True)
    df = engineer_features()
    
    # Feature columns
    feature_cols = [
        "avg_revenue", "avg_expenses", "avg_cash_flow", "avg_margin",
        "avg_current_ratio", "avg_debt_ratio", "avg_working_capital", "rev_trend",
        "avg_delay", "max_delay", "late_rate", "avg_inspect", "avg_defect",
        "avg_return", "total_complaints", "gst_compliant", "iso9001", "iso14001",
        "avg_audit", "total_violations", "event_count", "event_impact"
    ]
    
    X = df[feature_cols]
    
    # 1. Model 1: Trust Score Prediction (Regression)
    y_trust = df["target_trust"]
    X_train, X_test, y_train, y_test = train_test_split(X, y_trust, test_size=0.2, random_state=42)
    model_trust = RandomForestRegressor(n_estimators=100, random_state=42)
    model_trust.fit(X_train, y_train)
    preds = model_trust.predict(X_test)
    print(f"Model 1 (Trust Score Regression) MAE: {mean_absolute_error(y_test, preds):.2f}, R2: {r2_score(y_test, preds):.2f}")
    
    # 2. Model 2: Risk Classification (Multi-class Classification)
    y_risk = df["target_risk"]
    X_train, X_test, y_train, y_test = train_test_split(X, y_risk, test_size=0.2, random_state=42)
    model_risk = RandomForestClassifier(n_estimators=100, random_state=42)
    model_risk.fit(X_train, y_train)
    preds = model_risk.predict(X_test)
    print(f"Model 2 (Risk Level Classification) Accuracy: {accuracy_score(y_test, preds):.2f}")
    
    # 3. Model 3: Failure Probability Regression / Classification
    # Since failure probability is continuous between 0 and 1, we train a regression model
    y_fail = df["target_failure"]
    X_train, X_test, y_train, y_test = train_test_split(X, y_fail, test_size=0.2, random_state=42)
    model_fail = RandomForestRegressor(n_estimators=100, random_state=42)
    model_fail.fit(X_train, y_train)
    preds = model_fail.predict(X_test)
    print(f"Model 3 (Failure Probability Regression) MAE: {mean_absolute_error(y_test, preds):.2f}")
    
    # 4. Model 4: Delivery Delay Prediction (Regression)
    y_delay = df["target_delay"]
    X_train, X_test, y_train, y_test = train_test_split(X, y_delay, test_size=0.2, random_state=42)
    model_delay = RandomForestRegressor(n_estimators=100, random_state=42)
    model_delay.fit(X_train, y_train)
    preds = model_delay.predict(X_test)
    print(f"Model 4 (Delivery Delay Regression) MAE: {mean_absolute_error(y_test, preds):.2f}")

    # Save models
    with open(os.path.join(MODELS_DIR, "trust.pkl"), 'wb') as f:
        pickle.dump(model_trust, f)
    with open(os.path.join(MODELS_DIR, "risk.pkl"), 'wb') as f:
        pickle.dump(model_risk, f)
    with open(os.path.join(MODELS_DIR, "failure.pkl"), 'wb') as f:
        pickle.dump(model_fail, f)
    with open(os.path.join(MODELS_DIR, "delivery.pkl"), 'wb') as f:
        pickle.dump(model_delay, f)
        
    # Store the feature list signature to ensure inference code uses identical headers
    with open(os.path.join(MODELS_DIR, "features.pkl"), 'wb') as f:
        pickle.dump(feature_cols, f)
        
    print("All models serialized successfully in ml/models/ directory.")

if __name__ == "__main__":
    train_and_save()
