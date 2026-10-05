export const FIBER_THRESHOLD = 0.25; // Equivalent optical power at the receiver, mW.
export const FIBER_LOSS = 0.2; // Illustrative attenuation, dB/km.
export function textBits(text:string):number[] {
  return Array.from(new TextEncoder().encode(text)).flatMap(byte=>Array.from({length:8},(_,i)=>(byte>>(7-i))&1));
}
export function decodeBits(bits:number[],complete=false):string {
  const bytes=Uint8Array.from({length:Math.floor(bits.length/8)},(_,i)=>bits.slice(i*8,i*8+8).reduce((a,b)=>a*2+b,0));
  return new TextDecoder('utf-8').decode(bytes,{stream:!complete});
}
export function fiberPower(power:number,length:number){return power*10**(-FIBER_LOSS*length/10);}
export function receiveBits(bits:number[],power:number,length:number,noise:number,seed=1){
  let state=seed>>>0;
  const peak=fiberPower(power,length);
  return bits.map(bit=>{
    state=(Math.imul(state,1664525)+1013904223)>>>0;
    const sample=Math.max(0,bit*peak+noise*(2*state/4294967296-1));
    return {sample,bit:sample>=FIBER_THRESHOLD?1:0};
  });
}
