// A local explanatory model, never connected to event records or real QR signing.
export const createPassportState=()=>({station:0,stamps:[],scenario:'valid',result:'ready',complete:false});
export function scanStation(state){
 if(state.scenario==='expired')return {...state,result:'expired'};
 if(state.stamps.includes(state.station))return {...state,result:'duplicate'};
 const stamps=[...state.stamps,state.station];
 return {...state,stamps,result:'approved',complete:stamps.length===3};
}
export function nextStation(state){return {...state,station:Math.min(2,state.station+1),scenario:'valid',result:'ready'};}
