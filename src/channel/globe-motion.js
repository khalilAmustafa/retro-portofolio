const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export function dragVelocity(previous,delta,seconds){const dt=clamp(seconds,1/240,.1),sample=clamp(delta/dt,-6,6),blend=1-Math.exp(-dt/.035);return clamp(previous+(sample-previous)*blend,-4.5,4.5);}
export function releaseVelocity(velocity,age){return age>.12?0:velocity*Math.exp(-Math.max(0,age)/.045);}
export function advanceGlide(state,seconds,{min=-Infinity,max=Infinity,damping=4.2}={}){
 const dt=clamp(seconds,0,.1),decay=Math.exp(-damping*dt),unclamped=state.value+state.velocity*(1-decay)/damping,value=clamp(unclamped,min,max);
 const velocity=value!==unclamped||Math.abs(state.velocity*decay)<.008?0:state.velocity*decay;
 return {...state,value,target:value,velocity};
}
