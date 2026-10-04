export function forceMotion(force: number, mass: number, time: number) {
 const acceleration = force/mass;
 return { acceleration, velocity: acceleration*time, distance: 0.5*acceleration*time**2 };
}
export const pendulumPeriod = (length:number, gravity:number) => 2*Math.PI*Math.sqrt(length/gravity);
export const waveDisplacement = (x:number,t:number,a:number,f:number,v:number) => a*Math.sin(2*Math.PI*(x*f/v-f*t));
export function refractedAngle(n1:number,n2:number,angle:number) {
 const sine=n1/n2*Math.sin(angle*Math.PI/180);
 return sine>1+1e-12?null:Math.asin(Math.min(1,sine))*180/Math.PI;
}
export function resistorCircuit(voltage:number,r1:number,r2:number,parallel:boolean) {
 const resistance=parallel?1/(1/r1+1/r2):r1+r2;const total=voltage/resistance;
 const i1=parallel?voltage/r1:total,i2=parallel?voltage/r2:total;
 return {resistance,total,i1,i2,v1:i1*r1,v2:i2*r2};
}
export const mixedTemperature = (m1:number,t1:number,m2:number,t2:number)=>(m1*t1+m2*t2)/(m1+m2);
export const boxEnergyEV = (n:number,lengthNm:number)=>n**2*(6.62607015e-34)**2/(8*9.1093837139e-31*(lengthNm*1e-9)**2)/1.602176634e-19;
export const boxDensity = (x:number,n:number)=>2*Math.sin(n*Math.PI*x)**2;
export const boxProbability = (a:number,b:number,n:number)=>(b-a)-(Math.sin(2*n*Math.PI*b)-Math.sin(2*n*Math.PI*a))/(2*n*Math.PI);
