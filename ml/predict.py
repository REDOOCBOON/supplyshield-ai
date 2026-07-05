# predict.py
import sys
import os
import json

# Ensure project root is in path so 'ml' package is importable when called as subprocess
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.dirname(_THIS_DIR)
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)
import pickle
import pandas as pd
from ml.explain import explain_prediction

MODELS_DIR = os.path.join(_THIS_DIR, "models")

def load_models():
    models = {}
    for name in ["trust", "risk", "failure", "delivery", "features"]:
        path = os.path.join(MODELS_DIR, f"{name}.pkl")
        with open(path, 'rb') as f:
            models[name] = pickle.load(f)
    return models

def predict_for_supplier(features_dict):
    try:
        models = load_models()
        feature_cols = models["features"]
        
        # Build DataFrame
        df_in = pd.DataFrame([features_dict])
        
        # Check if any columns are missing, fill with 0
        for col in feature_cols:
            if col not in df_in.columns:
                df_in[col] = 0.0
                
        X = df_in[feature_cols]
        
        # Run predictions
        trust_pred = float(models["trust"].predict(X)[0])
        risk_pred = str(models["risk"].predict(X)[0])
        fail_pred = float(models["failure"].predict(X)[0])
        delay_pred = float(models["delivery"].predict(X)[0])
        
        # Calculate dynamic explanations
        explanations = explain_prediction(features_dict.get("supplier_id", "UNKNOWN"), features_dict)
        
        output = {
            "trust_score": int(round(trust_pred)),
            "risk_level": risk_pred,
            "failure_probability": round(fail_pred, 2),
            "delivery_delay_prediction": round(delay_pred, 1),
            "explanations": explanations
        }
        return output
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Expect JSON string from stdin
    try:
        input_data = sys.stdin.read()
        if not input_data.strip():
            print(json.dumps({"error": "No input data provided."}))
            sys.exit(1)
            
        features = json.loads(input_data)
        result = predict_for_supplier(features)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
