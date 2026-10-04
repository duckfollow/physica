export const SWING_G = 9.81;
export const SWING_MASS = 60;
export type SwingPoint = {x:number;y:number;vx:number;vy:number;tension:number};
export function swingPath(anchor:number,length:number) {
  const dt=0.005, points:SwingPoint[]=[];
  let angle=-Math.PI/3,omega=0;
  for(let i=0;i<=8000;i++){
    points.push({x:anchor+length*Math.sin(angle),y:26-length*Math.cos(angle),vx:length*omega*Math.cos(angle),vy:length*omega*Math.sin(angle),tension:SWING_MASS*(SWING_G*Math.cos(angle)+length*omega**2)});
    const acceleration=-SWING_G/length*Math.sin(angle);
    angle+=omega*dt+acceleration*dt*dt/2;
    omega+=(acceleration-SWING_G/length*Math.sin(angle))*dt/2;
  }
  return points;
}
export const BUILDINGS=[{left:0,right:9,roof:12,goal:false},{left:24,right:34,roof:8,goal:true}] as const;
/** Ballistic flight after release. Success only when the path hits the goal roof top face first. */
export type FlightOutcome='landed'|'wall'|'ground'|'outside';
export function flightPath(start:SwingPoint) {
  const points=[{x:start.x,y:start.y,time:0}],dt=0.005;
  let outcome:FlightOutcome='outside';
  for(let i=1;i<=2400;i++){
    const t=i*dt,p={x:start.x+start.vx*t,y:start.y+start.vy*t-SWING_G*t*t/2,time:t},prev=points.at(-1)!;
    let hit=Infinity,reason:FlightOutcome=outcome;
    for(const b of BUILDINGS){
      // Vertical faces first so a lip graze counts as wall, not a rooftop landing.
      for(const edge of [b.left,b.right]){
        if(p.x!==prev.x){
          const f=(edge-prev.x)/(p.x-prev.x),y=prev.y+f*(p.y-prev.y);
          if(f>=0&&f<=1&&y>=0&&y<=b.roof&&f<hit){hit=f;reason='wall';}
        }else if(prev.x===edge&&p.y<prev.y&&prev.y>0&&p.y<b.roof){
          const top=Math.min(prev.y,b.roof),f=(prev.y-top)/(prev.y-p.y);
          if(f>=0&&f<=1&&f<hit){hit=f;reason='wall';}
        }
      }
      if(prev.y>=b.roof&&p.y<=b.roof&&p.y<prev.y){
        const f=(prev.y-b.roof)/(prev.y-p.y),x=prev.x+f*(p.x-prev.x);
        // Strictly inside the roof deck: the front/back edges are walls.
        if(x>b.left&&x<b.right&&f<hit){hit=f;reason=b.goal?'landed':'wall';}
      }
    }
    if(p.y<=0&&prev.y>0){const f=prev.y/(prev.y-p.y);if(f<hit){hit=f;reason='ground';}}
    if(hit!==Infinity){points.push({x:prev.x+hit*(p.x-prev.x),y:prev.y+hit*(p.y-prev.y),time:prev.time+hit*dt});outcome=reason;break;}
    points.push(p);
    if(p.x<-4||p.x>44){outcome='outside';break;}
  }
  return {points,outcome};
}
