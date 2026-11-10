const catalog: Record<string, string[]> = {
  "ASTON MARTIN": [
    "DB11",
    "DB12",
    "DB9",
    "DBS",
    "DBX",
    "Rapide",
    "V8 Vantage",
    "Valiant",
    "Valour",
    "Vanquish",
    "Vantage"
  ],
  "TESLA": [
    "Model 3",
    "Model S",
    "Model X",
    "Model Y"
  ],
  "JAGUAR": [
    "E-Pace",
    "E-PACE",
    "F-Pace",
    "F-PACE",
    "F-TYPE",
    "I-PACE",
    "S-Type",
    "Vanden Plas",
    "X-Type",
    "XF",
    "XJ",
    "XJR",
    "XK",
    "XK8"
  ],
  "MASERATI": [
    "Coupe",
    "Ghibli",
    "Grancabrio",
    "Granturismo",
    "Grecale",
    "Levante",
    "MC20",
    "Quattroporte",
    "Spyder"
  ],
  "ROLLS-ROYCE": [
    "Cullinan",
    "Ghost",
    "Phantom",
    "Spectre",
    "Wraith"
  ],
  "TOYOTA": [
    "4Runner",
    "Allion",
    "Alphard",
    "Aqua",
    "Aurion",
    "Auris",
    "Avalon",
    "Avanza",
    "Axio",
    "Belta",
    "bZ4X",
    "Camry",
    "Camry Solara",
    "Carina",
    "Celica",
    "Corolla",
    "Corolla Cross",
    "Corolla Fielder",
    "Corolla Matrix",
    "Corolla Runx",
    "Crown",
    "Crown Athlete",
    "Crown Majesta",
    "Crown Royal",
    "Echo",
    "Estima",
    "FJ Cruiser",
    "Fortuner",
    "GR Corolla",
    "GR86",
    "Grand Highlander",
    "Harrier",
    "HiAce",
    "Highlander",
    "Hilux",
    "Isis",
    "Land Cruiser",
    "Land Cruiser Prado",
    "Mark X",
    "Mirai",
    "MR2",
    "Noah",
    "Passo",
    "Premio",
    "Prius",
    "Prius C",
    "Prius Prime (PHEV)",
    "Prius V",
    "Probox",
    "Ractis",
    "Raize",
    "RAV4",
    "RAV4 Prime (PHEV)",
    "Scion FR-S",
    "Scion iQ",
    "Scion tC",
    "Scion xA",
    "Scion xB",
    "Scion xD",
    "Sequoia",
    "Sienna",
    "Sienta",
    "Supra",
    "Surf",
    "Vellfire",
    "Venza",
    "Vitz",
    "Voxy",
    "Wish",
    "Yaris",
    "Yaris Cross"
  ],
  "MERCEDES-BENZ": [
    "A-Class",
    "AMG GT",
    "B-Class",
    "C-Class",
    "CL-Class",
    "CLA",
    "CLA-Class",
    "CLE",
    "CLK-Class",
    "CLS-Class",
    "E-Class",
    "EQB-Class",
    "EQE-Class Sedan",
    "EQE-Class SUV",
    "EQS-Class Sedan",
    "EQS-Class SUV",
    "eSprinter",
    "G-Class",
    "GL-Class",
    "GLA",
    "GLA-Class",
    "GLB",
    "GLB-Class",
    "GLC",
    "GLC-Class",
    "GLE",
    "GLE-Class",
    "GLK-Class",
    "GLS",
    "GLS-Class",
    "M-Class",
    "ML-Class",
    "S-Class",
    "SL-Class",
    "SLK-Class",
    "SLR McLaren",
    "SLS-Class",
    "Sprinter",
    "V-Class"
  ],
  "BMW": [
    "1 Series",
    "128i",
    "135i",
    "2 Series",
    "228i",
    "230i",
    "3 Series",
    "320i",
    "325Ci",
    "325i",
    "325xi",
    "328d",
    "328i",
    "330Ci",
    "330e",
    "330i",
    "330xi",
    "335",
    "335i",
    "335is",
    "340i",
    "4 Series",
    "428i",
    "430i",
    "435i",
    "5 Series",
    "525i",
    "528i",
    "530i",
    "535d",
    "535i",
    "540i",
    "545i",
    "550i",
    "640i",
    "645Ci",
    "645i",
    "650i",
    "650xi",
    "7 Series",
    "740i",
    "740Li",
    "745i",
    "745Li",
    "750e",
    "750i",
    "750i, Alpina B7",
    "750Li",
    "750Li, Alpina B7",
    "750Lxi",
    "750xi",
    "760i",
    "760Li",
    "840i",
    "ActiveHybrid 3",
    "ActiveHybrid 5",
    "ActiveHybrid 7",
    "Alpina B8",
    "i3",
    "i4",
    "i5",
    "i7",
    "i8",
    "iX",
    "M2",
    "M235i",
    "M240i",
    "M3",
    "M340i",
    "M3Ci",
    "M4",
    "M440i",
    "M5",
    "M6",
    "M8",
    "M850i",
    "X1",
    "X2",
    "X3",
    "X4",
    "X5",
    "X6",
    "X7",
    "XM",
    "Z4"
  ],
  "BUGATTI": [
    "Chiron",
    "Chiron Pur Sport",
    "Chiron Supersport",
    "EB110",
    "Veyron"
  ],
  "MINI": [
    "Clubman",
    "Cooper",
    "Cooper Convertible",
    "Cooper Coupe",
    "Cooper Roadster",
    "Countryman",
    "Hardtop",
    "Paceman"
  ],
  "FORD": [
    "'34",
    "Bronco",
    "Bronco Sport",
    "C-Max",
    "Crown Victoria",
    "E-150",
    "E-250",
    "E-350",
    "E-450",
    "EcoSport",
    "Edge",
    "Escape",
    "Everest",
    "Excursion",
    "Expedition",
    "Expedition MAX",
    "Explorer",
    "Explorer Sport Trac",
    "Fiesta",
    "Flex",
    "Focus",
    "Freestar",
    "Fusion",
    "GT",
    "GT MKII",
    "Kuga",
    "Mustang",
    "Mustang Mach-E",
    "Ranger",
    "Taurus",
    "Thunderbird",
    "Transit"
  ],
  "LINCOLN": [
    "Aviator",
    "Corsair",
    "LS",
    "MKS",
    "MKT",
    "MKX",
    "MKZ",
    "Nautilus",
    "Navigator",
    "Navigator L",
    "Town Car"
  ],
  "MERCURY": [
    "Grand Marquis",
    "Marauder",
    "Monterey",
    "Mountaineer",
    "Sable"
  ],
  "LOTUS": [
    "Emira",
    "Esprit",
    "Evora"
  ],
  "CHEVROLET": [
    "3 ton",
    "Astro Van",
    "Avalanche",
    "Aveo",
    "Blazer",
    "Camaro",
    "Caprice Police Vehicle",
    "Captiva",
    "Captiva Sport",
    "Cavalier",
    "Colorado",
    "Corvette",
    "Cruze",
    "Epica",
    "Equinox",
    "Express",
    "Impala",
    "Impala Limited",
    "Malibu",
    "Malibu Classic",
    "Matiz",
    "Monte Carlo",
    "Onix",
    "Optra",
    "Orlando",
    "Sonic",
    "Spark",
    "SS",
    "Suburban",
    "Suburban HD",
    "Tahoe",
    "Tracker",
    "Trailblazer",
    "Traverse",
    "Traverse Limited",
    "Trax",
    "U100",
    "Venture",
    "Volt"
  ],
  "BUICK": [
    "Century",
    "Enclave",
    "Encore",
    "Encore GX",
    "Envision",
    "Envista",
    "LaCrosse",
    "LeSabre",
    "Park Avenue",
    "Rainier",
    "Regal",
    "Rendezvous",
    "Verano"
  ],
  "CADILLAC": [
    "ATS",
    "CT4",
    "CT5",
    "CTS",
    "Deville",
    "ELR",
    "Escalade",
    "Escalade ESV",
    "Lyriq",
    "SRX",
    "Seville",
    "XLR",
    "XT4",
    "XT5",
    "XT6",
    "XTS"
  ],
  "HOLDEN": [
    "Volt"
  ],
  "OPEL": [
    "Ampera"
  ],
  "GMC": [
    "Acadia",
    "Cruise Origin AV",
    "Envoy",
    "Hummer EV SUV",
    "Jimmy Utility",
    "Safari",
    "Savana",
    "Terrain",
    "Yukon",
    "Yukon XL"
  ],
  "MAZDA": [
    "Atenza",
    "Axela",
    "Bongo",
    "CX-3",
    "CX-30",
    "CX-5",
    "CX-50",
    "CX-8",
    "CX-9",
    "CX-90",
    "Demio",
    "Mazda2",
    "Mazda3",
    "Mazda5",
    "Mazda6",
    "MPV",
    "MX-5",
    "Premacy",
    "Roadster",
    "RX-8",
    "Tribute"
  ],
  "HONDA": [
    "Accord",
    "Airwave",
    "Civic",
    "Civic Si",
    "Civic Type R",
    "CR-V",
    "CR-Z",
    "Crosstour",
    "Element",
    "FCX Clarity",
    "Fit",
    "Freed",
    "Grace",
    "HR-V",
    "Insight",
    "Jade",
    "Legend",
    "Odyssey",
    "Passport",
    "Pilot",
    "Prologue",
    "S2000",
    "Shuttle",
    "Stepwgn",
    "Vezel"
  ],
  "ACURA": [
    "ILX",
    "Integra",
    "MDX",
    "NSX",
    "RDX",
    "RL",
    "RLX",
    "RSX",
    "TL",
    "TLX",
    "TSX",
    "ZDX"
  ],
  "DODGE": [
    "Avenger",
    "Caravan",
    "Challenger",
    "Charger",
    "Dart",
    "Durango",
    "Grand Caravan",
    "Hornet",
    "Intrepid",
    "Journey",
    "Neon",
    "Stratus",
    "Viper"
  ],
  "CHRYSLER": [
    "200",
    "300",
    "Concorde",
    "Crossfire",
    "Grand Caravan",
    "PT Cruiser",
    "Pacifica",
    "Sebring",
    "Town and Country",
    "Voyager"
  ],
  "NISSAN": [
    "350Z",
    "370Z",
    "AD Van",
    "Almera",
    "Altima",
    "Altra-EV",
    "Ariya Hatchback",
    "Armada",
    "Caravan",
    "Cube",
    "Dualis",
    "Elgrand",
    "Frontier",
    "Fuga",
    "GT-R",
    "Juke",
    "Kicks",
    "Leaf",
    "March",
    "Maxima",
    "Murano",
    "Navara",
    "Nissan Z",
    "Note",
    "NV200",
    "Pathfinder",
    "Patrol",
    "Qashqai",
    "Quest",
    "Rogue",
    "Rogue Select",
    "Sentra",
    "Serena",
    "Skyline",
    "Teana",
    "Tiida",
    "Titan",
    "Versa",
    "Versa Note",
    "X-Trail",
    "Xterra"
  ],
  "INFINITI": [
    "EX",
    "FX",
    "FX35",
    "FX45",
    "G",
    "G35",
    "I35",
    "M45",
    "Q45",
    "Q50",
    "Q60",
    "Q70",
    "QX50",
    "QX55",
    "QX56",
    "QX60",
    "QX70",
    "QX80"
  ],
  "MITSUBISHI": [
    "ASX",
    "Colt",
    "Delica",
    "Diamante",
    "Eclipse",
    "Eclipse Cross",
    "Endeavor",
    "Galant",
    "i-MiEV",
    "L200",
    "Lancer",
    "Lancer Evolution",
    "Lancer SportBack",
    "Mirage",
    "Mirage G4",
    "Montero",
    "Montero Sport",
    "Outlander",
    "Outlander Sport",
    "Pajero",
    "RVR",
    "Triton"
  ],
  "VOLKSWAGEN": [
    "Amarok",
    "Atlas",
    "Atlas Cross Sport",
    "Beetle",
    "CC",
    "Eos",
    "Golf",
    "Golf GTI",
    "Golf R",
    "GTI",
    "ID.4",
    "Jetta",
    "Jetta GLI",
    "Jetta SportWagen",
    "Jetta Wagon",
    "Passat",
    "Phaeton",
    "Polo",
    "R32",
    "Routan",
    "Taos",
    "Tiguan",
    "Touareg",
    "Transporter",
    "Up"
  ],
  "VOLVO": [
    "C40",
    "C70",
    "S40",
    "S60",
    "S80",
    "S90",
    "V40",
    "V60",
    "V60CC",
    "V70",
    "V90CC",
    "XC40",
    "XC60",
    "XC70",
    "XC90"
  ],
  "FIAT": [
    "500",
    "500L",
    "500e",
    "Freemont"
  ],
  "ALFA ROMEO": [
    "4C",
    "8C Competizione Spider",
    "Giulia (952)",
    "Stelvio",
    "Tonale"
  ],
  "HYUNDAI": [
    "Accent",
    "Azera",
    "Creta",
    "Elantra",
    "Elantra N",
    "Entourage",
    "Equus",
    "Genesis",
    "Genesis Coupe",
    "i10",
    "i20",
    "i30",
    "Ioniq 5",
    "Ioniq 6",
    "Kona",
    "Nexo",
    "Palisade",
    "Santa Fe",
    "Santa Fe Sport",
    "Sonata",
    "Staria",
    "Tiburon",
    "Tucson",
    "Veloster",
    "Venue",
    "XG350"
  ],
  "KIA": [
    "Amanti",
    "Cadenza",
    "Carnival",
    "Cerato",
    "EV6",
    "EV9",
    "Forte",
    "K3",
    "K5",
    "Niro",
    "Optima",
    "Picanto",
    "Rio",
    "Rondo",
    "Sedona",
    "Seltos",
    "Sorento",
    "Soul",
    "Spectra",
    "Sportage",
    "Stonic",
    "Telluride"
  ],
  "LAMBORGHINI": [
    "Aventador",
    "Gallardo",
    "Huracan",
    "Murcielago",
    "Revuelto",
    "URUS"
  ],
  "SMART": [
    "Fortwo",
    "smart"
  ],
  "SUZUKI": [
    "Aerio",
    "Alto",
    "Escudo",
    "Every",
    "Forenza",
    "Grand Vitara",
    "Jimny",
    "Kizashi",
    "S-Cross",
    "Solio",
    "Swift",
    "SX4",
    "Verona",
    "Vitara",
    "Wagon R",
    "XL7"
  ],
  "LEXUS": [
    "CT",
    "ES",
    "GS",
    "GX",
    "IS",
    "LC",
    "LM",
    "LS",
    "LX",
    "NX",
    "RC",
    "RX",
    "RZ",
    "SC",
    "TX",
    "UX"
  ],
  "SUBARU": [
    "Ascent",
    "B9 Tribeca",
    "Baja",
    "BRZ",
    "Crosstrek",
    "Exiga",
    "Forester",
    "Impreza",
    "Legacy",
    "Levorg",
    "Outback",
    "Solterra",
    "WRX",
    "XV",
    "XV CrossTrek"
  ],
  "MAYBACH": [
    "57",
    "62"
  ],
  "PONTIAC": [
    "Aztek",
    "Bonneville",
    "GTO",
    "Grand AM",
    "Grand Prix",
    "Montana",
    "Sunfire",
    "Vibe"
  ],
  "MORGAN": [
    "Aero 8",
    "Aero Supersports",
    "Plus 8",
    "Plus Four",
    "Roadster"
  ],
  "ISUZU": [
    "Ascender",
    "Axiom",
    "D-Max",
    "Elf",
    "MU-X",
    "N-Series",
    "Rodeo"
  ],
  "SAAB": [
    "9-3",
    "9-5"
  ],
  "AUDI": [
    "A3",
    "A4",
    "A4 allroad",
    "A5",
    "A6",
    "A6 allroad",
    "A7",
    "A8",
    "A8 L",
    "allroad",
    "e-tron GT",
    "Q3",
    "Q4",
    "Q5",
    "Q5 e",
    "Q7",
    "Q8",
    "R8",
    "RS 3",
    "RS 5",
    "RS 6",
    "RS 6 Avant",
    "RS 7",
    "RS e-tron GT",
    "RS Q8",
    "S3",
    "S4",
    "S5",
    "S6",
    "S7",
    "S8",
    "SQ5",
    "SQ7",
    "SQ8",
    "TT",
    "TT RS",
    "TTS"
  ],
  "BENTLEY": [
    "ARMOURED ARNAGE",
    "Arnage",
    "Azure",
    "Bentayga",
    "Continental",
    "Flying Spur",
    "Mulsanne"
  ],
  "PORSCHE": [
    "718 Boxster",
    "718 Cayman",
    "718 Spyder",
    "911",
    "Boxster",
    "Cayenne",
    "Cayman",
    "Macan",
    "Panamera",
    "Taycan"
  ],
  "FERRARI": [
    "296",
    "360",
    "458",
    "458 Italia",
    "575M Maranello",
    "812",
    "California",
    "California T",
    "Challenge Stradale",
    "Daytona SP3",
    "F12 Berlinetta",
    "FF",
    "La Ferrari",
    "Purosangue",
    "Roma",
    "SF90"
  ],
  "AM GENERAL": [
    "MV-1"
  ],
  "CREATIVE COACHWORKS": [
    "Creative Coachworks"
  ],
  "AC PROPULSION": [
    "eBox",
    "tZero"
  ],
  "FALCON": [
    "F-7"
  ],
  "EV INNOVATIONS": [
    "2 Door Inizio Sports Car",
    "2 Door Wave",
    "2 Door Wave Truck",
    "4 Door Wave",
    "4 Door Wave Truck",
    "Chopper",
    "Custom Vehicle",
    "Liv Wise",
    "Motorcycle Wave"
  ],
  "FAW JIAXING HAPPY MESSENGER": [
    "Faw Jianxing Happy Messenger"
  ],
  "SATURN": [
    "Ion",
    "L300",
    "LW300",
    "Vue"
  ],
  "DAEWOO": [
    "Laganza V-car",
    "Leganza V-200 & variants/derivatives"
  ],
  "FORMULA 1 STREET COM": [
    "F1S",
    "FXS"
  ],
  "FORTUNESPORT VES": [
    "Rk.S",
    "Rt.C",
    "Rt.S",
    "Rt.V",
    "Rt.X"
  ],
  "AAS": [
    "Euro Edition",
    "Gt Malan",
    "Performance Edition",
    "Race Edition",
    "Sport Edition",
    "Trophy Edition"
  ],
  "EQUUS AUTOMOTIVE": [
    "Equus Passenger Car"
  ],
  "ELECTRIC MOBILE CARS": [
    "Electric Mobile Cars"
  ],
  "BAKKURA MOBILITY": [
    "Bakkura Mobility"
  ],
  "CONTEMPORARY CLASSIC CARS (CCC)": [
    "Ravenhawk"
  ],
  "KOENIGSEGG": [
    "Agera",
    "One:1",
    "Regera"
  ],
  "BYD": [
    "Atto 3",
    "Dolphin",
    "e6",
    "Seal"
  ],
  "KANDI": [
    "K10 Roadster",
    "K11 Panda",
    "K12 City Beauty",
    "K13 Urban Cowboy",
    "K17A",
    "K22",
    "K23-300",
    "K27-300",
    "K28",
    "K28-300",
    "K30"
  ],
  "MAKING YOU MOBILE": [
    "Mizer G4"
  ],
  "MCLAREN": [
    "540C",
    "570GT",
    "570S",
    "625C",
    "650S",
    "675LT",
    "750S",
    "Artura",
    "MP4-12C",
    "P1"
  ],
  "MYCAR": [
    "CV .2"
  ],
  "NJD AUTOMOTIVE LLC": [
    "R32"
  ],
  "PHOENIX MOTORCARS": [
    "Phoenix Motorcars"
  ],
  "ROCKET SLED MOTORS": [
    "GTM Coupe",
    "Roadster ZR"
  ],
  "VISION INDUSTRIES": [
    "SZR"
  ],
  "WARHAWK PERFORMANCE": [
    "Willys Coupe"
  ],
  "UKEYCHEYMA": [
    "Jopi",
    "MONOM",
    "ONO"
  ],
  "TOTAL ELECTRIC VEHICLES": [
    "Electric Stinger",
    "Trilectra XR"
  ],
  "SPYKER": [
    "C12",
    "C8",
    "D8/D12"
  ],
  "OLDSMOBILE": [
    "Alero",
    "Bravada",
    "Silhouette"
  ],
  "PANOZ": [
    "Panoz Roadster"
  ],
  "SALEEN": [
    "S7"
  ],
  "SOLECTRIA": [
    "Flash",
    "Force",
    "Sunrise"
  ],
  "YESTER YEAR AUTO": [
    "Bucket",
    "Cabriolet",
    "Club Pickup",
    "Cobra",
    "Coupe",
    "Delivery",
    "Vicky",
    "Willys"
  ],
  "BXR": [
    "Blade"
  ],
  "ENGINE CONNECTION": [
    "1932 Ford Highboy replica",
    "1934 Ford 5-Window Coupe replica",
    "1934 Ford Roadster",
    "Cobra 427 replica",
    "Daytona Coupe replica",
    "GT40 replica"
  ],
  "MOSLER": [
    "MT900s",
    "Raptor"
  ],
  "PAGANI": [
    "Huayra",
    "Utopia"
  ],
  "REVOLOGY": [
    "M6466"
  ],
  "EMA": [
    "Limo"
  ],
  "GENESIS": [
    "G70",
    "G80",
    "G90",
    "GV60",
    "GV70",
    "GV80"
  ],
  "KARMA": [
    "GS-6",
    "Revero GT"
  ],
  "MATRIX MOTOR COMPANY": [
    "Matrix Motor Company"
  ],
  "ARMBRUSTER STAGEWAY": [
    "Buick First Call",
    "Buick Funeral Car",
    "Buick Limousine",
    "Buick Ski Cruiser",
    "Cadillac First Call",
    "Cadillac Funeral Car",
    "Cadillac Limousine",
    "Cadillac Ski Cruiser",
    "Lincoln First Call",
    "Lincoln Funeral Car",
    "Lincoln Limousine",
    "Lincoln Ski Cruiser",
    "Mercedes First Call",
    "Mercedes Funeral Car",
    "Mercedes Limousine",
    "Mercedes Ski Cruiser"
  ],
  "LUMEN": [
    "Impero"
  ],
  "VINTAGE AUTO": [
    "SS100",
    "XK120"
  ],
  "MGS GRAND SPORT (MARDIKIAN)": [
    "Miami"
  ],
  "PANTHER": [
    "Kallista"
  ],
  "DAYTONA COACH BUILDERS": [
    "Daytona Midgie-2"
  ],
  "UCC": [
    "32",
    "427",
    "53"
  ],
  "RS SPIDER": [
    "E",
    "Sport Spider"
  ],
  "GRUPPE B": [
    "Gruppe B"
  ],
  "RALLY SPORT": [
    "RS 200",
    "RS Cosworth"
  ],
  "JAC 427": [
    "Cobra"
  ],
  "HUNTER DESIGN GROUP, LLC": [
    "HUNTER DESIGN GROUP, LLC"
  ],
  "BLACKWATER": [
    "Classic",
    "Cordova",
    "Malibu"
  ],
  "GULLWING INTERNATIONAL MOTORS, LTD.": [
    "GULLWING 300SL(MERCEDES REPLICA)",
    "ROADSTER 300SL(MERCEDES REPLICA)"
  ],
  "AMERITECH CORPORATION": [
    "F1"
  ],
  "STANFORD CUSTOMS": [
    "Classic Sedan",
    "Cordova Sedan",
    "Malibu Sedan"
  ],
  "CLASSIC ROADSTERS": [
    "Cobra",
    "Duchess",
    "Duke",
    "MX",
    "Marlene",
    "Saxon",
    "Sebring"
  ],
  "HERITAGE": [
    "Camaro",
    "Chevelle",
    "Mustang"
  ],
  "COBRA CARS": [
    "Cobra Daytona",
    "Others"
  ],
  "C-R CHEETAH RACE CARS": [
    "CHEETAH",
    "SUPER CHEETAH"
  ],
  "PAS": [
    "AMG",
    "GLD",
    "GLS",
    "HSE",
    "LSX"
  ],
  "IVES MOTORS CORPORATION (IMC)": [
    "Calypso",
    "M151",
    "M2000",
    "Super Hunter",
    "The Hunter/El Cazador"
  ],
  "AUTODELTA USA INC": [
    "Autodelta USA Inc"
  ],
  "AUTOCAR LTD": [
    "Autocar Ltd"
  ],
  "MOKE": [
    "Gen 1 EV"
  ],
  "BBC": [
    "BBC Passenger Car"
  ],
  "PHOENIX SPORTS CARS, INC.": [
    "Phoenix Sports Cars, Inc."
  ],
  "VECTOR AEROMOTIVE CORPORATION": [
    "Vector"
  ],
  "CREATIVE COACHWORKS INC.": [
    "Baron Automobile Line"
  ],
  "WESTFALL MOTORS CORP.": [
    "GT Model"
  ],
  "CLENET": [
    "Chrysler Base",
    "Ford Base",
    "General Motors Base"
  ],
  "ELECTRIC CAR COMPANY": [
    "MI-6"
  ],
  "CX AUTOMOTIVE": [
    "CX Automotive"
  ],
  "LA EXOTICS": [
    "LA Exotics"
  ],
  "CLASSIC SPORTS CARS": [
    "MIGI",
    "OTHER",
    "XC-53"
  ],
  "SCUDERIA CAMERON GLICKENHAUS (SCG)": [
    "002CS",
    "002S",
    "003C",
    "003CS",
    "003S",
    "004C",
    "004CS",
    "004S",
    "005C",
    "005CS",
    "005S",
    "006C",
    "006CS",
    "006S",
    "007CS",
    "008S"
  ],
  "VINTAGE CRUISER": [
    "LC40-R",
    "LC44-R",
    "LC45-R",
    "LC47-R",
    "LC78-R",
    "LC79-R"
  ],
  "VINTAGE MICROBUS": [
    "KOMBI CAMPER T2-R",
    "KOMBI TRANSPORTER T2-R"
  ],
  "VINTAGE ROVER": [
    "LRD110-R",
    "LRD90-R"
  ],
  "LITE CAR": [
    "Lite Car"
  ],
  "POLESTAR": [
    "Polestar 2"
  ],
  "CZINGER": [
    "21C"
  ],
  "GLICKENHAUS": [
    "004",
    "007",
    "2-Door Boot",
    "2-Door Boot Baja Edition",
    "4-Door Boot",
    "4-Door Boot Baja Edition"
  ],
  "DONGFENG": [
    "Front drive motor",
    "Rear drive motor",
    "Sport"
  ],
  "CRUISE": [
    "Cruise AV"
  ],
  "LUCID": [
    "Air"
  ],
  "CALMOTORS": [
    "CA1"
  ],
  "AUTOMOBILI PININFARINA": [
    "Battista"
  ],
  "ALLARD MOTOR WORKS": [
    "J2X"
  ],
  "SHELBY": [
    "Cobra",
    "GT"
  ],
  "FISKER": [
    "Ocean"
  ],
  "RIMAC": [
    "Nevera"
  ],
  "ZOOX": [
    "Zoox"
  ],
  "ECOCAR": [
    "X",
    "X2"
  ],
  "SUPERCAR SYSTEM": [
    "B2"
  ],
  "RUF": [
    "CTR Anniversary / CTR2 / Turbo R / BTR / RCT",
    "CTR1",
    "CTR3 / RtR / Rt12",
    "SCR / R Spyder / Speedster"
  ],
  "KINDIG": [
    "CF1"
  ],
  "SSC NORTH AMERICA": [
    "Aggressor",
    "Striker",
    "Tuatara"
  ],
  "BALLISTIC": [
    "FR1",
    "FR2"
  ],
  "MEYERS MANX": [
    "Manx 2.0"
  ],
  "1955 CUSTOM BELAIR": [
    "1955 Custom Belair"
  ],
  "ELKINGTON": [
    "Original"
  ],
  "MK SPORTSCARS": [
    "RX5",
    "Sport"
  ],
  "BACKDRAFT": [
    "Roadster"
  ],
  "DAIHATSU": [
    "Boon",
    "Copen",
    "Hijet",
    "Mira",
    "Move",
    "Rocky",
    "Tanto",
    "Terios"
  ],
  "LAND ROVER": [
    "Defender",
    "Discovery",
    "Discovery Sport",
    "Freelander",
    "Range Rover",
    "Range Rover Evoque",
    "Range Rover Sport",
    "Range Rover Velar"
  ],
  "PEUGEOT": [
    "208",
    "3008",
    "308",
    "5008",
    "508",
    "Partner"
  ],
  "RENAULT": [
    "Captur",
    "Clio",
    "Duster",
    "Koleos",
    "Logan",
    "Megane",
    "Sandero"
  ],
  "DATSUN": [
    "Go",
    "Go+"
  ],
  "SSANGYONG": [
    "Korando",
    "Rexton",
    "Tivoli"
  ],
  "TATA": [
    "Harrier",
    "Nexon"
  ],
  "HINO": [
    "Dutro",
    "Ranger"
  ],
  "CHERY": [
    "Tiggo"
  ],
  "MG": [
    "3",
    "5",
    "HS",
    "ZS"
  ],
  "JEEP": [
    "Cherokee",
    "Compass",
    "Grand Cherokee",
    "Wrangler"
  ]
};

const MAKE_DISPLAY_NAMES: Record<string, string> = {
  'ALFA ROMEO': 'Alfa Romeo',
  'ASTON MARTIN': 'Aston Martin',
  BMW: 'BMW',
  BYD: 'BYD',
  GMC: 'GMC',
  GWM: 'GWM',
  HINO: 'Hino',
  JAC: 'JAC',
  MG: 'MG',
  MINI: 'MINI',
  'LAND ROVER': 'Land Rover',
  'ROLLS-ROYCE': 'Rolls-Royce',
  SAIC: 'SAIC',
  TVR: 'TVR',
};

export const VEHICLE_CATALOG: Readonly<Record<string, readonly string[]>> = catalog;

export function displayMakeName(make: string): string {
  const normalized = make.trim().toLocaleUpperCase();
  return MAKE_DISPLAY_NAMES[normalized] ?? normalized.toLocaleLowerCase().replace(/(^|[\s/-])([a-z])/g, (_match, separator: string, letter: string) => separator + letter.toLocaleUpperCase());
}

export function modelsForMake(make: string): readonly string[] {
  return VEHICLE_CATALOG[make.trim().toLocaleUpperCase()] ?? [];
}
