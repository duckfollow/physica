// Heights in metres; loss is dissipated energy per horizontal metre per kg (J/kg/m).
export function trackHeight(x: number, start: number) {
  return x <= 40 ? start * (1 - x / 40) : 12 * (1 - Math.cos(Math.PI * (x - 40) / 40)) / 2;
}
export function coasterState(x: number, start: number, loss: number) {
  const height = trackHeight(x, start);
  const kinetic = 9.81 * (start - height) - loss * x;
  return { height, kinetic: Math.max(0, kinetic), potential: 9.81 * height, dissipated: loss * x, speed: Math.sqrt(2 * Math.max(0, kinetic)), reachable: kinetic >= -1e-8 };
}
export function coasterLimit(start: number, loss: number) {
  for (let x = 0.1; x <= 80; x += 0.1) if (!coasterState(x,start,loss).reachable) return Math.max(0,x-0.1);
  return 80;
}
export function buoyancy(mass: number, volume: number, density: number) {
  const capacity = density * volume;
  const submerged = Math.min(volume, mass / density);
  return { capacity, submerged, fraction: submerged / volume, weight: mass * 9.81, force: density * submerged * 9.81, sinking: mass > capacity, neutral: Math.abs(mass-capacity)<1e-7 };
}
export const EARTH_RADIUS_KM = 6371;
export const ORBIT_TIME_SECONDS = 805.46;
export const ORBIT_SPEED_KMS = EARTH_RADIUS_KM / ORBIT_TIME_SECONDS;
export function orbitPath(factor: number) {
  const dt = 0.008, points = [] as {x:number;y:number;speed:number;time:number;energy:number}[];
  let x=1.6,y=0,vx=0,vy=factor/Math.sqrt(1.6);
  let outcome: 'impact'|'bound'|'escape' = factor >= Math.SQRT2 ? 'escape' : 'bound';
  for(let i=0;i<=6000;i++){
    const r=Math.hypot(x,y);
    points.push({x,y,speed:Math.hypot(vx,vy),time:i*dt,energy:(vx*vx+vy*vy)/2-1/r});
    if(r<=1){outcome='impact';break;}
    if(r>=6)break;
    const ax=-x/r**3,ay=-y/r**3;
    x+=vx*dt+0.5*ax*dt*dt;y+=vy*dt+0.5*ay*dt*dt;
    const nextR=Math.hypot(x,y);
    vx+=0.5*(ax-x/nextR**3)*dt;vy+=0.5*(ay-y/nextR**3)*dt;
  }
  return {points,outcome};
}
