import { test } from 'node:test';
import assert from 'node:assert/strict';
import { swingPath, flightPath, SWING_G, SWING_MASS } from '../src/simulations/web-swing.ts';
test('large angle swing preserves rope length, energy, and tangent velocity',()=>{
  const path=swingPath(17,14),initial=SWING_G*path[0].y;
  for(const p of path){
    assert.ok(Math.abs(Math.hypot(p.x-17,p.y-26)-14)<1e-10);
    assert.ok(Math.abs((p.x-17)*p.vx+(p.y-26)*p.vy)<1e-8);
    assert.ok(Math.abs((p.vx*p.vx+p.vy*p.vy)/2+SWING_G*p.y-initial)<0.001);
    assert.ok(p.tension>0);
  }
  assert.ok(Math.abs(path[0].tension-SWING_MASS*SWING_G*0.5)<1e-8);
});
test('release preserves position, follows ballistic flight, and treats roof lip as wall',()=>{
  const p={x:20,y:8.5,vx:10,vy:0,tension:500};
  const wall=flightPath(p);assert.equal(wall.outcome,'wall');assert.ok(Math.abs(wall.points.at(-1)!.x-24)<1e-8);
  const roof=flightPath({...p,y:12});assert.equal(roof.outcome,'landed');assert.equal(roof.points.at(-1)!.y,8);assert.ok(roof.points.at(-1)!.x>24);assert.ok(roof.points.at(-1)!.x<34);
  for(const point of roof.points.slice(0,-1)){assert.ok(Math.abs(point.y-(12-0.5*SWING_G*point.time**2))<1e-8);}
  assert.equal(flightPath({...p,x:16,vx:0}).outcome,'ground');
  assert.equal(flightPath({x:24,y:9,vx:0,vy:-2,tension:0}).outcome,'wall');
  assert.equal(flightPath({x:23.5,y:7.5,vx:8,vy:0,tension:0}).outcome,'wall');
  const clear=flightPath({x:26,y:9,vx:1,vy:-2,tension:0});assert.equal(clear.outcome,'landed');assert.equal(clear.points.at(-1)!.y,8);
  assert.equal(flightPath({x:4,y:13,vx:1,vy:-1,tension:0}).outcome,'wall');
});
test('default mission has a reachable success window and unsuccessful release timings',()=>{
  const path=swingPath(17,14);let success=0,failure=0,first=-1;
  for(let i=0;i<1800;i+=20){
    const outcome=flightPath(path[i]).outcome;
    if(outcome==='landed'){success++;if(first<0)first=i;}
    else failure++;
  }
  assert.ok(success>0);assert.ok(failure>0);
  assert.ok(path[first].x<24,'success should come from releasing before the goal face');
});
