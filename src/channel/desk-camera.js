export const DESK_TV={y:3.12,z:.55,front:.95};
export function deskCameraPose({width,height},progress,screenX=-.53){
 const p=Math.max(0,Math.min(1,progress)),compact=width<900,tan=Math.tan(33*Math.PI/360);
 const near=compact?3.2/(2*tan*.78):Math.max(4.05/(2*tan*.95),6.25/(2*tan*(width/height)*.97));
 const far=width<650?17:12.2,distance=far+(near-far)*p;
 return {x:(compact?screenX:0)*p,y:DESK_TV.y,z:DESK_TV.front+distance,targetZ:DESK_TV.front,fov:42-9*p};
}
