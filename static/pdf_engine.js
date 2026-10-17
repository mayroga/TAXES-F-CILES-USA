"use strict";
(function(){
const D=window.TAX_DATA;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const usd=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(Number(n)||0);
const labels={
  es:{title:"GUÍA EDUCATIVA DE IMPUESTOS FEDERALES",fictional:"EJEMPLO EDUCATIVO — NO ES UN FORMULARIO OFICIAL DEL IRS",year:"Año fiscal",status:"Estado civil fiscal",income:"Ingresos totales estimados",agi:"Ingreso bruto ajustado estimado (AGI)",deduction:"Deducción utilizada",extra:"Deducciones adicionales estimadas (Schedule 1-A)",taxable:"Ingreso tributable estimado",regularTax:"Impuesto federal ordinario estimado",seTax:"Impuesto por cuenta propia estimado",tax:"Impuesto estimado antes de otros créditos e impuestos",payments:"Pagos y retenciones introducidos",balance:"Diferencia preliminar",steps:"Cómo leer este resultado",warnings:"Advertencias que debes revisar",checks:"Lista de verificación",forms:"Formularios originales e instrucciones del IRS",source:"Fuentes oficiales",note:"Esta guía no es una declaración, no reemplaza los formularios originales y no se envía al IRS. Las cantidades dependen de los datos introducidos y de cálculos que requieren verificación adicional.",positive:"Posible saldo a pagar",negative:"Posible exceso de pagos",zero:"Saldo aproximado cero",explain:"Explicación del cálculo"},
  en:{title:"FEDERAL TAX EDUCATIONAL GUIDE",fictional:"EDUCATIONAL EXAMPLE — NOT AN OFFICIAL IRS FORM",year:"Tax year",status:"Filing status",income:"Estimated total income",agi:"Estimated adjusted gross income (AGI)",deduction:"Deduction used",extra:"Estimated additional deductions (Schedule 1-A)",taxable:"Estimated taxable income",regularTax:"Estimated regular federal income tax",seTax:"Estimated self-employment tax",tax:"Estimated tax before other credits and taxes",payments:"Payments and withholding entered",balance:"Preliminary difference",steps:"How to read this result",warnings:"Warnings to review",checks:"Review checklist",forms:"Original IRS forms and instructions",source:"Official sources",note:"This guide is not a tax return, does not replace original forms, and is not submitted to the IRS. Amounts depend on entered data and calculations requiring further verification.",positive:"Possible balance due",negative:"Possible overpayment",zero:"Approximate zero balance",explain:"Calculation explanation"}
};
function generate(result,lang="es"){
  if(!result)throw new Error("No hay resultados para imprimir.");
  const l=labels[lang]||labels.es,t=result.totals,bal=t.balance;
  const balanceLabel=bal>0?l.positive:bal<0?l.negative:l.zero;
  const warnings=result.warnings||[],checks=result.checks||[],explanations=result.explanations||[];
  const formLinks=D.formLinks.map(f=>`<li><a href="${esc(D.official[f.key])}" target="_blank" rel="noopener">${esc(lang==="en"?f.en:f.es)}</a></li>`).join("");
  const rows=[
    [l.income,t.totalIncome],[l.agi,t.agi],[l.deduction,t.deductionUsed],[l.extra,t.schedule1ADeduction],
    [l.taxable,t.taxableIncome],[l.regularTax,t.regularTax],[l.seTax,t.seTax],[l.tax,t.estimatedTax],[l.payments,t.totalPayments],[balanceLabel,bal]
  ];
  const rowHtml=rows.map(([label,value])=>`<tr><th>${esc(label)}</th><td>${esc(usd(value))}</td></tr>`).join("");
  const section=(title,items)=>`<h2>${esc(title)}</h2><ul>${items.map(v=>`<li>${esc(v)}</li>`).join("")}</ul>`;
  const doc=`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(l.title)}</title><meta name="viewport" content="width=device-width"><style>body{font:12pt Arial,sans-serif;max-width:850px;margin:25px auto;color:#172b3a;line-height:1.45}h1{font-size:22pt}h2{font-size:15pt;margin-top:25px}table{border-collapse:collapse;width:100%}th,td{padding:9px;border:1px solid #aaa;text-align:left}td{text-align:right}th{background:#eef2f5}.banner{border:2px solid #a22;padding:12px;font-weight:bold;color:#8a1c1c}.note{border:1px solid #888;padding:12px}.no-print{margin:20px 0}a{overflow-wrap:anywhere}@media print{body{margin:0;max-width:none}.no-print{display:none}a{color:black;text-decoration:none}a:after{content:" (" attr(href) ")";font-size:8pt;overflow-wrap:anywhere}}</style></head><body><h1>${esc(l.title)}</h1><div class="banner">${esc(l.fictional)}</div><p><strong>${esc(l.year)}:</strong> 2025<br><strong>${esc(l.status)}:</strong> ${esc(result.statusLabel)}</p><div class="note">${esc(l.note)}</div><h2>${esc(l.steps)}</h2><table><tbody>${rowHtml}</tbody></table>${section(l.explain,explanations)}${section(l.warnings,warnings)}${section(l.checks,checks)}<h2>${esc(l.forms)}</h2><p>${lang==="en"?"Open the appropriate original form and its instructions. The links below do not mean the PDF has been filled in.":"Abre el formulario original apropiado y sus instrucciones. Los enlaces siguientes no significan que el PDF haya sido rellenado."}</p><ul>${formLinks}</ul><h2>${esc(l.source)}</h2><ul><li><a href="${esc(D.official.instructions1040)}">Form 1040 instructions</a></li><li><a href="${esc(D.official.instructionsC)}">Schedule C instructions</a></li><li><a href="${esc(D.official.instructionsSE)}">Schedule SE instructions</a></li><li><a href="${esc(D.official.schedule1A)}">Schedule 1-A PDF</a></li></ul><p>${esc(result.disclaimer||"")}</p><div class="no-print"><button onclick="window.print()">Print / Save as PDF</button> <button onclick="window.close()">Close</button></div></body></html>`;
  const w=window.open("","_blank");
  if(!w)throw new Error("El navegador bloqueó la ventana. Permite ventanas emergentes para generar la guía.");
  w.document.open();w.document.write(doc);w.document.close();
  return true;
}
function openOfficialForms(keys){
  const list=(keys&&keys.length?keys:["form1040","schedule1","schedule1A","schedule2","schedule3","scheduleC","scheduleSE"]).filter(k=>D.official[k]);
  list.forEach((k,i)=>setTimeout(()=>window.open(D.official[k],"_blank","noopener"),i*180));
}
window.PdfEngine={generate,openOfficialForms};
})();
