# main.py
import os
import csv
import random
import numpy as np

# Imports from custom generator modules
from ml.config import config
from ml.generators.supplier_generator import generate_suppliers
from ml.generators.financial_generator import generate_financial_history
from ml.generators.orders_generator import generate_orders
from ml.generators.delivery_generator import generate_delivery_history
from ml.generators.quality_generator import generate_quality_records
from ml.generators.complaint_generator import generate_complaints_for_timeline
from ml.generators.compliance_generator import generate_compliance_records
from ml.generators.event_generator import generate_external_events

# Imports from scoring modules
from ml.scoring.financial_score import calculate_financial_score
from ml.scoring.delivery_score import calculate_delivery_score_for_month
from ml.scoring.quality_score import calculate_quality_score
from ml.scoring.trust_score import calculate_trust_score, get_risk_level, calculate_failure_probability
from ml.scoring.recommendation import generate_recommendation

_THIS_DIR = os.path.dirname(os.path.abspath(__file__))

def create_directories():
    os.makedirs(os.path.join(_THIS_DIR, "datasets", "raw"), exist_ok=True)
    os.makedirs(os.path.join(_THIS_DIR, "datasets", "processed"), exist_ok=True)
    print("Dataset directories verified.")

def save_csv(filename, data, headers):
    filepath = os.path.join(_THIS_DIR, "datasets", "raw", filename)
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        for row in data:
            writer.writerow(row)
    print(f"Exported {len(data)} rows to {filename}")

def run_pipeline():
    random.seed(config.SEED)
    np.random.seed(config.SEED)
    
    create_directories()
    
    print("Generating suppliers metadata...")
    raw_suppliers = generate_suppliers()
    
    all_financials = []
    all_orders = []
    all_deliveries = []
    all_quality = []
    all_complaints = []
    all_compliance = []
    all_events = []
    
    all_predictions = []
    all_recommendations = []
    
    # We will compute monthly trust scores and keep track of them
    for s_idx, sup in enumerate(raw_suppliers):
        s_id = sup["supplier_id"]
        
        # 1. Generate histories
        fins = generate_financial_history(sup, config.MONTHS)
        ords = generate_orders(sup, fins)
        dels = generate_delivery_history(sup, ords)
        quals = generate_quality_records(sup, config.MONTHS)
        compls = generate_complaints_for_timeline(sup, quals, dels)
        comps = generate_compliance_records(sup, config.MONTHS)
        evts = generate_external_events(sup, config.MONTHS)
        
        all_financials.extend(fins)
        all_orders.extend(ords)
        all_deliveries.extend(dels)
        all_quality.extend(quals)
        all_complaints.extend(compls)
        all_compliance.extend(comps)
        all_events.extend(evts)
        
        # 2. Score mapping & timeline building
        # We need to compute historical scores per month
        monthly_trust_scores = []
        
        for m in range(1, config.MONTHS + 1):
            m_label = f"Month_{m:02d}"
            
            # Fetch records for this month
            f_rec = next(f for f in fins if f["month"] == m_label)
            d_rec = next(d for d in dels if d["month"] == m_label)
            q_rec = next(q for q in quals if q["month"] == m_label)
            c_rec = next(c for c in comps if c["month"] == m_label)
            
            # Sentiment based on monthly complaints count
            sentiment_score = max(10, 100 - q_rec["complaints"] * 25)
            
            # External event score penalty calculation
            evt_month = [e for e in evts if e["month"] == m_label]
            external_penalty = sum(e["impact_score"] for e in evt_month)
            external_score = max(0, 100 - external_penalty)
            
            # Run calculations
            fin_score = calculate_financial_score(f_rec)
            del_score = calculate_delivery_score_for_month(d_rec)
            q_score = calculate_quality_score(q_rec)
            comp_score = (c_rec["audit_score"] * 0.4 + 
                          (20 if not c_rec["gst_compliant"] else 100) * 0.2 +
                          (100 if c_rec["iso9001"] else 20) * 0.2 +
                          (100 if c_rec["iso14001"] else 20) * 0.2)
            
            t_score = calculate_trust_score(
                fin_score, del_score, q_score, comp_score, external_score, sentiment_score
            )
            
            monthly_trust_scores.append(t_score)
            
            # For the latest month (Month 60), we set the final scores of the supplier profile
            if m == config.MONTHS:
                sup["trust_score"] = t_score
                sup["risk_level"] = get_risk_level(t_score)
                sup["financial_score"] = int(round(fin_score))
                sup["delivery_score"] = int(round(del_score))
                sup["quality_score"] = int(round(q_score))
                sup["compliance_score"] = int(round(comp_score))
                sup["news_risk_score"] = int(100 - external_score)
                sup["failure_probability"] = calculate_failure_probability(t_score, f_rec["debt_ratio"], f_rec["cash_flow"])
                sup["confidence"] = round(random.uniform(0.78, 0.98), 2)
                sup["last_updated"] = "2025-12-31"
                
                # Create Predictions row
                # expected delay average over last 3 months
                recent_delays = [d["delay_days"] for d in dels[-3:]]
                avg_delay = sum(recent_delays) / len(recent_delays)
                
                all_predictions.append({
                    "supplier_id": s_id,
                    "trust_score": t_score,
                    "risk_level": sup["risk_level"],
                    "failure_probability": sup["failure_probability"],
                    "delivery_delay_prediction": round(avg_delay, 1),
                    "prediction_confidence": sup["confidence"],
                    "predicted_failure_months": 12 if sup["risk_level"] == "CRITICAL" else 24 if sup["risk_level"] == "HIGH" else 0
                })
                
                # Create Recommendations row
                violations_count = sum(c["violations"] for c in comps[-3:])
                rec = generate_recommendation(
                    s_id, t_score, f_rec["debt_ratio"], avg_delay, q_rec["defect_rate"], violations_count
                )
                all_recommendations.append(rec)
                
        if (s_idx + 1) % 50 == 0:
            print(f"Processed supplier {s_idx + 1}/{config.NUMBER_OF_SUPPLIERS}...")

    # Save to CSV
    save_csv("suppliers.csv", raw_suppliers, [
        "supplier_id", "supplier_name", "industry", "country", "city",
        "years_in_business", "employees", "tier", "profile", "persona", "status",
        "trust_score", "risk_level", "financial_score", "delivery_score",
        "quality_score", "compliance_score", "news_risk_score",
        "failure_probability", "confidence", "last_updated"
    ])
    
    save_csv("financial_history.csv", all_financials, [
        "record_id", "supplier_id", "month", "revenue", "expenses",
        "cash_flow", "profit_margin", "current_ratio", "debt_ratio", "working_capital"
    ])
    
    save_csv("orders.csv", all_orders, [
        "order_id", "supplier_id", "order_value", "quantity", "category", "status", "month"
    ])
    
    save_csv("delivery_history.csv", all_deliveries, [
        "delivery_id", "supplier_id", "order_id", "expected_date",
        "actual_date", "delay_days", "on_time", "delivery_score", "month"
    ])
    
    save_csv("quality_history.csv", all_quality, [
        "quality_id", "supplier_id", "month", "inspection_score", "defect_rate", "return_rate", "complaints"
    ])
    
    save_csv("complaints.csv", all_complaints, [
        "complaint_id", "supplier_id", "type", "severity", "resolved", "month"
    ])
    
    save_csv("compliance.csv", all_compliance, [
        "compliance_id", "supplier_id", "month", "gst_compliant", "iso9001", "iso14001", "audit_score", "violations"
    ])
    
    save_csv("external_events.csv", all_events, [
        "news_id", "supplier_id", "title", "severity", "impact_score", "date", "month"
    ])
    
    save_csv("predictions.csv", all_predictions, [
        "supplier_id", "trust_score", "risk_level", "failure_probability",
        "delivery_delay_prediction", "prediction_confidence", "predicted_failure_months"
    ])
    
    save_csv("recommendations.csv", all_recommendations, [
        "supplier_id", "recommendation", "priority"
    ])
    
    print("Simulation Generation Completed Successfully!")

if __name__ == "__main__":
    run_pipeline()
