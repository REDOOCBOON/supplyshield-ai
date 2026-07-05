# delivery_score.py

def calculate_delay_score(delay_days):
    if delay_days == 0: return 100
    elif delay_days <= 2: return 95
    elif delay_days <= 5: return 80
    elif delay_days <= 10: return 60
    elif delay_days <= 20: return 30
    else: return 10

def calculate_delivery_score_for_month(del_record):
    on_time_score = 100 if del_record["on_time"] else 30
    delay_score = calculate_delay_score(del_record["delay_days"])
    late_rate_score = 100 if del_record["on_time"] else 20
    
    score = on_time_score * 0.45 + delay_score * 0.30 + late_rate_score * 0.25
    return round(max(0, min(100, score)), 1)
