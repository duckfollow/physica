export interface ProjectileInput { speed: number; angle: number; gravity: number; }
export function projectile({ speed, angle, gravity }: ProjectileInput) {
  if (!Number.isFinite(speed) || !Number.isFinite(angle) || !Number.isFinite(gravity) || speed <= 0 || angle <= 0 || angle >= 90 || gravity <= 0) throw new RangeError("Invalid projectile parameters");
  const radians = angle * Math.PI / 180;
  const vx = speed * Math.cos(radians), vy = speed * Math.sin(radians);
  const duration = 2 * vy / gravity;
  return { duration, range: vx * duration, height: vy * vy / (2 * gravity), position: (time: number) => { const t = Math.max(0, Math.min(duration, time)); return { x: vx * t, y: Math.max(0, vy * t - gravity * t * t / 2) }; } };
}
