import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ohmLaw} from '../src/simulations/ohm.ts';
test('Ohm law preserves voltage, power and expected scaling',()=>{
 assert.equal(ohmLaw(6,3).current,2);assert.equal(ohmLaw(12,3).current,4);assert.equal(ohmLaw(6,6).current,1);
 for(const v of [0,0.5,6,12])for(const r of [1,3,12]){const s=ohmLaw(v,r);assert.ok(Math.abs(s.current*r-v)<1e-10);assert.ok(Math.abs(s.power-s.current*s.current*r)<1e-10);}
 assert.deepEqual(ohmLaw(0,3),{current:0,power:0});
 assert.throws(()=>ohmLaw(6,0),RangeError);assert.throws(()=>ohmLaw(NaN,1),RangeError);
});
