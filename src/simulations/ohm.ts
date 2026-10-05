export function ohmLaw(voltage:number,resistance:number){
  if(!Number.isFinite(voltage)||voltage<0||!Number.isFinite(resistance)||resistance<=0)throw new RangeError('Use nonnegative voltage and positive resistance');
  const current=voltage/resistance;
  return {current,power:voltage*current};
}
