# recommendation.py

def generate_recommendation(supplier_id, trust_score, debt_ratio, average_delay, defect_rate, compliance_violations):
    recs = []
    
    if debt_ratio > 0.8:
        recs.append("Reduce financial dependency. Consider onboarding secondary options.")
    if average_delay > 5:
        recs.append("Increase safety inventory buffer by 15-20% to mitigate transportation delays.")
    if defect_rate > 3.0:
        recs.append("Increase product batch quality inspections. Demand corrective actions plan.")
    if compliance_violations > 0:
        recs.append("Schedule formal compliance and regulatory audit checklist reviews.")
    if trust_score < 40:
        recs.append("IMMEDIATE ACTION: Initiate vendor offboarding. Activate backup supply lines.")
    
    if not recs:
        if trust_score >= 85:
            recs.append("Continue current partnership cadence. Perform standard quarterly reviews.")
        else:
            recs.append("Conduct standard monitoring. Maintain standard delivery safety stocks.")
            
    # Combine recommendations
    full_rec = " ".join(recs)
    priority = "Low"
    if trust_score < 40:
        priority = "Critical"
    elif trust_score < 60 or defect_rate > 5.0 or compliance_violations > 0:
        priority = "High"
    elif trust_score < 75 or average_delay > 3:
        priority = "Medium"
        
    return {
        "supplier_id": supplier_id,
        "recommendation": full_rec,
        "priority": priority
    }
