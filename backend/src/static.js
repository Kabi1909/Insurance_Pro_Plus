import { readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2'};
export async function serveFrontend(req,res,root){
  if(!root||!['GET','HEAD'].includes(req.method))return false;
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{return false;}
  if(pathname.startsWith('/api/'))return false;
  const base=resolve(root);let target=resolve(base,'.'+pathname);
  if(target!==base&&!target.startsWith(base+sep))return false;
  if(pathname.split(/[\\/]/).some(p=>p.startsWith('.')))return false;
  if(!extname(target))target=resolve(base,'index.html');
  try{const data=await readFile(target);res.writeHead(200,{'Content-Type':types[extname(target)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:data);return true;}catch(error){if(['ENOENT','EISDIR'].includes(error.code))return false;throw error;}
}
