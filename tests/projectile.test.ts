import { test } from "node:test";
import assert from "node:assert/strict";
import { projectile } from "../src/simulations/mechanics/projectile.ts";
const near = (a: number, b: number) => assert.ok(Math.abs(a-b) < 1e-8);
test("45 degree Earth launch matches analytical values and lands at ground", () => { const p = projectile({ speed: 20, angle: 45, gravity: 9.81 }); near(p.range, 400/9.81); near(p.height, 100/9.81); near(p.position(p.duration).y, 0); near(p.position(p.duration/2).y, p.height); near(p.position(-2).x, 0); near(p.position(100).x, p.range); });
test("complementary angles have equal ranges", () => { near(projectile({ speed:20, angle:30, gravity:9.81 }).range, projectile({ speed:20, angle:60, gravity:9.81 }).range); });
test("weaker gravity increases duration and range", () => { const earth = projectile({ speed:20, angle:45, gravity:9.81 }), moon = projectile({ speed:20, angle:45, gravity:1.62 }); near(moon.range/earth.range, 9.81/1.62); near(moon.duration/earth.duration, 9.81/1.62); });
test("rejects invalid physical inputs", () => { for (const input of [{speed:0,angle:45,gravity:9.81},{speed:20,angle:90,gravity:9.81},{speed:20,angle:45,gravity:0},{speed:NaN,angle:45,gravity:9.81}]) assert.throws(() => projectile(input), RangeError); });
