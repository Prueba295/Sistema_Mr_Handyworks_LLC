import { Service, PortfolioMedia, Review, PaymentQR, AvailabilityDay, Booking } from '../types';
import { REAL_PORTFOLIO_ITEMS } from './realJobsPortfolio';
import { REAL_THUMBTACK_REVIEWS } from './realReviews';

export const BUSINESS_INFO = {
  name: 'Mr Handyworks LLC',
  owner: 'Mr Handyworks LLC',
  phone: '(574) 279-9355',
  phoneRaw: '15742799355',
  email: 'contact@mrhandyworks.com',
  location: 'South Bend, IN',
  serviceAreas: [
    'South Bend, IN',
    'Mishawaka, IN',
    'Granger, IN',
    'Elkhart, IN',
    'Notre Dame, IN',
    'Osceola, IN',
    'St. Joseph County'
  ],
  workingHours: {
    weekdays: '8:00 AM - 7:00 PM',
    saturdays: '9:00 AM - 5:00 PM',
    sundays: 'Closed / Emergency Only'
  },
  stats: {
    rating: 5.0,
    totalReviews: 79,
    fiveStarPercentage: 99,
    hiredCount: '100+',
    responseTime: '< 2 hours',
    repeatHires: '45%'
  },
  badges: [
    { id: 'top_pro', labelEs: 'Top Pro Certificado', labelEn: 'Top Pro Certified', icon: 'Award' },
    { id: 'bg_checked', labelEs: 'Antecedentes Verificados', labelEn: 'Background Checked', icon: 'ShieldCheck' },
    { id: 'insured', labelEs: 'Asegurado y Afianzado', labelEn: 'Fully Insured & Bonded', icon: 'FileCheck' },
    { id: 'fast_reply', labelEs: 'Respuesta en < 2 Horas', labelEn: 'Replies in < 2 Hours', icon: 'Clock' },
  ],
  thumbtackUrl: 'https://www.thumbtack.com/in/south-bend/handyman/mr-handyworks-llc/service/557892581429960708',
  logoUrl: '/logo_handyworks.jpeg',
  consultationFee: 'Starts at $125',
  depositRequired: 0,
  depositPolicyEs: 'Las consultas en sitio inician en $125. Los estimados se basan en las condiciones visibles y el alcance acordado al momento de la evaluación. Condiciones ocultas, trabajos adicionales o cambios de alcance pueden requerir precios adicionales y aprobación del cliente.',
  depositPolicyEn: 'On-site consultations start at $125. Estimates are based on the visible conditions and agreed scope at the time of evaluation. Concealed conditions, additional work, material changes, or changes in scope may require additional pricing and customer approval.',
  paymentMethods: [
    'Zelle',
    'Venmo',
    'Cash App',
    'Apple Pay',
    'Debit/Credit Cards (+3.5% processing fee)',
    'Cash',
    'Check'
  ]
};

export const THUMBTACK_SERVICES_LIST = [
  'Handyman',
  'Home Theater System Installation or Replacement',
  'TV Mounting',
  'Drywall Installation and Hanging',
  'Drywall Repair and Texturing',
  'Interior Painting',
  'Exterior Painting',
  'Furniture Assembly',
  'Exercise Equipment Repair',
  'Sink or Faucet Installation or Replacement',
  'Toilet Installation or Replacement',
  'Shower and Bathtub Installation or Replacement',
  'Plumbing Drain Repair',
  'Plumbing Pipe Repair',
  'Garbage Disposal Installation',
  'Garbage Disposal Repair',
  'Water Heater Repair or Maintenance',
  'Electrical and Wiring Repair',
  'Switch and Outlet Installation',
  'Switch and Outlet Repair',
  'Lighting Installation',
  'Smart Home Installation or Repair',
  'Thermostat Installation or Repair',
  'Home Security and Alarms Install',
  'Lock Installation and Repair',
  'Door Installation',
  'Door Repair',
  'Window Treatment Installation or Repair',
  'Window Installation and Repair',
  'Trim or Molding Installation',
  'Closet and Shelving System Installation',
  'Cabinet Installation',
  'Custom Cabinet Building',
  'Tile Installation and Replacement',
  'Floor Installation or Replacement',
  'Deck or Porch Repair',
  'Deck or Porch Remodel or Addition',
  'Fence and Gate Installation',
  'Fence and Gate Repairs',
  'Bathroom Remodel',
  'Patio Remodel or Addition',
  'Basement Finishing or Remodeling',
  'General Contracting',
  'Pressure Washing',
  'Gutter Cleaning and Maintenance',
  'Full Service Lawn Care'
];

export const REAL_SERVICE_OPTIONS = [
  'Handyman',
  'Home Theater System Installation or Replacement',
  'Computer Repair',
  'General Contracting',
  'Interior Painting',
  'Lawn Mowing and Trimming',
  'Electrical and Wiring Repair',
  'Tile Installation and Replacement',
  'Deck or Porch Repair',
  'Gutter Cleaning and Maintenance',
  'Pressure Washing',
  'Exterior Painting',
  'Plumbing Drain Repair',
  'TV Repair Services',
  'Lock Installation and Repair',
  'Odor Removal',
  'Masonry Construction Services',
  'Smart Home Installation or Repair',
  'Lighting Installation',
  'Holiday Lighting Installation and Removal',
  'Home Security and Alarms Install',
  'Furniture Assembly',
  'Central Air Conditioning Installation or Replacement',
  'Water Treatment System Installation or Replacement',
  'Picture Hanging and Art Installation',
  'Shower and Bathtub Installation or Replacement',
  'Trim or Molding Installation',
  'Closet and Shelving System Installation',
  'Exercise Equipment Repair',
  'Framing Carpentry',
  'Drywall Installation and Hanging',
  'Plumbing Pipe Repair',
  'Sink or Faucet Installation or Replacement',
  'Plumbing Pipe Installation or Replacement',
  'Water Heater Repair or Maintenance',
  'Wiring Installation',
  'Switch and Outlet Installation',
  'Floor Installation or Replacement',
  'Duct and Vent Cleaning',
  'Thermostat Installation or Repair',
  'Window Treatment Installation or Repair',
  'Well System Work',
  'TV Mounting',
  'Screen Installation or Replacement',
  'Barbecue and Grill Services',
  'Window Installation',
  'Window Repair',
  'Heating System Repair or Maintenance',
  'Appliance Installation',
  'Appliance Repair or Maintenance',
  'Garage Door Repair',
  'Central Air Conditioning Repair or Maintenance',
  'Dishwasher Installation',
  'Fence and Gate Installation',
  'Fence and Gate Repairs',
  'Fan Installation',
  'Door Installation',
  'Door Repair',
  'Play Equipment Construction and Assembly',
  'Patio Cover and Awning Services',
  'Bathroom Remodel',
  'Phone or Tablet Repair',
  'Window, Wall, or Portable AC Repair or Maintenance',
  'Water Heater Installation or Replacement',
  'Toilet Installation or Replacement',
  'Shower and Bathtub Repair',
  'Stair Installation, Remodel, or Repair',
  'Railing Installation or Remodel',
  'Deck or Porch Remodel or Addition',
  'Switch and Outlet Repair',
  'Home Security System Repair',
  'Drywall Repair and Texturing',
  'Furniture Moving and Heavy Lifting',
  'Cabinet Installation',
  'Custom Cabinet Building',
  'Full Service Lawn Care',
  'Garbage Disposal Installation',
  'Garbage Disposal Repair',
  'Patio Remodel or Addition',
  'Window Tinting',
  'Basement Finishing or Remodeling',
  'Fitness Equipment Assembly',
  'Snow Plowing',
  'Duct and Vent Installation or Removal',
  'Air Quality and Environmental Testing',
  'Closet Remodel',
  'Finish Carpentry',
  'Emergency Plumbing',
  'Mobile Auto Brake Services',
  'Mobile Auto Battery Services',
  'Mobile Auto Detailing'
] as const;

export const PROJECT_TYPE_OPTIONS = [
  'Repairs',
  'Installation',
  'Maintenance',
  'Assembly',
  'Painting',
  'Cleaning',
  'Other'
] as const;

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'tv-mount',
    category: 'TV_MOUNTING',
    titleEs: 'Montaje de TV y Ocultamiento de Cables',
    titleEn: 'TV Mounting & In-Wall Cable Concealment',
    descEs: 'Instalación profesional de televisores de 32" a 85"+ sobre paneles de yeso, chimeneas de piedra o ladrillo, con ocultamiento limpio de cables y soportes para Apple TV/consolas. El precio varía según las horas y el tipo o dificultad de instalación.',
    descEn: 'Expert mounting for 32" to 85"+ displays over drywall, stone or brick fireplaces. Complete in-wall cable concealment and hidden brackets. Pricing varies based on hours and installation scope.',
    estimatedHours: '1 - 2.5 hrs',
    rateEstimate: 'Consultation: $125 (Price varies by hours and scope)',
    iconName: 'Tv',
    popular: true
  },
  {
    id: 'home-theater',
    category: 'HOME_THEATER',
    titleEs: 'Cine en Casa y Sistemas de Sonido',
    titleEn: 'Home Theater & Surround Sound Setup',
    descEs: 'Configuración acústica de barras de sonido, altavoces envolventes de pared/techo, paneles acústicos y cableado oculto para una experiencia de audio inmersiva. El costo se calcula según la complejidad del montaje.',
    descEn: 'Acoustic placement of soundbars, in-wall/ceiling surround speakers, acoustic panels and clean wire routing. Final cost depends on room size and project scope.',
    estimatedHours: '2 - 4.5 hrs',
    rateEstimate: 'Consultation: $125 (Price varies by hours and scope)',
    iconName: 'Speaker',
    popular: true
  },
  {
    id: 'general-repairs',
    category: 'REPAIRS',
    titleEs: 'Reparaciones Generales del Hogar',
    titleEn: 'General Home & Drywall Repairs',
    descEs: 'Parcheo de paneles de yeso, reparación de fugas menores de fontanería, reemplazo de molduras, fijación de azulejos sueltos y mantenimiento preventivo.',
    descEn: 'Drywall patching and texture matching, minor plumbing drain fixes, loose tile re-grouting, baseboard repairs, and all-around house fixes.',
    estimatedHours: '1.5 - 4 hrs',
    rateEstimate: 'Consultation: $125 (Price varies by hours and scope)',
    iconName: 'Wrench',
    popular: true
  },
  {
    id: 'furniture-assembly',
    category: 'ASSEMBLY',
    titleEs: 'Ensamblaje de Muebles y Equipos',
    titleEn: 'Furniture & Fitness Equipment Assembly',
    descEs: 'Armado rápido y sólido de muebles IKEA, Wayfair, escritorios de oficina, armarios modulares, camas y máquinas de gimnasio con calibración perfecta.',
    descEn: 'Precision assembly of flat-pack furniture (IKEA, Wayfair, Amazon), office executive desks, bed frames, dressers, and home gym exercise gear.',
    estimatedHours: '1.5 - 3.5 hrs',
    rateEstimate: 'Consultation: $125 (Price varies by hours and scope)',
    iconName: 'Hammer',
    popular: true
  },
  {
    id: 'painting',
    category: 'PAINTING',
    titleEs: 'Pintura Interior y Molduras',
    titleEn: 'Interior Painting & Trim Staining',
    descEs: 'Pintura impecable de habitaciones, techos, puertas, rodapiés y paredes decorativas con bordes nítidos, preparación exhaustiva y protección de pisos.',
    descEn: 'Immaculate painting of bedrooms, living spaces, ceilings, door casings, and accent walls with razor-sharp lines and meticulous surface masking.',
    estimatedHours: '3 - 8 hrs',
    rateEstimate: 'Consultation: $125 (Price varies by hours and size)',
    iconName: 'Paintbrush',
    popular: true
  },
  {
    id: 'doors-windows',
    category: 'DOORS_WINDOWS',
    titleEs: 'Puertas de Granero, Cerraduras y Ventanas',
    titleEn: 'Sliding Barn Doors, Locks & Window Trim',
    descEs: 'Instalación de puertas correderas tipo granero con herrajes industriales, ajuste de bisagras que rozan, cerraduras inteligentes y burletes térmicos.',
    descEn: 'Heavy sliding barn door hardware install, door realignment, smart deadbolt/handle installations, weatherstripping and interior casing repairs.',
    estimatedHours: '2 - 4 hrs',
    rateEstimate: 'Consultation: $125 (Price varies by hours and scope)',
    iconName: 'DoorOpen',
    popular: true
  },
  {
    id: 'carpentry-shelves',
    category: 'CARPENTRY',
    titleEs: 'Estanterías Flotantes y Carpintería',
    titleEn: 'Custom Floating Shelves & Woodwork',
    descEs: 'Fabricación y anclaje reforzado de repisas flotantes de roble o pino con tiras LED integradas, revestimiento de paredes y molduras decorativas.',
    descEn: 'Heavy-duty wall anchoring of solid hardwood floating shelves with optional warm LED underglow, custom closet storage, and decorative finish carpentry.',
    estimatedHours: '2.5 - 5 hrs',
    rateEstimate: 'Consultation: $125 (Price varies by hours and size)',
    iconName: 'Layers',
    popular: false
  },
  {
    id: 'fixtures-install',
    category: 'INSTALLATION',
    titleEs: 'Lámparas, Ventiladores y Muebles de Baño',
    titleEn: 'Lighting, Ceiling Fans & Vanity Installs',
    descEs: 'Reemplazo de lámparas colgantes, instalación de ventiladores de techo balanceados, espejos LED táctiles y cambio de lavabos o grifería.',
    descEn: 'Replacing old chandeliers with modern pendant lights, ceiling fan balancing, backlit LED vanity mirrors, and bathroom sink/faucet upgrades.',
    estimatedHours: '1.5 - 3.5 hrs',
    rateEstimate: 'Consultation: $125 (Price varies by hours and scope)',
    iconName: 'Lightbulb',
    popular: true
  }
];

export const INITIAL_PORTFOLIO: PortfolioMedia[] = REAL_PORTFOLIO_ITEMS;

export const INITIAL_REVIEWS: Review[] = REAL_THUMBTACK_REVIEWS;


export const INITIAL_QR_METHODS: PaymentQR[] = [
  {
    id: 'zelle',
    provider: 'Zelle',
    accountInfo: '(574) 279-9355',
    displayName: 'Zelle (574) 279-9355',
    instructionsEs: 'Envía tu pago por Zelle usando exclusivamente el número de teléfono registrado: (574) 279-9355. Por seguridad, NUNCA busques por nombre o empresa para evitar confusiones con cuentas similares.',
    instructionsEn: 'Send your Zelle payment strictly using our registered phone number: (574) 279-9355. For your security, NEVER search by name or business to prevent sending to similar duplicate accounts.',
    isActive: true
  },
  {
    id: 'venmo',
    provider: 'Venmo',
    accountInfo: '(574) 279-9355',
    displayName: 'Venmo (574) 279-9355',
    instructionsEs: 'Envía tu pago en Venmo buscando únicamente el número de teléfono oficial: (574) 279-9355. No busques por nombres o @handles para evitar transferencias a cuentas homónimas erróneas.',
    instructionsEn: 'Send your Venmo payment using strictly the official phone number: (574) 279-9355. Do not search by names or @handles to avoid accidental transfers to similar accounts.',
    isActive: true
  },
  {
    id: 'cashapp',
    provider: 'CashApp',
    accountInfo: '(574) 279-9355',
    displayName: 'Cash App (574) 279-9355',
    instructionsEs: 'Paga en Cash App enviando directamente al número de teléfono verificado: (574) 279-9355. No busques por $Cashtag o nombres para garantizar que el pago llegue a nuestra cuenta oficial.',
    instructionsEn: 'Pay on Cash App directly to our verified phone number: (574) 279-9355. Do not search by names or $Cashtags to guarantee funds reach our verified business account.',
    isActive: true
  },
  {
    id: 'applepay',
    provider: 'ApplePay',
    accountInfo: '(574) 279-9355',
    displayName: 'Apple Pay (574) 279-9355',
    instructionsEs: 'Envía tu pago mediante Apple Pay / Apple Cash directamente al número de teléfono verificado: (574) 279-9355.',
    instructionsEn: 'Send Apple Pay / Apple Cash payment directly to our verified phone number: (574) 279-9355.',
    isActive: true
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'HW-8492',
    clientName: 'Sarah Jenkins',
    clientPhone: '(574) 555-0192',
    clientEmail: 'sarah.j@gmail.com',
    clientAddress: '1428 E Jefferson Blvd, South Bend, IN',
    zipCode: '46617',
    serviceType: 'TV Mounting & In-Wall Cable Concealment',
    estimatedHours: '2 hrs',
    estimatedPrice: 135,
    projectDetails: 'Mount 75" Samsung TV in living room and hide HDMI/power cables inside drywall cavity.',
    scheduledDate: '2026-09-22',
    scheduledTimeSlot: '09:00 AM - 11:30 AM',
    status: 'CONFIRMED',
    paymentMethod: 'ZELLE',
    paymentStatus: 'DEPOSIT_PAID',
    depositAmount: 40,
    createdAt: '2026-09-18T14:30:00Z',
    notes: 'Customer requested tilt mount. Bring heavy stud anchors.'
  },
  {
    id: 'HW-8493',
    clientName: 'Michael Miller',
    clientPhone: '(574) 555-8321',
    clientEmail: 'mmiller.home@outlook.com',
    clientAddress: '51200 Grape Rd, Mishawaka, IN',
    zipCode: '46545',
    serviceType: 'Sliding Barn Doors, Locks & Window Trim',
    estimatedHours: '3 hrs',
    estimatedPrice: 210,
    projectDetails: 'Install modern solid wood sliding barn door into master bathroom entrance with soft close track.',
    scheduledDate: '2026-09-23',
    scheduledTimeSlot: '02:00 PM - 05:00 PM',
    status: 'PENDING',
    paymentMethod: 'CARD',
    paymentStatus: 'UNPAID',
    createdAt: '2026-09-19T10:15:00Z'
  },
  {
    id: 'HW-8490',
    clientName: 'Elena Ramos',
    clientPhone: '(574) 555-4419',
    clientEmail: 'elena.r@yahoo.com',
    clientAddress: '822 Diamond Ave, South Bend, IN',
    zipCode: '46628',
    serviceType: 'Furniture & Fitness Equipment Assembly',
    estimatedHours: '2.5 hrs',
    estimatedPrice: 150,
    projectDetails: 'Assemble large 6-drawer dresser and queen size storage platform bed.',
    scheduledDate: '2026-09-17',
    scheduledTimeSlot: '11:30 AM - 02:00 PM',
    status: 'COMPLETED',
    paymentMethod: 'VENMO',
    paymentStatus: 'PAID_IN_FULL',
    depositAmount: 50,
    createdAt: '2026-09-15T09:00:00Z',
    notes: 'Completed ahead of time. Customer left 5 star review.'
  }
];

export const STANDARD_TIME_SLOTS = [
  '09:00 AM - 12:00 PM',
  '12:00 PM - 03:00 PM',
  '03:00 PM - 07:00 PM'
];

export const INITIAL_AVAILABILITY: AvailabilityDay[] = [
  {
    date: '2026-09-21',
    isBlocked: false,
    slots: [...STANDARD_TIME_SLOTS]
  },
  {
    date: '2026-09-22',
    isBlocked: false,
    slots: [...STANDARD_TIME_SLOTS]
  },
  {
    date: '2026-09-23',
    isBlocked: false,
    slots: [...STANDARD_TIME_SLOTS]
  },
  {
    date: '2026-09-24',
    isBlocked: true,
    slots: [],
    note: 'Booked - unavailable'
  },
  {
    date: '2026-09-25',
    isBlocked: false,
    slots: [...STANDARD_TIME_SLOTS]
  },
  {
    date: '2026-09-26',
    isBlocked: false,
    slots: [...STANDARD_TIME_SLOTS]
  },
  {
    date: '2026-09-27',
    isBlocked: true,
    slots: [],
    note: 'Booked - unavailable'
  },
  {
    date: '2026-09-28',
    isBlocked: false,
    slots: [...STANDARD_TIME_SLOTS]
  },
  {
    date: '2026-09-29',
    isBlocked: true,
    slots: [],
    note: 'Booked - unavailable'
  },
  {
    date: '2026-09-30',
    isBlocked: false,
    slots: [...STANDARD_TIME_SLOTS]
  }
];
