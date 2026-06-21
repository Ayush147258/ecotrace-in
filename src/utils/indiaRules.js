export const getRuleBasedTips = (emissions) => {
  const rules = {
    transport: [
      { text: "Switching from daily auto to metro for a 10km commute saves ₹2,400/month and reduces 25 kg CO₂. Buy a metro smart card today.", co2: 25, money: 2400 },
      { text: "Carpooling to work twice a week cuts your transport footprint by 20%. Start a WhatsApp group with colleagues nearby.", co2: 15, money: 1200 },
      { text: "Keep your two-wheeler tires inflated. It improves mileage and saves about ₹300 on petrol every month.", co2: 5, money: 300 },
      { text: "Take the bus instead of a cab for airport runs. It saves you nearly ₹800 per trip and cuts emissions drastically.", co2: 12, money: 800 },
      { text: "Walk to local shops instead of taking the scooter. Good for health, saves 2 kg CO₂ and ₹100 petrol a month.", co2: 2, money: 100 },
      { text: "Turn off your engine at signals longer than 30 seconds. You'll save half a litre of fuel every week.", co2: 5, money: 200 },
      { text: "If you use a CNG car, ensure regular servicing. A well-maintained engine reduces emissions by 10%.", co2: 10, money: 500 },
      { text: "Combine your errands into one trip on weekends instead of multiple auto rides. Saves ₹150/week.", co2: 4, money: 600 },
      { text: "If buying a new vehicle, consider an EV scooter. Government subsidies can make the EMI cheaper than petrol costs.", co2: 30, money: 3000 },
      { text: "Work from home one extra day a week. It directly eliminates 20% of your commute footprint and saves ₹400/month.", co2: 18, money: 1600 }
    ],
    food: [
      { text: "Home-cooked dal-rice has roughly a third the footprint of restaurant meals. Eating in twice more a week saves ₹800.", co2: 9, money: 3200 },
      { text: "Replace mutton with chicken or eggs once a week. It cuts your food footprint by 10 kg CO₂ per month.", co2: 10, money: 500 },
      { text: "Buy seasonal local vegetables from the mandi instead of imported supermarket produce. Fresher, cheaper, lower CO₂.", co2: 5, money: 400 },
      { text: "Plan your meals to reduce food waste. An average Indian home wastes ₹400 of food monthly.", co2: 4, money: 400 },
      { text: "Try going pure veg on weekends. It's traditional, healthy, and saves about 15 kg CO₂ monthly.", co2: 15, money: 600 },
      { text: "Boil water in a covered vessel to save cooking gas. Small habit, saves 10% LPG usage.", co2: 1.5, money: 100 },
      { text: "Soak lentils (dal) and beans overnight before cooking. It cuts boiling time on the stove by half.", co2: 3, money: 150 },
      { text: "Use a pressure cooker instead of open pans. It cooks faster and uses 50% less energy.", co2: 5, money: 200 },
      { text: "Avoid ordering food during peak traffic. The delivery trip adds extra emissions. Pick it up if nearby.", co2: 2, money: 100 },
      { text: "Grow simple herbs like mint or coriander in pots. Zero transport emissions and fresh flavor.", co2: 1, money: 50 }
    ],
    energy: [
      { text: "Switching to an induction stove for lunch prep could cut your LPG use by a third. Saves ₹380/month.", co2: 18, money: 380 },
      { text: "Set your AC to 24°C instead of 18°C. Every degree higher saves 6% in electricity costs.", co2: 15, money: 450 },
      { text: "Clean your AC filters monthly. A dirty filter makes the AC work harder, costing you ₹200 extra.", co2: 8, money: 200 },
      { text: "Use a 5-star rated ceiling fan. It uses 30W compared to 75W of older fans. Saves ₹100/month.", co2: 5, money: 100 },
      { text: "Switch all bulbs to LEDs. If you have 5 old bulbs, replacing them saves 30 kg CO₂ and ₹300 monthly.", co2: 30, money: 300 },
      { text: "Unplug chargers and TVs when not in use. 'Vampire power' accounts for 5% of your electricity bill.", co2: 3, money: 80 },
      { text: "Use natural sunlight during the day. Keeping curtains open saves electricity and improves mood.", co2: 2, money: 50 },
      { text: "Defrost your fridge regularly. Ice buildup forces the motor to run longer, wasting electricity.", co2: 4, money: 120 },
      { text: "If using a geyser, turn it on just 15 minutes before bathing. Don't leave it on for hours.", co2: 10, money: 250 },
      { text: "Use cold water for laundry. Heating water uses 90% of a washing machine's energy.", co2: 12, money: 300 }
    ],
    shopping: [
      { text: "Skip one online fast-fashion order this month. Saves 15 kg CO₂ and at least ₹1,000.", co2: 15, money: 1000 },
      { text: "Repair your phone or shoes instead of replacing them. Extends life and saves massive embedded carbon.", co2: 50, money: 5000 },
      { text: "Carry a cloth bag for groceries. Skip the ₹5 plastic bag fee and keep 10 bags out of the landfill.", co2: 1, money: 50 },
      { text: "Buy electronics second-hand or refurbished. A refurbished laptop saves 200 kg CO₂ and ₹15,000.", co2: 200, money: 15000 },
      { text: "Borrow tools or occasional items (like a drill or luggage) from neighbors instead of buying.", co2: 20, money: 2000 },
      { text: "Consolidate online orders. Ask the delivery app to deliver items together to reduce trips.", co2: 3, money: 0 },
      { text: "Buy in bulk for staples like rice and wheat. Less packaging, fewer trips, and cheaper per kg.", co2: 5, money: 300 },
      { text: "Choose local brands over imported ones to cut down shipping emissions.", co2: 8, money: 200 },
      { text: "Donate old clothes instead of throwing them away. It gives them a second life.", co2: 10, money: 0 },
      { text: "Unsubscribe from marketing emails. Less digital clutter means fewer impulse buys.", co2: 5, money: 1000 }
    ],
    waste: [
      { text: "Start composting kitchen scraps. It reduces your landfill waste by 50% and gives free fertilizer.", co2: 8, money: 100 },
      { text: "Use separate bins for dry and wet waste. It helps municipality workers recycle effectively.", co2: 5, money: 0 },
      { text: "Avoid single-use water bottles. Carry a steel bottle and save ₹20 every time you go out.", co2: 3, money: 600 },
      { text: "Repurpose old t-shirts as cleaning rags instead of buying paper towels or sponges.", co2: 2, money: 150 },
      { text: "Sell old newspapers and metal scrap to the local kabadiwala. Get ₹50 and ensure recycling.", co2: 10, money: 50 },
      { text: "Use rechargeable batteries for remotes and clocks instead of throwing away alkaline ones.", co2: 2, money: 200 },
      { text: "Opt for e-bills and digital receipts instead of paper ones. Saves trees and clutter.", co2: 1, money: 0 },
      { text: "Say no to plastic cutlery when ordering food online. Use your home spoons.", co2: 1.5, money: 0 },
      { text: "Upcycle glass jars for kitchen storage instead of buying new plastic containers.", co2: 4, money: 300 },
      { text: "Avoid foil wrap; use a steel lunchbox or reusable cloth wraps for packing rotis.", co2: 3, money: 100 }
    ]
  };

  if (!emissions) return [rules.transport[0], rules.food[0], rules.energy[0]];

  // Sort categories by highest emission
  const categories = [
    { name: 'transport', val: emissions.transport },
    { name: 'food', val: emissions.food },
    { name: 'energy', val: emissions.energy },
    { name: 'shopping', val: emissions.shopping },
    { name: 'waste', val: emissions.waste }
  ].sort((a, b) => b.val - a.val);

  // Pick one random tip from the top 3 highest emitting categories
  const topCategories = categories.slice(0, 3).map(c => c.name);
  
  const tips = topCategories.map(cat => {
    const catRules = rules[cat];
    const randomIdx = Math.floor(Math.random() * catRules.length);
    return catRules[randomIdx];
  });

  return tips;
};
