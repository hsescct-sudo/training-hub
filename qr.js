// Fixed QR version 5-L, byte mode, one RS block, mask 0. Capacity: 106 UTF-8 bytes.
export function qrSvg(text){
 const bytes=new TextEncoder().encode(text);if(bytes.length>106)throw Error('Passport URL is too long for the QR code. Set a shorter PUBLIC_URL.');
 const bits=[];const add=(n,k)=>{for(let i=k-1;i>=0;i--)bits.push((n>>>i)&1);};add(4,4);add(bytes.length,8);bytes.forEach(b=>add(b,8));for(let i=0;i<4&&bits.length<864;i++)bits.push(0);while(bits.length%8)bits.push(0);
 const data=[];for(let i=0;i<bits.length;i+=8)data.push(bits.slice(i,i+8).reduce((n,b)=>n*2+b,0));for(let i=0;data.length<108;i++)data.push(i%2?17:236);
 const mul=(a,b)=>{let out=0;while(b){if(b&1)out^=a;b>>>=1;a<<=1;if(a&256)a^=285;}return out;};
 let gen=[1],root=1;for(let i=0;i<26;i++){const out=Array(gen.length+1).fill(0);gen.forEach((v,j)=>{out[j]^=v;out[j+1]^=mul(v,root);});gen=out;root=mul(root,2);}
 const rem=Array(26).fill(0);for(const b of data){const factor=b^rem.shift();rem.push(0);for(let i=0;i<26;i++)rem[i]^=mul(gen[i+1],factor);}
 const stream=[...data,...rem].flatMap(b=>Array.from({length:8},(_,i)=>(b>>>(7-i))&1));const n=37,m=Array.from({length:n},()=>Array(n).fill(false)),reserved=Array.from({length:n},()=>Array(n).fill(false));
 const set=(x,y,v)=>{if(x>=0&&y>=0&&x<n&&y<n){m[y][x]=!!v;reserved[y][x]=true;}};
 const finder=(x,y)=>{for(let dy=-1;dy<=7;dy++)for(let dx=-1;dx<=7;dx++)set(x+dx,y+dy,dx>=0&&dx<=6&&dy>=0&&dy<=6&&(dx===0||dx===6||dy===0||dy===6||dx>=2&&dx<=4&&dy>=2&&dy<=4));};finder(0,0);finder(n-7,0);finder(0,n-7);
 for(let i=8;i<n-8;i++){set(i,6,i%2===0);set(6,i,i%2===0);}for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(30+dx,30+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1);
 const format=(value)=>{for(let i=0;i<=5;i++)set(8,i,(value>>>i)&1);set(8,7,(value>>>6)&1);set(8,8,(value>>>7)&1);set(7,8,(value>>>8)&1);for(let i=9;i<15;i++)set(14-i,8,(value>>>i)&1);for(let i=0;i<8;i++)set(n-1-i,8,(value>>>i)&1);for(let i=8;i<15;i++)set(8,n-15+i,(value>>>i)&1);set(8,n-8,true);};
 format(0);let bit=0;for(let right=n-1;right>=1;right-=2){if(right===6)right=5;for(let v=0;v<n;v++){const y=((right+1)&2)===0?n-1-v:v;for(let j=0;j<2;j++){const x=right-j;if(!reserved[y][x]){m[y][x]=Boolean(stream[bit++]||0)!==((x+y)%2===0);}}}}
 const raw=8;let bch=raw;for(let i=0;i<10;i++)bch=(bch<<1)^((bch>>>9)*0x537);format(((raw<<10)|bch)^0x5412);
 let d='';m.forEach((row,y)=>row.forEach((v,x)=>{if(v)d+=`M${x+4},${y+4}h1v1h-1z`;}));return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" role="img" aria-label="Training passport QR code" shape-rendering="crispEdges"><rect width="45" height="45" fill="white"/><path d="${d}" fill="#102f37"/></svg>`;
}
