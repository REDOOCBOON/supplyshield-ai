# quality_generator.py
import random

def generate_quality_records(supplier, months=60):
    profile = supplier["profile"]
    persona = supplier.get("persona", "Legacy Manufacturer")
    supplier_id = supplier["supplier_id"]
    
    records = []
    
    # Establish base quality profiles
    if profile == "Premium":
        base_inspect = (95, 100)
        base_defect = (0.001, 0.008)  # 0.1% to 0.8%
        base_return = (0.001, 0.005)
    elif profile == "Growing":
        base_inspect = (88, 96)
        base_defect = (0.005, 0.018)
        base_return = (0.003, 0.012)
    elif profile == "Stable":
        base_inspect = (85, 95)
        base_defect = (0.008, 0.025)
        base_return = (0.005, 0.015)
    elif profile == "Declining":
        base_inspect = (72, 85)
        base_defect = (0.02, 0.05)
        base_return = (0.012, 0.035)
    elif profile == "High Risk":
        base_inspect = (55, 75)
        base_defect = (0.04, 0.14)
        base_return = (0.03, 0.09)
    else:  # New
        base_inspect = (80, 92)
        base_defect = (0.01, 0.03)
        base_return = (0.005, 0.02)
        
    # Persona quality adjustments
    if persona in ["Quality Focused", "Innovation Driven"]:
        base_inspect = (max(96.0, base_inspect[0]), min(100.0, base_inspect[1] + 2.0))
        base_defect = (base_defect[0] * 0.4, base_defect[1] * 0.4)
        base_return = (base_return[0] * 0.4, base_return[1] * 0.4)
    elif persona in ["Operationally Weak", "Crisis Prone"]:
        base_inspect = (max(40.0, base_inspect[0] - 10.0), max(50.0, base_inspect[1] - 5.0))
        base_defect = (base_defect[0] * 1.5, base_defect[1] * 1.5)
        base_return = (base_return[0] * 1.5, base_return[1] * 1.5)
        
    for m in range(1, months + 1):
        quality_id = f"QUA_{supplier_id}_{m:02d}"
        
        inspect = random.uniform(base_inspect[0], base_inspect[1])
        defect = random.uniform(base_defect[0], base_defect[1])
        ret_rate = defect * random.uniform(0.6, 0.9)
        
        records.append({
            "quality_id": quality_id,
            "supplier_id": supplier_id,
            "month": f"Month_{m:02d}",
            "inspection_score": round(inspect, 1),
            "defect_rate": round(defect * 100, 2),  # store as percentage e.g. 1.2%
            "return_rate": round(ret_rate * 100, 2),
            "complaints": 0  # will be computed or updated by complaints generator
        })
        
    return records
