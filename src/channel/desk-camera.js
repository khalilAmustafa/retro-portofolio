export const DESK_TV={y:3.12,z:.55,front:.95};
export function deskCameraPose({width,height},progress){
 const p=Math.max(0,Math.min(1,progress)),compact=width<900,tan=Math.tan(33*Math.PI/360);
 const portrait=width<600&&height>width;
 const near=Math.max((portrait?11.15:4.05)/(2*tan*.95),6.25/(2*tan*(width/height)*.97));
 const far=compact?Math.max(width<650?17:12.2,near*1.35):12.2,distance=far+(near-far)*p;
 return {x:0,y:DESK_TV.y+(portrait?3.46:0),z:DESK_TV.front+distance,targetZ:DESK_TV.front,fov:42-9*p};
}
