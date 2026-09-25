import json

# Define the exact ground-truth specification for all 125 portfolio items
# based on combined Review mapping, OCR text extraction, and MobileNet vision classification.

CLASSIFICATIONS = [
  # 1-6: Direct reviews
  {
    "id": "job-586492808112529414",
    "filename": "job_006_586492808112529414.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de TV y Audio Envolvente (Sushruta N.)",
    "titleEn": "TV Mounting & Surround Audio (Sushruta N.)",
    "tags": ["TV Mounting", "Home Theater", "Audio"],
    "descriptionEs": "Outstanding Job. Set up up my whole home theater including surround speakers and made changes till it was absolutely perfect!",
    "descriptionEn": "Outstanding Job. Set up up my whole home theater including surround speakers and made changes till it was absolutely perfect!",
    "featured": True,
    "author": "Sushruta N.",
    "date": "Aug 1, 2026"
  },
  {
    "id": "job-582841862834618372",
    "filename": "job_004_582841862834618372.jpeg",
    "category": "REPAIRS",
    "titleEs": "Plomería y Grifería Residencial (Patrick E.)",
    "titleEn": "Plumbing & Fixture Replacement (Patrick E.)",
    "tags": ["Plumbing", "Bathroom", "Fixtures"],
    "descriptionEs": "Mr Handyworks LLC was extremly responsive as soon as I reached out about our projects. he reached out immediately to gather more information and provide a quote for services. We had a faucet and drain replaced as well as our upstair",
    "descriptionEn": "Mr Handyworks LLC was extremly responsive as soon as I reached out about our projects. he reached out immediately to gather more information and provide a quote for services. We had a faucet and drain replaced as well as our upstair",
    "featured": True,
    "author": "Patrick E.",
    "date": "Jun 20, 2026"
  },
  {
    "id": "job-569553639910694926",
    "filename": "job_001_569553639910694926.jpeg",
    "category": "REPAIRS",
    "titleEs": "Remodelación y Plomería de Baño (Emma M.)",
    "titleEn": "Bathroom Plumbing & Fixtures (Emma M.)",
    "tags": ["Plumbing", "Bathtub", "Bathroom"],
    "descriptionEs": "Mr Handyworks LLC did an amazing job!! He and his team worked so hard the whole time and really helped us out. We have an older house with some big issues, and Mr Handyworks LLC was able to solve everything that needed to be done to get our bat",
    "descriptionEn": "Mr Handyworks LLC did an amazing job!! He and his team worked so hard the whole time and really helped us out. We have an older house with some big issues, and Mr Handyworks LLC was able to solve everything that needed to be done to get our bat",
    "featured": True,
    "author": "Emma M.",
    "date": "Jan 17, 2026"
  },
  {
    "id": "job-566524396090687490",
    "filename": "job_003_566524396090687490.jpeg",
    "category": "REPAIRS",
    "titleEs": "Reemplazo de Calentador de Agua (Markiesha M.)",
    "titleEn": "Water Heater Replacement (Markiesha M.)",
    "tags": ["Water Heater", "Plumbing", "Emergency"],
    "descriptionEs": "Mr Handyworks LLC was amazing! We had a water heater leak and needed immediate assistance with replacing our old unit. He responded right away and was able to come out the next day. He communicated well and was on time. He got the j",
    "descriptionEn": "Mr Handyworks LLC was amazing! We had a water heater leak and needed immediate assistance with replacing our old unit. He responded right away and was able to come out the next day. He communicated well and was on time. He got the j",
    "featured": True,
    "author": "Markiesha M.",
    "date": "Dec 13, 2025"
  },
  {
    "id": "job-569553640531558414",
    "filename": "job_002_569553640531558414.jpeg",
    "category": "REPAIRS",
    "titleEs": "Reparaciones y Mantenimiento General (Emma M.)",
    "titleEn": "General Home Repairs & Upgrades (Emma M.)",
    "tags": ["Handyman", "Repairs", "Maintenance"],
    "descriptionEs": "Mr Handyworks LLC did an amazing job!! He and his team worked so hard the whole time and really helped us out. We have an older house with some big issues, and Mr Handyworks LLC was able to solve everything that needed to be done to get our bat",
    "descriptionEn": "Mr Handyworks LLC did an amazing job!! He and his team worked so hard the whole time and really helped us out. We have an older house with some big issues, and Mr Handyworks LLC was able to solve everything that needed to be done to get our bat",
    "featured": True,
    "author": "Emma M.",
    "date": "Jan 17, 2026"
  },
  {
    "id": "job-587304499874766855",
    "filename": "job_005_587304499874766855.jpeg",
    "category": "REPAIRS",
    "titleEs": "Instalación de Calentador de Gas (Terry T.)",
    "titleEn": "Gas Water Heater Installation (Terry T.)",
    "tags": ["Water Heater", "Plumbing", "Gas Line"],
    "descriptionEs": "I needed a gas water heater installed. Mr Handyworks LLC was able to work around my schedule to get it done. Very professional, fair price, and he explained everything that was being done and why. Will be using in the future",
    "descriptionEn": "I needed a gas water heater installed. Mr Handyworks LLC was able to work around my schedule to get it done. Very professional, fair price, and he explained everything that was being done and why. Will be using in the future",
    "featured": True,
    "author": "Terry T.",
    "date": "Aug 11, 2026"
  },

  # 7-32: Flyer project banners with explicit OCR text
  {
    "id": "job-588050729373147137",
    "filename": "job_008_588050729373147137.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Instalación de TV con Cables Ocultos #7",
    "titleEn": "Clean TV Installation & Wire Concealment #7",
    "tags": ["TV Mounting", "Cable Concealment", "Living Room"],
    "descriptionEs": "Montaje profesional de pantalla con ocultamiento de cables, soporte nivelado y acabado estético.",
    "descriptionEn": "Secure TV wall mounting with concealed cabling, precision bracket leveling, and clean wall finish."
  },
  {
    "id": "job-588045933606207492",
    "filename": "job_010_588045933606207492.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Instalación y Montaje Seguro de TV #8",
    "titleEn": "Precision TV Installation & Mount #8",
    "tags": ["TV Mounting", "Bracket Alignment", "Display"],
    "descriptionEs": "Fijación reforzada a montantes, calibración del soporte articulado y pruebas operativas.",
    "descriptionEn": "Reinforced stud anchoring, articulating bracket alignment, and full operational screen testing."
  },
  {
    "id": "job-587623902717992960",
    "filename": "job_012_587623902717992960.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Ventilador de Techo #9",
    "titleEn": "Ceiling Fan Installation #9",
    "tags": ["Ceiling Fan", "Installation", "Electrical"],
    "descriptionEs": "Instalación profesional de ventilador de techo, retiro de accesorio anterior, cableado seguro y prueba de velocidades.",
    "descriptionEn": "Professional ceiling fan installation, old fixture removal, secure wiring, and operational speed verification."
  },
  {
    "id": "job-588309384845443078",
    "filename": "job_007_588309384845443078.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Gazebo de Madera Exterior #10",
    "titleEn": "Outdoor Wood Gazebo Assembly #10",
    "tags": ["Gazebo", "Assembly", "Outdoor"],
    "descriptionEs": "Ensamblaje y fijación estructural completa de gazebo de madera para patio exterior.",
    "descriptionEn": "Complete component organization, heavy-duty frame assembly, and ground anchoring for outdoor wood gazebo."
  },
  {
    "id": "job-587865914842374146",
    "filename": "job_011_587865914842374146.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Patio de Adoquines y Jardineras #11",
    "titleEn": "Paver Patio & Flower Bed Installation #11",
    "tags": ["Paver Patio", "Landscaping", "Installation"],
    "descriptionEs": "Instalación de adoquines para patio exterior, construcción de jardineras elevadas y área de descanso.",
    "descriptionEn": "Paver patio installation with raised flower bed borders, transforming the outdoor space into a clean seating area."
  },
  {
    "id": "job-588050727517093896",
    "filename": "job_009_588050727517093896.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Poste de Buzón #12",
    "titleEn": "Mail Post Installation #12",
    "tags": ["Mailbox", "Installation", "Outdoor"],
    "descriptionEs": "Instalación y anclaje en concreto de poste y buzón residencial con nivelación perfecta y durabilidad superior.",
    "descriptionEn": "Professional residential mail post installation, anchored in concrete, level, and built to last."
  },
  {
    "id": "job-587623901065060358",
    "filename": "job_013_587623901065060358.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Cocina de Juguete Infantil #13",
    "titleEn": "Children's Play Kitchen Assembly #13",
    "tags": ["Assembly", "Play Kitchen", "Furniture"],
    "descriptionEs": "Armado detallado de cocinita infantil de madera, fijación de accesorios, grifos y alineación de puertas.",
    "descriptionEn": "Precision assembly of children's play kitchen, secure attachment of accessories, and door alignment."
  },
  {
    "id": "job-582858249500942341",
    "filename": "job_018_582858249500942341.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de TV y Manejo de Cables #14",
    "titleEn": "TV Mounting & Cable Management #14",
    "tags": ["TV Mounting", "Cable Management", "Living Room"],
    "descriptionEs": "Montaje profesional de televisor en pared con ocultamiento de cables e instalación de placas de tomacorriente.",
    "descriptionEn": "Wall TV mounting with in-wall wire concealment, outlet plates installation, and flush view finish."
  },
  {
    "id": "job-587103584989896710",
    "filename": "job_017_587103584989896710.jpeg",
    "category": "REPAIRS",
    "titleEs": "Reemplazo de Calentador de Agua #15",
    "titleEn": "Water Heater Replacement #15",
    "tags": ["Plumbing", "Water Heater", "Gas Line"],
    "descriptionEs": "Reemplazo de calentador de agua a gas, actualización de conexiones de plomería y ventilación.",
    "descriptionEn": "Gas water heater replacement, updated water lines and gas/vent connections with full system testing."
  },
  {
    "id": "job-587432409755828237",
    "filename": "job_014_587432409755828237.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Instalación de Smart TV y Soporte Articulado #16",
    "titleEn": "Smart TV Wall Mount & Bracket Setup #16",
    "tags": ["TV Mounting", "Smart TV", "Entertainment"],
    "descriptionEs": "Montaje de Smart TV sobre soporte basculante/articulado con calibración de pantalla y streaming.",
    "descriptionEn": "Smart TV mounting on articulating wall bracket with streaming device integration and concealed lines."
  },
  {
    "id": "job-587111774011572229",
    "filename": "job_016_587111774011572229.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Lavavajillas #17",
    "titleEn": "Dishwasher Installation #17",
    "tags": ["Appliance", "Installation", "Plumbing"],
    "descriptionEs": "Instalación de lavavajillas suministrado por el cliente, conexión de agua, desagüe y fijación bajo encimera.",
    "descriptionEn": "Customer-supplied dishwasher installation, water supply & drain line connections, secured under countertop."
  },
  {
    "id": "job-587430719275221005",
    "filename": "job_015_587430719275221005.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de TV The Frame 65\" con Cables Ocultos #18",
    "titleEn": "65\" The Frame TV Mounting & Cable Concealment #18",
    "tags": ["The Frame TV", "TV Mounting", "Cable Concealment"],
    "descriptionEs": "Montaje al ras de Samsung The Frame TV de 65 pulgadas con caja One Connect oculta en pared.",
    "descriptionEn": "Flush wall mounting of 65\" Samsung The Frame TV with seamless wire concealment for an art-gallery look."
  },
  {
    "id": "job-582857965472956433",
    "filename": "job_019_582857965472956433.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Ventilador de Techo con Lámpara #19",
    "titleEn": "Ceiling Fan with Lighting Installation #19",
    "tags": ["Ceiling Fan", "Installation", "Electrical"],
    "descriptionEs": "Instalación de ventilador de techo con luminaria moderna, conexión segura a cajetín y verificación.",
    "descriptionEn": "Modern ceiling fan with light installation, old fixture removal, secure wiring, and operational testing."
  },
  {
    "id": "job-582429406056202246",
    "filename": "job_022_582429406056202246.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de Smart TV Hisense Roku #20",
    "titleEn": "Hisense Roku Smart TV Wall Mount #20",
    "tags": ["TV Mounting", "Roku TV", "Living Room"],
    "descriptionEs": "Fijación en pared de televisor Hisense Roku TV, verificación de puertos y nivelación milimétrica.",
    "descriptionEn": "Precision wall mounting for Hisense Roku TV, port accessibility check, and level bracket anchoring."
  },
  {
    "id": "job-582857962276790290",
    "filename": "job_021_582857962276790290.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Conexión de Parrilla a Gas Natural y Ensamble #21",
    "titleEn": "Grill Natural Gas Hookup & Assembly #21",
    "tags": ["Grill", "Gas Hookup", "Installation"],
    "descriptionEs": "Armado profesional de parrilla de exterior, conexión a línea de gas natural y pruebas de hermeticidad.",
    "descriptionEn": "Professional outdoor grill assembly, natural gas line hookups, and thorough leak testing."
  },
  {
    "id": "job-582232879844818945",
    "filename": "job_023_582232879844818945.jpeg",
    "category": "DOORS_WINDOWS",
    "titleEs": "Instalación de Puerta para Mascotas #22",
    "titleEn": "Pet Dog Door Installation #22",
    "tags": ["Dog Door", "Doors", "Pet Access"],
    "descriptionEs": "Corte preciso en puerta exterior, sellado climático e instalación de marco con compuerta para perros.",
    "descriptionEn": "Precision exterior door cut-out, weather-tight sealing, and durable pet door frame installation."
  },
  {
    "id": "job-582857964074745856",
    "filename": "job_020_582857964074745856.jpeg",
    "category": "REPAIRS",
    "titleEs": "Actualización de Lavabo y Grifería de Baño #23",
    "titleEn": "Bathroom Sink & Faucet Upgrade #23",
    "tags": ["Bathroom", "Faucet", "Plumbing"],
    "descriptionEs": "Retiro de grifería y desagüe antiguo, instalación de nuevo grifo moderno con prueba de estanqueidad.",
    "descriptionEn": "Old faucet and drain removal, new faucet installation, and complete watertight drain assembly."
  },
  {
    "id": "job-581632504667709450",
    "filename": "job_024_581632504667709450.jpeg",
    "category": "REPAIRS",
    "titleEs": "Reemplazo de Sección de Cerca de Madera #24",
    "titleEn": "Wood Fence Section Replacement #24",
    "tags": ["Fence", "Outdoor", "Repairs"],
    "descriptionEs": "Retiro de sección de valla dañada, colocación de estacas tratadas a presión y alineación perimetral.",
    "descriptionEn": "Damaged fence section removal, new pressure-treated pickets installation, and perimeter alignment."
  },
  {
    "id": "job-581489799806525450",
    "filename": "job_025_581489799806525450.jpeg",
    "category": "REPAIRS",
    "titleEs": "Instalación de Fregadero Workstation y Grifo #25",
    "titleEn": "Kitchen Workstation Sink & Faucet Install #25",
    "tags": ["Kitchen Sink", "Faucet", "Plumbing"],
    "descriptionEs": "Instalación de fregadero workstation en cocina, grifería monomando con rociador y prueba de presión.",
    "descriptionEn": "Kitchen workstation sink install, modern pull-down spray faucet, and full leak-tested drain setup."
  },
  {
    "id": "job-581489798259539972",
    "filename": "job_026_581489798259539972.jpeg",
    "category": "CARPENTRY",
    "titleEs": "Montaje en Pared de Consola Flotante de TV #26",
    "titleEn": "Floating TV Console Wall Installation #26",
    "tags": ["Floating Console", "Carpentry", "Wall Mount"],
    "descriptionEs": "Anclaje estructural reforzado de consola flotante de suelo a pared con nivelación láser y cables ocultos.",
    "descriptionEn": "Heavy-duty wall anchoring for floating TV console unit, laser-level alignment, and hidden cable routing."
  },
  {
    "id": "job-580794336415391751",
    "filename": "job_027_580794336415391751.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Actualización de Iluminación Moderna #27",
    "titleEn": "Modern Lighting Fixture Upgrade #27",
    "tags": ["Lighting", "Fixtures", "Installation"],
    "descriptionEs": "Sustitución de luminaria antigua por lámpara moderna de mayor luminosidad y eficiencia energética.",
    "descriptionEn": "Old chandelier replacement with modern high-efficiency lighting fixture for enhanced room illumination."
  },
  {
    "id": "job-580628634546733060",
    "filename": "job_028_580628634546733060.jpeg",
    "category": "PAINTING",
    "titleEs": "Reparación Profesional de Yeso en Techo #28",
    "titleEn": "Professional Ceiling Drywall Repair #28",
    "tags": ["Ceiling Repair", "Drywall", "Painting"],
    "descriptionEs": "Reparación de sección dañada en techo de yeso, parcheo invisible, lijado fino y aplicación de textura.",
    "descriptionEn": "Damaged drywall ceiling patch repair, seamless mudding, fine sanding, and matched finish texture."
  },
  {
    "id": "job-580628632590008322",
    "filename": "job_029_580628632590008322.jpeg",
    "category": "PAINTING",
    "titleEs": "Reparación Profesional de Pared y Drywall #29",
    "titleEn": "Professional Wall Drywall Patching #29",
    "tags": ["Wall Repair", "Drywall", "Painting"],
    "descriptionEs": "Reparación de perforación en pared de paneles de yeso con malla de refuerzo y masillado perfecto.",
    "descriptionEn": "Drywall wall patch repair, reinforced mesh application, flawless compound smoothing, and repaint readiness."
  },
  {
    "id": "job-579841079438049299",
    "filename": "job_030_579841079438049299.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Parque y Juego Infantil #30",
    "titleEn": "Outdoor Playset & Playground Assembly #30",
    "tags": ["Playground", "Assembly", "Outdoor"],
    "descriptionEs": "Ensamblaje robusto de estructura de juegos para niños en patio exterior, calibración de columpios y anclaje.",
    "descriptionEn": "Comprehensive outdoor playset assembly, structural bolting, swing leveling, and safe ground staking."
  },
  {
    "id": "job-578808197378670603",
    "filename": "job_031_578808197378670603.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Luminaria LED Moderna #31",
    "titleEn": "Modern LED Light Fixture Installation #31",
    "tags": ["Lighting", "LED", "Installation"],
    "descriptionEs": "Reemplazo de artefacto de iluminación por unidad LED moderna con distribución uniforme de luz.",
    "descriptionEn": "Modern LED light fixture upgrade, providing bright ambient illumination and energy savings."
  },
  {
    "id": "job-578808195854098434",
    "filename": "job_032_578808195854098434.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Buzón Reforzado para Exterior #32",
    "titleEn": "Heavy-Duty Outdoor Mailbox Installation #32",
    "tags": ["Mailbox", "Outdoor", "Installation"],
    "descriptionEs": "Instalación de buzón exterior de alta durabilidad con poste empotrado resistente a la intemperie.",
    "descriptionEn": "Weather-resistant curbside mailbox installation on solid anchored post with clean exterior finish."
  },

  # 33 to 125: Exact real project photos classified by visual analysis
  {
    "id": "job-578621799572389900",
    "filename": "job_033_578621799572389900.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Mesita de Noche y Lámpara #33",
    "titleEn": "Nightstand & Bedside Setup #33",
    "tags": ["Furniture", "Assembly", "Bedroom"],
    "descriptionEs": "Armado de mueble de dormitorio, nivelación de patas y ajuste de gavetas.",
    "descriptionEn": "Bedroom nightstand furniture assembly, leveling, and drawer alignment."
  },
  {
    "id": "job-578621798141386764",
    "filename": "job_034_578621798141386764.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Mesa de Comedor #34",
    "titleEn": "Dining Room Table Assembly #34",
    "tags": ["Dining Table", "Assembly", "Furniture"],
    "descriptionEs": "Montaje sólido de mesa de comedor de madera, apriete de pernos y comprobación de estabilidad.",
    "descriptionEn": "Dining table assembly, heavy-duty frame bolting, and wobble-free stability check."
  },
  {
    "id": "job-578621797178875910",
    "filename": "job_035_578621797178875910.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de TV en Sala de Entretenimiento #35",
    "titleEn": "Living Room TV Wall Mount #35",
    "tags": ["TV Mounting", "Living Room", "Display"],
    "descriptionEs": "Instalación de televisor sobre pared con cableado recogido y ángulo de visión óptimo.",
    "descriptionEn": "Living room TV wall installation with organized wiring and comfortable viewing elevation."
  },
  {
    "id": "job-578621795959865344",
    "filename": "job_036_578621795959865344.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Sofá Seccional y Sala #36",
    "titleEn": "Sectional Sofa Assembly & Arrangement #36",
    "tags": ["Sofa", "Assembly", "Living Room"],
    "descriptionEs": "Armado de módulos de sofá seccional, unión de herrajes conectores y ubicación en sala.",
    "descriptionEn": "Multi-piece sectional sofa assembly, interlock hardware latching, and room arrangement."
  },
  {
    "id": "job-577944559225126925",
    "filename": "job_037_577944559225126925.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Cómoda de Dormitorio #37",
    "titleEn": "Bedroom Chest of Drawers Assembly #37",
    "tags": ["Dresser", "Assembly", "Bedroom"],
    "descriptionEs": "Armado de cajonera de dormitorio, montaje de rieles deslizantes y ajuste de tiradores.",
    "descriptionEn": "Bedroom dresser drawer assembly, smooth slide tracks installation, and handle alignment."
  },
  {
    "id": "job-577944381268049922",
    "filename": "job_038_577944381268049922.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de TV con Sistema de Streaming #38",
    "titleEn": "TV Wall Mount with Streaming Setup #38",
    "tags": ["TV Mounting", "Streaming", "Home Theater"],
    "descriptionEs": "Instalación de soporte para pantalla plana, fijación en montantes y conexión de streaming.",
    "descriptionEn": "Flat panel TV bracket mounting, stud anchoring, and streaming device integration."
  },
  {
    "id": "job-577944379941642248",
    "filename": "job_039_577944379941642248.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de TV de Gran Formato en Pared #39",
    "titleEn": "Large Format TV Wall Mount #39",
    "tags": ["TV Mounting", "Home Theater", "Living Room"],
    "descriptionEs": "Montaje de televisor de gran pantalla con soporte basculante reforzado y gestión de cables.",
    "descriptionEn": "Heavy-duty wall mounting for large format TV screen with tilt bracket and neat cable routing."
  },
  {
    "id": "job-577944378673537038",
    "filename": "job_040_577944378673537038.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Escritorio para Oficina en Casa #40",
    "titleEn": "Home Office Desk Assembly #40",
    "tags": ["Desk", "Assembly", "Office"],
    "descriptionEs": "Armado de escritorio ergonómico con compartimentos y nivelación de patas.",
    "descriptionEn": "Home office desk assembly, secure tabletop fastening, and level leg balancing."
  },
  {
    "id": "job-577594708771880964",
    "filename": "job_041_577594708771880964.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Instalación de TV y Centro de Entretenimiento #41",
    "titleEn": "Entertainment Center & TV Mount #41",
    "tags": ["TV Mounting", "Entertainment Center", "Audio"],
    "descriptionEs": "Montaje de pantalla sobre mueble de entretenimiento con cables ocultos y equipos conectados.",
    "descriptionEn": "TV screen installation centered over entertainment console with concealed interconnects."
  },
  {
    "id": "job-577594411153719297",
    "filename": "job_042_577594411153719297.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Sillón y Butaca de Descanso #42",
    "titleEn": "Accent Chair & Seating Assembly #42",
    "tags": ["Seating", "Assembly", "Living Room"],
    "descriptionEs": "Armado de butaca acolchada, ensamble de base reforzada y ajuste de tornillería.",
    "descriptionEn": "Accent lounge chair assembly, base frame tightening, and floor protector leveling."
  },
  {
    "id": "job-577594278969450500",
    "filename": "job_043_577594278969450500.jpeg",
    "category": "DOORS_WINDOWS",
    "titleEs": "Instalación de Persianas para Ventana #43",
    "titleEn": "Window Blinds & Shade Installation #43",
    "tags": ["Window Blinds", "Doors & Windows", "Hardware"],
    "descriptionEs": "Colocación de soportes, anclaje y montaje de persianas enrollables a medida.",
    "descriptionEn": "Window blind bracket anchoring, roller shade installation, and tension adjustments."
  },
  {
    "id": "job-577594092810231815",
    "filename": "job_044_577594092810231815.jpeg",
    "category": "DOORS_WINDOWS",
    "titleEs": "Instalación de Puerta Corrediza con Panel #44",
    "titleEn": "Sliding Door & Panel Partition Setup #44",
    "tags": ["Sliding Door", "Doors & Windows", "Partition"],
    "descriptionEs": "Instalación de riel superior, colocación de rodillos y deslizamiento suave de panel divisor.",
    "descriptionEn": "Top track rail installation, roller carriage mounting, and smooth sliding door adjustment."
  },
  {
    "id": "job-577593878815514628",
    "filename": "job_045_577593878815514628.jpeg",
    "category": "REPAIRS",
    "titleEs": "Instalación de Lavabo y Grifo Monomando de Baño #45",
    "titleEn": "Bathroom Vanity Sink & Faucet Setup #45",
    "tags": ["Bathroom", "Sink", "Plumbing"],
    "descriptionEs": "Montaje de lavamanos sobre mueble, conexión de latiguillos de agua y sifón sin fugas.",
    "descriptionEn": "Vanity sink installation, water supply line hookups, and leak-free P-trap assembly."
  },
  {
    "id": "job-577593662314389504",
    "filename": "job_046_577593662314389504.jpeg",
    "category": "DOORS_WINDOWS",
    "titleEs": "Instalación de Puerta de Granero con Guía #46",
    "titleEn": "Sliding Barn Door Installation #46",
    "tags": ["Barn Door", "Doors", "Hardware"],
    "descriptionEs": "Fijación de cabezal de madera, riel de acero negro y montaje de puerta de granero corrediza.",
    "descriptionEn": "Solid header board anchoring, heavy-duty black rail installation, and sliding barn door alignment."
  },
  {
    "id": "job-577593661136879620",
    "filename": "job_047_577593661136879620.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de TV sobre Chimenea #47",
    "titleEn": "Over-Fireplace TV Mounting #47",
    "tags": ["TV Mounting", "Fireplace", "Living Room"],
    "descriptionEs": "Fijación de soporte especial para chimenea con anclaje a ladrillo/montantes y paso de cables.",
    "descriptionEn": "Over-the-fireplace TV mount installation with secure brick/stud anchoring and clean wiring."
  },
  {
    "id": "job-577593660043878400",
    "filename": "job_048_577593660043878400.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Mesa de Comedor de Madera #48",
    "titleEn": "Solid Wood Dining Table Assembly #48",
    "tags": ["Dining Table", "Assembly", "Wood Furniture"],
    "descriptionEs": "Armado de patas y estructura de mesa de comedor en madera maciza con apriete uniforme.",
    "descriptionEn": "Solid wood dining table frame construction, leg bolting, and level balance."
  },
  {
    "id": "job-577593439293218821",
    "filename": "job_049_577593439293218821.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de TV y Barra de Sonido en Pared #49",
    "titleEn": "Wall TV & Soundbar Mounting #49",
    "tags": ["TV Mounting", "Soundbar", "Home Theater"],
    "descriptionEs": "Instalación en pared de televisor y barra de sonido con alineación simétrica y cableado oculto.",
    "descriptionEn": "Dual TV and soundbar wall mounting with precision vertical alignment and concealed cables."
  },
  {
    "id": "job-576982518578659338",
    "filename": "job_050_576982518578659338.jpeg",
    "category": "CARPENTRY",
    "titleEs": "Montaje de Cuadros y Elementos de Pared #50",
    "titleEn": "Wall Hanging & Framing Installation #50",
    "tags": ["Picture Hanging", "Wall Mount", "Decor"],
    "descriptionEs": "Fijación segura de cuadros decorativos y elementos de pared con tacos reforzados y nivelación.",
    "descriptionEn": "Secure wall art and frame installation using heavy-duty anchors and laser leveling."
  },
  {
    "id": "job-576796893634207756",
    "filename": "job_051_576796893634207756.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de TV con Sistema de Altavoces #51",
    "titleEn": "TV Mounting & Speaker System Setup #51",
    "tags": ["TV Mounting", "Speakers", "Audio"],
    "descriptionEs": "Montaje de pantalla con altavoces complementarios para una experiencia inmersiva en sala.",
    "descriptionEn": "TV wall mount paired with auxiliary audio speakers for an enhanced multimedia experience."
  },
  {
    "id": "job-576796853454651401",
    "filename": "job_053_576796853454651401.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Configuración y Calibración de Smart TV #52",
    "titleEn": "Smart TV Setup & Screen Calibration #52",
    "tags": ["Smart TV", "Setup", "TV Mounting"],
    "descriptionEs": "Configuración inicial de Smart TV, sincronización por código QR y optimización de pantalla.",
    "descriptionEn": "Smart TV out-of-box setup, QR-code device pairing, and display picture optimization."
  },
  {
    "id": "job-576796854744997890",
    "filename": "job_052_576796854744997890.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Instalación de Pantalla Plana en Dormitorio #53",
    "titleEn": "Bedroom Flat Screen TV Mount #53",
    "tags": ["TV Mounting", "Bedroom", "Display"],
    "descriptionEs": "Fijación en pared de televisor en dormitorio para visualización cómoda desde la cama.",
    "descriptionEn": "Bedroom TV wall mount installation positioned for comfortable bed-viewing angle."
  },
  {
    "id": "job-576796852382171146",
    "filename": "job_054_576796852382171146.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Baúl y Mueble de Almacenaje #54",
    "titleEn": "Storage Chest & Trunk Assembly #54",
    "tags": ["Furniture", "Assembly", "Storage"],
    "descriptionEs": "Armado de baúl de madera con bisagras de cierre suave y comprobación de cierre.",
    "descriptionEn": "Wooden storage trunk assembly, soft-close hinge installation, and lid alignment."
  },
  {
    "id": "job-576796851415621641",
    "filename": "job_055_576796851415621641.jpeg",
    "category": "CARPENTRY",
    "titleEs": "Instalación de Botiquín con Espejo en Baño #55",
    "titleEn": "Bathroom Medicine Cabinet Installation #55",
    "tags": ["Medicine Cabinet", "Bathroom", "Carpentry"],
    "descriptionEs": "Anclaje a pared de botiquín de baño con espejo, nivelado exacto y colocación de estantes.",
    "descriptionEn": "Wall-mounted bathroom medicine cabinet installation, laser-leveled with secure stud anchors."
  },
  {
    "id": "job-576796848976584716",
    "filename": "job_057_576796848976584716.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de Pantalla y Home Theater en Sala #56",
    "titleEn": "Living Room TV & Home Theater Mount #56",
    "tags": ["TV Mounting", "Home Theater", "Living Room"],
    "descriptionEs": "Instalación de televisor de alta definición en sala principal con cables ordenados.",
    "descriptionEn": "High-definition TV installation in living area with clean, organized in-wall wire channels."
  },
  {
    "id": "job-573362257304346629",
    "filename": "job_058_573362257304346629.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Escritorio Ejecutivo con Bandeja #57",
    "titleEn": "Executive Desk Assembly & Setup #57",
    "tags": ["Desk", "Assembly", "Office"],
    "descriptionEs": "Armado de mesa de despacho ejecutivo con refuerzos metálicos y gestión de cables.",
    "descriptionEn": "Executive office desk construction, metal frame reinforcement, and desktop cable grommet fitting."
  },
  {
    "id": "job-576796850200870914",
    "filename": "job_056_576796850200870914.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Mueble de Lavandería y Cestas #58",
    "titleEn": "Laundry Hamper & Storage Cabinet Assembly #58",
    "tags": ["Hamper", "Storage", "Assembly"],
    "descriptionEs": "Montaje de mueble organizador de lavandería con gavetas basculantes para ropa sucia.",
    "descriptionEn": "Laundry organizer cabinet assembly featuring tilt-out laundry hampers and upper shelf."
  },
  {
    "id": "job-573362256031924253",
    "filename": "job_059_573362256031924253.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Sofá de Descanso y Acomodo #59",
    "titleEn": "Living Room Sofa Setup & Assembly #59",
    "tags": ["Sofa", "Assembly", "Furniture"],
    "descriptionEs": "Armado de patas y herrajes de sofá, nivelación sobre suelo y acomodo en sala.",
    "descriptionEn": "Living room sofa leg installation, cushion arranging, and leveling."
  },
  {
    "id": "job-571543898354401288",
    "filename": "job_062_571543898354401288.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de Pantalla de TV en Pared #60",
    "titleEn": "Wall Mounted Display TV Setup #60",
    "tags": ["TV Mounting", "Wall Mount", "Display"],
    "descriptionEs": "Fijación segura de televisor en paneles de yeso con tacos basculantes de alta resistencia.",
    "descriptionEn": "Secure flat-panel TV wall mount using heavy-duty toggle bolts and stud anchors."
  },
  {
    "id": "job-571543899541929991",
    "filename": "job_061_571543899541929991.jpeg",
    "category": "CARPENTRY",
    "titleEs": "Ensamblaje de Librero y Estantería Modular #61",
    "titleEn": "Bookcase & Modular Shelving Assembly #61",
    "tags": ["Bookcase", "Carpentry", "Shelving"],
    "descriptionEs": "Armado de estantería de libros, fijación antivuelco a pared y ajuste de baldas.",
    "descriptionEn": "Tall bookcase assembly, anti-tip wall strap anchoring, and adjustable shelf positioning."
  },
  {
    "id": "job-570758120502894592",
    "filename": "job_065_570758120502894592.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Microondas sobre Estufa #62",
    "titleEn": "Over-the-Range Microwave Installation #62",
    "tags": ["Microwave", "Appliance", "Installation"],
    "descriptionEs": "Montaje de soporte en pared, conexión eléctrica y fijación superior bajo gabinete.",
    "descriptionEn": "Over-the-range microwave wall bracket mount, upper cabinet bolting, and exhaust venting."
  },
  {
    "id": "job-571543897015320584",
    "filename": "job_063_571543897015320584.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje y Sintonización de TCL Roku TV #63",
    "titleEn": "TCL Roku TV Wall Mounting & Setup #63",
    "tags": ["TV Mounting", "Roku TV", "Entertainment"],
    "descriptionEs": "Instalación en pared de televisor TCL Roku TV con canalización de cables y prueba de apps.",
    "descriptionEn": "TCL Roku TV mounting, neat cable concealing, and smart streaming app configuration."
  },
  {
    "id": "job-573362254836015133",
    "filename": "job_060_573362254836015133.jpeg",
    "category": "DOORS_WINDOWS",
    "titleEs": "Ajuste de Puerta Exterior y Burlete Térmico #64",
    "titleEn": "Exterior Door Weatherstripping & Alignment #64",
    "tags": ["Doors", "Weatherstripping", "Maintenance"],
    "descriptionEs": "Alineación de marco de puerta exterior, cepillado de roces e instalación de burlete aislante.",
    "descriptionEn": "Exterior door alignment, threshold adjustment, and weatherstripping replacement."
  },
  {
    "id": "job-569212846185144335",
    "filename": "job_067_569212846185144335.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de TV sobre Chimenea de Ladrillo #65",
    "titleEn": "Brick Fireplace TV Wall Mounting #65",
    "tags": ["TV Mounting", "Fireplace", "Brick"],
    "descriptionEs": "Perforación en mampostería, tacos de expansión metálicos y montaje seguro de TV sobre chimenea.",
    "descriptionEn": "Masonry pilot drilling, metal sleeve expansion anchors, and over-fireplace TV installation."
  },
  {
    "id": "job-570160420916338693",
    "filename": "job_066_570160420916338693.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Silla de Barbero y Mobiliario #66",
    "titleEn": "Specialty Chair Assembly & Adjustment #66",
    "tags": ["Chair", "Assembly", "Furniture"],
    "descriptionEs": "Armado de sillón reclinable con mecanismo hidráulico y fijación a base redonda.",
    "descriptionEn": "Hydraulic recline barber/accent chair assembly and heavy base leveling."
  },
  {
    "id": "job-571366696066605064",
    "filename": "job_064_571366696066605064.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de TV en Pared con Gestión de Cables #67",
    "titleEn": "TV Wall Mount & Wire Routing #67",
    "tags": ["TV Mounting", "Cables", "Living Room"],
    "descriptionEs": "Instalación limpia de pantalla en pared con soporte inclinable y bridas organizadoras de cable.",
    "descriptionEn": "Clean tilt-bracket TV installation with tidy cable bundles and flush wall spacing."
  },
  {
    "id": "job-568846121978585094",
    "filename": "job_069_568846121978585094.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de Samsung Smart TV en Pared #68",
    "titleEn": "Samsung Smart TV Wall Mount #68",
    "tags": ["Samsung TV", "TV Mounting", "Smart TV"],
    "descriptionEs": "Fijación de Smart TV Samsung de alta gama, verificación de nivel y canalización oculta.",
    "descriptionEn": "Samsung Smart TV wall mounting with precision level verification and concealed wire kit."
  },
  {
    "id": "job-568656657887395849",
    "filename": "job_071_568656657887395849.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Electrodoméstico en Gabinete #69",
    "titleEn": "Cabinet Appliance Installation #69",
    "tags": ["Appliance", "Cabinet", "Installation"],
    "descriptionEs": "Encaje a medida de electrodoméstico dentro de gabinete de cocina con fijaciones de seguridad.",
    "descriptionEn": "Custom-fit kitchen cabinet appliance installation with secure trim and mounting clips."
  },
  {
    "id": "job-569106936361263114",
    "filename": "job_068_569106936361263114.jpeg",
    "category": "REPAIRS",
    "titleEs": "Instalación de Mueble de Baño con Espejo #70",
    "titleEn": "Bathroom Vanity & Mirror Setup #70",
    "tags": ["Bathroom", "Vanity", "Plumbing"],
    "descriptionEs": "Fijación de tocador de baño a pared, montaje de grifería y sellado con silicona anti-moho.",
    "descriptionEn": "Bathroom vanity cabinet wall attachment, plumbing connections, and mildew-resistant silicone bead."
  },
  {
    "id": "job-567741743472508930",
    "filename": "job_073_567741743472508930.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de TV con Amazon Fire TV #71",
    "titleEn": "Amazon Fire TV Wall Mount #71",
    "tags": ["Fire TV", "TV Mounting", "Home Theater"],
    "descriptionEs": "Montaje en pared de televisor integrado con Amazon Fire TV y audio configurado.",
    "descriptionEn": "Fire TV system wall mount installation with HDMI CEC and remote pairing."
  },
  {
    "id": "job-568787980252741647",
    "filename": "job_070_568787980252741647.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Cómoda Gavetera Multiuso #72",
    "titleEn": "Multi-Drawer Dresser Assembly #72",
    "tags": ["Dresser", "Assembly", "Furniture"],
    "descriptionEs": "Armado completo de mueble con múltiples gavetas, correderas metálicas y tiradores.",
    "descriptionEn": "Complete multi-drawer dresser assembly, metal runner alignment, and knobs fitting."
  },
  {
    "id": "job-568495458085773314",
    "filename": "job_072_568495458085773314.jpeg",
    "category": "CARPENTRY",
    "titleEs": "Instalación de Repisas y Organizadores de Pared #73",
    "titleEn": "Wall Shelving & Storage Rack Mount #73",
    "tags": ["Shelving", "Carpentry", "Storage"],
    "descriptionEs": "Montaje de estantes de cocina y organizadores de pared con anclajes reforzados.",
    "descriptionEn": "Kitchen wall rack and utility shelf mounting using solid drywall anchors."
  },
  {
    "id": "job-567648764896002051",
    "filename": "job_075_567648764896002051.jpeg",
    "category": "DOORS_WINDOWS",
    "titleEs": "Instalación y Ajuste de Cerradura y Herrajes #74",
    "titleEn": "Door Lock & Hardware Installation #74",
    "tags": ["Door Lock", "Hardware", "Security"],
    "descriptionEs": "Reemplazo de cerradura, calibración del pestillo y ajuste de placa de impacto.",
    "descriptionEn": "Deadbolt lock replacement, latch strike plate alignment, and smooth turn testing."
  },
  {
    "id": "job-567648763780538381",
    "filename": "job_076_567648763780538381.jpeg",
    "category": "CARPENTRY",
    "titleEs": "Instalación de Pasamanos y Barandilla de Escalera #75",
    "titleEn": "Staircase Handrail & Railing Mount #75",
    "tags": ["Handrail", "Staircase", "Carpentry"],
    "descriptionEs": "Fijación reforzada de soportes de pasamanos a vigas de pared para seguridad en escalera.",
    "descriptionEn": "Heavy-duty stair handrail mounting into structural wall studs for maximum safety."
  },
  {
    "id": "job-567723264507199495",
    "filename": "job_074_567723264507199495.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Armado de Escritorio y Estación de Oficina #76",
    "titleEn": "Office Desk & Workstation Setup #76",
    "tags": ["Desk", "Assembly", "Office"],
    "descriptionEs": "Armado de estación de trabajo con soporte para equipos y organizador de cables.",
    "descriptionEn": "Office computer desk assembly, drawer setup, and organized power routing."
  },
  {
    "id": "job-567456815009767431",
    "filename": "job_078_567456815009767431.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Armario Ropero de 2 Puertas #77",
    "titleEn": "Double-Door Wardrobe Closet Assembly #77",
    "tags": ["Wardrobe", "Closet", "Assembly"],
    "descriptionEs": "Armado de armario ropero con barra para colgar, nivelación de puertas y herrajes.",
    "descriptionEn": "Two-door wardrobe cabinet assembly, hanging rod fitting, and door gap adjustment."
  },
  {
    "id": "job-567456816947732483",
    "filename": "job_077_567456816947732483.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Clóset y Mueble Ropero #78",
    "titleEn": "Tall Wardrobe Storage Assembly #78",
    "tags": ["Wardrobe", "Storage", "Assembly"],
    "descriptionEs": "Ensamblaje de ropero alto, fijación de bisagras regulables y anclaje de seguridad a pared.",
    "descriptionEn": "Tall freestanding wardrobe assembly, European hinge calibration, and wall safety strap."
  },
  {
    "id": "job-566528548953292802",
    "filename": "job_079_566528548953292802.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Horno Microondas Empotrado #79",
    "titleEn": "Built-In Microwave Oven Installation #79",
    "tags": ["Microwave", "Kitchen", "Installation"],
    "descriptionEs": "Montaje e instalación de microondas empotrado con marco embellecedor en mueble de cocina.",
    "descriptionEn": "Built-in kitchen microwave installation with trim kit and dedicated outlet hookup."
  },
  {
    "id": "job-566008284114550797",
    "filename": "job_081_566008284114550797.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Focos Spotlight Empotrados #80",
    "titleEn": "Recessed Spotlight Lighting Install #80",
    "tags": ["Lighting", "Spotlight", "Installation"],
    "descriptionEs": "Instalación de focos LED direccionales empotrados en falso techo con conexión eléctrica segura.",
    "descriptionEn": "Directional ceiling spotlight installation with safe junction box wiring."
  },
  {
    "id": "job-566528547896279042",
    "filename": "job_080_566528547896279042.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Lavavajillas Automático #81",
    "titleEn": "Under-Counter Dishwasher Installation #81",
    "tags": ["Dishwasher", "Appliance", "Installation"],
    "descriptionEs": "Instalación bajo encimera de lavavajillas, conexión a toma de agua, triturador y electricidad.",
    "descriptionEn": "Under-counter dishwasher hookup, water feed line connection, and drain hose loop."
  },
  {
    "id": "job-565930268931244040",
    "filename": "job_083_565930268931244040.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Configuración de Red y Smart TV en Pared #82",
    "titleEn": "Smart TV Network & Wall Display Setup #82",
    "tags": ["Smart TV", "Network", "TV Mounting"],
    "descriptionEs": "Montaje de pantalla inteligente y conexión a red inalámbrica Wi-Fi para streaming continuo.",
    "descriptionEn": "Smart TV wall installation and wireless network connection setup for stable streaming."
  },
  {
    "id": "job-566008271210815491",
    "filename": "job_082_566008271210815491.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Luces Empotradas de Techo #83",
    "titleEn": "Recessed Ceiling Lighting Installation #83",
    "tags": ["Lighting", "Ceiling", "Installation"],
    "descriptionEs": "Colocación de luces empotradas LED con regulación de intensidad y acabado limpio en techo.",
    "descriptionEn": "Recessed ceiling downlight fixture installation with dimmer compatibility."
  },
  {
    "id": "job-565901767630913546",
    "filename": "job_084_565901767630913546.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Mueble Gavetero para Habitación #84",
    "titleEn": "Bedroom Chest of Drawers Assembly #84",
    "tags": ["Dresser", "Assembly", "Bedroom"],
    "descriptionEs": "Armado de cómoda para dormitorio, calibración de gavetas y tiradores metálicos.",
    "descriptionEn": "Multi-tier bedroom chest assembly with smooth glide drawers and safety anchoring."
  },
  {
    "id": "job-565665554932580355",
    "filename": "job_086_565665554932580355.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Cómoda de 4 Gavetas #85",
    "titleEn": "4-Drawer Bedroom Dresser Assembly #85",
    "tags": ["Dresser", "Assembly", "Furniture"],
    "descriptionEs": "Montaje de cómoda de cuatro cajones con sistema antivuelco y acabados en madera.",
    "descriptionEn": "Four-drawer dresser assembly, anti-tip wall bracket, and flush faceplates."
  },
  {
    "id": "job-565218420461060110",
    "filename": "job_087_565218420461060110.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación y Ajuste de Soporte de Dispositivo #86",
    "titleEn": "Specialty Device Mount & Setup #86",
    "tags": ["Mounting", "Installation", "Hardware"],
    "descriptionEs": "Montaje de soporte articulado sobre trípode/pared para dispositivos residenciales.",
    "descriptionEn": "Precision articulated bracket and hardware installation for residential equipment."
  },
  {
    "id": "job-565218373510537216",
    "filename": "job_090_565218373510537216.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje y Nivelación de Sofá de Sala #87",
    "titleEn": "Living Room Sofa Assembly & Leveling #87",
    "tags": ["Sofa", "Assembly", "Living Room"],
    "descriptionEs": "Armado de sofá de sala de estar, fijación de apoyabrazos y nivelación de patas.",
    "descriptionEn": "Living room sofa assembly, armrest bolting, and balanced leg positioning."
  },
  {
    "id": "job-565218417933885445",
    "filename": "job_089_565218417933885445.jpeg",
    "category": "DOORS_WINDOWS",
    "titleEs": "Instalación de Persianas y Cortinas Enrollables #88",
    "titleEn": "Window Roller Shades & Blind Installation #88",
    "tags": ["Window Shades", "Blinds", "Doors & Windows"],
    "descriptionEs": "Fijación de mecanismos de persiana enrollable en marco de ventana con ajuste de tensión.",
    "descriptionEn": "Window frame roller shade bracket mounting, level alignment, and cord tension safety."
  },
  {
    "id": "job-565218362013409284",
    "filename": "job_091_565218362013409284.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Cómoda Alta de Dormitorio #89",
    "titleEn": "Tall Dresser Chest Assembly #89",
    "tags": ["Dresser", "Assembly", "Furniture"],
    "descriptionEs": "Montaje de chifonier alto con guías reforzadas y ajuste de frente de cajones.",
    "descriptionEn": "Tall upright dresser chest assembly, drawer face alignment, and hardware installation."
  },
  {
    "id": "job-565822717751304200",
    "filename": "job_085_565822717751304200.jpeg",
    "category": "DOORS_WINDOWS",
    "titleEs": "Instalación de Persianas Residenciales en Ventana #90",
    "titleEn": "Residential Window Blind Fitting #90",
    "tags": ["Window Blinds", "Doors & Windows", "Installation"],
    "descriptionEs": "Instalación a medida de persianas venecianas en ventana con control de inclinación y elevación.",
    "descriptionEn": "Custom-fit venetian window blind install with tilt wand and lift cord calibration."
  },
  {
    "id": "job-565218419246579720",
    "filename": "job_088_565218419246579720.jpeg",
    "category": "DOORS_WINDOWS",
    "titleEs": "Instalación de Puerta Corrediza de Vidrio #91",
    "titleEn": "Sliding Glass Patio Door Install #91",
    "tags": ["Sliding Door", "Doors", "Glass Door"],
    "descriptionEs": "Ajuste de rieles inferiores y superiores para puerta corrediza de cristal con cierre hermético.",
    "descriptionEn": "Top and bottom track alignment for sliding glass door with smooth glide and weather seal."
  },
  {
    "id": "job-564286796157657097",
    "filename": "job_092_564286796157657097.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de TV con Centro de Entretenimiento #92",
    "titleEn": "Entertainment Center & TV Mount #92",
    "tags": ["TV Mounting", "Entertainment Center", "Audio"],
    "descriptionEs": "Instalación de pantalla sobre centro multimedia con cableado ordenado y conexión de consolas.",
    "descriptionEn": "TV screen installation centered above media console with neat cable routing."
  },
  {
    "id": "job-564200034729893891",
    "filename": "job_095_564200034729893891.jpeg",
    "category": "REPAIRS",
    "titleEs": "Reparación de Revestimiento Exterior Residencial #93",
    "titleEn": "Exterior Siding & Trim Repair #93",
    "tags": ["Exterior", "Siding", "Repairs"],
    "descriptionEs": "Reparación de paneles de revestimiento exterior dañados y sellado contra humedad.",
    "descriptionEn": "Damaged exterior vinyl/wood siding repair, corner trim replacement, and weather caulking."
  },
  {
    "id": "job-564200036919934982",
    "filename": "job_093_564200036919934982.jpeg",
    "category": "CARPENTRY",
    "titleEs": "Reparación de Plataforma y Deck de Madera #94",
    "titleEn": "Outdoor Wood Deck Repair #94",
    "tags": ["Deck", "Carpentry", "Outdoor"],
    "descriptionEs": "Sustitución de tablas deterioradas en deck exterior, fijación de tornillos y refuerzo estructural.",
    "descriptionEn": "Rotten deck board replacement, joist reinforcement, and structural screw fastening."
  },
  {
    "id": "job-564200035919061002",
    "filename": "job_094_564200035919061002.jpeg",
    "category": "REPAIRS",
    "titleEs": "Mantenimiento y Reparación de Porche Exterior #95",
    "titleEn": "Outdoor Porch Maintenance & Repair #95",
    "tags": ["Porch", "Exterior", "Repairs"],
    "descriptionEs": "Mantenimiento preventivo en columnas y estructura de porche exterior con pintura protectora.",
    "descriptionEn": "Porch post and trim repair, wood conditioning, and weather protection application."
  },
  {
    "id": "job-564113734570115081",
    "filename": "job_097_564113734570115081.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Excavación y Anclaje de Poste de Buzón #96",
    "titleEn": "Mailbox Post Hole Digging & Concrete Anchor #96",
    "tags": ["Mailbox", "Concrete", "Installation"],
    "descriptionEs": "Excavación de zanja a profundidad normativa, colocación de poste y vertido de base de concreto.",
    "descriptionEn": "Post hole excavation to standard frost line depth, post placement, and concrete footing."
  },
  {
    "id": "job-564113735873150986",
    "filename": "job_096_564113735873150986.jpeg",
    "category": "REPAIRS",
    "titleEs": "Reparación y Mantenimiento de Escalones de Patio #97",
    "titleEn": "Patio Steps & Walkway Repair #97",
    "tags": ["Patio", "Steps", "Outdoor"],
    "descriptionEs": "Nivelación y refuerzo de escalones de acceso exterior con anclajes resistentes a la intemperie.",
    "descriptionEn": "Outdoor step reinforcement, leveling, and weather-resistant structural restoration."
  },
  {
    "id": "job-564005149343006730",
    "filename": "job_098_564005149343006730.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Buzón Residencial con Soporte #98",
    "titleEn": "Residential Curbside Mailbox Post Install #98",
    "tags": ["Mailbox", "Installation", "Outdoor"],
    "descriptionEs": "Montaje de buzón metálico sobre poste resistente con anclaje firme y alineación vial.",
    "descriptionEn": "Curbside metal mailbox installation on solid upright post with proper street setback."
  },
  {
    "id": "job-564005148038651918",
    "filename": "job_099_564005148038651918.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Buzón con Numeración de Calle #99",
    "titleEn": "Numbered Mailbox Post Installation #99",
    "tags": ["Mailbox", "Street Number", "Installation"],
    "descriptionEs": "Colocación de buzón exterior con rotulación de número residencial y base en concreto.",
    "descriptionEn": "Residential mailbox post installation with clean street numbering and durable footing."
  },
  {
    "id": "job-564005146756997129",
    "filename": "job_100_564005146756997129.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Buzón y Poste Anclado #100",
    "titleEn": "Anchored Mailbox Post Installation #100",
    "tags": ["Mailbox", "Installation", "Outdoor"],
    "descriptionEs": "Montaje completo de conjunto de buzón y poste con anclaje nivelado y remates duraderos.",
    "descriptionEn": "Complete mailbox and post assembly, level installation, and secure soil/concrete base."
  },
  {
    "id": "job-564005144174854147",
    "filename": "job_102_564005144174854147.jpeg",
    "category": "REPAIRS",
    "titleEs": "Instalación y Ajuste de Cerca de Estacas #101",
    "titleEn": "Picket Fence Section Installation #101",
    "tags": ["Picket Fence", "Fence", "Repairs"],
    "descriptionEs": "Instalación de sección de cerca de estacas de madera, alineación de postes y fijación a nivel.",
    "descriptionEn": "Wood picket fence section installation, post alignment, and rust-resistant fastening."
  },
  {
    "id": "job-564005145248038913",
    "filename": "job_101_564005145248038913.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Montaje de Buzón Exterior Residencial #102",
    "titleEn": "Outdoor Residential Mailbox Setup #102",
    "tags": ["Mailbox", "Outdoor", "Installation"],
    "descriptionEs": "Instalación de caja de correo exterior sobre poste reforzado con apertura suave.",
    "descriptionEn": "Outdoor mailbox housing installation with secure bracket attachment and smooth door hinge."
  },
  {
    "id": "job-563944535981481985",
    "filename": "job_104_563944535981481985.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Mesa de Trabajo y Banco de Taller #103",
    "titleEn": "Workshop Workbench Assembly #103",
    "tags": ["Workbench", "Assembly", "Workshop"],
    "descriptionEs": "Armado de mesa de trabajo reforzada para garaje o taller con nivelación milimétrica.",
    "descriptionEn": "Heavy-duty garage workbench assembly, crossbeam bolting, and work surface leveling."
  },
  {
    "id": "job-563944537216786445",
    "filename": "job_103_563944537216786445.jpeg",
    "category": "DOORS_WINDOWS",
    "titleEs": "Instalación de Persianas a Medida en Ventana #104",
    "titleEn": "Custom Window Shade Fitting #104",
    "tags": ["Window Shade", "Doors & Windows", "Installation"],
    "descriptionEs": "Colocación de persianas interiores a medida con mecanismo de tiro suave y bloqueo de luz.",
    "descriptionEn": "Custom interior window shade installation with smooth-glide pull mechanism."
  },
  {
    "id": "job-563944534976733187",
    "filename": "job_105_563944534976733187.jpeg",
    "category": "REPAIRS",
    "titleEs": "Instalación de Mueble de Lavabo y Grifo de Baño #105",
    "titleEn": "Bathroom Sink & Cabinet Install #105",
    "tags": ["Bathroom", "Sink", "Plumbing"],
    "descriptionEs": "Instalación de lavamanos con mueble inferior, conexión a tomas de agua fría/caliente y sifón.",
    "descriptionEn": "Bathroom sink basin and vanity cabinet install, dual water hookups, and waste trap."
  },
  {
    "id": "job-563778025381552131",
    "filename": "job_106_563778025381552131.jpeg",
    "category": "INSTALLATION",
    "titleEs": "Instalación de Soporte y Accesorio Residencial #106",
    "titleEn": "Residential Fixture & Bracket Mount #106",
    "tags": ["Bracket", "Installation", "Hardware"],
    "descriptionEs": "Fijación precisa de soporte en muro con tornillería de alta capacidad y prueba de carga.",
    "descriptionEn": "Wall bracket mounting with high-load capacity anchors and structural load testing."
  },
  {
    "id": "job-563777944319590413",
    "filename": "job_107_563777944319590413.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Banco de Patio Exterior #107",
    "titleEn": "Outdoor Patio Bench Assembly #107",
    "tags": ["Bench", "Outdoor", "Assembly"],
    "descriptionEs": "Armado de banco de madera para jardín con herrajes anticorrosivos y barnizado protector.",
    "descriptionEn": "Outdoor wooden park/patio bench assembly with rust-proof hardware and solid framing."
  },
  {
    "id": "job-563777902058766345",
    "filename": "job_109_563777902058766345.jpeg",
    "category": "CARPENTRY",
    "titleEs": "Trabajo de Carpintería y Molduras Finas #108",
    "titleEn": "Custom Carpentry & Trim Woodwork #108",
    "tags": ["Carpentry", "Woodwork", "Trim"],
    "descriptionEs": "Corte a inglete y ajuste de molduras de madera con acabados limpios y fijación invisible.",
    "descriptionEn": "Precision miter cutting and finish carpentry installation with seamless jointing."
  },
  {
    "id": "job-563777903129542661",
    "filename": "job_108_563777903129542661.jpeg",
    "category": "CARPENTRY",
    "titleEs": "Corte y Ajuste de Madera para Proyecto #109",
    "titleEn": "Wood Cutting & Finish Carpentry #109",
    "tags": ["Carpentry", "Wood Cutting", "Custom"],
    "descriptionEs": "Preparación y cepillado de piezas de madera a medida para encaje exacto en proyecto residencial.",
    "descriptionEn": "Custom wood board cutting, planing, and precision fitting for residential build."
  },
  {
    "id": "job-563777899391320069",
    "filename": "job_111_563777899391320069.jpeg",
    "category": "CARPENTRY",
    "titleEs": "Elaboración de Piezas de Madera Artesanales #110",
    "titleEn": "Handcrafted Wood Project Pieces #110",
    "tags": ["Woodwork", "Carpentry", "Handcrafted"],
    "descriptionEs": "Fabricación de elementos de carpintería a medida con lijado fino y sellado de madera.",
    "descriptionEn": "Craftsman custom woodwork piece fabrication, smooth sanding, and protective seal coat."
  },
  {
    "id": "job-563777837762068483",
    "filename": "job_112_563777837762068483.jpeg",
    "category": "CARPENTRY",
    "titleEs": "Construcción de Jardinera de Madera para Patio #111",
    "titleEn": "Custom Wood Planter Box Build #111",
    "tags": ["Planter Box", "Carpentry", "Outdoor"],
    "descriptionEs": "Fabricación y ensamblaje de jardinera elevada de madera tratada para terraza o patio.",
    "descriptionEn": "Raised treated-wood planter box construction and corner bracing for patio gardening."
  },
  {
    "id": "job-563777785179914249",
    "filename": "job_114_563777785179914249.jpeg",
    "category": "DOORS_WINDOWS",
    "titleEs": "Instalación y Ajuste de Puerta Corrediza #112",
    "titleEn": "Sliding Door Track & Hardware Adjust #112",
    "tags": ["Sliding Door", "Doors", "Hardware"],
    "descriptionEs": "Calibración de guías de deslizamiento y rodamientos para apertura suave de puerta corrediza.",
    "descriptionEn": "Sliding door roller and track alignment, ensuring frictionless glide and secure lock."
  },
  {
    "id": "job-563777786293723141",
    "filename": "job_113_563777786293723141.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje de TV con Sistema Home Theater #113",
    "titleEn": "Home Theater TV Mounting #113",
    "tags": ["Home Theater", "TV Mounting", "Audio"],
    "descriptionEs": "Instalación central de pantalla en sala de cine en casa con soporte basculante y sonido envolvente.",
    "descriptionEn": "Central display mounting for home theater room with tilt bracket and surround sound calibration."
  },
  {
    "id": "job-563777900570419205",
    "filename": "job_110_563777900570419205.jpeg",
    "category": "CARPENTRY",
    "titleEs": "Corte y Preparación de Madera Estructural #114",
    "titleEn": "Custom Timber Preparation & Carpentry #114",
    "tags": ["Timber", "Carpentry", "Woodwork"],
    "descriptionEs": "Dimensionado de vigas y tablas de madera para soporte estructural en reformas interiores.",
    "descriptionEn": "Lumber sizing and structural wood preparation for interior framing and carpentry."
  },
  {
    "id": "job-563777782625583114",
    "filename": "job_116_563777782625583114.jpeg",
    "category": "CARPENTRY",
    "titleEs": "Instalación de Estantería de Baño a Medida #115",
    "titleEn": "Bathroom Shelving & Storage Setup #115",
    "tags": ["Bathroom Shelving", "Carpentry", "Storage"],
    "descriptionEs": "Montaje de repisas resistentes a la humedad en baño con soportes empotrados.",
    "descriptionEn": "Moisture-resistant bathroom shelving installation with hidden support brackets."
  },
  {
    "id": "job-563777781438496778",
    "filename": "job_117_563777781438496778.jpeg",
    "category": "REPAIRS",
    "titleEs": "Instalación de Barra de Ducha y Accesorios #116",
    "titleEn": "Shower Rod & Bathroom Fixtures Setup #116",
    "tags": ["Shower Rod", "Bathroom", "Fixtures"],
    "descriptionEs": "Fijación anclada de barra de cortina de ducha y toallero con acabado cromado duradero.",
    "descriptionEn": "Heavy-duty shower curtain rod anchoring and bathroom towel hardware installation."
  },
  {
    "id": "job-563777783915266053",
    "filename": "job_115_563777783915266053.jpeg",
    "category": "CARPENTRY",
    "titleEs": "Armado e Instalación de Librero en Pared #117",
    "titleEn": "Custom Bookcase & Shelving Setup #117",
    "tags": ["Bookcase", "Shelving", "Carpentry"],
    "descriptionEs": "Ensamblaje y fijación a montantes de librero de madera con divisiones ajustables.",
    "descriptionEn": "Wooden bookcase assembly and secure wall-stud fastening with adjustable tiers."
  },
  {
    "id": "job-563777779646234633",
    "filename": "job_118_563777779646234633.jpeg",
    "category": "REPAIRS",
    "titleEs": "Instalación de Gabinete y Lavamanos de Baño #118",
    "titleEn": "Bathroom Vanity Cabinet & Basin Install #118",
    "tags": ["Vanity", "Sink", "Plumbing"],
    "descriptionEs": "Montaje de tocador de baño compacto, colocación de grifo y conexión al desagüe.",
    "descriptionEn": "Compact bathroom vanity cabinet installation, faucet hookup, and P-trap drain line."
  },
  {
    "id": "job-563513157557010455",
    "filename": "job_119_563513157557010455.jpeg",
    "category": "REPAIRS",
    "titleEs": "Instalación de Accesorios y Portarrollos de Baño #119",
    "titleEn": "Bathroom Hardware & Fixtures Install #119",
    "tags": ["Bathroom Hardware", "Fixtures", "Installation"],
    "descriptionEs": "Instalación nivelada de toalleros, portarrollos y ganchos de baño con tacos especiales para yeso.",
    "descriptionEn": "Level installation of towel rings, paper holders, and robe hooks with hollow-wall anchors."
  },
  {
    "id": "job-563513155262865414",
    "filename": "job_121_563513155262865414.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Archivador y Mueble de Oficina #120",
    "titleEn": "Office File Cabinet & Desk Assembly #120",
    "tags": ["File Cabinet", "Assembly", "Office"],
    "descriptionEs": "Armado de cajonera archivadora para oficina con cerradura y guías telescópicas.",
    "descriptionEn": "Office filing cabinet assembly with locking drawer mechanism and smooth telescopic slides."
  },
  {
    "id": "job-563513156417249297",
    "filename": "job_120_563513156417249297.jpeg",
    "category": "TV_MOUNTING",
    "titleEs": "Montaje y Conexión de Pantalla de TV #121",
    "titleEn": "TV Wall Mounting & Input Configuration #121",
    "tags": ["TV Mounting", "HDMI", "Display"],
    "descriptionEs": "Fijación en pared de televisor, conexión de entradas HDMI y comprobación de señal.",
    "descriptionEn": "TV wall mount installation, peripheral HDMI cable connection, and input source testing."
  },
  {
    "id": "job-563299694284103681",
    "filename": "job_123_563299694284103681.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Gabinete Archivador de Oficina #122",
    "titleEn": "Office Filing Cabinet Assembly #122",
    "tags": ["Office", "Storage", "Assembly"],
    "descriptionEs": "Armado de archivador de documentos para oficina, ajuste de frentes y ruedas giratorias.",
    "descriptionEn": "Commercial office storage file cabinet assembly, caster wheels mounting, and alignment."
  },
  {
    "id": "job-563299692950315025",
    "filename": "job_124_563299692950315025.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Mueble con Gavetas de Oficina #123",
    "titleEn": "Multi-Drawer Office Unit Assembly #123",
    "tags": ["Office Furniture", "Drawers", "Assembly"],
    "descriptionEs": "Montaje de cajonera para almacenamiento de suministros y carpetas de oficina.",
    "descriptionEn": "Office supply drawer unit assembly with smooth metal tracks and modern handles."
  },
  {
    "id": "job-563299691854217239",
    "filename": "job_125_563299691854217239.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Mueble para Impresora y Credenza #124",
    "titleEn": "Office Printer Stand & Credenza Assembly #124",
    "tags": ["Printer Stand", "Credenza", "Assembly"],
    "descriptionEs": "Armado de credenza y soporte para impresora con estantes de almacenamiento inferior.",
    "descriptionEn": "Office printer credenza and utility credenza assembly with lower shelving."
  },
  {
    "id": "job-563513153894613015",
    "filename": "job_122_563513153894613015.jpeg",
    "category": "ASSEMBLY",
    "titleEs": "Ensamblaje de Escritorio para Computadora #125",
    "titleEn": "Computer Workstation Desk Assembly #125",
    "tags": ["Desk", "Computer", "Assembly"],
    "descriptionEs": "Armado de mesa de trabajo para ordenador, nivelación de estructura y acomodo ergonómico.",
    "descriptionEn": "Computer desk workstation assembly with sturdy frame support and clean cable passes."
  }
]

print(f"Total classified items: {len(CLASSIFICATIONS)}")

# Generate TypeScript code
ts_lines = [
  "// Auto-generated real portfolio from downloaded Thumbtack jobs",
  "import { PortfolioMedia } from '../types';",
  "",
  "export const REAL_PORTFOLIO_ITEMS: PortfolioMedia[] = ["
]

for idx, item in enumerate(CLASSIFICATIONS):
  item_obj = {
    "id": item["id"],
    "titleEs": item["titleEs"],
    "titleEn": item["titleEn"],
    "type": "IMAGE",
    "url": f"/jobs/{item['filename']}",
    "category": item["category"],
    "tags": item["tags"],
    "descriptionEs": item["descriptionEs"],
    "descriptionEn": item["descriptionEn"],
    "featured": item.get("featured", False),
    "author": item.get("author", None),
    "date": item.get("date", None)
  }
  
  json_str = json.dumps(item_obj, ensure_ascii=False, indent=2)
  # indent each line
  indented = "\n".join("  " + l for l in json_str.split("\n"))
  if idx < len(CLASSIFICATIONS) - 1:
    indented += ","
  ts_lines.append(indented)

ts_lines.append("];")
ts_lines.append("")

output_path = "src/data/realJobsPortfolio.ts"
with open(output_path, "w", encoding="utf-8") as f:
  f.write("\n".join(ts_lines))

print(f"Successfully wrote {output_path} with {len(CLASSIFICATIONS)} items.")
