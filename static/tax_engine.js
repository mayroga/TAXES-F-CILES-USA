"use strict";
(function(){
const D=window.TAX_DATA;
const num=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const money=n=>Math.round((num(n)+Number.EPSILON)*100)/100;
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
function progressiveTax(income,status){
  let taxable=Math.max(0,num(income)),tax=0,previous=0;
  const brackets=D.brackets[status]||D.brackets.single;
  for(const [limit,rate] of brackets){const portion=Math.max(0,Math.min(taxable,limit)-previous);tax+=portion*rate;if(taxable<=limit)break;previous=limit;}
  return money(tax);
}
function phaseout(amount,magi,threshold,step=1000,perStep=100){
  return money(Math.max(0,amount-Math.ceil(Math.max(0,magi-threshold)/step)*perStep));
}
function calc(input){
  const x={...input};const warnings=[],checks=[],explanations=[];
  const status=D.brackets[x.status]?x.status:"single";
  const joint=status==="mfj",married=status==="mfj"||status==="mfs";
  const age=num(x.age),spouseAge=num(x.spouseAge),dependents=clamp(Math.floor(num(x.dependents)),0,30);
  const wages=Math.max(0,num(x.wages)),interest=Math.max(0,num(x.interest)),dividends=Math.max(0,num(x.dividends));
  const unemployment=Math.max(0,num(x.unemployment)),socialSecurity=Math.max(0,num(x.socialSecurity));
  const capitalGain=num(x.capitalGain),otherIncome=num(x.otherIncome),withholding=Math.max(0,num(x.withholding));
  const estimatedPayments=Math.max(0,num(x.estimatedPayments));
  const businessIncome=Math.max(0,num(x.businessIncome)),businessExpenses=Math.max(0,num(x.businessExpenses));
  const miles=Math.max(0,num(x.businessMiles));
  const mileageDeduction=x.mileageMethod==="standard"?money(miles*D.selfEmployment.businessMileageRate):0;
  if(x.mileageMethod==="standard"&&businessExpenses>0)warnings.push("Comprueba que los gastos introducidos no incluyan ya los mismos costos del vehículo. No deduzcas dos veces una misma cantidad.");
  const businessProfit=money(businessIncome-businessExpenses-mileageDeduction);
  const seNet=money(Math.max(0,businessProfit)*D.selfEmployment.netEarningsFactor);
  const ssTaxable=Math.min(seNet,D.selfEmployment.socialSecurityWageBase);
  const seTax=money(ssTaxable*D.selfEmployment.socialSecurityRate+seNet*D.selfEmployment.medicareRate);
  const halfSe=money(seTax/2);
  const totalIncome=money(wages+interest+dividends+unemployment+socialSecurity+capitalGain+otherIncome+Math.max(0,businessProfit));
  const adjustments=money(Math.max(0,num(x.adjustments))+halfSe);
  const agi=money(Math.max(0,totalIncome-adjustments));
  const age65=age>=65,spouse65=joint&&spouseAge>=65;
  const blind=x.blind==="yes",spouseBlind=joint&&x.spouseBlind==="yes";
  let standard=D.standardDeduction[status];
  if(status==="single"||status==="hoh")standard+=(age65?D.additionalStandardDeduction.singleOrHead.ageOrBlind:0)+(blind?D.additionalStandardDeduction.singleOrHead.ageOrBlind:0);
  else standard+=(age65?D.additionalStandardDeduction.marriedOrQss.ageOrBlind:0)+(blind?D.additionalStandardDeduction.marriedOrQss.ageOrBlind:0)+(spouse65?D.additionalStandardDeduction.marriedOrQss.ageOrBlind:0)+(spouseBlind?D.additionalStandardDeduction.marriedOrQss.ageOrBlind:0);
  const itemized=Math.max(0,num(x.itemized));
  const deduction=x.deductionChoice==="itemized"?itemized:standard;
  if(x.deductionChoice==="itemized"&&itemized===0)warnings.push("Seleccionaste deducciones detalladas, pero el total es cero. Revisa Schedule A antes de continuar.");
  let tips=0,overtime=0,vehicleInterest=0,senior=0;
  const magi=agi;
  const otherStatus=joint?D.schedule1A.tipsMagiThreshold.joint:D.schedule1A.tipsMagiThreshold.other;
  if(num(x.tips)>0){
    tips=phaseout(Math.min(num(x.tips),D.schedule1A.tipsMax),magi,otherStatus,1000,100);
    if(status==="mfs")warnings.push("La deducción por propinas de Schedule 1-A exige declaración conjunta para contribuyentes casados; revisa la elegibilidad antes de reclamarla.");
    explanations.push("Schedule 1-A: las propinas deben ser calificadas y reportadas conforme a las reglas de 2025. El cálculo aquí es preliminar.");
  }
  const overtimeThreshold=joint?300000:150000;
  if(num(x.overtime)>0){
    overtime=phaseout(Math.min(num(x.overtime),joint?25000:12500),magi,overtimeThreshold,1000,100);
    if(status==="mfs")warnings.push("La deducción por horas extra puede requerir declaración conjunta para contribuyentes casados; revisa las instrucciones oficiales.");
    explanations.push("La deducción por horas extra se limita a la compensación calificada según las instrucciones de Schedule 1-A; no es necesariamente todo el pago por horas extra.");
  }
  const vehicleThreshold=joint?200000:100000;
  if(num(x.vehicleInterest)>0){
    vehicleInterest=phaseout(Math.min(num(x.vehicleInterest),D.schedule1A.vehicleInterestMax),magi,vehicleThreshold,1000,200);
    explanations.push("El interés del vehículo solo califica si el préstamo, el vehículo y la fecha de compra cumplen los requisitos legales de Schedule 1-A.");
  }
  if(x.seniorDeduction==="yes"){
    const eligible=(age>=65?1:0)+(joint&&spouseAge>=65?1:0);
    if(eligible){
      const seniorThreshold=joint?150000:75000;
      senior=money(Math.max(0,eligible*D.schedule1A.seniorMaxPerEligiblePerson-Math.ceil(Math.max(0,magi-seniorThreshold)/1000)*120));
      explanations.push("La deducción adicional para mayores de Schedule 1-A tiene límites de ingresos y requisitos propios; verifica edad, MAGI y demás condiciones.");
    }else warnings.push("Con las edades introducidas no se identifica una persona de 65 años o más para esta deducción. Comprueba las fechas de nacimiento y las reglas oficiales.");
  }
  const schedule1A=money(tips+overtime+vehicleInterest+senior);
  const taxable=money(Math.max(0,agi-deduction-schedule1A));
  const regularTax=progressiveTax(taxable,status);
  const seTotal=seTax;
  const estimatedTax=money(regularTax+seTotal);
  const totalPayments=money(withholding+estimatedPayments);
  const balance=money(estimatedTax-totalPayments);
  if(capitalGain!==0)warnings.push("La tasa aplicada a la ganancia de capital se aproxima con las tasas ordinarias. Las ganancias de capital calificadas pueden recibir tasas distintas y requerir Schedule D.");
  if(socialSecurity>0)warnings.push("El cálculo trata provisionalmente todos los beneficios del Seguro Social como ingresos. La parte imponible puede ser menor y debe calcularse con la hoja oficial.");
  if(dividends>0)warnings.push("Los dividendos calificados pueden tener tasas distintas de las tasas ordinarias. Este cálculo preliminar no separa dividendos ordinarios y calificados.");
  if(dependents>0)warnings.push("No se ha calculado automáticamente el Child Tax Credit, Credit for Other Dependents ni EITC. Cada crédito requiere comprobar requisitos y formularios específicos.");
  if(businessProfit<0)warnings.push("La pérdida del negocio puede estar sujeta a límites y reglas adicionales. No se ha aplicado automáticamente ninguna pérdida a otros ingresos.");
  if(businessProfit>0)warnings.push("El impuesto por cuenta propia se estima con las tasas generales. Otros salarios, ingresos sujetos al límite de Seguro Social, excepciones o reglas especiales pueden cambiar el resultado.");
  warnings.push(...D.limitations.map(v=>v.es));
  checks.push("Comprueba si tienes que presentar Schedule 1, 1-A, 2, 3, A, B, C, D, SE u otros anexos.");
  checks.push("Verifica el estado civil fiscal, residencia, dependientes, retenciones y documentos originales.");
  checks.push("El cálculo no determina automáticamente créditos fiscales, AMT, impuestos sobre inversiones, impuestos estatales ni todas las situaciones especiales.");
  explanations.unshift("Ingresos totales estimados: salarios, intereses, dividendos, desempleo, beneficios introducidos, ganancia de capital, otros ingresos y beneficio comercial positivo.");
  explanations.push("La deducción estándar o detallada se resta del ingreso bruto ajustado. Schedule 1-A se resta después para esta estimación.");
  explanations.push("El saldo mostrado compara una estimación básica del impuesto con los pagos introducidos; no es un reembolso confirmado ni una cantidad definitiva a pagar.");
  const requiresReview=warnings.length>0;
  return {
    year:2025,status,dependents,inputs:x,
    totals:{wages,interest,dividends,unemployment,socialSecurity,capitalGain,otherIncome,businessIncome,businessExpenses,mileageDeduction,businessProfit,totalIncome,adjustments,agi,standardDeduction:money(standard),itemizedDeduction:money(itemized),deductionUsed:money(deduction),tipsDeduction:tips,overtimeDeduction:overtime,vehicleInterestDeduction:vehicleInterest,seniorDeduction:senior,schedule1ADeduction:schedule1A,taxableIncome:taxable,regularTax,seTax:seTotal,estimatedTax,totalPayments,balance},
    statusLabel:({single:"Soltero/a",mfj:"Casado/a: declaración conjunta",mfs:"Casado/a: declaración separada",hoh:"Cabeza de familia",qss:"Cónyuge sobreviviente que reúne los requisitos"})[status],
    warnings:[...new Set(warnings)],checks,explanations,requiresReview,
    resultType:balance>0?"estimated_owed":balance<0?"possible_overpayment":"estimated_even",
    disclaimer:"Estimación educativa, no una declaración completa. No se han calculado todos los créditos, impuestos adicionales, límites ni situaciones especiales."
  };
}
window.TaxEngine={calc,progressiveTax,money};
})();
