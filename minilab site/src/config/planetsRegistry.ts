import { PlanetConfig } from '../types/solarSystem';

export const CREATOR_PROFILE = {
  domain: 'minilab.app',
  name: 'Lucas Leite',
  location: 'Brooklyn, New York City',
  coordinates: '40.6782° N, 73.9442° W',
  email: 'lucas.lab118@gmail.com',
  currentRoleBadge: 'NOW: ART DEPT. PA — NETFLIX SERIES, NYC',
  currentRoleSummary:
    'Art Department Production Assistant (Art PA) for a Netflix series in NYC, operating at the intersection of physical set production, visual continuity, and creative technology.',
  previousExperienceSummary:
    '10+ years in high-volume General & Administrative Operations, budget/vendor logistics, and B2B Google Cloud consulting, grounded in an early career foundation in audiovisual videography and editing.'
};

export const PLANETS_REGISTRY: PlanetConfig[] = [
  {
    id: 'sol',
    sectionIndex: 0,
    code: '00 // HELIOS-CORE',
    name: 'SOL',
    subtitle: 'Core System & Overview',
    orbitTitle: 'Origin // minilab.app',
    cardSide: 'left',
    solarSystemParkedSide: 'right',
    orbitRadius: 0,
    bodyRadius: 24,
    baseAngle: 0,
    orbitalSpeed: 0.25,
    axialTiltDeg: 7.25,
    canvasCallout: 'SOL // CORE [NYC]',
    telemetryCoords: 'RA 00h 00m // DECL +00.0° // 90° PLAN',
    summary:
      'Central hub and mission control for minilab.app experiments, creative technology, and portfolio projects by Lucas Leite.',
    specs: [
      { label: 'CREATOR', value: 'Lucas Leite' },
      { label: 'LOCATION', value: 'Brooklyn, NYC' },
      { label: 'ROLE', value: 'Art Dept. PA — Netflix' },
      { label: 'STATUS', value: 'System Operational' }
    ],
    trajectory: [
      {
        code: 'NOW // NYC',
        era: 'CURRENT ROLE',
        role: 'Art Department Production Assistant — Netflix Series (NYC)',
        context: 'Physical set production, visual continuity, and creative technology.',
        highlight: true
      },
      {
        code: '10+ YRS // OPS',
        era: 'OPERATIONS',
        role: 'G&A Operations, Vendor Logistics & B2B Google Cloud Consulting',
        context: '10+ years in high-volume operations and enterprise cloud advisory.'
      },
      {
        code: 'ORIGIN // AV',
        era: 'EARLY CRAFT',
        role: 'Audiovisual Videography & Editing',
        context: 'Visual composition, camera operation, and post-production foundations.'
      }
    ],
    moons: [],
    miniApps: [
      {
        id: 'slot-sol',
        title: 'Core Telemetry Slot',
        tag: 'SLOT-00',
        status: 'ORBITAL SLOT',
        description: 'Available slot for central hub telemetry, project router, or profile overview.',
        actionLabel: 'CONFIGURE SLOT',
        inputs: [
          {
            key: 'slotNotes',
            label: 'SLOT CONFIGURATION NOTE',
            placeholder: 'Notes for this slot...',
            defaultValue: 'Hub & Overview slot'
          }
        ],
        sampleOutputs: {
          'Hub & Overview slot': [
            '[STATUS] Slot ready for configuration.',
            '[INFO] Ready to integrate upcoming apps or custom router.'
          ]
        }
      }
    ]
  },
  {
    id: 'mercury',
    sectionIndex: 1,
    code: '01 // MERC-01',
    name: 'MERCURY',
    subtitle: 'Orbital Slot 01',
    orbitTitle: 'Inner Orbit // Slot 01',
    cardSide: 'right',
    solarSystemParkedSide: 'left',
    orbitRadius: 56,
    bodyRadius: 7.5,
    baseAngle: 0.85,
    orbitalSpeed: 1.55,
    axialTiltDeg: 2.1,
    canvasCallout: 'MERC-01 // SLOT 01',
    telemetryCoords: '0.39 AU // READY FOR INTEGRATION',
    summary:
      'Reserved slot for fast utilities, text/script tools, or quick interaction mini-apps.',
    specs: [
      { label: 'SLOT ID', value: 'MERC-01' },
      { label: 'TYPE', value: 'Modular Mini-App Slot' },
      { label: 'STATUS', value: 'Ready to wire' },
      { label: 'LATENCY', value: 'Fast Path' }
    ],
    moons: [],
    miniApps: [
      {
        id: 'slot-mercury',
        title: 'Mercury Mini-App Slot',
        tag: 'SLOT-01',
        status: 'ORBITAL SLOT',
        description: 'Clean modular container ready to connect your app or experiment.',
        actionLabel: 'CONFIGURE MERCURY APP',
        inputs: [
          {
            key: 'appTarget',
            label: 'APP TARGET / REPO',
            placeholder: 'e.g. Script Tool, Bar Ordering App, etc.',
            defaultValue: 'New Mini-App Experiment'
          }
        ],
        sampleOutputs: {
          'New Mini-App Experiment': [
            '[SLOT 01] Mercury container awaiting integration.',
            '[CONFIG] Connect your GitHub repository or component in src/config/planetsRegistry.ts.'
          ]
        }
      }
    ]
  },
  {
    id: 'venus',
    sectionIndex: 2,
    code: '02 // VEN-02',
    name: 'VENUS',
    subtitle: 'Orbital Slot 02',
    orbitTitle: 'Visual & Concept Slot',
    cardSide: 'left',
    solarSystemParkedSide: 'right',
    orbitRadius: 92,
    bodyRadius: 10.5,
    baseAngle: 2.35,
    orbitalSpeed: 1.15,
    axialTiltDeg: 177.3,
    canvasCallout: 'VEN-02 // SLOT 02',
    telemetryCoords: '0.72 AU // READY FOR INTEGRATION',
    summary:
      'Reserved slot for visual experiments, interface design tools, or creative mini-apps.',
    specs: [
      { label: 'SLOT ID', value: 'VEN-02' },
      { label: 'TYPE', value: 'Visual / Concept Slot' },
      { label: 'STATUS', value: 'Ready to wire' },
      { label: 'TARGET', value: 'Pending Config' }
    ],
    moons: [],
    miniApps: [
      {
        id: 'slot-venus',
        title: 'Venus Mini-App Slot',
        tag: 'SLOT-02',
        status: 'ORBITAL SLOT',
        description: 'Clean modular container ready to host visual or interactive tools.',
        actionLabel: 'CONFIGURE VENUS APP',
        inputs: [
          {
            key: 'appTarget',
            label: 'APP TARGET / REPO',
            placeholder: 'e.g. Visual Tool, Bar Ordering App, etc.',
            defaultValue: 'New Visual Project'
          }
        ],
        sampleOutputs: {
          'New Visual Project': [
            '[SLOT 02] Venus container ready.',
            '[CONFIG] Ready to link component or external app.'
          ]
        }
      }
    ]
  },
  {
    id: 'earth',
    sectionIndex: 3,
    code: '03 // TERRA-NYC',
    name: 'EARTH + LUNA',
    subtitle: 'NYC Hub & Roombase Slot',
    orbitTitle: 'Brooklyn, NYC // Active Apps',
    cardSide: 'right',
    solarSystemParkedSide: 'left',
    orbitRadius: 132,
    bodyRadius: 12,
    baseAngle: 3.9,
    orbitalSpeed: 0.92,
    axialTiltDeg: 23.44,
    canvasCallout: 'TERRA-03 // NYC [40.67°N, 73.94°W]',
    telemetryCoords: '1.00 AU // BROOKLYN, NY // READY',
    summary:
      'Home base for core active projects, including Roombase (finance management app) and NYC-based applications.',
    specs: [
      { label: 'PROJECT', value: 'Roombase / Finance Hub' },
      { label: 'LOCATION', value: 'Brooklyn, NYC' },
      { label: 'SATELLITE', value: 'Luna-01 (Sub-module)' },
      { label: 'STATUS', value: 'Ready to wire' }
    ],
    moons: [
      {
        id: 'luna',
        name: 'Luna',
        code: 'LUNA-01',
        orbitRadius: 24,
        radius: 3.3,
        baseAngle: 1.1,
        orbitalSpeed: 3.2,
        roleLabel: 'Sub-Module Slot'
      }
    ],
    miniApps: [
      {
        id: 'roombase-slot',
        title: 'Roombase — Financial Control App Slot',
        tag: 'APP-ROOMBASE',
        status: 'ORBITAL SLOT',
        moonHost: 'Luna',
        description: 'Reserved container for Roombase finance and expense tracking integration.',
        actionLabel: 'OPEN ROOMBASE CONFIG',
        inputs: [
          {
            key: 'moduleSelect',
            label: 'ROOMBASE MODULE TARGET',
            placeholder: 'Select module...',
            defaultValue: 'Expense Tracking & Budget Engine',
            options: [
              'Expense Tracking & Budget Engine',
              'Shared Balances & Splitting',
              'Analytics & Financial Dashboard'
            ]
          }
        ],
        sampleOutputs: {
          'Expense Tracking & Budget Engine': [
            '[ROOMBASE SLOT] Ready to embed your Roombase application.',
            '[INTEGRATION] Can be embedded as an iframe, linked via GitHub, or loaded as a React component.'
          ]
        }
      }
    ]
  },
  {
    id: 'mars',
    sectionIndex: 4,
    code: '04 // MARS-04',
    name: 'MARS + MOONS',
    subtitle: 'Bar Ordering & Ops Slot',
    orbitTitle: 'Interactive Apps // Bar Orders',
    cardSide: 'left',
    solarSystemParkedSide: 'right',
    orbitRadius: 174,
    bodyRadius: 9.5,
    baseAngle: 5.2,
    orbitalSpeed: 0.72,
    axialTiltDeg: 25.19,
    canvasCallout: 'MARS-04 // BAR APP SLOT',
    telemetryCoords: '1.52 AU // READY FOR INTEGRATION',
    summary:
      'Reserved slot for your Bar Ordering app (from GitHub) and operational workflow utilities.',
    specs: [
      { label: 'TARGET APP', value: 'Bar Ordering App' },
      { label: 'SOURCE', value: 'GitHub Integration' },
      { label: 'MOON 01', value: 'Phobos (Orders)' },
      { label: 'MOON 02', value: 'Deimos (Menu / Tab)' }
    ],
    moons: [
      {
        id: 'phobos',
        name: 'Phobos',
        code: 'PHOB-01',
        orbitRadius: 18,
        radius: 2.5,
        baseAngle: 0.6,
        orbitalSpeed: 4.1,
        roleLabel: 'Order Queue Slot'
      },
      {
        id: 'deimos',
        name: 'Deimos',
        code: 'DEIM-02',
        orbitRadius: 27,
        radius: 2.1,
        baseAngle: 3.7,
        orbitalSpeed: 2.6,
        roleLabel: 'Menu & Tab Slot'
      }
    ],
    miniApps: [
      {
        id: 'bar-order-app-slot',
        title: 'Bar Ordering App Slot',
        tag: 'APP-BAR',
        status: 'ORBITAL SLOT',
        moonHost: 'Phobos & Deimos',
        description: 'Reserved container ready to integrate your GitHub bar ordering application.',
        actionLabel: 'OPEN BAR APP CONFIG',
        inputs: [
          {
            key: 'appMode',
            label: 'BAR APP INTEGRATION MODE',
            placeholder: 'Select mode...',
            defaultValue: 'Connect GitHub Repo & Live Preview',
            options: [
              'Connect GitHub Repo & Live Preview',
              'Embed Interactive Order Simulator',
              'Direct App Link / Webhook'
            ]
          }
        ],
        sampleOutputs: {
          'Connect GitHub Repo & Live Preview': [
            '[BAR APP SLOT] Ready to connect your GitHub bar ordering project.',
            '[NEXT STEP] We can import the components or embed the app preview here.'
          ]
        }
      }
    ]
  },
  {
    id: 'jupiter',
    sectionIndex: 5,
    code: '05 // JOVE-05',
    name: 'JUPITER + 4 MOONS',
    subtitle: 'Multi-Agent & Experiments Slot',
    orbitTitle: 'Galilean Moons Swarm',
    cardSide: 'right',
    solarSystemParkedSide: 'left',
    orbitRadius: 226,
    bodyRadius: 17.5,
    baseAngle: 1.55,
    orbitalSpeed: 0.52,
    axialTiltDeg: 3.13,
    canvasCallout: 'JOVE-05 // 4 MOON SLOTS',
    telemetryCoords: '5.20 AU // 4 MODULAR SLOTS READY',
    summary:
      'Heavy-compute gas giant where each of the 4 Galilean moons can host an independent project or sub-agent.',
    specs: [
      { label: 'SLOT 01', value: 'Io (Sub-module A)' },
      { label: 'SLOT 02', value: 'Europa (Sub-module B)' },
      { label: 'SLOT 03', value: 'Ganymede (Sub-module C)' },
      { label: 'SLOT 04', value: 'Callisto (Sub-module D)' }
    ],
    moons: [
      {
        id: 'io',
        name: 'Io',
        code: 'IO-01',
        orbitRadius: 24,
        radius: 2.8,
        baseAngle: 0.4,
        orbitalSpeed: 4.5,
        roleLabel: 'Sub-Module A'
      },
      {
        id: 'europa',
        name: 'Europa',
        code: 'EUR-02',
        orbitRadius: 31,
        radius: 2.6,
        baseAngle: 2.0,
        orbitalSpeed: 3.4,
        roleLabel: 'Sub-Module B'
      },
      {
        id: 'ganymede',
        name: 'Ganymede',
        code: 'GAN-03',
        orbitRadius: 39,
        radius: 3.4,
        baseAngle: 3.8,
        orbitalSpeed: 2.5,
        roleLabel: 'Sub-Module C'
      },
      {
        id: 'callisto',
        name: 'Callisto',
        code: 'CAL-04',
        orbitRadius: 47,
        radius: 3.0,
        baseAngle: 5.1,
        orbitalSpeed: 1.8,
        roleLabel: 'Sub-Module D'
      }
    ],
    miniApps: [
      {
        id: 'jupiter-swarm-slot',
        title: 'Jupiter 4-Node Swarm Slot',
        tag: 'SLOT-05',
        status: 'ORBITAL SLOT',
        moonHost: 'Io • Europa • Ganymede • Callisto',
        description: 'Multi-node slot ready to connect up to 4 parallel tools, APIs, or experiments.',
        actionLabel: 'CONFIGURE JUPITER SLOTS',
        inputs: [
          {
            key: 'slotSetup',
            label: 'SLOT CLUSTER TARGET',
            placeholder: 'Select target...',
            defaultValue: 'Multi-Tool Hub (4 Sub-Projects)',
            options: [
              'Multi-Tool Hub (4 Sub-Projects)',
              'Parallel API Pipeline',
              'Modular Experiment Sandbox'
            ]
          }
        ],
        sampleOutputs: {
          'Multi-Tool Hub (4 Sub-Projects)': [
            '[JUPITER SLOTS] 4 satellite nodes ready for custom assignments.',
            '[AVAILABLE] Connect separate tools to Io, Europa, Ganymede, and Callisto.'
          ]
        }
      }
    ]
  },
  {
    id: 'saturn',
    sectionIndex: 6,
    code: '06 // SATURN-06',
    name: 'SATURN + RINGS & TITAN',
    subtitle: '3D & Spatial Slot',
    orbitTitle: 'Ring System & Titan',
    cardSide: 'left',
    solarSystemParkedSide: 'right',
    orbitRadius: 282,
    bodyRadius: 15,
    baseAngle: 4.45,
    orbitalSpeed: 0.38,
    axialTiltDeg: 26.73,
    hasRings: true,
    ringInnerRadius: 22,
    ringOuterRadius: 38,
    canvasCallout: 'SATURN-06 // SPATIAL SLOT',
    telemetryCoords: '9.58 AU // TITAN-01 // READY',
    summary:
      'Reserved slot for 3D graphics, CAD models, spatial computing, or interactive shader experiments.',
    specs: [
      { label: 'SLOT ID', value: 'SATURN-06' },
      { label: 'FEATURE', value: 'Cassini Rings Grid' },
      { label: 'MOON', value: 'Titan-01' },
      { label: 'STATUS', value: 'Ready to wire' }
    ],
    moons: [
      {
        id: 'titan',
        name: 'Titan',
        code: 'TITAN-01',
        orbitRadius: 46,
        radius: 3.5,
        baseAngle: 2.4,
        orbitalSpeed: 2.1,
        roleLabel: 'Spatial Sub-Module'
      }
    ],
    miniApps: [
      {
        id: 'saturn-spatial-slot',
        title: '3D & Spatial Experiment Slot',
        tag: 'SLOT-06',
        status: 'ORBITAL SLOT',
        moonHost: 'Titan + Cassini Rings',
        description: 'Container for 3D viewers, architectural spatial plans, or canvas experiments.',
        actionLabel: 'CONFIGURE 3D SLOT',
        inputs: [
          {
            key: 'rendererTarget',
            label: 'EXPERIMENT VECTOR',
            placeholder: 'Select vector...',
            defaultValue: 'Three.js / WebGL / Spatial Model Viewer',
            options: [
              'Three.js / WebGL / Spatial Model Viewer',
              'CAD Blueprint Floorplan Generator',
              'Custom Canvas Shader Tool'
            ]
          }
        ],
        sampleOutputs: {
          'Three.js / WebGL / Spatial Model Viewer': [
            '[SATURN SLOT] Ready for 3D or spatial tool integration.',
            '[INFO] Direct 25° perspective camera locked on Saturn and rings.'
          ]
        }
      }
    ]
  },
  {
    id: 'outer',
    sectionIndex: 7,
    code: '07 // OUTER-07/08',
    name: 'URANUS & NEPTUNE',
    subtitle: 'Future Slots & Contact',
    orbitTitle: 'Expansion Slots // Brooklyn, NY',
    cardSide: 'right',
    solarSystemParkedSide: 'left',
    orbitRadius: 334,
    bodyRadius: 12.5,
    baseAngle: 2.9,
    orbitalSpeed: 0.24,
    axialTiltDeg: 97.77,
    hasRings: true,
    ringInnerRadius: 16,
    ringOuterRadius: 21,
    canvasCallout: 'OUTER-07/08 // CONTACT & SLOTS',
    telemetryCoords: '19.2–30.1 AU // LUCAS.LAB118@GMAIL.COM',
    summary:
      'Expansion slots for upcoming projects, paired with direct contact info for Lucas Leite.',
    specs: [
      { label: 'CREATOR', value: 'Lucas Leite' },
      { label: 'LOCATION', value: 'Brooklyn, NYC' },
      { label: 'EMAIL', value: 'lucas.lab118@gmail.com' },
      { label: 'SLOTS', value: 'Uranus & Neptune Ready' }
    ],
    moons: [
      {
        id: 'triton',
        name: 'Triton',
        code: 'TRITON-08',
        orbitRadius: 28,
        radius: 2.7,
        baseAngle: 1.8,
        orbitalSpeed: -2.2,
        roleLabel: 'Frontier Relay'
      }
    ],
    miniApps: [
      {
        id: 'outer-contact-slot',
        title: 'Contact Terminal & Upcoming Project Slot',
        tag: 'SLOT-07',
        status: 'ORBITAL SLOT',
        moonHost: 'Triton Relay',
        description: 'Direct contact link and expansion slot for upcoming projects.',
        actionLabel: 'DISPATCH EMAIL',
        inputs: [
          {
            key: 'inquiry',
            label: 'SUBJECT / INQUIRY',
            placeholder: 'Subject...',
            defaultValue: 'Collaboration & Project Inquiry'
          }
        ],
        sampleOutputs: {
          'Collaboration & Project Inquiry': [
            '[CONTACT] Lucas Leite — Brooklyn, NYC <lucas.lab118@gmail.com>',
            '[SLOT] Outer frontier slots ready for future developments.'
          ]
        }
      }
    ]
  }
];
