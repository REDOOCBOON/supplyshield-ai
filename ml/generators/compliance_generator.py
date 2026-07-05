# compliance_generator.py
import random

def generate_compliance_records(supplier, months=60):
    profile = supplier["profile"]
    persona = supplier.get("persona", "Legacy Manufacturer")
    supplier_id = supplier["supplier_id"]
    
    records = []
    
    # Establish base profiles
    if profile == "Premium":
        base_audit = (90, 100)
        base_violations = 0
        gst_prob = 0.99
        iso9_prob = 0.98
        iso14_prob = 0.95
    elif profile == "Growing":
        base_audit = (82, 92)
        base_violations = 0
        gst_prob = 0.95
        iso9_prob = 0.85
        iso14_prob = 0.70
    elif profile == "Stable":
        base_audit = (80, 90)
        base_violations = 0
        gst_prob = 0.96
        iso9_prob = 0.80
        iso14_prob = 0.65
    elif profile == "Declining":
        base_audit = (68, 80)
        base_violations = 1
        gst_prob = 0.90
        iso9_prob = 0.70
        iso14_prob = 0.50
    elif profile == "High Risk":
        base_audit = (50, 72)
        base_violations = 2
        gst_prob = 0.75
        iso9_prob = 0.55
        iso14_prob = 0.35
    else:  # New
        base_audit = (75, 88)
        base_violations = 0
        gst_prob = 0.92
        iso9_prob = 0.60
        iso14_prob = 0.40
        
    # Persona compliance adjustments
    if persona == "Compliance Champion":
        base_audit = (98, 100)
        base_violations = 0
        gst_prob = 1.0
        iso9_prob = 1.0
        iso14_prob = 1.0
    elif persona == "Financially Fragile":
        gst_prob = max(0.40, gst_prob * 0.7) # tax filing lags
        base_audit = (base_audit[0] - 5, base_audit[1] - 3)
    elif persona == "Crisis Prone":
        base_violations = max(1, base_violations + 1)
        base_audit = (base_audit[0] - 8, base_audit[1] - 5)
        
    gst_compliant = random.random() < gst_prob
    iso9001 = random.random() < iso9_prob
    iso14001 = random.random() < iso14_prob
    
    current_audit = random.uniform(base_audit[0], base_audit[1])
    
    for m in range(1, months + 1):
        compliance_id = f"CMP_{supplier_id}_{m:02d}"
        
        # Audit score drifts slightly over time
        current_audit = max(30, min(100, current_audit + random.uniform(-1.5, 1.5)))
        
        # Violations count
        violations = 0
        if random.random() < 0.05:
            violations = random.randint(1, max(1, base_violations + 1))
            
        records.append({
            "compliance_id": compliance_id,
            "supplier_id": supplier_id,
            "month": f"Month_{m:02d}",
            "gst_compliant": gst_compliant,
            "iso9001": iso9001,
            "iso14001": iso14001,
            "audit_score": round(current_audit, 1),
            "violations": violations
        })
        
    return records
