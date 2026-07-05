# explain.py
import sys
import os

# Ensure project root is in path so 'ml' package is importable when called as subprocess
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.dirname(_THIS_DIR)
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

import pickle
import pandas as pd
import numpy as np

RAW_DIR = os.path.join(_PROJECT_ROOT, "ml", "datasets", "raw")
MODELS_DIR = os.path.join(_PROJECT_ROOT, "ml", "models")

def explain_prediction(supplier_id, input_features=None):
    # If input_features is provided, we explain that (useful for simulators)
    # Otherwise we load from dataset
    
    # Load serialized features signature
    features_path = os.path.join(MODELS_DIR, "features.pkl")
    if not os.path.exists(features_path):
        return ["Model parameters missing. Cannot generate explanation."]
        
    with open(features_path, 'rb') as f:
        feature_cols = pickle.load(f)
        
    # Standard labels for business descriptions
    labels_map = {
        "avg_revenue": "Operational Revenue",
        "avg_expenses": "Operating Expenses",
        "avg_cash_flow": "Operational Cash Flow",
        "avg_margin": "Profit Margin",
        "avg_current_ratio": "Current Liquidity Ratio",
        "avg_debt_ratio": "Debt-to-Asset Leverage Ratio",
        "avg_working_capital": "Net Working Capital",
        "rev_trend": "Revenue Growth Momentum",
        "avg_delay": "Logistical Delivery Delay",
        "max_delay": "Worst Case Disruption delay",
        "late_rate": "Late Delivery Failure Rate",
        "avg_inspect": "Quality Inspection Score",
        "avg_defect": "Manufacturing Yield Defect ppm",
        "avg_return": "Product Return Refund Rate",
        "total_complaints": "Resolved Sourcing Complaints",
        "gst_compliant": "GST Tax Filing Status",
        "iso9001": "ISO 9001 Quality Certification",
        "iso14001": "ISO 14001 Environmental Standard",
        "avg_audit": "Regulatory Compliance Audit Score",
        "total_violations": "Sourcing Regulatory Violations",
        "event_count": "Extreme Weather/Operational Disruption Events",
        "event_impact": "Disruption Severity Level"
    }

    # Load baseline averages
    # We can compute baseline averages from suppliers dataset
    try:
        from ml.train import engineer_features
        df = engineer_features()
    except Exception:
        # Fallback if engineer_features fails
        return ["Unable to compile feature matrices for explanation."]
        
    baseline = df[feature_cols].mean()
    
    if input_features is not None:
        target_features = pd.Series(input_features)
    else:
        target_row = df[df["supplier_id"] == supplier_id]
        if target_row.empty:
            return [f"Supplier {supplier_id} not found in tracking records."]
        target_features = target_row.iloc[0][feature_cols]
        
    # Compute deviations normalized by standard deviation or just absolute differences
    deviations = []
    
    for col in feature_cols:
        val = target_features[col]
        base_val = baseline[col]
        diff = val - base_val
        
        # Check standard deviations to check significance
        col_std = df[col].std()
        if col_std == 0 or np.isnan(col_std):
            z_score = 0
        else:
            z_score = diff / col_std
            
        deviations.append((col, val, base_val, z_score))
        
    # Sort deviations by significance (z_score absolute value)
    deviations.sort(key=lambda x: abs(x[3]), reverse=True)
    
    reasons = []
    
    for col, val, base, z in deviations[:5]:  # Top 5 contributing factors
        name = labels_map.get(col, col)
        
        # Format the impact statement based on direction
        # Lower z-score means worse for positive attributes (like current_ratio, audit_score, revenue)
        # Higher z-score means worse for negative attributes (like delay, defect, violations)
        negative_attributes = ["avg_delay", "max_delay", "late_rate", "avg_defect", "avg_return", "total_complaints", "total_violations", "event_count", "event_impact", "avg_expenses"]
        
        if col in negative_attributes:
            if z > 0.5:
                reasons.append(f"Elevated {name.lower()} of {val:.1f} vs baseline {base:.1f} increases operational risk.")
            elif z < -0.5:
                reasons.append(f"Low {name.lower()} of {val:.1f} (baseline {base:.1f}) improves operational stability.")
        else:
            if z < -0.5:
                # Value is significantly lower than average (bad for business health)
                reasons.append(f"Declining {name.lower()} of {val:.1f} (baseline {base:.1f}) drags down performance score.")
            elif z > 0.5:
                # Value is significantly higher than average (good)
                reasons.append(f"Healthy {name.lower()} of {val:.1f} vs average {base:.1f} supports higher trust index.")
                
    if not reasons:
        reasons.append("Operational indicators are aligned with the baseline average across all segments.")
        
    return reasons

if __name__ == "__main__":
    # Test explanation for SUP000001
    reasons = explain_prediction("SUP000001")
    print("Explanations for SUP000001:")
    for r in reasons:
        print(f"- {r}")
