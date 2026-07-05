# complaint_generator.py
import random

def generate_complaints_for_timeline(supplier, quality_records, delivery_records):
    profile = supplier["profile"]
    persona = supplier.get("persona", "Legacy Manufacturer")
    supplier_id = supplier["supplier_id"]
    
    complaints = []
    
    complaint_types = ["Late Delivery Delay", "Product Quality Defect", "Packaging Damage", "Invoicing Mismatch", "Customer Service Unresponsiveness"]
    
    for idx, (qual, deli) in enumerate(zip(quality_records, delivery_records)):
        month_idx = idx + 1
        
        # Chance of complaint depends on delays and defects
        defect_rate = qual["defect_rate"]
        delay_days = deli["delay_days"]
        
        base_prob = 0.02
        if defect_rate > 2.0:
            base_prob += 0.15
        if delay_days > 5:
            base_prob += 0.25
            
        if profile == "High Risk":
            base_prob += 0.20
        elif profile == "Premium":
            base_prob = max(0.005, base_prob - 0.05)
            
        # Persona complaint probability adjustments
        if persona in ["Customer Centric", "Quality Focused", "Enterprise Leader", "Compliance Champion"]:
            base_prob = max(0.002, base_prob * 0.3)
        elif persona == "Operationally Weak":
            base_prob = min(0.70, base_prob * 1.5 + 0.10)
            
        num_complaints = 0
        if random.random() < base_prob:
            num_complaints = random.choice([1, 2])
            if base_prob > 0.4:
                num_complaints = random.randint(2, 4)
                
        qual["complaints"] = num_complaints
        
        for c in range(1, num_complaints + 1):
            complaint_id = f"COM_{supplier_id}_{month_idx:02d}_{c}"
            c_type = random.choice(complaint_types)
            if delay_days > 0 and random.random() < 0.6:
                c_type = "Late Delivery Delay"
            elif defect_rate > 1.0 and random.random() < 0.6:
                c_type = "Product Quality Defect"
                
            severity = "LOW"
            if c_type == "Late Delivery Delay" and delay_days > 10:
                severity = "HIGH"
            elif c_type == "Product Quality Defect" and defect_rate > 5.0:
                severity = "CRITICAL"
            elif random.random() < 0.3:
                severity = "MEDIUM"
                
            # Resolution probability based on profile and persona
            resolve_prob = 0.85
            if profile == "High Risk":
                resolve_prob = 0.50
            if persona == "Customer Centric":
                resolve_prob = 0.98
            elif persona == "Operationally Weak":
                resolve_prob = 0.60
                
            resolved = random.random() < resolve_prob
            
            complaints.append({
                "complaint_id": complaint_id,
                "supplier_id": supplier_id,
                "type": c_type,
                "severity": severity,
                "resolved": resolved,
                "month": qual["month"]
            })
            
    return complaints
