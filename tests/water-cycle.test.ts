import {test} from 'node:test';
import assert from 'node:assert/strict';
import {waterHistory,waterStep,initialWater} from '../src/simulations/water-cycle.ts';
test('water reservoirs stay nonnegative and conserve water across control extremes',()=>{
 for(const sun of [0,1,2])for(const cooling of [0,1,2])for(const {state} of waterHistory(sun,cooling)){const values=Object.values(state);assert.ok(values.every(v=>v>=0));assert.ok(Math.abs(values.reduce((a,b)=>a+b,0)-100)<1e-8);}
});
test('controls act on their processes and rain requires cloud storage',()=>{
 assert.equal(waterStep(initialWater,0,1).flux.evaporation,0);
 assert.equal(waterStep(initialWater,1,0).flux.condensation,0);
 assert.equal(waterStep(initialWater,1,1).flux.rain,0);
 assert.equal(waterStep(initialWater,2,1).flux.evaporation,2*waterStep(initialWater,1,1).flux.evaporation);
 assert.ok(waterHistory(1,1).some(p=>p.flux.rain>0));
 const dry=waterHistory(2,0).at(-1)!;assert.ok(dry.state.vapor>initialWater.vapor);assert.equal(dry.flux.rain,0);
});
