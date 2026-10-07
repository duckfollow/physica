import {test} from 'node:test';
import assert from 'node:assert/strict';
import {earthBounds,earthLayerAt,EARTH_RADIUS} from '../src/simulations/earth.ts';
test('Earth layers cover surface to center and switch at depth boundaries',()=>{
 for(const ocean of [false,true]){const b=earthBounds(ocean);assert.equal(b[0],0);assert.equal(b[4],EARTH_RADIUS);assert.equal(b.slice(1).reduce((sum,d,i)=>sum+d-b[i],0),EARTH_RADIUS);for(let i=0;i<4;i++){assert.equal(earthLayerAt((b[i]+b[i+1])/2,ocean),i);assert.equal(earthLayerAt(b[i],ocean),i);}assert.equal(earthLayerAt(EARTH_RADIUS,ocean),3);}
 assert.equal(earthLayerAt(10,false),0);assert.equal(earthLayerAt(10,true),1);assert.equal(earthLayerAt(3000,false),2);assert.equal(earthLayerAt(6000,false),3);
});
