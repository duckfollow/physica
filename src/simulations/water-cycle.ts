export type WaterState={surface:number;vapor:number;cloud:number;land:number};
export const initialWater:WaterState={surface:75,vapor:10,cloud:5,land:10};
// A closed, qualitative reservoir model. Units and rates are illustrative, not weather forecasts.
export function waterStep(s:WaterState,sun:number,cooling:number,dt=0.1){
 const evaporation=Math.min(s.surface,s.surface*0.025*sun*dt);
 const condensation=Math.min(s.vapor,s.vapor*0.07*cooling*dt);
 const rain=Math.min(s.cloud,Math.max(0,s.cloud-8)*0.15*dt);
 const runoff=Math.min(s.land,s.land*0.04*dt);
 return {state:{surface:s.surface-evaporation+rain*0.2+runoff,vapor:s.vapor+evaporation-condensation,cloud:s.cloud+condensation-rain,land:s.land+rain*0.8-runoff},flux:{evaporation:evaporation/dt,condensation:condensation/dt,rain:rain/dt,runoff:runoff/dt}};
}
export function waterHistory(sun:number,cooling:number){
 let state={...initialWater};
 const result=[{state,flux:waterStep(state,sun,cooling).flux}];
 for(let i=0;i<1200;i++){const next=waterStep(state,sun,cooling);result.push(next);state=next.state;}
 return result;
}
