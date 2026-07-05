# supplier_generator.py
import random
import numpy as np
from ml.config import config

def generate_company_name(industry, existing_names):
    prefixes = ["Alpha", "Apex", "Nova", "Titan", "Prime", "Global", "Horizon", "Vertex", "Delta", "Zenith", "Orion", "Phoenix", "Falcon", "Omega", "Sterling"]
    suffixes = ["Pvt Ltd", "Industries", "Corporation", "Group", "Technologies", "Enterprises"]
    
    industry_words = {
        "Automotive": ["Motors", "Components", "Precision"],
        "Semiconductor": ["Semiconductors", "Micro", "Electronics"],
        "Steel": ["Steel", "Foundry", "Alloys"],
        "Chemical": ["Chemicals", "Synthetics", "Labs"],
        "Battery": ["Energy", "Batteries", "Power"],
        "Logistics": ["Logistics", "Freight", "Express"],
        "Packaging": ["Packaging", "Containers", "Cartons"],
        "Textile": ["Textiles", "Weaving", "Apparel"],
        "Pharmaceutical": ["Pharma", "Therapeutics", "Bio"]
    }
    
    words = industry_words.get(industry, ["Systems", "Solutions"])
    
    while True:
        p = random.choice(prefixes)
        w = random.choice(words)
        s = random.choice(suffixes)
        name = f"{p} {w} {s}"
        if name not in existing_names:
            existing_names.add(name)
            return name

def generate_suppliers():
    random.seed(config.SEED)
    np.random.seed(config.SEED)
    
    suppliers_list = []
    existing_names = set()
    
    # Extract industries, countries, profiles with probabilities
    ind_names = [i["name"] for i in config.INDUSTRIES]
    ind_probs = [i["probability"] for i in config.INDUSTRIES]
    
    ct_names = [c["name"] for c in config.COUNTRIES]
    ct_probs = [c["probability"] for c in config.COUNTRIES]
    
    prof_names = [p["name"] for p in config.SUPPLIER_PROFILES]
    prof_probs = [p["probability"] for p in config.SUPPLIER_PROFILES]
    
    for i in range(1, config.NUMBER_OF_SUPPLIERS + 1):
        sup_id = f"SUP{i:06d}"
        industry = np.random.choice(ind_names, p=ind_probs)
        country = np.random.choice(ct_names, p=ct_probs)
        profile = np.random.choice(prof_names, p=prof_probs)
        
        # Get compatible personas
        comp = config.PERSONA_COMPATIBILITY.get(profile, [("Stable Supplier", 1.0)])
        comp_personas = [c[0] for c in comp]
        comp_weights = [c[1] for c in comp]
        # Normalize weights
        w_sum = sum(comp_weights)
        comp_weights = [w / w_sum for w in comp_weights]
        persona = np.random.choice(comp_personas, p=comp_weights)
        
        # Determine size, employees & years based on profile and persona
        if profile == "Premium":
            employees = random.randint(1000, 5000)
            years = random.randint(10, 30)
            tier = "Tier-1"
        elif profile == "Growing":
            employees = random.randint(300, 1500)
            years = random.randint(3, 10)
            tier = random.choice(["Tier-1", "Tier-2"])
        elif profile == "Stable":
            employees = random.randint(200, 2000)
            years = random.randint(8, 25)
            tier = random.choice(["Tier-1", "Tier-2", "Tier-3"])
        elif profile == "Declining":
            employees = random.randint(200, 1500)
            years = random.randint(5, 20)
            tier = "Tier-2"
        elif profile == "High Risk":
            employees = random.randint(50, 700)
            years = random.randint(2, 15)
            tier = "Tier-2"
        else:  # New
            employees = random.randint(20, 300)
            years = random.randint(1, 3)
            tier = "Tier-3"
            
        # Persona adjustments
        if persona == "Fast Growing Startup":
            employees = random.randint(20, 300)
            years = random.randint(1, 3)
        elif persona == "Legacy Manufacturer":
            years = random.randint(15, 45)
        elif persona == "Market Leader":
            employees = random.randint(2000, 8000)
            years = random.randint(15, 40)
            tier = "Tier-1"
            
        company_name = generate_company_name(industry, existing_names)
        
        # Standard cities per country
        cities = {
            "India": ["Pune", "Hyderabad", "Bangalore", "Chennai"],
            "China": ["Shenzhen", "Guangzhou", "Shanghai", "Wuhan"],
            "Germany": ["Ludwigshafen", "Stuttgart", "Munich", "Frankfurt"],
            "Japan": ["Tokyo", "Osaka", "Nagoya", "Yokohama"],
            "USA": ["Chicago", "Detroit", "Houston", "San Jose"],
            "South Korea": ["Seoul", "Incheon", "Busan", "Daegu"],
            "Vietnam": ["Da Nang", "Hanoi", "Ho Chi Minh City"]
        }
        city = random.choice(cities.get(country, ["Capital City"]))
        
        suppliers_list.append({
            "supplier_id": sup_id,
            "supplier_name": company_name,
            "industry": industry,
            "country": country,
            "city": city,
            "years_in_business": years,
            "employees": employees,
            "tier": tier,
            "profile": profile,
            "persona": persona,
            "status": "ACTIVE" if profile != "High Risk" else "UNDER_REVIEW"
        })
        
    return suppliers_list
