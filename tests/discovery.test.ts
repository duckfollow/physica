import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coasterState, coasterLimit, buoyancy, orbitPath } from '../src/simulations/discovery.ts';
test('coaster conserves energy including dissipation and cannot cross inaccessible hill',()=>{
  for(const x of [0,20,40,60,80]){const s=coasterState(x,25,0.8);assert.ok(Math.abs(s.kinetic+s.potential+s.dissipated-25*9.81)<1e-8);}
  assert.equal(coasterLimit(20,0),80);assert.ok(coasterLimit(5,0)<80);assert.ok(coasterLimit(12,1)<coasterLimit(12,0));
});
test('floating displacement balances weight; overload and neutral limits are distinct',()=>{
  const fresh=buoyancy(500,1,1000),salt=buoyancy(500,1,1025);
  assert.equal(fresh.force,fresh.weight);assert.equal(fresh.fraction,0.5);assert.ok(salt.fraction<fresh.fraction);
  assert.ok(buoyancy(1001,1,1000).sinking);assert.ok(buoyancy(1000,1,1000).neutral);
  assert.ok(buoyancy(1200,1,1000).force<buoyancy(1200,1,1000).weight);
});
test('orbit integrator preserves circular radius and energy and distinguishes collision from escape',()=>{
  const circle=orbitPath(1);assert.equal(circle.outcome,'bound');
  for(const p of circle.points){assert.ok(Math.abs(Math.hypot(p.x,p.y)-1.6)<0.0001);assert.ok(Math.abs(p.energy-circle.points[0].energy)<1e-6);}
  const low=orbitPath(0.5);assert.equal(low.outcome,'impact');assert.ok(Math.hypot(low.points.at(-1)!.x,low.points.at(-1)!.y)<=1);
  const high=orbitPath(1.5);assert.equal(high.outcome,'escape');assert.ok(high.points[0].energy>0);assert.ok(Math.hypot(high.points.at(-1)!.x,high.points.at(-1)!.y)>=6);
});
