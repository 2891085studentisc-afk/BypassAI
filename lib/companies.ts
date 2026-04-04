export interface TrafficCompany {
  id: string;
  name: string;
  sector: string;
  successRate?: number;
}

export const TOP_50_COMPANIES: TrafficCompany[] = [
  // 1. Telecoms & TV
  { id: "ee", name: "EE", sector: "Telecoms & TV", successRate: 88 },
  { id: "vodafone", name: "Vodafone", sector: "Telecoms & TV", successRate: 82 },
  { id: "talktalk", name: "TalkTalk", sector: "Telecoms & TV", successRate: 75 },
  { id: "o2", name: "O2", sector: "Telecoms & TV", successRate: 84 },
  { id: "three", name: "Three", sector: "Telecoms & TV", successRate: 79 },
  { id: "sky", name: "Sky", sector: "Telecoms & TV", successRate: 91 },
  { id: "sky-mobile", name: "Sky Mobile", sector: "Telecoms & TV", successRate: 89 },
  { id: "sky-broadband", name: "Sky Broadband", sector: "Telecoms & TV", successRate: 87 },
  { id: "virgin-media", name: "Virgin Media", sector: "Telecoms & TV", successRate: 72 },
  { id: "shell-energy", name: "Shell Energy", sector: "Telecoms & TV", successRate: 70 },
  { id: "plusnet", name: "Plusnet", sector: "Telecoms & TV", successRate: 85 },
  { id: "now-tv", name: "NOW TV", sector: "Telecoms & TV", successRate: 81 },
  // 2. Banking & Finance
  { id: "barclays", name: "Barclays", sector: "Banking & Finance", successRate: 78 },
  { id: "lloyds-bank", name: "Lloyds Bank", sector: "Banking & Finance", successRate: 80 },
  { id: "hsbc", name: "HSBC", sector: "Banking & Finance", successRate: 74 },
  { id: "natwest", name: "NatWest", sector: "Banking & Finance", successRate: 76 },
  { id: "santander", name: "Santander", sector: "Banking & Finance", successRate: 77 },
  { id: "monzo", name: "Monzo", sector: "Banking & Finance", successRate: 94 },
  { id: "revolut", name: "Revolut", sector: "Banking & Finance", successRate: 86 },
  { id: "starling-bank", name: "Starling Bank", sector: "Banking & Finance", successRate: 95 },
  { id: "nationwide", name: "Nationwide", sector: "Banking & Finance", successRate: 88 },
  { id: "tsb", name: "TSB", sector: "Banking & Finance", successRate: 71 },
  { id: "halifax", name: "Halifax", sector: "Banking & Finance", successRate: 79 },
  { id: "bank-of-scotland", name: "Bank of Scotland", sector: "Banking & Finance", successRate: 79 },
  { id: "chase-uk", name: "Chase UK", sector: "Banking & Finance", successRate: 92 },
  // 3. Insurance & Pensions
  { id: "admiral", name: "Admiral", sector: "Insurance & Pensions", successRate: 83 },
  { id: "aviva", name: "Aviva", sector: "Insurance & Pensions", successRate: 85 },
  { id: "direct-line", name: "Direct Line", sector: "Insurance & Pensions", successRate: 81 },
  { id: "axa", name: "Axa", sector: "Insurance & Pensions", successRate: 79 },
  { id: "allianz", name: "Allianz", sector: "Insurance & Pensions", successRate: 77 },
  { id: "saga", name: "Saga", sector: "Insurance & Pensions", successRate: 89 },
  { id: "royal-london", name: "Royal London", sector: "Insurance & Pensions", successRate: 84 },
  { id: "phoenix-life", name: "Phoenix Life", sector: "Insurance & Pensions", successRate: 72 },
  { id: "zurich", name: "Zurich", sector: "Insurance & Pensions", successRate: 82 },
  { id: "lv", name: "Liverpool Victoria (LV=)", sector: "Insurance & Pensions", successRate: 88 },
  // 4. Energy & Utilities
  { id: "british-gas", name: "British Gas", sector: "Energy & Utilities", successRate: 65 },
  { id: "eon-next", name: "E.ON Next", sector: "Energy & Utilities", successRate: 68 },
  { id: "edf-energy", name: "EDF Energy", sector: "Energy & Utilities", successRate: 69 },
  { id: "scottish-power", name: "Scottish Power", sector: "Energy & Utilities", successRate: 64 },
  { id: "ovo-energy", name: "Ovo Energy", sector: "Energy & Utilities", successRate: 67 },
  { id: "octopus-energy", name: "Octopus Energy", sector: "Energy & Utilities", successRate: 92 },
  { id: "thames-water", name: "Thames Water", sector: "Energy & Utilities", successRate: 58 },
  { id: "united-utilities", name: "United Utilities", sector: "Energy & Utilities", successRate: 71 },
  { id: "severn-trent-water", name: "Severn Trent Water", sector: "Energy & Utilities", successRate: 74 },
  { id: "southern-water", name: "Southern Water", sector: "Energy & Utilities", successRate: 60 },
  // 5. Retail & Travel
  { id: "ryanair", name: "Ryanair", sector: "Retail & Travel", successRate: 62 },
  { id: "british-airways", name: "British Airways", sector: "Retail & Travel", successRate: 68 },
  { id: "easyjet", name: "EasyJet", sector: "Retail & Travel", successRate: 71 },
  { id: "amazon-uk", name: "Amazon UK", sector: "Retail & Travel", successRate: 85 },
  { id: "royal-mail", name: "Royal Mail", sector: "Retail & Travel", successRate: 66 },
  { id: "evri", name: "Evri", sector: "Retail & Travel", successRate: 59 },
  { id: "po-ferries", name: "DP World (P&O Ferries)", sector: "Retail & Travel", successRate: 63 },
];