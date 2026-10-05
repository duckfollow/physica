import { test } from 'node:test';
import assert from 'node:assert/strict';
import { textBits,decodeBits,fiberPower,receiveBits } from '../src/simulations/fiber.ts';
test('UTF-8 bit order, multibyte text, incomplete characters and empty input',()=>{
 assert.equal(textBits('H').join(''),'01001000');
 for(const s of ['Hi','สวัสดี','🌈',''])assert.equal(decodeBits(textBits(s),true),s);
 const thai=textBits('ก');assert.equal(thai.length,24);assert.equal(decodeBits(thai.slice(0,16)), '');assert.equal(decodeBits(thai,true),'ก');
 assert.equal(decodeBits([1,0,1],true),'');
});
test('power uses dB loss, clean link recovers text and weak link loses ones',()=>{
 assert.equal(fiberPower(1,0),1);assert.ok(Math.abs(fiberPower(1,50)-0.1)<1e-12);
 const bits=textBits('Hi');assert.equal(decodeBits(receiveBits(bits,1,10,0).map(x=>x.bit),true),'Hi');
 assert.ok(receiveBits(bits,0.2,80,0).every(x=>x.bit===0));
});
test('noise is reproducible, seed-sensitive, bounded and can create zero-to-one errors',()=>{
 const bits=Array(100).fill(0),a=receiveBits(bits,1,10,0.5,1),b=receiveBits(bits,1,10,0.5,2);
 assert.deepEqual(a,receiveBits(bits,1,10,0.5,1));assert.notDeepEqual(a,b);
 assert.ok(a.every(x=>x.sample>=0&&x.sample<=0.5));assert.ok(a.some(x=>x.bit===1));
});
