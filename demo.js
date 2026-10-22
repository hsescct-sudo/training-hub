const D=window.__DEMO,F=window.fetch.bind(window);
const ok=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{'Content-Type':'application/json'}});
window.fetch=async(u,o={})=>{const p=new URL(u,location.href).pathname;
 if(p.endsWith('/api/session'))return ok({user:D.user,setup:false,setupAllowed:false});
 if(p.endsWith('/api/hub')&&(!o.method||o.method==='GET'))return ok(D);
 if(p.endsWith('/api/backup'))return ok({format:'training-hub-backup-v1',projects:D.projects,records:D.records});
 if(p.includes('/api/'))return ok({error:'Demo version: read-only. Saving, approvals and uploads work in the full server version.'},403);
 return F(u,o);};
