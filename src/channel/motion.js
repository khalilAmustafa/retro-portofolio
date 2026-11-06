export function createMotion(value=0,max=10){return {value,target:value,velocity:0,direction:0,max};}
const clamp=(n,max)=>Math.max(0,Math.min(max,n));
export function advanceSpring(state,delta){
 const dt=Math.min(.05,Math.max(0,delta)),omega=19,error=state.value-state.target;
 const term=state.velocity+omega*error,decay=Math.exp(-omega*dt);
 const value=state.target+(error+term*dt)*decay,velocity=(state.velocity-omega*term*dt)*decay;
 return {...state,value:Math.abs(value-state.target)<.00005&&Math.abs(velocity)<.001?state.target:value,velocity};
}
export function moveWheel(state,delta){const direction=Math.sign(delta);if(!direction)return state;const reversing=direction!==state.direction,origin=reversing?state.value:state.target;return {...state,target:clamp(origin+delta*.0028,state.max),velocity:reversing?0:state.velocity,direction};}
export function dragMotion(state,value){value=clamp(value,state.max);return {...state,value,target:value,velocity:0,direction:0};}
export function snapMotion(state){return {...state,target:Math.round(state.target),direction:0};}
