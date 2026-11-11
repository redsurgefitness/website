-- Add the missing columns
ALTER TABLE products ADD COLUMN features TEXT;
ALTER TABLE products ADD COLUMN specs TEXT;

-- Update Speed Jump Rope
UPDATE products SET 
  features = '["Competition-grade sealed bearings", "Lightweight 2.5mm PVC coated cable", "Machined aluminum handles with ergonomic grip", "Adjustable cable length up to 10ft"]',
  specs = '{"Cable Material": "Coated steel", "Handle Material": "Machined Aluminum", "Bearing Type": "Sealed ball bearings", "Weight": "4.8 oz", "Cable Length": "10 ft (adjustable)"}' 
WHERE slug = 'speed-jump-rope';

-- Update Weighted Jump Rope
UPDATE products SET 
  features = '["Progressive weight distribution", "Heavy-duty braided cable", "Textured anti-slip handles", "Builds shoulder and forearm endurance"]',
  specs = '{"Cable Material": "Braided nylon/steel", "Handle Material": "High-density polymer", "Weight": "1 lb (16 oz)", "Cable Length": "9.5 ft", "Bearing Type": "Smooth-rotation ball bearings"}' 
WHERE slug = 'weighted-jump-rope';