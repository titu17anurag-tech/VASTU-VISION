import { SampleFloorPlan, VastuAnalysisReport, ZoneActivityPlacementRule } from './vastu-types';

export const SAMPLE_FLOOR_PLANS: SampleFloorPlan[] = [
  {
    id: 'sample-3bhk-modern',
    title: 'Modern 3BHK Urban Apartment',
    tagline: 'North-East Entrance with East Balcony & SW Master Suite',
    type: '3 BHK Flat',
    imageSrc: '/samples/floorplan_sample_modern_3bhk_1793727873456.jpg',
    facing: 'North',
    roomsCount: '3 Bedrooms · 2 Bathrooms · Foyer · Living · Dining · Kitchen',
    description: 'Contemporary multi-room floor plan with dedicated master suite, attached ensuite, corner balcony, and open-plan kitchen-living zone.',
  },
  {
    id: 'sample-2bhk-compact',
    title: 'Compact 2BHK City Residence',
    tagline: 'East Facing Living Area with South-East Kitchen counter',
    type: '2 BHK Home',
    imageSrc: '/samples/floorplan_sample_compact_2bhk_1793727874413.jpg',
    facing: 'East',
    roomsCount: '2 Bedrooms · 2 Baths · Dining · Kitchen · Balcony',
    description: 'High-density residential layout with balanced central circulation hall, utility nook, and dual aspect fenestrations.',
  },
  {
    id: 'sample-blueprint-pdf',
    title: 'Architectural Blueprint Villa (PDF)',
    tagline: 'High-Precision 2D Blueprint with NE Pooja & SE Kitchen',
    type: 'Architectural PDF',
    imageSrc: '/samples/architectural_floorplan_blueprint.pdf',
    facing: 'North',
    roomsCount: '4 Bedrooms · 3 Baths · Pooja Sanctuary · Living · Kitchen · Dining',
    description: 'Vector architectural blueprint document tested for precise Vastu Purusha Mandala mapping and true compass alignment.',
  },
];

export const VASTU_ZONES_CONFIG = [
  {
    key: 'NE',
    name: 'North-East (NE / Ishanya)',
    element: 'Water (Jal)',
    deity: 'Lord Shiva / Jupiter (Guru)',
    color: '#06b6d4', // cyan-500
    idealFor: 'Pooja Room, Meditation, Water storage, Open balcony, Light study',
    taboo: 'Toilets, Heavy Master Bedroom, Kitchen (fire destroys water energy)',
    energyTrait: 'Cosmic Prana inflow, Spiritual clarity, Family prosperity',
    gridRow: 0,
    gridCol: 2,
  },
  {
    key: 'N',
    name: 'North (Uttar)',
    element: 'Water / Earth (Prosperity)',
    deity: 'Lord Kubera / Mercury (Budh)',
    color: '#3b82f6', // blue-500
    idealFor: 'Living Room, Safe / Treasury, Open garden, Front entry',
    taboo: 'Clutter, Heavy storage, Dark enclosed walls, Septic tanks',
    energyTrait: 'Financial abundance, Career opportunities, Liquidity',
    gridRow: 0,
    gridCol: 1,
  },
  {
    key: 'NW',
    name: 'North-West (NW / Vayavya)',
    element: 'Air (Vayu)',
    deity: 'Lord Vayu / Moon (Chandra)',
    color: '#a855f7', // purple-500
    idealFor: 'Guest Bedroom, Finished Goods, Dining, Powder Room, Daughters room',
    taboo: 'Master Bedroom for head of family, Heavy permanent storage',
    energyTrait: 'Movement, Relationship harmony, Social goodwill, Travel',
    gridRow: 0,
    gridCol: 0,
  },
  {
    key: 'E',
    name: 'East (Purva)',
    element: 'Fire / Solar (Agni/Surya)',
    deity: 'Lord Indra / Sun (Surya)',
    color: '#10b981', // emerald-500
    idealFor: 'Main Door, Living Area, Study Room, Windows, Balconies',
    taboo: 'High compound walls blocking sun, Toilets, Staircases',
    energyTrait: 'Vitality, Health, Social status, Mental clarity',
    gridRow: 1,
    gridCol: 2,
  },
  {
    key: 'C',
    name: 'Center (Brahma Sthan)',
    element: 'Space (Akash)',
    deity: 'Lord Brahma (Creator)',
    color: '#f59e0b', // amber-500
    idealFor: 'Open Courtyard, Light atrium, Unobstructed circulation',
    taboo: 'Pillars, Toilets, Staircase, Kitchen stove, Heavy machinery',
    energyTrait: 'Navel of the house, Cosmic equilibrium, Omnipresent harmony',
    gridRow: 1,
    gridCol: 1,
  },
  {
    key: 'W',
    name: 'West (Paschim)',
    element: 'Space / Water (Varuna)',
    deity: 'Lord Varuna / Saturn (Shani)',
    color: '#64748b', // slate-500
    idealFor: 'Dining Room, Children Study, Overhead water tank, Storage',
    taboo: 'Main entrance without remedy, Low depression, Deep wells',
    energyTrait: 'Stability of earnings, Disciplinary focus, Fulfillment',
    gridRow: 1,
    gridCol: 0,
  },
  {
    key: 'SE',
    name: 'South-East (SE / Agni)',
    element: 'Fire (Agni)',
    deity: 'Lord Agni / Venus (Shukra)',
    color: '#f97316', // orange-500
    idealFor: 'Kitchen, Cooktop, Electrical panel, Inverters, Gas appliances',
    taboo: 'Water body, Underground tank, Master bedroom (causes temper)',
    energyTrait: 'Cash flow, Vital passion, Digestive health, Female wellbeing',
    gridRow: 2,
    gridCol: 2,
  },
  {
    key: 'S',
    name: 'South (Dakshin)',
    element: 'Earth-Fire (Yama)',
    deity: 'Lord Yama / Mars (Mangal)',
    color: '#ef4444', // red-500
    idealFor: 'Staircase, Heavy bedrooms, Storeroom, Office',
    taboo: 'Open wells, Underground water tanks, Large glass openings',
    energyTrait: 'Legal fame, Security, Bold decision making, Endurance',
    gridRow: 2,
    gridCol: 1,
  },
  {
    key: 'SW',
    name: 'South-West (SW / Nairutya)',
    element: 'Earth (Prithvi)',
    deity: 'Nirrti / Rahu (Stability & Heaviness)',
    color: '#b45309', // amber-700
    idealFor: 'Master Bedroom for Provider/Head of family, Heavy Wardrobes, Safe facing North',
    taboo: 'Toilets, Water boring, Cut corners, Balconies, Main Entrance',
    energyTrait: 'Grounding strength, Family stability, Leadership authority',
    gridRow: 2,
    gridCol: 0,
  },
];

export const BENCHMARK_3BHK_REPORT: VastuAnalysisReport = {
  overallScore: 84,
  vastuGrade: 'A (Shubh / Auspicious)',
  orientation: 'North Facing Layout',
  pranaEnergyVerdict: 'Positive Pranic Inflow with minor element friction in North-East wet zone',
  executiveSummary:
    'The floor plan demonstrates exceptional alignment with classical Vastu principles. The Master Bedroom is solidly anchored in the South-West (Nairutya) earth zone, providing stability for the household head. The central Brahma Sthan is clear of load-bearing obstacles, and the primary living and balcony expanses capture beneficial morning solar radiation from the North and East.',
  brahmasthanStatus: {
    isOpen: true,
    verdict: 'Clear central core free of structural columns and toilets',
    advice: 'Maintain the central hallway clutter-free to preserve unobstructed cosmic prana flow.',
  },
  entranceStatus: {
    zone: 'North / North-East Foyer Zone',
    padaVerdict: 'Mukhya Pada 3 / Bhallat Pada (Highly Auspicious)',
    recommendation: 'Place a brass swastika or Om symbol above the lintel and keep the threshold well-illuminated.',
  },
  roomAssessments: [
    {
      id: 'rm-1',
      roomName: 'Master Suite (King Bedroom)',
      detectedZone: 'South-West (SW / Nairutya)',
      idealZone: 'South-West (SW / Nairutya)',
      status: 'compliant',
      score: 95,
      element: 'Earth',
      rulingDeity: 'Nirrti (Stability)',
      findings: 'Ideally positioned in the heaviest quadrant of the home. Bedhead aligns toward South.',
      energyImpact: 'Promotes deep restful sleep, family leadership, financial longevity, and emotional grounding.',
      coordinates: { x: 68, y: 28 },
    },
    {
      id: 'rm-2',
      roomName: 'Main Kitchen & Cooking Island',
      detectedZone: 'South-East (SE / Agni)',
      idealZone: 'South-East (SE / Agni)',
      status: 'compliant',
      score: 92,
      element: 'Fire',
      rulingDeity: 'Agni (Energy & Health)',
      findings: 'Fire appliance placed in Agni kon. Cooktop facilitates East-facing cooking posture.',
      energyImpact: 'Enhances digestive fire, family vitality, and steady liquidity of financial reserves.',
      coordinates: { x: 38, y: 72 },
    },
    {
      id: 'rm-3',
      roomName: 'Living Room & Dining Expanses',
      detectedZone: 'East (Purva)',
      idealZone: 'North / East / North-East',
      status: 'compliant',
      score: 88,
      element: 'Air',
      rulingDeity: 'Indra (Clarity)',
      findings: 'Direct access to natural light and expansive balcony doors facilitating ventilation.',
      energyImpact: 'Invites fresh positive chi, smooth social interactions, and mental lightness.',
      coordinates: { x: 25, y: 32 },
    },
    {
      id: 'rm-4',
      roomName: 'Secondary Ensuite Bathroom',
      detectedZone: 'North-West (NW / Vayavya)',
      idealZone: 'North-West (NW / Vayavya)',
      status: 'compliant',
      score: 80,
      element: 'Air',
      rulingDeity: 'Vayu (Elimination)',
      findings: 'Ventilated bathroom located in Vayavya zone, allowing effective disposal of waste energies.',
      energyImpact: 'Smooth waste disposal without disturbing primary prosperity sectors.',
      coordinates: { x: 82, y: 22 },
    },
    {
      id: 'rm-5',
      roomName: 'Children Bedroom 3',
      detectedZone: 'West (Paschim)',
      idealZone: 'West / North-West',
      status: 'compliant',
      score: 82,
      element: 'Space',
      rulingDeity: 'Varuna (Wisdom)',
      findings: 'Study desk can be oriented towards East for optimal concentration.',
      energyImpact: 'Encourages focus on academic studies and disciplined daily routine.',
      coordinates: { x: 78, y: 68 },
    },
    {
      id: 'rm-6',
      roomName: 'Main Hallway (Brahmasthan)',
      detectedZone: 'Center (Brahma Sthan)',
      idealZone: 'Center (Brahma Sthan)',
      status: 'compliant',
      score: 90,
      element: 'Space',
      rulingDeity: 'Brahma (Ether)',
      findings: 'No heavy columns, toilets, or dark store rooms interfering with the central 1/9th core.',
      energyImpact: 'Ensures equitable distribution of prana to all peripheral rooms.',
      coordinates: { x: 52, y: 50 },
    },
  ],
  detectedDoshas: [
    {
      id: 'dsh-1',
      title: 'Water Sink & Cooktop Proximity Friction',
      severity: 'moderate',
      zone: 'South-East (SE / Agni)',
      elementImbalance: 'Fire (Agni) clashing with Water (Jal)',
      description: 'The kitchen sink is positioned within 2.5 feet of the cooking burners on the kitchen counter.',
      lifeImpact: 'May trigger minor misunderstandings between partners and unexpected household repair expenses.',
      remedyCategory: 'non-structural',
      remedyTitle: 'Elemental Wooden Partition & Zinc Boundary Strip',
      actionableSteps: [
        'Place a natural wooden cutting board or small live green jade plant between the gas stove and sink.',
        'Apply a thin 1-inch zinc or brass boundary strip along the countertop between fire and water zones.',
        'Use soft warm white under-cabinet lighting (2700K) to stabilize elemental equilibrium.',
      ],
      remedyMaterials: ['Wood partition block', 'Brass separator strip', 'Green ceramic plant pot'],
      structuralRemedy: {
        actionType: 'Plumbing / Wet Stack Reroute',
        currentActivity: 'Washing dishes & water drainage directly touching fire stove platform',
        recommendedActivity: 'Dry Cooking & Baking in SE; Dishwashing / Wet Cleaning in NE corner of kitchen',
        prohibitedActivity: 'Wet sink within 2.5 feet of gas burner',
        structuralSteps: [
          'Reroute under-counter cold/hot water inlet lines and 40mm PVC waste pipe 3.5 feet towards the Northeast edge of the counter.',
          'Cut a new sink aperture in the granite slab on the eastern wall and seal the old cutout with a solid matching stone prep block.',
          'Erect a 4-inch raised tiled curb or fireproof splash barrier between cooktop and wet zones.',
        ],
        civilConsiderations: 'Requires plumber for PVC waste stack extension and stone mason for granite cutout fabrication.',
        renovationUrgency: 'Medium (Phase 2 Remodeling)',
      },
    },
    {
      id: 'dsh-2',
      title: 'Balcony Overhang in West Quadrant',
      severity: 'minor',
      zone: 'West (Paschim)',
      elementImbalance: 'Heavy void in Varuna sector',
      description: 'Extended glass opening without heavy drapes on the western facade can leak evening heat.',
      lifeImpact: 'Can cause mild sluggishness in the late afternoon hours.',
      remedyCategory: 'color_elemental',
      remedyTitle: 'Earth Tone Drapes & Grounding Planters',
      actionableSteps: [
        'Install double-layer earthen beige or charcoal linen curtains on the western balcony slider.',
        'Place heavy terracotta planters with broad-leaf plants (e.g. Ficus or Snake Plant) near the window frame.',
      ],
      remedyMaterials: ['Terracotta planter', 'Beige blackout curtains'],
      structuralRemedy: {
        actionType: 'Fenestration Adjustment',
        currentActivity: 'Unshaded single-glazed glass opening admitting intense late afternoon infrared heat',
        recommendedActivity: 'Double-glazed thermal buffer balcony or solid study nook with vertical louvers',
        prohibitedActivity: 'Unprotected wide glass void in western Varuna zone',
        structuralSteps: [
          'Retrofit exterior powder-coated aluminum vertical shading fins or deep RCC chajja (overhang) above the western aperture.',
          'Replace clear float glass with double-glazed low-emissivity (Low-E) tinted thermal unit.',
          'Construct a 3-foot masonry dwarf parapet wall beneath the railing to increase physical earth element weight.',
        ],
        civilConsiderations: 'Civil facade anchoring into peripheral RCC lintel beam; no structural alteration to loadbearing elements.',
        renovationUrgency: 'Optional Architectural Upgrade',
      },
    },
  ],
  elementBalances: [
    {
      element: 'Earth',
      sanskritName: 'Prithvi',
      percentage: 88,
      status: 'balanced',
      zoneRepresented: 'South-West (SW)',
      significance: 'Imparts physical stability, asset security, and steady emotional roots.',
    },
    {
      element: 'Water',
      sanskritName: 'Jal',
      percentage: 82,
      status: 'balanced',
      zoneRepresented: 'North-East (NE)',
      significance: 'Governs financial liquidity, spiritual peace, and clear intuition.',
    },
    {
      element: 'Fire',
      sanskritName: 'Agni',
      percentage: 86,
      status: 'balanced',
      zoneRepresented: 'South-East (SE)',
      significance: 'Regulates bodily vitality, metabolic health, confidence, and passion.',
    },
    {
      element: 'Air',
      sanskritName: 'Vayu',
      percentage: 80,
      status: 'balanced',
      zoneRepresented: 'North-West (NW)',
      significance: 'Controls circulation of ideas, social harmony, and mental freshness.',
    },
    {
      element: 'Space',
      sanskritName: 'Akash',
      percentage: 85,
      status: 'balanced',
      zoneRepresented: 'Center (Brahma Sthan)',
      significance: 'Harmonizes all surrounding elemental frequencies throughout the home.',
    },
  ],
  energyFlowRecommendations: [
    {
      id: 'rec-1',
      category: 'Wealth & Prosperity',
      action: 'Install a small tabletop water fountain or water bowl with fresh petals in the North-East zone to invigorate Kuber prosperity currents.',
      priority: 'High',
      effort: 'Simple (No Construction)',
    },
    {
      id: 'rec-2',
      category: 'Health & Vitality',
      action: 'Ensure the chef faces East while preparing meals by organizing the main cooking prep station accordingly.',
      priority: 'High',
      effort: 'Furniture Shift',
    },
    {
      id: 'rec-3',
      category: 'Peace & Harmony',
      action: 'Place raw Himalayan rock salt crystals in a glass dish inside the bathrooms to absorb residual negative ions.',
      priority: 'Medium',
      effort: 'Simple (No Construction)',
    },
    {
      id: 'rec-4',
      category: 'Career Growth',
      action: 'Position your work-from-home desk so that your back is supported by a solid wall and you face North or East while working.',
      priority: 'Medium',
      effort: 'Furniture Shift',
    },
  ],
  quickWins: [
    'Keep the North-East corner spotless, lightly scented with sandalwood or camphor, and free of heavy shoes.',
    'Hang a melodic metal wind chime (5 or 6 rods) in the North-West area to stimulate joyful social connections.',
    'Always sleep with head facing South or East to align with Earth geomagnetic lines for optimal REM sleep.',
    'Ensure all internal doors open clockwise past 90 degrees without squeaks or friction.',
  ],
  zoneActivityMatrix: undefined, // Attached after ZONE_ACTIVITY_RULES definition below
};

export const ZONE_ACTIVITY_RULES: ZoneActivityPlacementRule[] = [
  {
    zoneKey: 'NE',
    zoneName: 'North-East (NE / Ishanya)',
    direction: 'North-East',
    element: 'Water (Jal)',
    rulingDeity: 'Lord Shiva / Jupiter (Guru)',
    primaryEnergy: 'Cosmic Pranic Inflow & Spiritual Enlightenment',
    auspiciousActivities: [
      {
        activity: 'Prayer Sanctuary / Mandir',
        description: 'Receives the purest magnetic and solar vibrations of dawn. Fosters inner peace and wisdom.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Meditation & Deep Yoga Studio',
        description: 'Lowest electromagnetic turbulence in the entire floor plan, ideal for higher mental faculties.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Underground Rainwater Sump / Borewell',
        description: 'Water storage placed in the Water quadrant naturally depresses the ground, accelerating positive energy inflow.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Light Reading Room & Study Alcove',
        description: 'Students facing East or North absorb intellectual focus with minimal cognitive fatigue.',
        auspiciousGrade: 'Shubh (Auspicious)',
      },
      {
        activity: 'Open Porch, Veranda & Balcony',
        description: 'Uncluttered exterior openings keep the Ishanya zone light, airy, and welcoming.',
        auspiciousGrade: 'Shubh (Auspicious)',
      },
    ],
    prohibitedActivities: [
      {
        activity: 'Toilet, Bathroom & Septic Tank',
        doshaConsequence: 'Pollutes the head of the Vastu Purusha; causes chronic neurological/mental stress and financial blockage.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Kitchen, Gas Stove & Fire Appliances',
        doshaConsequence: 'Fire destroys the sacred Water element; leads to rapid cash drain, family disputes, and digestive trouble.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Master Bedroom for Head of Family',
        doshaConsequence: 'Too light and delicate for the household provider; causes restless sleep, decision paralysis, and detachment.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Heavy RCC Staircase & Overhead Heavy Tank',
        doshaConsequence: 'Crushes Ishanya energy under immense dead weight, suffocating growth and luck.',
        severity: 'Severe Dosha',
      },
    ],
    structuralCureIfMisplaced:
      'If a toilet exists in NE: Decommission commode and seal wastewater pipes; convert the space into a dry storage or study room. If a kitchen exists: Relocate the cooktop and gas line to the South-East Agni quadrant.',
  },
  {
    zoneKey: 'N',
    zoneName: 'North (Uttar)',
    direction: 'North',
    element: 'Water / Earth (Kuber)',
    rulingDeity: 'Lord Kubera / Mercury (Budh)',
    primaryEnergy: 'Treasury, Career Growth, Wealth Liquidity & Opportunity',
    auspiciousActivities: [
      {
        activity: 'Cash Vault, Safe & Accounting Office',
        description: 'Safes located here should open towards the North to receive Kuber blessings for multiplied savings.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Main Entrance & Formal Foyer',
        description: 'North entrance padas (Soma, Bhallat) invite abundant career advancement and new customer opportunities.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Living Area & Open Reception Lounge',
        description: 'Wide communal areas facilitate the unobstructed movement of magnetic prosperity streams.',
        auspiciousGrade: 'Shubh (Auspicious)',
      },
      {
        activity: 'Light Water Fountain & Cascading Feature',
        description: 'Gentle, clear moving water activates the financial circulatory pulse of the home.',
        auspiciousGrade: 'Shubh (Auspicious)',
      },
    ],
    prohibitedActivities: [
      {
        activity: 'Heavy Solid Storage & Junk Dump',
        doshaConsequence: 'Dead weight chokeholds cash liquidity and stalls career promotions.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Toilet & Sewage Drainage Stack',
        doshaConsequence: 'Flushes away financial stability; causes continuous medical and court expenses.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Dark Blank Firewalls without Windows',
        doshaConsequence: 'Blocks magnetic planetary flux from entering the living floor plan.',
        severity: 'Moderate Imbalance',
      },
    ],
    structuralCureIfMisplaced:
      'Dismantle non-loadbearing partitions that restrict northern daylight. Ensure the floor level in the North is equal to or lower than the South and West.',
  },
  {
    zoneKey: 'E',
    zoneName: 'East (Purva)',
    direction: 'East',
    element: 'Solar Fire / Vitality (Surya)',
    rulingDeity: 'Lord Indra / Sun (Surya)',
    primaryEnergy: 'Physical Health, Social Influence, Dignity & Vitality',
    auspiciousActivities: [
      {
        activity: 'Main Entrance Gate & Sunlit Foyer',
        description: 'Entering from the East charges inhabitants with morning prana, social respect, and radiant health.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Morning Yoga, Exercise & Sun Lounge',
        description: 'Direct exposure to dawn infrared and ultraviolet rays restores cellular circadian rhythm.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Children Study Room & Academic Library',
        description: 'Desks arranged so students face East enhance memory retention and cognitive agility.',
        auspiciousGrade: 'Shubh (Auspicious)',
      },
      {
        activity: 'Broad Daylight Windows & Clerestory Glazing',
        description: 'High window-to-wall ratio draws solar vitality deep into interior corridors.',
        auspiciousGrade: 'Shubh (Auspicious)',
      },
    ],
    prohibitedActivities: [
      {
        activity: 'High Blank Boundary Walls / Heavy Garage',
        doshaConsequence: 'Starves the residence of morning solar prana; induces chronic low immunity and lethargy.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Toilets & Septic Chambers',
        doshaConsequence: 'Tarnishes family reputation, social prestige, and causes chronic eye/heart health complaints.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Heavy RCC Staircase Blocking Facade',
        doshaConsequence: 'Casts dark shadow over eastern facade, stunting vitality of children.',
        severity: 'Moderate Imbalance',
      },
    ],
    structuralCureIfMisplaced:
      'Enlarge eastern window openings to at least 25% of the wall surface. Lower boundary wall height on the eastern edge.',
  },
  {
    zoneKey: 'SE',
    zoneName: 'South-East (SE / Agni)',
    direction: 'South-East',
    element: 'Fire (Agni)',
    rulingDeity: 'Lord Agni / Venus (Shukra)',
    primaryEnergy: 'Metabolism, Cash Flow, Passion & Female Wellbeing',
    auspiciousActivities: [
      {
        activity: 'Main Kitchen & Cooking Hob',
        description: 'Cooking in the fire quadrant aligns biological nourishment with cosmic Agni. Chef faces East.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Electrical Meter Board, Inverter & Geyser',
        description: 'High-voltage machinery, boilers, and transformers find their natural elemental home here.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Home Gym, Fitness Equipment & Sauna',
        description: 'Cardio and heat workouts harmonize with active metabolic fire frequencies.',
        auspiciousGrade: 'Shubh (Auspicious)',
      },
    ],
    prohibitedActivities: [
      {
        activity: 'Underground Water Tank, Sump or Borewell',
        doshaConsequence: 'Water directly quenches fire: triggers severe wealth leakage, surgical health expenses, and digestive illnesses.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Master Bedroom for Provider',
        doshaConsequence: 'Inhabitants become overly aggressive, argumentative, and suffer hypertension and insomnia.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Wet Toilets & Cold Jacuzzi',
        doshaConsequence: 'Extinguishes female vitality and disrupts household liquid cash flow.',
        severity: 'Moderate Imbalance',
      },
    ],
    structuralCureIfMisplaced:
      'If the kitchen is misplaced elsewhere, structurally relocate the cooking counter and exhaust hood to the SE corner. Ensure gas piping connects to this zone.',
  },
  {
    zoneKey: 'S',
    zoneName: 'South (Dakshin)',
    direction: 'South',
    element: 'Earth-Fire (Yama)',
    rulingDeity: 'Lord Yama / Mars (Mangal)',
    primaryEnergy: 'Discipline, Legal Victory, Fame, Stability & Security',
    auspiciousActivities: [
      {
        activity: 'Heavy Concrete Staircase (Clockwise Ascending)',
        description: 'Dead weight on the South anchors the property against external legal and financial storms.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Heavy Wardrobe Wall & Solid Master Closet',
        description: 'Solid floor-to-ceiling cabinetry creates a defensive barrier on the southern perimeter.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Private Office & Executive Sanctuary',
        description: 'Provides authority, firm executive decision-making, and professional endurance.',
        auspiciousGrade: 'Shubh (Auspicious)',
      },
    ],
    prohibitedActivities: [
      {
        activity: 'Underground Well, Sump or Large Low Depression',
        doshaConsequence: 'Invites legal disputes, sudden accidents, and loss of household male authority.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Main Front Lawn / Large Unshaded Glass Voids',
        doshaConsequence: 'Allows midday harsh ultraviolet solar energy to destabilize interior thermal peace.',
        severity: 'Moderate Imbalance',
      },
    ],
    structuralCureIfMisplaced:
      'Thicken southern walls with 9-inch brickwork or sound acoustic paneling. Install heavy masonry planter boxes on south balconies.',
  },
  {
    zoneKey: 'SW',
    zoneName: 'South-West (SW / Nairutya)',
    direction: 'South-West',
    element: 'Earth (Prithvi)',
    rulingDeity: 'Nirrti / Rahu (Stability)',
    primaryEnergy: 'Foundation, Patriarchal Authority, Stability & Ancestral Strength',
    auspiciousActivities: [
      {
        activity: 'Master Suite for Head of Family / Breadwinner',
        description: 'Anchors the family leader with supreme stability, commanding authority, and long-term vision.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Heavy Metal Vault / Safe (Placed in SW, opens North)',
        description: 'Locks accumulated wealth in the heaviest sector; wealth cannot leak or be spent recklessly.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Overhead Concrete Water Storage Tank (On Roof)',
        description: 'Highest and heaviest structural mass of the entire building must reside in the South-West.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Solid Loadbearing Structural Masonry',
        description: 'Thickest external envelope wall with smallest fenestrations.',
        auspiciousGrade: 'Shubh (Auspicious)',
      },
    ],
    prohibitedActivities: [
      {
        activity: 'Toilets, Commode & Waste Sewage Outlets',
        doshaConsequence: 'Catastrophic dosha: causes unmanageable debt, chronic health illnesses, and severe loss of family stability.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Underground Water Sump or Borewell',
        doshaConsequence: 'Digging a hole in the Earth anchor creates severe financial ruin and emotional collapse.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Main Entrance / Cut Corner / Void Balcony',
        doshaConsequence: 'Lack of corner support creates chronic life instability, relationship divorces, and career crashes.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Kitchen or Fire Appliance',
        doshaConsequence: 'Destabilizes the owner health and creates recurring hospital bills.',
        severity: 'Severe Dosha',
      },
    ],
    structuralCureIfMisplaced:
      'Ensure the South-West floor level is raised 1 to 2 inches higher than all surrounding rooms. If a toilet is present, shift wet functions to the West or NW. If a corner is cut, erect a structural pergola or brick wall to close the geometric envelope.',
  },
  {
    zoneKey: 'W',
    zoneName: 'West (Paschim)',
    direction: 'West',
    element: 'Space / Water (Varuna)',
    rulingDeity: 'Lord Varuna / Saturn (Shani)',
    primaryEnergy: 'Fulfillment, Consistent Gains, Long-Term Academic Focus & Trade',
    auspiciousActivities: [
      {
        activity: 'Family Dining Room',
        description: 'Nourishes family members with balanced digestion and shared harmony; promotes gratitude.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Children & Teenager Study Bedroom',
        description: 'Cultivates patient focus, discipline, and endurance needed for competitive academic exams.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Overhead Water Tank Platform (Secondary)',
        description: 'Varuna is lord of waters; high overhead storage is structurally compatible here.',
        auspiciousGrade: 'Shubh (Auspicious)',
      },
      {
        activity: 'Book Library & Knowledge Archive',
        description: 'Fosters deep scholarship and contemplative literature study.',
        auspiciousGrade: 'Shubh (Auspicious)',
      },
    ],
    prohibitedActivities: [
      {
        activity: 'Basement Sump / Floor Level Depression',
        doshaConsequence: 'Drains profitability from investments and delays career achievements.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Wide Unprotected Western Glass Windows',
        doshaConsequence: 'Overheats interior with harsh evening radiation, inducing late-day exhaustion.',
        severity: 'Moderate Imbalance',
      },
    ],
    structuralCureIfMisplaced:
      'Retrofit deep exterior sunshades (chajjas) or double-glazed solar control windows on the western facade. Maintain floor height higher than the North and East.',
  },
  {
    zoneKey: 'NW',
    zoneName: 'North-West (NW / Vayavya)',
    direction: 'North-West',
    element: 'Air (Vayu)',
    rulingDeity: 'Lord Vayu / Moon (Chandra)',
    primaryEnergy: 'Movement, Communication, Guest Hospitality, Travel & Elimination',
    auspiciousActivities: [
      {
        activity: 'Guest Bedroom & Visitor Suites',
        description: 'Guests enjoy their stay but depart gracefully without overstaying or causing household disruption.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Attached Powder Room / Toilet / Bath',
        description: 'Zone of movement and elimination safely flushes away negative bio-waste without prosperity friction.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Unmarried Daughter Bedroom',
        description: 'Air element naturally facilitates graceful marital alliance and smooth transition.',
        auspiciousGrade: 'Shubh (Auspicious)',
      },
      {
        activity: 'Vehicle Garage, Pantry & Finished Goods Storage',
        description: 'Commercial products and vehicles move rapidly into sales and dispatch.',
        auspiciousGrade: 'Shubh (Auspicious)',
      },
    ],
    prohibitedActivities: [
      {
        activity: 'Master Bedroom for Head of Family',
        doshaConsequence: 'Causes perpetual restlessness, frequent unwanted travel, and inability to settle down.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Mandir / Sacred Pooja Room',
        doshaConsequence: 'Air element destabilizes meditation; spiritual focus wanders constantly.',
        severity: 'Moderate Imbalance',
      },
      {
        activity: 'Heavy Permanent Underground Safe Vault',
        doshaConsequence: 'Money keeps circulating out faster than it accumulates.',
        severity: 'Moderate Imbalance',
      },
    ],
    structuralCureIfMisplaced:
      'Position toilet commodes strictly on North-South axis with proper ventilation ducts. Keep doors leading into the NW tightly gasketed.',
  },
  {
    zoneKey: 'C',
    zoneName: 'Center (Brahma Sthan)',
    direction: 'Center',
    element: 'Space / Ether (Akash)',
    rulingDeity: 'Lord Brahma (Supreme Creator)',
    primaryEnergy: 'Omnipresent Cosmic Harmony, Ether Equilibrium & Lung Vitality',
    auspiciousActivities: [
      {
        activity: 'Open Central Circulation Hall / Aangan',
        description: 'Acts as the heart of the home, allowing cosmic prana to breathe freely into all 8 perimeter rooms.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Light Skylight / Central Courtyard Atrium',
        description: 'Natural downward shaft of light illuminates the Brahma Sthan and energizes all occupants.',
        auspiciousGrade: 'Param Shubh (Most Ideal)',
      },
      {
        activity: 'Clean, Uncluttered Gathering Space',
        description: 'Fosters unconditional harmony and mutual connection among family members.',
        auspiciousGrade: 'Shubh (Auspicious)',
      },
    ],
    prohibitedActivities: [
      {
        activity: 'Heavy RCC Structural Columns & Pillars',
        doshaConsequence: 'Directly pierces the chest/navel of the Vastu Purusha; causes extreme suffocation and chronic distress.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Toilets, Kitchen Stove or Heavy Staircase',
        doshaConsequence: 'Contaminates or burns the heart of the entire floor plan; triggers family-wide health crises.',
        severity: 'Severe Dosha',
      },
      {
        activity: 'Dark Storage Closets or Sunken Pits',
        doshaConsequence: 'Suffocates prana circulation to all peripheral quadrants.',
        severity: 'Severe Dosha',
      },
    ],
    structuralCureIfMisplaced:
      'Demolish interior partition walls that bisect the central 1/9th grid square. If concrete structural beams cross the Brahmasthan, enclose them inside a smooth false ceiling.',
  },
];

// Link benchmark report to the activity rules
BENCHMARK_3BHK_REPORT.zoneActivityMatrix = ZONE_ACTIVITY_RULES;
