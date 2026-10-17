"use strict";
(function(){
const $=id=>document.getElementById(id);
let lastResult=null;
const translations={
  es:{
    subtitle:"Entiende tus impuestos federales · Año fiscal 2025",intro:"Responde solo lo que sabes. Puedes dejar campos en cero si no corresponden. La aplicación explicará los cálculos y las cuestiones que debes revisar.",
    disclaimer:"Importante: esta aplicación es educativa. No presenta declaraciones, no envía información al IRS y no garantiza reembolsos ni resultados fiscales.",
    privacyNotice:"Privacidad: tus respuestas se calculan en este navegador. No creamos una cuenta ni enviamos tus respuestas fiscales a este servidor. No escribas tu número de Seguro Social, nombre completo ni dirección.",
    statusHeading:"Tu situación familiar",statusLabel:"Estado civil fiscal",statusHelp:"El estado fiscal depende de las reglas del IRS, no solo de cómo te describas.",ageLabel:"Tu edad al final de 2025",ageHelp:"Se usa para revisar reglas para personas de 65 años o más.",spouseAgeLabel:"Edad de tu cónyuge (si corresponde)",blindLabel:"¿Eres legalmente ciego/a según las reglas fiscales?",spouseBlindLabel:"¿Tu cónyuge reúne esa condición?",dependentsLabel:"Número de posibles dependientes",dependentsHelp:"El número por sí solo no determina si alguien califica.",
    incomeHeading:"Ingresos del año",incomeHelp:"Introduce cantidades anuales en dólares. No restes impuestos retenidos de los ingresos.",wagesLabel:"Salarios W-2",interestLabel:"Intereses bancarios imponibles",dividendsLabel:"Dividendos ordinarios",unemploymentLabel:"Compensación por desempleo",socialSecurityLabel:"Beneficios del Seguro Social recibidos",socialSecurityHelp:"La parte imponible requiere un cálculo separado y depende de otros ingresos.",capitalGainLabel:"Ganancia neta de capital (estimada)",capitalGainHelp:"Ventas de inversiones pueden requerir Form 8949 y Schedule D.",otherIncomeLabel:"Otros ingresos imponibles (estimación)",otherIncomeHelp:"Incluye aquí solo cantidades que ya sabes que son imponibles y no has introducido antes.",withholdingLabel:"Impuesto federal retenido en formularios W-2/1099",estimatedPaymentsLabel:"Pagos estimados y otros pagos aplicables",
    deductionHeading:"Deducciones y ajustes",deductionChoiceLabel:"Tipo de deducción",deductionChoiceHelp:"Las deducciones detalladas requieren una revisión de sus categorías y límites.",itemizedLabel:"Total de deducciones detalladas elegibles",adjustmentsLabel:"Otros ajustes deducibles (estimación)",adjustmentsHelp:"No introduzcas aquí de nuevo la mitad del impuesto por cuenta propia si el motor ya la calcula.",tipsLabel:"Propinas que podrían calificar para Schedule 1-A",overtimeLabel:"Compensación por horas extra que podría calificar",vehicleInterestLabel:"Interés de préstamo de vehículo que podría calificar",seniorDeductionLabel:"¿Quieres revisar la deducción adicional para mayores?",schedule1aWarning:"Las deducciones de Schedule 1-A tienen condiciones, límites, requisitos de documentación y posibles reducciones por ingresos. Introducir una cantidad no significa que automáticamente califique.",
    businessHeading:"Trabajo por cuenta propia o pequeño negocio",businessIncomeLabel:"Ingresos brutos del negocio",businessExpensesLabel:"Gastos comerciales potencialmente deducibles",businessMilesLabel:"Millas comerciales documentadas",businessMilesHelp:"Tarifa estándar 2025: $0.70 por milla elegible. No cuentes el mismo vehículo dos veces si ya incluiste el gasto.",mileageMethodLabel:"¿Cómo registraste el vehículo?",businessWarning:"La app ofrece una estimación inicial para un negocio individual sencillo. Depreciación, inventario, uso de vivienda, pérdidas, empleados, elecciones fiscales y otras reglas pueden requerir formularios y cálculos adicionales.",
    reviewHeading:"Revisar y calcular",confirmedText:"He revisado las cantidades y no he contado dos veces los ingresos o gastos.",noSSNText:"No he escrito aquí mi SSN, dirección ni datos personales identificativos.",calculateBtn:"Calcular y explicar",demoBtn:"Cargar ejemplo ficticio",clearBtn:"Borrar todo",verifyHelp:"Los resultados son estimaciones educativas. Verifica los formularios e instrucciones oficiales del año fiscal correspondiente.",resultsHeading:"Tu estimación",printBtn:"Generar guía imprimible",officialBtn:"Ver formularios originales del IRS",editBtn:"Volver a revisar",sourcesHeading:"Fuentes oficiales",footerText:"No afiliado al IRS. Esta herramienta no ofrece asesoramiento legal o fiscal individual, no transmite declaraciones y no garantiza resultados. Las reglas pueden cambiar; confirma siempre las instrucciones oficiales.",
    statusOptions:["Soltero/a","Casado/a, declaración conjunta","Casado/a, declaración separada","Cabeza de familia","Cónyuge sobreviviente que reúne los requisitos"],blindOptions:["No","Sí"],deductionOptions:["Deducción estándar estimada","Deducciones detalladas (Schedule A)"],seniorOptions:["No / no sé si califico","Sí, revisar si califico"],mileageOptions:["No reclamar millas","Usar tarifa estándar de millaje","Usar gastos reales (incluidos en gastos)"],step:["PASO 1 DE 5","PASO 2 DE 5","PASO 3 DE 5","PASO 4 DE 5","PASO 5 DE 5"]
  },
  en:{
    subtitle:"Understand your federal taxes · Tax year 2025",intro:"Answer what you know. Leave fields at zero when they do not apply. The app explains the calculations and items you should review.",
    disclaimer:"Important: this is an educational tool. It does not file returns, send information to the IRS, or guarantee refunds or tax results.",
    privacyNotice:"Privacy: your answers are calculated in this browser. No account is created and your tax answers are not sent to this server. Do not enter your Social Security number, full name, or address.",
    statusHeading:"Your family situation",statusLabel:"Filing status",statusHelp:"Your filing status depends on IRS rules, not just how you describe yourself.",ageLabel:"Your age at the end of 2025",ageHelp:"Used to review rules for people age 65 or older.",spouseAgeLabel:"Your spouse's age (if applicable)",blindLabel:"Are you legally blind under tax rules?",spouseBlindLabel:"Does your spouse meet that condition?",dependentsLabel:"Number of possible dependents",dependentsHelp:"The number alone does not establish eligibility.",
    incomeHeading:"Income for the year",incomeHelp:"Enter annual amounts in dollars. Do not subtract withholding from income.",wagesLabel:"W-2 wages",interestLabel:"Taxable bank interest",dividendsLabel:"Ordinary dividends",unemploymentLabel:"Unemployment compensation",socialSecurityLabel:"Social Security benefits received",socialSecurityHelp:"The taxable portion requires a separate calculation and depends on other income.",capitalGainLabel:"Net capital gain (estimate)",capitalGainHelp:"Investment sales may require Form 8949 and Schedule D.",otherIncomeLabel:"Other taxable income (estimate)",otherIncomeHelp:"Only include amounts you know are taxable and have not entered elsewhere.",withholdingLabel:"Federal tax withheld on W-2/1099 forms",estimatedPaymentsLabel:"Estimated payments and other applicable payments",
    deductionHeading:"Deductions and adjustments",deductionChoiceLabel:"Deduction type",deductionChoiceHelp:"Itemized deductions require reviewing their categories and limits.",itemizedLabel:"Total eligible itemized deductions",adjustmentsLabel:"Other deductible adjustments (estimate)",adjustmentsHelp:"Do not enter the deductible half of self-employment tax again if the engine already calculates it.",tipsLabel:"Tips that might qualify for Schedule 1-A",overtimeLabel:"Overtime compensation that might qualify",vehicleInterestLabel:"Vehicle loan interest that might qualify",seniorDeductionLabel:"Would you like to review the enhanced senior deduction?",schedule1aWarning:"Schedule 1-A deductions have eligibility conditions, limits, documentation requirements, and possible income phaseouts. Entering an amount does not automatically make it eligible.",
    businessHeading:"Self-employment or small business",businessIncomeLabel:"Gross business income",businessExpensesLabel:"Potentially deductible business expenses",businessMilesLabel:"Documented business miles",businessMilesHelp:"2025 standard mileage rate: $0.70 per eligible mile. Do not count the same vehicle cost twice if it is already included in expenses.",mileageMethodLabel:"How did you record vehicle costs?",businessWarning:"The app provides an initial estimate for a simple sole proprietorship. Depreciation, inventory, home-office use, losses, employees, tax elections, and other rules may require additional forms and calculations.",
    reviewHeading:"Review and calculate",confirmedText:"I reviewed the amounts and did not count income or expenses twice.",noSSNText:"I did not enter my SSN, address, or identifying personal information.",calculateBtn:"Calculate and explain",demoBtn:"Load fictional example",clearBtn:"Clear everything",verifyHelp:"Results are educational estimates. Verify the official forms and instructions for the applicable tax year.",resultsHeading:"Your estimate",printBtn:"Generate printable guide",officialBtn:"Open original IRS forms",editBtn:"Review answers",sourcesHeading:"Official sources",footerText:"Not affiliated with the IRS. This tool does not provide individualized legal or tax advice, transmit returns, or guarantee results. Rules can change; always confirm official instructions.",
    statusOptions:["Single","Married filing jointly","Married filing separately","Head of household","Qualifying surviving spouse"],blindOptions:["No","Yes"],deductionOptions:["Estimated standard deduction","Itemized deductions (Schedule A)"],seniorOptions:["No / not sure if eligible","Yes, check eligibility"],mileageOptions:["Do not claim mileage","Use standard mileage rate","Use actual expenses (included in expenses)"],step:["STEP 1 OF 5","STEP 2 OF 5","STEP 3 OF 5","STEP 4 OF 5","STEP 5 OF 5"]
  }
};
function setText(id,value){const el=$(id);if(el&&value!==undefined)el.textContent=value;}
function setOptions(id,values){const el=$(id);if(!el)return;[...el.options].forEach((o,i)=>{if(values[i]!==undefined)o.textContent=values[i];});}
function language(){return $("language").value==="en"?"en":"es";}
function applyLanguage(){
  const l=translations[language()];
  Object.entries(l).forEach(([k,v])=>{if(k.endsWith("Options")||k==="step")return;setText(k,v);});
  l.step.forEach((v,i)=>setText("step"+(i+1),v));
  setOptions("status",l.statusOptions);setOptions("blind",l.blindOptions);setOptions("spouseBlind",l.blindOptions);setOptions("deductionChoice",l.deductionOptions);setOptions("seniorDeduction",l.seniorOptions);setOptions("mileageMethod",l.mileageOptions);
  document.documentElement.lang=language();
  setText("appTitle",language()==="en"?"Taxes Made Easy USA":"Taxes Fáciles USA");
  if(lastResult)renderResult(lastResult);
}
function readInputs(){
  const ids=["status","age","spouseAge","blind","spouseBlind","dependents","wages","interest","dividends","unemployment","socialSecurity","capitalGain","otherIncome","withholding","estimatedPayments","deductionChoice","itemized","adjustments","tips","overtime","vehicleInterest","seniorDeduction","businessIncome","businessExpenses","businessMiles","mileageMethod"];
  const x={};ids.forEach(id=>{x[id]=$(id).value;});
  ["age","spouseAge","dependents","wages","interest","dividends","unemployment","socialSecurity","capitalGain","otherIncome","withholding","estimatedPayments","itemized","adjustments","tips","overtime","vehicleInterest","businessIncome","businessExpenses","businessMiles"].forEach(k=>x[k]=Number(x[k]||0));
  return x;
}
const usd=n=>new Intl.NumberFormat(language()==="en"?"en-US":"es-US",{style:"currency",currency:"USD"}).format(Number(n)||0);
function addLine(parent,label,value){const row=document.createElement("div");row.className="line";const a=document.createElement("span"),b=document.createElement("span");a.textContent=label;b.textContent=value;row.append(a,b);parent.append(row);}
function renderResult(r){
  const en=language()==="en",t=r.totals,content=$("resultContent");content.replaceChildren();
  const intro=document.createElement("p");intro.textContent=en?"This is a preliminary estimate, not a complete return. Review all warnings before relying on it.":"Esta es una estimación preliminar, no una declaración completa. Revisa todas las advertencias antes de confiar en el resultado.";content.append(intro);
  const total=document.createElement("div");total.className="result";const title=document.createElement("strong");title.textContent=en?"Estimated difference after entered payments":"Diferencia estimada después de los pagos introducidos";const value=document.createElement("div");value.className="money";value.textContent=usd(t.balance);const label=document.createElement("p");label.textContent=t.balance>0?(en?"Possible amount owed; not final.":"Posible cantidad a pagar; no es definitiva."):t.balance<0?(en?"Possible overpayment; not a confirmed refund.":"Posible exceso de pagos; no es un reembolso confirmado."):(en?"Estimated payments and tax are approximately equal.":"Los pagos y el impuesto estimados son aproximadamente iguales.");total.append(title,value,label);content.append(total);
  const heading=document.createElement("h3");heading.textContent=en?"Calculation summary":"Resumen del cálculo";content.append(heading);
  const rows=[
    [en?"Total income entered":"Ingresos totales introducidos",t.totalIncome],
    [en?"Adjusted gross income (AGI)":"Ingreso bruto ajustado (AGI)",t.agi],
    [en?"Deduction used":"Deducción utilizada",t.deductionUsed],
    [en?"Schedule 1-A deductions (preliminary)":"Deducciones de Schedule 1-A (preliminares)",t.schedule1ADeduction],
    [en?"Taxable income estimate":"Ingreso tributable estimado",t.taxableIncome],
    [en?"Regular income tax estimate":"Impuesto ordinario estimado",t.regularTax],
    [en?"Self-employment tax estimate":"Impuesto estimado por cuenta propia",t.seTax],
    [en?"Estimated tax before uncalculated credits/taxes":"Impuesto estimado antes de créditos/impuestos no calculados",t.estimatedTax],
    [en?"Withholding and payments entered":"Retenciones y pagos introducidos",t.totalPayments]
  ];
  rows.forEach(([a,b])=>addLine(content,a,usd(b)));
  const warnings=document.createElement("h3");warnings.textContent=en?"Important warnings":"Advertencias importantes";content.append(warnings);
  r.warnings.forEach(w=>{const p=document.createElement("div");p.className="warning";p.textContent=w;content.append(p);});
  const ex=document.createElement("h3");ex.textContent=en?"How the estimate was built":"Cómo se construyó la estimación";content.append(ex);
  r.explanations.forEach(v=>{const p=document.createElement("p");p.textContent=v;content.append(p);});
  const checklist=document.createElement("h3");checklist.textContent=en?"Before using any number":"Antes de usar cualquier cantidad";content.append(checklist);
  r.checks.forEach(v=>{const p=document.createElement("p");p.textContent="• "+v;content.append(p);});
  const note=document.createElement("div");note.className="notice";note.textContent=en?r.disclaimer:"Estimación educativa. No se han calculado automáticamente todos los créditos fiscales, impuestos adicionales, límites ni situaciones especiales.";content.append(note);
  $("results").classList.remove("hidden");$("results").scrollIntoView({behavior:"smooth",block:"start"});
}
$("language").addEventListener("change",applyLanguage);
$("taxForm").addEventListener("submit",event=>{
  event.preventDefault();
  if(!$("confirmed").checked||!$("noSSN").checked){alert(language()==="en"?"Please confirm both review and privacy checkboxes.":"Marca ambas casillas de revisión y privacidad antes de calcular.");return;}
  try{lastResult=window.TaxEngine.calc(readInputs());renderResult(lastResult);}
  catch(err){alert((language()==="en"?"Could not calculate: ":"No se pudo calcular: ")+(err.message||"Error"));}
});
$("demoBtn").addEventListener("click",()=>{
  const sample={status:"single",age:35,spouseAge:35,blind:"no",spouseBlind:"no",dependents:0,wages:52000,interest:240,dividends:100,unemployment:0,socialSecurity:0,capitalGain:0,otherIncome:0,withholding:4500,estimatedPayments:0,deductionChoice:"standard",itemized:0,adjustments:0,tips:0,overtime:0,vehicleInterest:0,seniorDeduction:"no",businessIncome:0,businessExpenses:0,businessMiles:0,mileageMethod:"none"};
  Object.entries(sample).forEach(([id,v])=>$(id).value=v);
  $("confirmed").checked=true;$("noSSN").checked=true;
  if(language()==="en")$("intro").textContent="Fictional example loaded. These are not real taxpayer details.";
  else $("intro").textContent="Se cargó un ejemplo ficticio. No son datos de un contribuyente real.";
});
$("clearBtn").addEventListener("click",()=>{
  $("taxForm").reset();lastResult=null;$("results").classList.add("hidden");$("resultContent").replaceChildren();
  $("taxYear").value="2025";applyLanguage();$("intro").textContent=translations[language()].intro;
  window.scrollTo({top:0,behavior:"smooth"});
});
$("printBtn").addEventListener("click",()=>{
  if(!lastResult)return;
  try{window.PdfEngine.generate(lastResult,language());}
  catch(err){alert(err.message||"No se pudo generar la guía.");}
});
$("officialBtn").addEventListener("click",()=>{
  window.PdfEngine.openOfficialForms(["form1040","schedule1","schedule1A","schedule2","schedule3","scheduleA","scheduleB","scheduleC","scheduleD","scheduleSE"]);
});
$("editBtn").addEventListener("click",()=>$("taxForm").scrollIntoView({behavior:"smooth",block:"start"}));
applyLanguage();
})();
