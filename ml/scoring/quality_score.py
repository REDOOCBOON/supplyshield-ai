# quality_score.py

def calculate_defect_score(defect_rate):
    # defect_rate is percentage, e.g. 1.2
    if defect_rate == 0: return 100
    elif defect_rate <= 1.0: return 95
    elif defect_rate <= 3.0: return 85
    elif defect_rate <= 5.0: return 75
    elif defect_rate <= 10.0: return 50
    else: return 20

def calculate_return_score(return_rate):
    if return_rate == 0: return 100
    elif return_rate <= 0.5: return 95
    elif return_rate <= 2.0: return 80
    elif return_rate <= 5.0: return 50
    else: return 10

def calculate_quality_score(qual_record):
    inspect = qual_record["inspection_score"]
    defect_rate = qual_record["defect_rate"]
    return_rate = qual_record["return_rate"]
    
    inspect_score = inspect
    def_score = calculate_defect_score(defect_rate)
    ret_score = calculate_return_score(return_rate)
    
    score = inspect_score * 0.40 + def_score * 0.35 + ret_score * 0.25
    return round(max(0, min(100, score)), 1)
