"use strict";
window.TAX_DATA = Object.freeze({
  year: 2025,
  official: {
    form1040: "https://www.irs.gov/pub/irs-pdf/f1040.pdf",
    form1040Prior: "https://www.irs.gov/pub/irs-prior/f1040--2025.pdf",
    form1040SR: "https://www.irs.gov/pub/irs-prior/f1040s--2025.pdf",
    schedule1: "https://www.irs.gov/pub/irs-prior/f1040s1--2025.pdf",
    schedule1A: "https://www.irs.gov/pub/irs-pdf/f1040s1a.pdf",
    schedule2: "https://www.irs.gov/pub/irs-pdf/f1040s2.pdf",
    schedule3: "https://www.irs.gov/pub/irs-pdf/f1040s3.pdf",
    scheduleA: "https://www.irs.gov/pub/irs-pdf/f1040sa.pdf",
    scheduleB: "https://www.irs.gov/pub/irs-pdf/f1040sb.pdf",
    scheduleC: "https://www.irs.gov/pub/irs-pdf/f1040sc.pdf",
    scheduleD: "https://www.irs.gov/pub/irs-pdf/f1040sd.pdf",
    scheduleE: "https://www.irs.gov/pub/irs-pdf/f1040se.pdf",
    scheduleSE: "https://www.irs.gov/pub/irs-pdf/f1040sse.pdf",
    schedule8812: "https://www.irs.gov/pub/irs-pdf/f1040s8.pdf",
    instructions1040: "https://www.irs.gov/instructions/i1040gi",
    instructionsC: "https://www.irs.gov/instructions/i1040sc",
    instructionsSE: "https://www.irs.gov/instructions/i1040sse",
    forms: "https://www.irs.gov/forms-instructions"
  },
  standardDeduction: { single: 15750, mfj: 31500, mfs: 15750, hoh: 23625, qss: 31500 },
  brackets: {
    single: [[11925,.10],[48475,.12],[103350,.22],[197300,.24],[250525,.32],[626350,.35],[Infinity,.37]],
    mfj: [[23850,.10],[96950,.12],[206700,.22],[394600,.24],[501050,.32],[751600,.35],[Infinity,.37]],
    mfs: [[11925,.10],[48475,.12],[103350,.22],[197300,.24],[250525,.32],[375800,.35],[Infinity,.37]],
    hoh: [[17000,.10],[64850,.12],[103350,.22],[197300,.24],[250500,.32],[626350,.35],[Infinity,.37]],
    qss: [[23850,.10],[96950,.12],[206700,.22],[394600,.24],[501050,.32],[751600,.35],[Infinity,.37]]
  },
  additionalStandardDeduction: {
    singleOrHead: { ageOrBlind: 2000, both: 4000 },
    marriedOrQss: { ageOrBlind: 1600, both: 3200 }
  },
  selfEmployment: { socialSecurityWageBase: 176100, netEarningsFactor: .9235, socialSecurityRate: .124, medicareRate: .029, businessMileageRate: .70 },
  schedule1A: {
    tipsMax: 25000,
    tipsMagiThreshold: { single: 150000, joint: 300000, other: 150000 },
    overtimeMax: { single: 12500, joint: 25000, other: 12500 },
    vehicleInterestMax: 10000,
    seniorMaxPerEligiblePerson: 6000,
    seniorMagiThreshold: { single: 75000, joint: 150000, other: 75000 }
  },
  formLinks: [
    { key:"form1040", es:"Formulario 1040", en:"Form 1040" },
    { key:"schedule1", es:"Anexo 1 — Ingresos adicionales y ajustes", en:"Schedule 1 — Additional Income and Adjustments" },
    { key:"schedule1A", es:"Anexo 1-A — Deducciones adicionales", en:"Schedule 1-A — Additional Deductions" },
    { key:"schedule2", es:"Anexo 2 — Impuestos adicionales", en:"Schedule 2 — Additional Taxes" },
    { key:"schedule3", es:"Anexo 3 — Créditos y pagos adicionales", en:"Schedule 3 — Additional Credits and Payments" },
    { key:"scheduleA", es:"Anexo A — Deducciones detalladas", en:"Schedule A — Itemized Deductions" },
    { key:"scheduleB", es:"Anexo B — Intereses y dividendos", en:"Schedule B — Interest and Ordinary Dividends" },
    { key:"scheduleC", es:"Anexo C — Ganancias o pérdidas del negocio", en:"Schedule C — Profit or Loss From Business" },
    { key:"scheduleD", es:"Anexo D — Ganancias y pérdidas de capital", en:"Schedule D — Capital Gains and Losses" },
    { key:"scheduleSE", es:"Anexo SE — Impuesto por cuenta propia", en:"Schedule SE — Self-Employment Tax" },
    { key:"schedule8812", es:"Anexo 8812 — Créditos por hijos y dependientes", en:"Schedule 8812 — Credits for Qualifying Children and Other Dependents" }
  ],
  limitations: [
    { id:"nonresident", es:"Esta herramienta está diseñada principalmente para declaraciones federales individuales de residentes fiscales de EE. UU. Los no residentes suelen usar Form 1040-NR y necesitan una revisión distinta.", en:"This tool is primarily designed for U.S. tax residents filing individual federal returns. Nonresidents generally use Form 1040-NR and need a different review." },
    { id:"businessEntity", es:"Corporaciones, sociedades, elecciones S corporation, K-1 complejos y negocios con nómina requieren formularios y análisis adicionales.", en:"Corporations, partnerships, S corporation elections, complex K-1s, and businesses with payroll require additional forms and analysis." },
    { id:"credits", es:"Créditos como EITC, Child Tax Credit, educación, adopción, cuidado de dependientes y primas de seguro requieren pruebas específicas. No se conceden automáticamente por contar dependientes.", en:"Credits such as EITC, Child Tax Credit, education, adoption, dependent care, and premium credits require specific eligibility tests. They are not granted automatically based on dependent count." },
    { id:"income", es:"Pensiones, distribuciones IRA, alquileres, agricultura, criptomonedas, ingresos extranjeros, ganancias de capital complejas, AMT y deducciones especializadas pueden requerir anexos y hojas de cálculo adicionales.", en:"Pensions, IRA distributions, rentals, farming, cryptocurrency, foreign income, complex capital gains, AMT, and specialized deductions may require additional schedules and worksheets." }
  ]
});
