export const EARTH_RADIUS = 6371;
export const earthLayers = [
  {name:'เปลือกโลก',color:'#63946c',state:'ของแข็ง',material:'หินซิลิเกต',detail:'ชั้นหินบางที่เราอาศัยอยู่ เปลือกมหาสมุทรบางกว่าเปลือกทวีป ความหนาจริงแปรผันประมาณ 5–70 km'},
  {name:'เนื้อโลก',color:'#d9924c',state:'ส่วนใหญ่เป็นของแข็ง',material:'หินซิลิเกตที่มี Mg และ Fe',detail:'หินร้อนที่เปลี่ยนรูปและไหลอย่างช้ามากในช่วงเวลาทางธรณีวิทยา ไม่ใช่มหาสมุทรแมกมาทั้งชั้น'},
  {name:'แก่นโลกชั้นนอก',color:'#cf593b',state:'ของเหลว',material:'เหล็กและนิกเกิลเป็นหลัก',detail:'โลหะเหลวที่เคลื่อนที่มีบทบาทสร้างสนามแม่เหล็กโลก คลื่นไหวสะเทือนชนิด S ไม่ผ่านของเหลว'},
  {name:'แก่นโลกชั้นใน',color:'#f1cb70',state:'ของแข็ง',material:'เหล็กและนิกเกิลเป็นหลัก',detail:'แม้อุณหภูมิสูงมาก แต่ความดันมหาศาลทำให้แก่นชั้นในเป็นของแข็ง เราศึกษาจากหลักฐานคลื่นไหวสะเทือน'},
] as const;
export function earthBounds(ocean:boolean){return [0,ocean?7:35,2900,5150,EARTH_RADIUS];}
export function earthLayerAt(depth:number,ocean:boolean){
  const d=Math.max(0,Math.min(EARTH_RADIUS,depth)),b=earthBounds(ocean);
  return d<b[1]?0:d<b[2]?1:d<b[3]?2:3;
}
