export function resolveChannelRoute(hash,projects){
 let path;try{path=decodeURIComponent(String(hash).replace(/^#\/?/,''));}catch{return {view:'work'};}
 if(/^education\/(amman|valencia)$/.test(path))return {view:'profile',section:'education',school:path.split('/')[1]};
 if(path.startsWith('projects/')){const id=path.split('/')[1];return Object.prototype.hasOwnProperty.call(projects,id)?{view:'case',projectId:id}:{view:'work'};}
 if(path==='atlas')return {view:'atlas'};
 if(['profile','about','experience','education','skills','certifications','credentials','contact'].includes(path))return {view:'profile',section:({about:'experience',credentials:'certifications'})[path]??(path==='profile'?null:path)};
 return {view:'work'};
}
