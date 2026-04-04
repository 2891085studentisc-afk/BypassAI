
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const HIGH_TRAFFIC_COMPANIES = [
  { name: "Sky", contact: "Exec: ann-marie.mackay@sky.uk", successRate: 92 },
  { name: "Amazon", contact: "Exec: ajassy@amazon.com", successRate: 88 },
  { name: "Virgin Media", contact: "Exec: lutz.schueler@virginmedia.co.uk", successRate: 85 },
  { name: "HSBC", contact: "Exec: customerrelations@hsbc.com", successRate: 82 },
  { name: "Barclays", contact: "CEO office: group chief executive (Barclays plc, London) — annual report governance", successRate: 78 },
  { name: "Vodafone", contact: "Exec: ahmed.essam@vodafone.com", successRate: 84 },
  { name: "EE", contact: "Exec: marc.allera@bt.com", successRate: 86 },
  { name: "British Gas", contact: "Exec: chris.o'shea@centrica.com", successRate: 81 },
  { name: "O2", contact: "CEO / MD: Virgin Media O2 (executive office, UK HQ) — regulator escalations CISAS", successRate: 79 },
  { name: "Tesco", contact: "CEO office: Tesco PLC registered office & executive correspondence (Welwyn)", successRate: 83 },
  { name: "Ryanair", contact: "CEO: Michael O’Leary office — investor / corporate affairs (Ryanair Holdings)", successRate: 75 },
  { name: "BT", contact: "Group CEO office: BT Group plc (London) — Ofcom escalations where applicable", successRate: 80 },
  { name: "TalkTalk", contact: "Executive team: TalkTalk Group — Companies House registered office route", successRate: 77 },
  { name: "Three", contact: "CEO: Three UK (CK Hutchison) — executive complaints escalation", successRate: 78 },
  { name: "Lloyds Bank", contact: "Group CEO: Lloyds Banking Group plc — executive complaints / FOS route", successRate: 82 },
  { name: "NatWest", contact: "Group CEO: NatWest Group plc — executive correspondence & FOS", successRate: 81 },
  { name: "Halifax", contact: "Part of Lloyds Banking Group — group CEO office escalations", successRate: 82 },
  { name: "Nationwide Building Society", contact: "Chief Executive: Nationwide Building Society (Swindon HQ)", successRate: 85 },
  { name: "Santander UK", contact: "CEO: Santander UK — executive office & FOS escalations", successRate: 80 },
  { name: "Scottish Power", contact: "CEO: Scottish Power Ltd — energy ombudsman / executive route", successRate: 76 },
  { name: "E.ON Next", contact: "CEO: E.ON UK / Next — energy ombudsman escalations", successRate: 79 },
  { name: "Octopus Energy", contact: "CEO: Octopus Energy Group — executive & Ofgem escalations", successRate: 91 },
  { name: "EDF Energy", contact: "UK CEO: EDF Energy — energy ombudsman route", successRate: 78 },
  { name: "Ovo Energy", contact: "CEO: OVO Group — executive complaints & Ofgem", successRate: 77 },
  { name: "Thames Water", contact: "CEO office: Thames Water — Ofwat / CCW escalations", successRate: 72 },
  { name: "Royal Mail", contact: "CEO: International Distributions Services plc — Postal Redress scheme", successRate: 74 },
  { name: "Evri", contact: "CEO office: Evri — retail ADR / ombudsman where applicable", successRate: 68 },
  { name: "DPD", contact: "UK CEO: DPDgroup UK — parcel ombudsman / executive route", successRate: 82 },
  { name: "DHL", contact: "Country management: DHL Express UK — executive escalations", successRate: 81 },
  { name: "Currys", contact: "CEO: Currys plc — investor relations / executive correspondence", successRate: 76 },
  { name: "Argos", contact: "Part of Sainsbury’s — group CEO office escalations", successRate: 79 },
  { name: "John Lewis", contact: "Executive team: John Lewis Partnership — chair / partnership council route", successRate: 88 },
  { name: "ASOS", contact: "CEO: ASOS plc — London HQ executive correspondence", successRate: 82 },
  { name: "Openreach", contact: "CEO: Openreach (BT Group) — Ofcom escalations", successRate: 79 },
  { name: "Plusnet", contact: "Part of BT Group — group CEO / executive complaints", successRate: 83 },
  { name: "Shell Energy", contact: "UK executive: Shell Energy Retail — Ombudsman route", successRate: 77 },
  { name: "Utilita", contact: "CEO: Utilita Energy — energy ombudsman escalations", successRate: 74 },
  { name: "Co-operative Group", contact: "CEO: Co-operative Group — member / executive route", successRate: 84 },
  { name: "Avanti West Coast", contact: "Managing Director: First Trenitalia / Avanti — Transport Focus", successRate: 73 },
  { name: "Southeastern", contact: "Managing Director: Southeastern (Govia) — Transport Focus", successRate: 75 },
  { name: "Southern Railway", contact: "Managing Director: GTR / Southern — Transport Focus", successRate: 75 },
  { name: "Northern Trains", contact: "Managing Director: Northern Trains — Transport Focus", successRate: 72 },
  { name: "Uber", contact: "UK GM: Uber UK — in-app escalations & ADR", successRate: 80 },
  { name: "Deliveroo", contact: "CEO: Deliveroo plc — UK executive correspondence", successRate: 78 },
  { name: "Just Eat", contact: "CEO: Just Eat Takeaway.com — UK executive route", successRate: 76 },
  { name: "McDonald's", contact: "UK CEO: McDonald’s UK — corporate affairs / executive office", successRate: 81 },
  { name: "British Airways", contact: "CEO: British Airways (IAG) — CAA / ADR escalations", successRate: 74 },
  { name: "easyJet", contact: "CEO: easyJet plc — executive complaints & ADR", successRate: 76 },
  { name: "PayPal", contact: "Executive escalations: PayPal Europe — Financial Ombudsman Service (UK)", successRate: 82 },
  { name: "Netflix", contact: "UK public policy / member support — executive escalations via help centre", successRate: 79 },
];

async function main() {
  console.log('Seed starting...')
  for (const c of HIGH_TRAFFIC_COMPANIES) {
    await prisma.company.upsert({
      where: { name: c.name },
      update: { 
        contact: c.contact,
        successRate: c.successRate,
        isActive: true
      },
      create: { 
        name: c.name, 
        contact: c.contact,
        successRate: c.successRate,
        isActive: true
      },
    })
  }
  console.log('Seed finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
