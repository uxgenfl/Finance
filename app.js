let tst=0,UNDO=null,svWarn=0,NEWID=null,txLim=100;
const ic=(n,z=20,c='')=>`<svg class="ni${c?' '+c:''}" width="${z}" height="${z}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const $=s=>document.querySelector(s),uid=()=>Math.random().toString(36).slice(2,9),
R=n=>S&&S.hd?'Rp•••••':(n<0?'-':'')+'Rp'+Math.abs(Math.round(n)).toLocaleString('id-ID'),
esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
ymd=d=>new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10),P=s=>new Date(s+'T00:00'),today=ymd(new Date()),
add=(s,n)=>{const d=P(s);d.setDate(d.getDate()+n);return ymd(d)},
fd=(s,y)=>P(s).toLocaleDateString(LC(),y?{day:'numeric',month:'short',year:'numeric'}:{day:'numeric',month:'short'}),
k=x=>S&&S.hd?'•••':x>=1e6?(x/1e6).toFixed(1).replace('.0','')+'jt':x>=1e3?Math.round(x/1e3)+'rb':Math.round(x),
pc=(a,b)=>b?Math.round(a/b*100):0,KEY='finance-v1';try{if(localStorage.getItem(KEY)===null){var _o=localStorage.getItem('duitku-v1');if(_o!==null)localStorage.setItem(KEY,_o)}}catch(_){}
const PL={day:'Harian',week:'Mingguan',month:'Bulanan',year:'Tahunan'},FQ={d:'Harian',w:'Mingguan',m:'Bulanan',y:'Tahunan'},
PAL=[100,84,70,58,48,40,33,27,22].map(x=>`color-mix(in srgb,var(--out) ${x}%,var(--cd))`);

function seed(){
 const dt=(m,d)=>{const t=new Date(),l=new Date(t.getFullYear(),t.getMonth()+m+1,0).getDate();let x=Math.min(d,l);if(!m)x=Math.min(x,t.getDate());return ymd(new Date(t.getFullYear(),t.getMonth()+m,x))};
 const S={acc:[['bca','BCA',6e6],['mandiri','Mandiri',2e6],['gopay','GoPay',15e4],['cash','Cash',3e5],['cc','Kartu Kredit',0]].map(([id,n,b])=>({id,n,b})),
 cat:[...['gaji:Gaji','bonus:Bonus','freelance:Freelance','invest:Investasi','in_lain:Lainnya'].map(x=>x.split(':').concat('in')),...['makan:Makanan','transport:Transportasi','belanja:Belanja','tagihan:Tagihan','hibur:Hiburan','sehat:Kesehatan','didik:Pendidikan','rumah:Kebutuhan rumah','out_lain:Lainnya'].map(x=>x.split(':').concat('out'))].map(([id,n,t])=>({id,n,t})),
 tx:[],bud:[],goal:[]};
 const base=[['in',95e5,'gaji','bca',1,'Gaji bulanan'],['out',18e5,'rumah','bca',2,'Sewa kos'],['out',35e4,'tagihan','bca',5,'Internet & listrik'],['out',85e3,'makan','gopay',3,'Makan siang'],['out',42e4,'makan','cash',9,'Belanja dapur'],['out',65e3,'transport','gopay',4,'Ojek online'],['out',15e4,'transport','mandiri',12,'Bensin'],['out',25e4,'hibur','cc',15,'Nonton & kopi'],['out',6e5,'belanja','cc',18,'Belanja bulanan'],['in',15e5,'freelance','mandiri',10,'Proyek freelance']];
 for(let m=-5;m<=0;m++)base.forEach(([t,v,c,a,d,n],i)=>{if(t=='in'&&c=='freelance'&&!m)return;const f=['gaji','rumah','tagihan'].includes(c)?1:.8+((m+9)*(i+3)%5)/10;S.tx.push({id:uid(),t,m:Math.round(v*f/5e3)*5e3,c,a,d:dt(m,d),note:n})});
 [['Sepatu lari',85e4],['Headphone',12e5],['Tas ransel',45e4]].forEach(([n,m])=>S.bud.push({id:uid(),n,m}));
 [['Dana darurat',2e7,85e5,200],['Laptop',15e6,75e5,150],['Liburan',8e6,2e6,120],['Motor',3e7,4e6,540]].forEach(([n,t,s,d])=>S.goal.push({id:uid(),n,t,s,d:add(today,d)}));
 return S}
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
S=S||seed();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){if(!svWarn){svWarn=1;toast('Penyimpanan gagal, data tidak tersimpan. Ekspor data untuk cadangan.',null,null,8000)}}};

const U=x=>'\u2063'+esc(x)+'\u2064',bn=b=>U(b.n||'—'),cn=id=>esc((S.cat.find(c=>c.id==id)||{n:'—'}).n),an=id=>esc((S.acc.find(a=>a.id==id)||{n:'—'}).n),
inR=(t,s,e)=>t.d>=s&&t.d<=e,
sm=(t,s,e,c)=>S.tx.filter(x=>x.t==t&&inR(x,s,e)&&(!c||x.c==c)).reduce((a,x)=>a+x.m,0),
brk=(s,e)=>{const m={},n={};S.tx.filter(x=>x.t=='out'&&inR(x,s,e)).forEach(x=>{const q=(x.note||'').trim()||(S.cat.find(c=>c.id==x.c)||{}).n||'Tanpa nama',k=q.toLowerCase();n[k]=n[k]||q;m[k]=(m[k]||0)+x.m});return Object.entries(m).map(([k,v])=>[n[k],v]).sort((a,b)=>b[1]-a[1])},
oldBal=id=>{const a=S.acc.find(x=>x.id==id);if(!a)return 0;let b=+a.b||0;const bt=a.bt||0,bd=ymd(new Date(bt));S.tx.forEach(t=>{if(!(t.d>bd||(t.d==bd&&(t.ts||0)>bt))||t.d>today)return;if(t.t=='in'&&t.a==id)b+=t.m;if(t.t=='out'&&t.a==id)b-=t.m;if(t.t=='tf'){if(t.a==id)b-=t.m;if(t.to==id)b+=t.m}});return b},
txSum=()=>S.tx.reduce((s,t)=>t.d>today?s:t.t=='in'?s+t.m:t.t=='out'?s-t.m:s,0),
accBal=id=>{const a=S.acc.find(x=>x.id==id);return a?(+a.b||0)+txSum():0},
total=()=>S.acc.reduce((a,x)=>a+accBal(x.id),0);
function migrate(){delete S.pf;(S.bud||[]).forEach(b=>{if(!b.n){const c=(S.cat||[]).find(x=>x.id==b.c);b.n=c?c.n:''}});(S.acc||[]).forEach(a=>{a.bt=a.bt||Date.now()});if(!(S.acc&&S.acc.length==1&&S.acc[0].id=='main')){const tt=S.acc&&S.acc.length?S.acc.reduce((a,x)=>a+oldBal(x.id),0):0;S.acc=[{id:'main',n:'Saldo',b:tt,bt:Date.now()}];S.tx=(S.tx||[]).filter(t=>t.t!='tf');S.tx.forEach(t=>{t.a='main';delete t.to})}
if(S.v!=2){const a=S.acc[0];a.b=oldBal(a.id)-txSum();S.v=2}}
migrate();save();
function rng(p){const n=P(today),y=n.getFullYear(),m=n.getMonth();
 if(p=='day')return[today,today];
 if(p=='week'){const w=(n.getDay()+6)%7;return[add(today,-w),add(today,6-w)]}
 if(p=='year')return[ymd(new Date(y,0,1)),ymd(new Date(y,11,31))];
 return[ymd(new Date(y,m,1)),ymd(new Date(y,m+1,0))]}

const pb=(p,c,lb)=>{p=Math.min(100,p);return`<div class="pb" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}"${lb?` aria-label="${lb}"`:''}><i data-w="${p}" style="width:${p}%;background:${c||'var(--ac)'}"></i></div>`},
bok=b=>(+b.u||0)>=b.m,
wl=(b,d)=>`<div class="r" style="padding:15px 0"${d?'':` data-k="bud" data-id="${b.id}" role="button" tabindex="0"`} onclick="ed('bud','${b.id}')"><div style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${bn(b)}</div><b style="white-space:nowrap;font-variant-numeric:tabular-nums">${R(b.m)}</b></div>`,
budRow=(b,full)=>{const u=+b.u||0,p=pc(u,b.m),ok=bok(b);return`<div class="r" style="display:block"${full?'':` onclick="ed('bud','${b.id}')"`}><div class="row2"><b>${bn(b)}</b><b>${p}%</b></div><div class="row2" style="margin:2px 0 6px"><span class="mu">${R(u)} / ${R(b.m)}</span><span style="font-size:13px;color:${ok?'var(--ac)':'var(--tx)'}">${ok?'Aman':'Belum aman'}</span></div>${pb(p,'var(--ac)','Budget '+bn(b))}${full?`<div class="row2" style="margin-top:10px"><span class="mu">${ok?'Target tercapai':'Kurang '+R(b.m-u)}</span><span><button class="b" style="padding:10px 38px" onclick="ed('bud','${b.id}')">Ubah</button></span></div>`:''}</div>`},
gRow=(g,full)=>{const p=pc(g.s,g.t),left=Math.max(0,g.t-g.s),mo=Math.max(1,Math.ceil((P(g.d)-P(today))/2.6e9));
 return`<div class="r" style="display:block"><div class="row2"><b>${U(g.n)}</b><b>${p}%</b></div><div class="mu row2" style="margin:2px 0 6px"><span>${R(g.s)} / ${R(g.t)}</span><span style="white-space:nowrap">${fd(g.d,1)}</span></div>${pb(p,'var(--in)','Tabungan '+U(g.n))}${full?`<div class="row2" style="margin-top:10px"><span class="mu">${left?`Perlu ${R(left/mo)}/bulan`:`${ic('checkc',14)} Tercapai`}</span></div>`:''}</div>`},
TI={in:ic('in'),out:ic('out'),tf:ic('tx')},
DOL=ic('save',40),
row=(t,sa)=>{const tf=t.t=='tf';return`<div class="r" style="padding:${sa?15:12}px 0" data-k="tx" data-id="${t.id}" role="button" tabindex="0" onclick="ed('tx','${t.id}')"><div class="ic" aria-hidden="true" style="${tf?'':`color:var(--${t.t=='in'?'in':'out'});background:color-mix(in srgb,var(--${t.t=='in'?'in':'out'}) 14%,transparent)`}">${TI[tf?'tf':t.t]}</div><div style="min-width:0"><b style="display:block;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.note?U(t.note):(tf?'Transfer':cn(t.c))}</b>${sa?'':`<small>${fd(t.d)}</small>`}</div><b style="white-space:nowrap;padding-left:8px" class="${tf?'':t.t=='in'?'gi':'go'}">${tf?'':t.t=='in'?'+':'-'}${R(t.m)}</b>${sa?`<div class="sa" aria-hidden="true"><button type="button" tabindex="-1" class="sa1" onclick="event.stopPropagation();closeRow();ed('tx','${t.id}')">Ubah</button><button type="button" tabindex="-1" class="sa2" onclick="event.stopPropagation();swDel('${t.id}')">Hapus</button></div>`:''}</div>`},
em=(i,t,s)=>`<div class="em"><div class="ei" aria-hidden="true">${i}</div><b>${t}</b><span class="mu">${s}</span></div>`,
empty=em(ic('list',40),'Belum ada data','Mulai mencatat untuk melihat ringkasan di sini.'),
hd=(t,kd)=>`<div class="row2"><h3>${t}</h3><span class="row2"><button type="button" class="b ib" style="width:auto;margin-left:0;padding:0 18px" onclick="ed('${kd}')">Tambah</button><button type="button" class="b ib" aria-label="Opsi lainnya" aria-haspopup="menu" onclick="openPm(this,'${kd}')">${ic('dots')}</button></span></div>`;

function donut(l){const t=l.reduce((a,x)=>a+x[1],0);if(!t)return'<p class="mu">Belum ada pengeluaran di periode ini.</p>';let a=0;
 const g=l.map((x,i)=>{const s=a;a+=x[1]/t*100;return`${PAL[i%9]} ${s}% ${a}%`}).join(',');
 return`<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div class="dn zi" style="background:conic-gradient(${g})"></div><div style="flex:1;min-width:150px">${l.slice(0,6).map((x,i)=>`<div style="display:flex;gap:8px;font-size:13px;padding:3px 0"><span style="color:${PAL[i%9]}">●</span><span style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${U(x[0])}</span><b>${k(x[1])}</b></div>`).join('')}</div></div>`}
function mchart(){const n=new Date(),a=[];for(let m=-5;m<=0;m++){const f=new Date(n.getFullYear(),n.getMonth()+m,1),s=ymd(f),e=ymd(new Date(f.getFullYear(),f.getMonth()+1,0));a.push([f.toLocaleDateString(LC(),{month:'short'}),sm('in',s,e),sm('out',s,e)])}
 const mx=Math.max(1,...a.flatMap(x=>[x[1],x[2]]));
 return`<svg viewBox="0 0 330 145" width="100%">${a.map((x,i)=>{const X=12+i*53,h1=x[1]/mx*105,h2=x[2]/mx*105;return`<rect class="i gr" style="--d:${i*60}ms" x="${X}" y="${115-h1}" width="20" height="${h1}" rx="4"/><rect class="o gr" style="--d:${i*60+30}ms" x="${X+22}" y="${115-h2}" width="20" height="${h2}" rx="4"/><text x="${X+21}" y="134" text-anchor="middle" font-size="11" fill="var(--mu)">${x[0]}</text>`}).join('')}</svg><div class="mu"><span class="gi">■</span> Pemasukan &nbsp;<span class="go">■</span> Pengeluaran</div>`}
function trend(s,e){const mo=P(e)-P(s)>92*864e5,m={},ks=[];S.tx.filter(x=>x.t=='out'&&inR(x,s,e)).forEach(x=>{const q=mo?x.d.slice(0,7):x.d;m[q]=(m[q]||0)+x.m});
 if(mo){for(let d=P(s.slice(0,7)+'-01');d<=P(e);d.setMonth(d.getMonth()+1))ks.push(ymd(d).slice(0,7))}else for(let d=s;d<=e;d=add(d,1))ks.push(d);
 const v=ks.map(q=>m[q]||0),mx=Math.max(1,...v),w=300/v.length;
 return`<svg viewBox="0 0 300 100" width="100%" height="110" preserveAspectRatio="none">${v.map((y,i)=>`<rect class="o gr" style="--d:${Math.min(i*12,360)}ms" x="${i*w+w*.12}" y="${98-y/mx*95}" width="${w*.76}" height="${y/mx*95}" rx="1.5"/>`).join('')}</svg><div class="row2 mu"><span>${fd(s,1)}</span><span>Puncak ${R(mx)}/${mo?'bln':'hari'}</span><span>${fd(e,1)}</span></div>`}

const HR={dash:'dashboard',tx:'transaksi',bud:'wishlist',goal:'tabungan',rep:'laporan',set:'pengaturan'};
function hashTab(){const h=location.hash.replace(/^#\/?/,'');return Object.keys(HR).find(k=>HR[k]==h)}
function route(t,push){const h='#/'+HR[t];if(location.hash===h)return;try{history[push?'pushState':'replaceState'](null,'',h)}catch(_){try{location.hash=h}catch(__){}}}
const V={};let tab=hashTab()||(['dash','tx','bud','goal','rep'].includes(S.st)?S.st:'dash'),fl='all',rp={p:'month',s:rng('month')[0],e:today};
V.dash=()=>{const[s,e]=rng('month'),i=sm('in',s,e),o=sm('out',s,e),nb=S.bud.filter(b=>!bok(b)).length;
 return`<div class="c d-bal"><span class="mu" style="display:block;margin-bottom:2px">Total saldo</span><div class="big bal" role="button" tabindex="0" aria-label="Atur saldo" onclick="ed('acc','main')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();ed('acc','main')}" data-v="${total()}">${R(total())}</div><div class="st st3"><div><span class="mu">Pemasukan</span><b class="gi">${R(i)}</b></div><div><span class="mu">Pengeluaran</span><b class="go">${R(o)}</b></div><div><span class="mu">Sisa bulan ini</span><b class="${i-o<0?'go':''}">${R(i-o)}</b></div></div></div>
<div class="g2"><div class="c d-chart"><h2>Pemasukan vs pengeluaran</h2>${mchart()}</div><div class="c d-donut"><h2>Pengeluaran bulan ini</h2>${donut(brk(s,e))}</div></div>
<div class="g2"><div class="c d-wish"><h2>Wishlist</h2>${S.bud.slice(0,4).map(b=>wl(b,1)).join('')||em(ic('wish',40),'Wishlist masih kosong','Catat barang yang ingin kamu beli.')}</div>
<div class="c d-sav"><h2>Tabungan</h2>${S.goal.map(g=>gRow(g)).join('')||em(DOL,'Belum ada tabungan','Catat tabungan yang ingin kamu kumpulkan.')}</div></div>
<div class="c d-tx"><h2>Transaksi terbaru</h2>${S.tx.slice().sort((a,b)=>b.d.localeCompare(a.d)).slice(0,8).map(t=>row(t)).join('')||em(ic('search',40),'Belum ada transaksi','Catat transaksi pertamamu dari menu Transaksi.')}</div>`};
const txList=()=>{const all=S.tx.filter(t=>fl=='all'||t.t==fl).sort((a,b)=>b.d.localeCompare(a.d)),l=all.slice(0,txLim);let h='',last='';
 l.forEach(t=>{if(t.d!=last){last=t.d;h+=`<div class="mu" style="margin:20px 0 4px">${P(t.d).toLocaleDateString(LC(),{weekday:'long',day:'numeric',month:'long'})}</div>`}h+=row(t,1)});
 return(h||(fl=='all'?em(ic('search',40),'Belum ada transaksi','Tekan Tambah untuk mencatat transaksi pertamamu.'):em(ic('search',40),'Tidak ada transaksi','Belum ada transaksi untuk filter ini.')))+(all.length>txLim?`<button type="button" class="b more" onclick="moreTx()">Muat lebih banyak (${all.length-txLim} lagi)</button>`:'')};
V.tx=()=>`${hd('Riwayat Transaksi','tx')}<div class="ft" role="group" aria-label="Filter transaksi">${[['all','Semua'],['in','Masuk'],['out','Keluar']].map(([v,l])=>`<button type="button" data-f="${v}" class="${fl==v?'on':''}" aria-pressed="${fl==v}" onclick="setFl('${v}')">${l}</button>`).join('')}<i id="fi" aria-hidden="true"></i></div><div class="c" id="txl">${txList()}</div>`;
function moveFi(a){const b=document.querySelector('#p_tx .ft button.on'),i=$('#fi');if(!b||!i)return;i.style.transition=a?'':'none';i.style.width=Math.max(0,b.offsetWidth-24)+'px';i.style.transform=`translateX(${b.offsetLeft+12}px)`;if(!a){void i.offsetWidth;i.style.transition=''}}
function setFl(v){if(fl==v)return;fl=v;txLim=100;selOff();closeRow();document.querySelectorAll('#p_tx .ft button').forEach(b=>{const on=b.dataset.f==v;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});moveFi(1);const l=$('#txl');l.innerHTML=txList();l.classList.remove('swp');void l.offsetWidth;l.classList.add('swp')}
function moreTx(){txLim+=100;$('#txl').innerHTML=txList()}
V.acc=()=>`<div class="c"><span class="mu">Total saldo</span><div class="big" data-v="${total()}">${R(total())}</div><div class="act" style="justify-content:flex-start"><button class="b p" onclick="ed('acc','main')">Atur saldo</button></div></div>
<p class="mu">Saldo dihitung dari semua transaksi sampai hari ini, termasuk yang bertanggal bulan lalu. Transaksi bertanggal ke depan baru dihitung saat tanggalnya tiba. Tekan Atur saldo untuk menyesuaikan dengan kondisi asli.</p>`;
V.bud=()=>`${hd('Wishlist','bud')}<div class="c" id="wll">${S.bud.length?S.bud.map(b=>wl(b)).join('')+`<div class="row2" style="margin:6px -10px -6px;padding:13px 10px;border-radius:12px;background:color-mix(in srgb,var(--ac) 12%,transparent);font-variant-numeric:tabular-nums"><span style="color:var(--ac);font-weight:600">Total Harga</span><b style="color:var(--ac);white-space:nowrap">${R(S.bud.reduce((a,b)=>a+(+b.m||0),0))}</b></div>`:em(ic('wish',40),'Wishlist masih kosong','Tekan Tambah untuk mencatat barang yang ingin kamu beli.')}</div>`;
V.goal=()=>`${hd('Tabungan','goal')}<div class="g2">${S.goal.map(g=>`<div class="c gc" data-k="goal" data-id="${g.id}" role="button" tabindex="0" onclick="ed('goal','${g.id}')">${gRow(g,1)}</div>`).join('')||`<div class="c">${em(DOL,'Belum ada tabungan','Tekan Tambah untuk mencatat tabungan yang ingin kamu kumpulkan.')}</div>`}</div>`;
V.rep=()=>{let s,e;if(rp.p=='custom'){s=rp.s;e=rp.e;if(s>e)[s,e]=[e,s]}else[s,e]=rng(rp.p);
 const L=Math.round((P(e)-P(s))/864e5)+1,ps=add(s,-L),pe=add(s,-1),i=sm('in',s,e),o=sm('out',s,e),br=brk(s,e);
 return`<div class="c"><div class="row2"><select style="width:auto" onchange="rp.p=this.value;render()">${[['day','Hari ini'],['week','Minggu ini'],['month','Bulan ini'],['year','Tahun ini'],['custom','Custom range']].map(([v,l])=>`<option value="${v}"${rp.p==v?' selected':''}>${l}</option>`).join('')}</select><span class="mu">${fd(s,1)} – ${fd(e,1)}</span></div>${rp.p=='custom'?`<div class="row2" style="margin-top:6px;align-items:flex-start"><div style="flex:1;min-width:0"><label for="rp_s">Dari</label>${dpBtn('rp_s',rp.s,"dpRep('s')",1)}</div><div style="flex:1;min-width:0"><label for="rp_e">Sampai</label>${dpBtn('rp_e',rp.e,"dpRep('e')",1)}</div></div>`:''}</div>
<div class="g2" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))"><div class="c"><span class="mu">Pemasukan</span><div class="gi" style="font-size:19px;font-weight:700">${R(i)}</div></div><div class="c"><span class="mu">Pengeluaran</span><div class="go" style="font-size:19px;font-weight:700">${R(o)}</div></div><div class="c"><span class="mu">${i-o<0?'Defisit':'Surplus'}</span><div class="${i-o<0?'go':'gi'}" style="font-size:19px;font-weight:700">${R(i-o)}</div></div></div>
<div class="c"><h2>Rincian pengeluaran</h2>${donut(br)}</div>`};

V.set=()=>{const L=S.lang==='en'?'English':'Bahasa Indonesia',it=(k,i,t,d)=>`<button type="button" class="mr" onclick="openPp('${k}')">${ic(i,22)}<span class="mt"><b>${t}</b><small class="mu">${d}</small></span>${ic('chev',18,'mc')}</button>`;
 return`<div class="row2"><h3>Pengaturan</h3></div><div class="c sl">${it('lang','globe','Bahasa',L)}${it('data','archive','Kontrol data','Ekspor, impor, dan reset data')}</div>${PP.set[1]()}`};
function go(t,np){const from=tab;if(t!=from){selOff();closeRow();hideToast()}if(document.activeElement&&document.activeElement.blur&&!document.body.classList.contains('kb'))document.activeElement.blur();tab=t;
 const a=TABS.findIndex(x=>x[0]==from),b=TABS.findIndex(x=>x[0]==t);for(let j=Math.min(a,b)-1;j<=Math.max(a,b)+1;j++){const x=TABS[j];if(x&&dirty.has(x[0]))rp1(x[0])}
 moveInd();place(1);if(t!=from)fx(t);route(t,t!=from&&!np)}
const TABS=[['dash','Dashboard'],['tx','Transaksi'],['bud','Wishlist'],['goal','Tabungan'],['rep','Laporan'],['set','Pengaturan']];
const navTo=t=>{go(t);closeDw()};
function moveInd(t){t=t||tab;document.querySelectorAll('#nv .sni').forEach(x=>{const on=x.dataset.t==t;x.classList.toggle('on',on);if(on)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current')})}
const OSRM=matchMedia('(prefers-reduced-motion: reduce)').matches;let RM=OSRM||S.an===0;document.documentElement.classList.toggle('na',S.an===0);
function buildPager(){$('#tk').innerHTML=TABS.map(([k,l])=>`<section class="pn" id="p_${k}" role="region" aria-label="${l}"><main><div class="c sk" aria-hidden="true"><i></i><i></i><i></i></div></main></section>`).join('')}
let wc;
function place(a,dx){const t=$('#tk');t.style.willChange='transform';clearTimeout(wc);wc=setTimeout(()=>{t.style.willChange=''},500);const i=TABS.findIndex(x=>x[0]==tab);t.style.transition=a&&!RM?'transform .32s cubic-bezier(.2,.8,.2,1)':'none';t.style.transform=`translateX(calc(${-i*100}% + ${dx||0}px))`;document.querySelectorAll('.pn').forEach(p=>{p.inert=p.id!='p_'+tab})}
const dirty=new Set(),shown={};
function countUp(el,k){const to=+el.dataset.v,from=shown[k]??0;shown[k]=to;if(RM||from===to){el.textContent=R(to);return}const t0=performance.now(),d=Math.min(900,350+Math.abs(to-from)/2e4);el.textContent=R(from);(function f(t){const p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3);el.textContent=R(from+(to-from)*e);if(p<1&&el.isConnected)requestAnimationFrame(f)})(t0)}
function animBars(p){if(RM)return;const b=[...p.querySelectorAll('.pb i[data-w]')];if(!b.length)return;b.forEach(i=>{i.style.transition='none';i.style.width='0%'});void p.offsetWidth;raf2(()=>b.forEach(i=>{i.style.transition='';i.style.width=i.dataset.w+'%'}))}
function replay(p){if(RM)return;const l=p.querySelectorAll('.gr,.zi');l.forEach(e=>{e.style.animation='none'});void p.offsetWidth;l.forEach(e=>{e.style.animation=''})}
function post(p,k){p.querySelectorAll('.big[data-v]').forEach(el=>countUp(el,k));if(k==tab)animBars(p);if(NEWID)p.querySelectorAll(`[data-id="${NEWID}"]`).forEach(e=>e.classList.add('nw'));if(k=='tx')moveFi(0)}
function rp1(k){const p=$('#p_'+k);p.querySelector('main').innerHTML=V[k]();dirty.delete(k);post(p,k)}
function fx(t){const p=$('#p_'+t);if(!p)return;animBars(p);replay(p);if(!RM){const m=p.querySelector('main');m.classList.remove('swp');void m.offsetWidth;m.classList.add('swp')}}
let idl=0;function schedIdle(){if(idl||!dirty.size)return;idl=1;(window.requestIdleCallback||(f=>setTimeout(f,80)))(()=>{idl=0;const k=[...dirty][0];if(k){rp1(k);schedIdle()}},{timeout:600})}
function render(){moveInd();openRow=null;TABS.forEach(([k])=>dirty.add(k));const i=TABS.findIndex(x=>x[0]==tab);[i,i-1,i+1].forEach(j=>{const x=TABS[j];if(x)rp1(x[0])});selUi();schedIdle()}
addEventListener('resize',()=>{moveInd();moveFi(0)});

/* ---------- Forms ---------- */
const catO=t=>S.cat.filter(c=>c.t==t).map(c=>[c.id,c.n]),accO=()=>S.acc.map(a=>[a.id,a.n]),
SEG=[['out','Pengeluaran'],['in','Pemasukan']];
const CFG={
 tx:{t:'transaksi',f:[{k:'t',l:'Jenis',type:'seg',o:()=>SEG},{k:'note',l:'Nama',type:'text',af:1},{k:'m',l:'Nominal (Rp)',type:'number'},{k:'d',l:'Tanggal',type:'date'}],
  d:()=>({t:'out',m:'',c:'',a:'main',d:ymd(new Date()),note:''}),
  ok:v=>{v.a='main';up('tx',v)}},
 acc:{t:'saldo',nodel:1,f:[{k:'b',l:'Saldo saat ini (Rp)',type:'number',af:1},{k:'_n',type:'note',l:'Saldo dihitung dari semua transaksi sampai hari ini. Ubah angka ini untuk menyesuaikan dengan saldo aslimu.'}],d:()=>({n:'Saldo',b:''}),ok:v=>{v.b=v.b-txSum();v.bt=Date.now();up('acc',v)}},
 bud:{t:'wishlist',f:[{k:'n',l:'Nama barang',type:'text',af:1},{k:'m',l:'Harga (Rp)',type:'number'}],d:()=>({n:'',m:''})},
 goal:{t:'tujuan',nodel:1,f:[{k:'n',l:'Nama target (mis. Laptop)',type:'text'},{k:'t',l:'Target nominal (Rp)',type:'number'},{k:'s',l:'Sudah terkumpul (Rp)',type:'number'},{k:'d',l:'Target tanggal',type:'date'}],d:()=>({n:'',t:'',s:0,d:ymd(new Date())})},
};
const up=(key,v)=>{const a=S[key],i=a.findIndex(x=>x.id==v.id);if(i>=0)a[i]={...v};else{const id=uid();NEWID=id;setTimeout(()=>{if(NEWID==id)NEWID=null},2500);a.push({...v,id,...(key=='tx'&&{ts:Date.now()})})}};
function ed(kd,id,ov){const c=CFG[kd],o=id?S[kd].find(x=>x.id==id):null;
 selOff();closeRow();if(kd!='acc'&&!S.acc.length)return al('Tambahkan akun terlebih dulu.');
 form((o?'Ubah ':'Tambah ')+c.t,c.f,o?{...o,...(kd=='acc'&&{b:accBal(o.id)})}:{...c.d(),...ov},v=>{
  return c.ok?c.ok(v):up(kd,v)},o&&!c.nodel?v=>c.del?c.del(v):(S[kd]=S[kd].filter(x=>x.id!=v.id)):0,kd)}
function dep(id){const g=S.goal.find(x=>x.id==id);form('Setor ke '+U(g.n),[{k:'x',l:'Nominal setoran (Rp)',type:'number',af:1}],{x:''},v=>{g.s+=v.x})}
function depB(id){const b=S.bud.find(x=>x.id==id);form('Setor ke budget '+bn(b),[{k:'x',l:'Nominal setoran (Rp)',type:'number',af:1}],{x:''},v=>{b.u=(+b.u||0)+v.x})}
const nf=v=>{v=typeof v=='number'?String(Math.round(v)):String(v??'');const ng=v.trim().startsWith('-'),d=v.replace(/\D/g,'').replace(/^0+(?=\d)/,'');return d?(ng?'-':'')+'Rp'+d.replace(/\B(?=(\d{3})+(?!\d))/g,'.'):ng?'-':''},
pn=v=>{v=String(v||'');const d=v.replace(/\D/g,'');return d?(v.trim().startsWith('-')?-1:1)*+d:0};
function fmtIn(e){const n=e.value.slice(0,e.selectionStart).replace(/\D/g,'').length;e.value=nf(e.value);let c=0,i=0;for(;i<e.value.length&&c<n;i++)if(/\d/.test(e.value[i]))c++;e.setSelectionRange(i,i)}
let F=null;
function form(title,fields,v,ok,del,kd){F={title,fields,v,ok,del,kd};drawF(1)}
function collect(){const f=$('#fm');if(!f||!F)return;F.fields.forEach(x=>{const e=f.elements[x.k];if(e&&x.type!='file')F.v[x.k]=x.type=='number'?pn(e.value):e.value})}
function drawF(sk){if(!F)return;if(!sk)collect();const{title,fields,v,del}=F;
 $('#mo').innerHTML=`<div class="sh" role="dialog" aria-modal="true" aria-labelledby="fh" tabindex="-1"><form id="fm" autocomplete="off" onsubmit="return sub(event)"><h3 id="fh">${title}</h3>${fields.filter(x=>!x.show||x.show(v)).map(x=>{const l=typeof x.l=='function'?x.l(v):x.l;let h;if(x.type=='note')return`<p class="mu" style="margin:12px 0 0;font-size:13px">${l}</p>`;
  if(x.type=='seg')h=`<div class="seg tbs" role="group" aria-labelledby="l_${x.k}">${x.o(v).map(([a,b])=>`<button type="button" class="${v[x.k]==a?'on':''}" data-v="${a}" aria-pressed="${v[x.k]==a}" onclick="sg('${x.k}','${a}')">${b}</button>`).join('')}</div>`;
  else if(x.type=='select')h=`<select id="f_${x.k}" name="${x.k}" onchange="drawF()">${x.o(v).map(([a,b])=>`<option value="${esc(a)}"${v[x.k]==a?' selected':''}>${esc(b)}</option>`).join('')}</select>`;
  else if(x.type=='date')h=dpField(x.k,v[x.k]||ymd(new Date()));
  else{const nm=x.type=='number';h=`<input id="f_${x.k}" name="${x.k}" type="${nm?'text':x.type}" value="${esc(nm?nf(v[x.k]):v[x.k])}" autocomplete="off" autocorrect="off" spellcheck="false" ${nm?'inputmode="numeric" placeholder="Rp0" oninput="fmtIn(this)"':''} ${x.opt?'':'required'}>`}
  return x.type=='seg'?`<label id="l_${x.k}" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">${l}</label>${h}`:`<label for="f_${x.k}">${l}</label>${h}`}).join('')}<div class="act"><button type="button" class="b" onclick="closeF()">Batal</button><button class="b p">Simpan</button></div></form></div>`;
 openLayer($('#mo'))}
function sg(key,x){if(!F)return;collect();F.v[key]=x;if(key=='t'&&x!='tf'&&F.fields.some(f=>f.k=='c'))F.v.c=(S.cat.find(c=>c.t==x)||{}).id;drawF(1)}
function sub(e){e.preventDefault();if(!F)return false;collect();if(F.ok(F.v)===false)return false;save();vib(12);closeF();render();return false}
function delF(){cf('Hapus data ini?',()=>{if(!F)return;const f=F,id=f.v.id;snap();closeF();animRemove(f.kd,new Set([id]),()=>{f.del(f.v);save();render();delToast(1);vib([10,30,10])})})}
function closeF(){closeLayer($('#mo'));F=null}

/* ---------- Pemilih tanggal (roda) ---------- */
const dpLong=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')?P(s).toLocaleDateString(LC(),{day:'numeric',month:'long',year:'numeric'}):'',
dpIco='<svg class="ni" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v15H4zM4 10h16M8 3v4M16 3v4"/></svg>',
DPH=44,dpPad=n=>String(n).padStart(2,'0');
function dpBtn(id,val,fn,short){return`<button type="button" class="dpb" id="${id}" aria-haspopup="dialog" onclick="${fn}"><span data-notr>${esc(short?fd(val,1):dpLong(val))}</span>${dpIco}</button>`}
function dpField(k,val){return`<input type="hidden" id="h_${k}" name="${k}" value="${esc(val)}">${dpBtn('f_'+k,val,`dpForm('${k}')`)}`}
function dpForm(k){const h=$('#h_'+k);if(!h)return;dpOpen(h.value,iso=>{h.value=iso;const b=$('#f_'+k);if(b)b.firstElementChild.textContent=dpLong(iso)})}
function dpRep(k){dpOpen(rp[k],iso=>{rp[k]=iso;render()})}
let DP=null;
const dpIso=()=>DP.y+'-'+dpPad(DP.m+1)+'-'+dpPad(DP.d),dpDays=()=>new Date(DP.y,DP.m+1,0).getDate(),dpIdx=k=>k=='d'?DP.d-1:k=='m'?DP.m:DP.y-1990;
const DPMIN=1990,DPMAX=2099,CHL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',CHR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',CHD='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square" aria-hidden="true"><path d="M5 9l7 7 7-7"/></svg>';
const dpWd=()=>(String(LC()).slice(0,2)=='en'?['Mo','Tu','We','Th','Fr','Sa','Su']:['Sn','Sl','Rb','Km','Jm','Sb','Mg']),dpMn=i=>new Date(2023,i,1).toLocaleDateString(LC(),{month:'short'});
function dpOpen(val,cb){const d=P(/^\d{4}-\d{2}-\d{2}$/.test(val||'')?val:ymd(new Date()));const y=Math.max(DPMIN,Math.min(DPMAX,d.getFullYear()));DP={y:d.getFullYear(),m:d.getMonth(),d:d.getDate(),vy:y,vm:y==d.getFullYear()?d.getMonth():0,mode:'d',cb};
 $('#dp').innerHTML=`<div class="dpc" role="dialog" aria-modal="true" aria-label="Pilih tanggal" tabindex="-1"><div class="cal-h"><button type="button" class="cal-n" id="dppv" aria-label="Sebelumnya" onclick="dpMove(-1)">${CHL}</button><button type="button" class="cal-t" id="dptt" aria-expanded="false" aria-label="Pilih bulan dan tahun" onclick="dpMode()"><span id="dpm" data-notr></span></button><button type="button" class="cal-n" id="dpnx" aria-label="Berikutnya" onclick="dpMove(1)">${CHR}</button></div><div id="dpbody"></div><div class="act"><button type="button" class="b" onclick="dpToday()">Hari ini</button><button type="button" class="b" onclick="dpClose()">Batal</button><button type="button" class="b p" onclick="dpOk()">OK</button></div></div>`;
 dpRender();openLayer($('#dp'))}
function dpRender(fx){const D=DP;if(!D)return;const body=$('#dpbody'),tt=$('#dpm'),td=ymd(new Date());
 if(D.mode=='d'){const first=new Date(D.vy,D.vm,1).getDay(),n=new Date(D.vy,D.vm+1,0).getDate(),inView=D.y==D.vy&&D.m==D.vm;
  tt.textContent=new Date(D.vy,D.vm,1).toLocaleDateString(LC(),{month:'long',year:'numeric'});
  $('#dppv').disabled=D.vy<=DPMIN&&D.vm==0;$('#dpnx').disabled=D.vy>=DPMAX&&D.vm==11;
  let h=`<div class="cal-w" data-notr aria-hidden="true">${dpWd().map(w=>`<span>${w}</span>`).join('')}</div><div class="cal-g" data-notr role="group" aria-label="${tt.textContent}" onkeydown="dpKey(event)" ontouchstart="dpTs(event)" ontouchend="dpTe(event)">`;
  const off=(first+6)%7;
  for(let i=0;i<off;i++){const dt=new Date(D.vy,D.vm,i-off+1),ok=dt.getFullYear()>=DPMIN;
   h+=`<button type="button" class="cal-d out" tabindex="-1" aria-label="${dpLong(ymd(dt))}" onclick="dpPickO(${dt.getFullYear()},${dt.getMonth()},${dt.getDate()})"${ok?'':' disabled'}>${dt.getDate()}</button>`}
  for(let d=1;d<=n;d++){const iso=D.vy+'-'+dpPad(D.vm+1)+'-'+dpPad(d),sel=inView&&D.d==d;
   h+=`<button type="button" class="cal-d${sel?' on':''}${iso==td?' td':''}" data-d="${d}" tabindex="${sel||(!inView&&d==1)?0:-1}" aria-pressed="${sel}"${iso==td?' aria-current="date"':''} aria-label="${dpLong(iso)}" onclick="dpPick(${d})">${d}</button>`}
  for(let i=off+n;i<42;i++){const dt=new Date(D.vy,D.vm,i-off+1),ok=dt.getFullYear()<=DPMAX;
   h+=`<button type="button" class="cal-d out" tabindex="-1" aria-label="${dpLong(ymd(dt))}" onclick="dpPickO(${dt.getFullYear()},${dt.getMonth()},${dt.getDate()})"${ok?'':' disabled'}>${dt.getDate()}</button>`}
  body.innerHTML=h+'</div>'}
 else{tt.textContent=D.vy;$('#dppv').disabled=D.vy<=DPMIN;$('#dpnx').disabled=D.vy>=DPMAX;
  body.innerHTML=`<div class="cal-mg" data-notr role="group" aria-label="${D.vy}">${Array.from({length:12},(_,i)=>{const sel=D.y==D.vy&&D.m==i,now=td.slice(0,7)==D.vy+'-'+dpPad(i+1);return`<button type="button" class="cal-m${sel?' on':''}${now?' td':''}" aria-pressed="${sel}" onclick="dpPickM(${i})">${dpMn(i)}</button>`}).join('')}</div>`}
 $('#dptt').setAttribute('aria-expanded',D.mode=='m');
 if(fx){const b=body.querySelector('.cal-d.on,.cal-m.on')||body.querySelector('.cal-d[tabindex="0"]');if(b)b.focus({preventScroll:true})}}
function dpMove(k){const D=DP;if(!D)return;if(D.mode=='d'){let m=D.vm+k,y=D.vy;if(m<0){m=11;y--}else if(m>11){m=0;y++}if(y<DPMIN||y>DPMAX)return;D.vy=y;D.vm=m}else{const y=D.vy+k;if(y<DPMIN||y>DPMAX)return;D.vy=y}dpRender()}
function dpMode(){const D=DP;if(!D)return;D.mode=D.mode=='d'?'m':'d';dpRender()}
function dpToday(){const D=DP;if(!D)return;const n=new Date(),y=n.getFullYear();if(y<DPMIN||y>DPMAX)return;D.y=D.vy=y;D.m=D.vm=n.getMonth();D.d=n.getDate();D.mode='d';vib(3);dpRender(1)}
function dpPick(d){const D=DP;if(!D)return;D.y=D.vy;D.m=D.vm;D.d=d;vib(3);dpRender(1)}
function dpPickO(y,m,d){const D=DP;if(!D)return;D.y=D.vy=y;D.m=D.vm=m;D.d=d;vib(3);dpRender(1)}

function dpPickM(i){const D=DP;if(!D)return;D.vm=i;D.mode='d';dpRender(1)}
function dpKey(e){const D=DP;if(!D)return;const f=document.activeElement,b=f&&f.dataset&&f.dataset.d?new Date(D.vy,D.vm,+f.dataset.d):new Date(D.y,D.m,D.d),k=e.key,dl={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[k];let t;
 if(dl)t=new Date(b.getFullYear(),b.getMonth(),b.getDate()+dl);
 else if(k=='PageUp'||k=='PageDown'){const x=k=='PageUp'?-1:1,dm=new Date(b.getFullYear(),b.getMonth()+x+1,0).getDate();t=new Date(b.getFullYear(),b.getMonth()+x,Math.min(b.getDate(),dm))}
 else if(k=='Home')t=new Date(b.getFullYear(),b.getMonth(),1);else if(k=='End')t=new Date(b.getFullYear(),b.getMonth()+1,0);else return;
 e.preventDefault();if(t.getFullYear()<DPMIN||t.getFullYear()>DPMAX)return;D.y=D.vy=t.getFullYear();D.m=D.vm=t.getMonth();D.d=t.getDate();dpRender(1)}
let dpT=null;function dpTs(e){const t=e.changedTouches[0];dpT=[t.clientX,t.clientY]}
function dpTe(e){if(!dpT)return;const t=e.changedTouches[0],dx=t.clientX-dpT[0],dy=t.clientY-dpT[1];dpT=null;if(Math.abs(dx)>50&&Math.abs(dy)<40)dpMove(dx<0?1:-1)}
function dpClose(){if(!DP)return;DP=null;closeLayer($('#dp'))}
function dpOk(){const D=DP;if(!D)return;const v=dpIso();dpClose();vib(8);D.cb(v)}



/* ---------- Layers, toast, undo ---------- */
const vib=p=>{if(S.vb===0)return;try{navigator.vibrate&&navigator.vibrate(p)}catch(_){}},raf2=f=>requestAnimationFrame(()=>requestAnimationFrame(f));
function syncInert(){const p=$('#dp').classList.contains('show')||$('#sp').classList.contains('show'),m=['#mo','#dg','#pp','#dp','#sp'].some(s=>$(s).classList.contains('show')),d=$('#dw').classList.contains('show');['header','#pg','#sb'].forEach(s=>{const x=$(s);if(x)x.inert=m||d});$('#dw').inert=m;$('#mo').inert=p;$('#pp').inert=p}
function openLayer(el){const was=el.classList.contains('on');if(!was){el._ret=document.activeElement;el.classList.add('on');void el.offsetWidth}el.classList.add('show');syncInert();if(!was)raf2(()=>{const t=el.querySelector('[autofocus]')||el.querySelector('[tabindex="-1"]');if(t)t.focus({preventScroll:true})})}
function closeLayer(el){if(!el.classList.contains('show'))return;el.classList.remove('show');syncInert();const r=el._ret;el._ret=null;if(r&&r.isConnected&&r.focus)r.focus({preventScroll:true});setTimeout(()=>{if(!el.classList.contains('show')){el.classList.remove('on');el.innerHTML=''}},RM?0:280)}
function sheet(title,body,acts){$('#mo').innerHTML=`<div class="sh" role="dialog" aria-modal="true" aria-labelledby="fh" tabindex="-1"><h3 id="fh">${title}</h3>${body}<div class="act">${acts}</div></div>`;openLayer($('#mo'))}
let DG=null;
function dlg(msg,btns){DG=btns;$('#dg').innerHTML=`<div class="dc" role="alertdialog" aria-modal="true" aria-describedby="dgm" tabindex="-1"><p id="dgm">${msg}</p><div class="act">${btns.map((b,i)=>`<button type="button" class="b ${b[1]||''}" onclick="dgc(${i})">${b[0]}</button>`).join('')}</div></div>`;openLayer($('#dg'))}
function dgc(i){const f=DG&&DG[i][2];DG=null;closeLayer($('#dg'));if(f)f()}
const al=m=>dlg(m,[['OK','p']]),cf=(m,fn,l)=>dlg(m,[['Batal'],[l||'Hapus','s',fn]]);
function toast(m,act,fn,ms){const t=$('#ts');t.classList.toggle('top',!!NFT);clearTimeout(tst);t.style.transition=t.style.transform=t.style.opacity='';t.innerHTML=`<span>${m}</span>${act?`<button type="button" class="ta">${act}</button>`:''}`;if(act)t.querySelector('.ta').onclick=()=>{hideToast();if(fn)fn()};t.classList.add('on');tst=setTimeout(hideToast,ms||4000)}
function hideToast(){clearTimeout(tst);$('#ts').classList.remove('on')}
const snap=()=>{UNDO=JSON.stringify(S)};
function undoDo(){if(!UNDO)return;S=JSON.parse(UNDO);UNDO=null;save();applyTheme();render();vib(10)}
const delToast=n=>toast(n>1?`${n} item dihapus`:'Item dihapus','Urungkan',undoDo,6000);
function animRemove(k,ids,fn){const els=[...document.querySelectorAll(`#p_${k} [data-k="${k}"]`)].filter(e=>ids.has(e.dataset.id));if(!els.length||RM){fn();return}els.forEach(e=>{e.style.maxHeight=e.offsetHeight+'px'});void document.body.offsetWidth;els.forEach(e=>e.classList.add('rm'));setTimeout(fn,250)}

/* ---------- Multi-select ---------- */
let SEL=null,lp=0,lpt=null,lx=0,ly=0;const SELK={tx:'transaksi',bud:'wishlist',goal:'tujuan tabungan'};
function selUi(){document.querySelectorAll('[data-k]').forEach(e=>{const on=!!SEL&&SEL.k==e.dataset.k,s=on&&SEL.ids.has(e.dataset.id);e.classList.toggle('sl',s);
  if(e.classList.contains('r')){if(on)e.setAttribute('aria-pressed',s);else e.removeAttribute('aria-pressed')}
  else if(on){e.setAttribute('role','checkbox');e.setAttribute('aria-checked',s);e.tabIndex=0}else if(e.dataset.k=='goal'){e.setAttribute('role','button');e.removeAttribute('aria-checked');e.tabIndex=0}else{e.removeAttribute('role');e.removeAttribute('aria-checked');e.removeAttribute('tabindex')}});
 const b=$('#sb');if(!SEL){b.classList.remove('on');return}
 $('#sn').textContent=SEL.ids.size;$('#sd').disabled=!SEL.ids.size;b.classList.add('on')}
function selOn(k,id){closeRow();hideToast();SEL={k,ids:new Set([id])};document.body.classList.add('selm');selUi()}
function selStart(k){closeRow();hideToast();SEL={k,ids:new Set(),man:1};document.body.classList.add('selm');selUi();vib(8)}
function selOff(){if(!SEL)return;SEL=null;document.body.classList.remove('selm');selUi()}
function selTog(id){if(!SEL)return;SEL.ids.has(id)?SEL.ids.delete(id):SEL.ids.add(id);if(!SEL.ids.size&&!SEL.man)selOff();else selUi()}
function qaSync(){const q=document.getElementById('qa');if(q)q.hidden=['dash','rep','set'].includes(tab)}
const _goQ=window.go;window.go=function(){const r=_goQ.apply(this,arguments);qaSync();return r};
qaSync();
(()=>{const q=document.getElementById('qa');let d=null,t0=0;
let sup=0;const fire=()=>{const n=performance.now();if(n-t0<500)return;t0=n;sup=n+450;ed(tab)};
window.addEventListener('click',e=>{if(performance.now()<sup){e.stopPropagation();e.preventDefault()}},true);
q.addEventListener('pointerdown',e=>{d=[e.clientX,e.clientY]},{passive:true});
q.addEventListener('pointerup',e=>{if(!d)return;const m=Math.hypot(e.clientX-d[0],e.clientY-d[1]);d=null;if(m<12)fire()});
q.addEventListener('pointercancel',()=>{d=null});
q.addEventListener('click',e=>{e.stopPropagation();fire()});
})();
/* Tap tepat setelah geser halaman: bila browser tidak mengirim klik, teruskan dari pointerup */
(()=>{const SELQ='button,a[href],[onclick],[data-k],[role=button],[role=checkbox],[role=tab]';let ps=null,dn=null,lc=0,sup=0,lastSw=-1e4;
addEventListener('click',e=>{if(performance.now()<sup){e.stopImmediatePropagation();e.preventDefault();return}lc=performance.now()},true);
addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||!e.isPrimary){ps=dn=null;return}const t=e.target.closest&&e.target.closest(SELQ);ps={x:e.clientX,y:e.clientY,s:performance.now()};dn=t&&!t.closest('input,select,textarea,label,#qa')?t:null},true);
addEventListener('pointerup',e=>{const p=ps,t=dn;ps=dn=null;if(!p||e.pointerType==='mouse')return;const n=performance.now(),dx=e.clientX-p.x,dy=e.clientY-p.y;
 if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.2){lastSw=n;return}
 if(!t||Math.hypot(dx,dy)>10||n-p.s>450||n-lastSw>900||lp||DD)return;
 setTimeout(()=>{if(lc>=n-5||!t.isConnected||t.disabled||t.closest('[inert]'))return;t.click();sup=performance.now()+400},60)},true);
})();
function closePm(){const m=document.getElementById('pm');if(m)m.remove();document.removeEventListener('click',pmOut,true)}
function pmOut(e){const m=document.getElementById('pm');if(m&&!m.contains(e.target)&&!e.target.closest('[aria-haspopup="menu"]'))closePm()}
function openPm(btn,kd){const had=document.getElementById('pm');closePm();if(had&&had._b===btn)return;
 const m=document.createElement('div');m.id='pm';m.className='pm';m.setAttribute('role','menu');m._b=btn;
 m.innerHTML=`<button type="button" role="menuitem">Pilih banyak</button><button type="button" role="menuitem">Pilih semua</button>`;
 m.children[0].onclick=()=>{closePm();selStart(kd)};
 m.children[1].onclick=()=>{closePm();selStart(kd);SEL.ids=new Set([...document.querySelectorAll('#p_'+kd+' [data-k]')].map(e=>e.dataset.id));selUi()};
 document.body.appendChild(m);
 const r=btn.getBoundingClientRect();m.style.top=(r.bottom+6)+'px';m.style.right=Math.max(12,innerWidth-r.right)+'px';
 setTimeout(()=>document.addEventListener('click',pmOut,true),0);m.firstChild.focus({preventScroll:true})}
document.addEventListener('keydown',e=>{if(e.key=='Escape')closePm()});
window.addEventListener('scroll',closePm,true);

function selAll(){if(!SEL)return;const a=[...document.querySelectorAll('#p_'+SEL.k+' [data-k]')].map(e=>e.dataset.id);SEL.ids=SEL.ids.size>=a.length?new Set():new Set(a);if(!SEL.ids.size&&!SEL.man)selOff();else selUi()}
function selDel(){if(!SEL||!SEL.ids.size)return;const{k,ids}=SEL,n=ids.size;
 cf(`Hapus ${n} ${SELK[k]} yang dipilih?`,()=>{snap();animRemove(k,ids,()=>{S[k]=S[k].filter(x=>!ids.has(x.id));save();selOff();render();delToast(n);vib([10,30,10])})})}
const LPS='#p_tx [data-k]';
document.addEventListener('pointerdown',e=>{lp=0;clearTimeout(lpt);if(F||SEL||(e.pointerType=='mouse'&&e.button))return;const el=e.target.closest(LPS);if(!el)return;lx=e.clientX;ly=e.clientY;
 lpt=setTimeout(()=>{lp=1;vib(15);ddNoSel();selOn(el.dataset.k,el.dataset.id)},500)});
document.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-lx)>10||Math.abs(e.clientY-ly)>10)clearTimeout(lpt)});
['pointerup','pointercancel'].forEach(t=>document.addEventListener(t,()=>clearTimeout(lpt)));
document.addEventListener('contextmenu',e=>{if(e.target.closest('[data-k]'))e.preventDefault()});
document.addEventListener('click',e=>{const el=e.target.closest('[data-k]');
 if(lp){lp=0;if(el){e.preventDefault();e.stopPropagation()}return}
 if(openRow&&el===openRow&&!e.target.closest('.sa')){e.preventDefault();e.stopPropagation();closeRow();return}
 if(SEL&&el&&el.dataset.k==SEL.k){e.preventDefault();e.stopPropagation();selTog(el.dataset.id)}},true);

/* ---------- Swipe actions (Riwayat Transaksi) ---------- */
let openRow=null,RS=null;const SW_W=144;
function rowTo(e,x,a){e.style.transition=a&&!RM?'transform .24s cubic-bezier(.2,.8,.2,1)':'none';e.style.transform=x?`translateX(${x}px)`:''}
function rowRest(e){setTimeout(()=>{if(openRow!==e&&e.isConnected){e.classList.remove('sx');e.style.transition=''}},290)}
function closeRow(a=1){const e=openRow;if(!e)return;openRow=null;rowTo(e,0,a);rowRest(e)}
function swDel(id){closeRow();snap();animRemove('tx',new Set([id]),()=>{S.tx=S.tx.filter(x=>x.id!=id);save();render();delToast(1);vib([10,30,10])})}
document.addEventListener('pointerdown',e=>{if(openRow&&!e.target.closest('.r.sx'))closeRow();RS=null;return;const el=e.target.closest('#txl .r[data-k="tx"]');if(!el||e.target.closest('.sa'))return;RS={el,x:e.clientX,y:e.clientY,base:el===openRow?-SW_W:0,h:null,id:e.pointerId,dx:0}});
document.addEventListener('pointermove',e=>{const s=RS;if(!s||e.pointerId!=s.id)return;const dx=e.clientX-s.x,dy=e.clientY-s.y;
 if(s.h===null){if(Math.abs(dx)<8&&Math.abs(dy)<8)return;s.h=Math.abs(dx)>Math.abs(dy)*1.2;if(!s.h||(!s.base&&dx>0)){RS=null;return}s.el.classList.add('sx');if(openRow&&openRow!==s.el)closeRow()}
 s.dx=Math.max(-SW_W-24,Math.min(0,s.base+dx));s.el.style.transition='none';s.el.style.transform=`translateX(${s.dx}px)`});
function rsEnd(){const s=RS;RS=null;if(!s||s.h!==true)return;lp=1;const el=s.el;if(s.dx<-SW_W/2){openRow=el;rowTo(el,-SW_W,1);vib(6)}else{if(openRow===el)openRow=null;rowTo(el,0,1);rowRest(el)}}
['pointerup','pointercancel'].forEach(t=>document.addEventListener(t,rsEnd));

/* ---------- Keyboard ---------- */
addEventListener('keydown',e=>{
 if(['Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' ','Home','End'].includes(e.key))document.body.classList.add('kb');
 if(e.key=='Escape'){if($('#sp').classList.contains('show')){spClose();return}if($('#dp').classList.contains('show')){dpClose();return}if($('#pp').classList.contains('show')&&!$('#mo').classList.contains('show')&&!DG){closePp();return}if($('#dw').classList.contains('show')&&!$('#mo').classList.contains('show')&&!DG){closeDw();return}if(DG){dgc(0);return}if($('#mo').classList.contains('show')){closeF();return}if(SEL){selOff();return}if(openRow)closeRow();return}
 if(e.key=='Tab'){const L=$('#sp').classList.contains('show')?$('#sp'):$('#dp').classList.contains('show')?$('#dp'):DG?$('#dg'):$('#mo').classList.contains('show')?$('#mo'):null;if(!L)return;const f=[...L.querySelectorAll('button,input,select,textarea,a[href],[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled&&x.offsetParent!==null);if(!f.length)return;const i=f.indexOf(document.activeElement);
  if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&(i<0||i==f.length-1)){e.preventDefault();f[0].focus()}return}
 if((e.key=='Enter'||e.key==' ')&&e.target.matches&&e.target.matches('[data-k][role="button"],[data-k][role="checkbox"]')){e.preventDefault();e.target.click()}});
addEventListener('pointerdown',()=>document.body.classList.remove('kb'),true);
$('#tk').addEventListener('scroll',e=>{if(openRow&&e.target.id=='p_tx')closeRow()},{capture:true,passive:true});

/* ---------- Sidebar ---------- */
function openDw(){const d=$('#dw');if(d.classList.contains('on')||DK.matches)return;closeRow&&closeRow();d._ret=document.activeElement;d.classList.add('on');void d.offsetWidth;d.classList.add('show');syncInert();raf2(()=>d.querySelector('.pn2').focus({preventScroll:true}))}
function closeDw(){const d=$('#dw');if(!d.classList.contains('show'))return;d.classList.remove('show');syncInert();const r=d._ret;d._ret=null;if(r&&r.isConnected&&r.focus)r.focus({preventScroll:true});setTimeout(()=>{if(!d.classList.contains('show'))d.classList.remove('on')},RM?0:290)}
var NFT=0;function nfToast(m){NFT=1;toast(m,null,null,5000);NFT=0}
function nfSet(k,v){S.nf=Object.assign({d:0,dt:'20:00',w:0,wp:80,ld:'',lw:''},S.nf);S.nf[k]=v;if(k=='d')S.nf.ld='';if(k=='w'||k=='wp')S.nf.lw='';save()}
function nfToday(){const t=new Date();return t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0')}
function nfCheck(){const n=S.nf;if(!n||document.hidden)return;const td=nfToday(),now=new Date(),hm=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');let delay=0;
if(n.w&&n.lw!=td){const ym=td.slice(0,7);let I=0,O=0;(S.tx||[]).forEach(t=>{if(String(t.d).slice(0,7)==ym){if(t.t=='in')I+=t.m;else if(t.t=='out')O+=t.m}});if(I>0&&O>=I*n.wp/100){n.lw=td;save();nfToast('Pengeluaran sudah '+Math.round(O/I*100)+'% dari pemasukan');delay=5600}}
if(n.d&&n.ld!=td&&hm>=n.dt&&!(S.tx||[]).some(t=>t.d==td&&t.t!='tf')){n.ld=td;save();setTimeout(()=>nfToast('Kamu belum mencatat transaksi hari ini.'),delay)}}

const PP={data:['Kontrol data',()=>`<div class="c"><h3>Cadangan data</h3><p class="mu">Data hanya tersimpan di browser ini. Simpan cadangan secara berkala agar tidak hilang.</p><div class="act" style="justify-content:flex-start;margin:0"><button type="button" class="b p" onclick="expData()">Ekspor data</button><button type="button" class="b" onclick="impData()">Impor data</button></div></div><div class="c"><h3>Reset data</h3><p class="mu">Hapus semua transaksi, budget, saldo, dan tabungan. Kategori tetap ada.</p><div class="act" style="justify-content:flex-start;margin:0"><button type="button" class="b d" onclick="resetAll()">Reset semua data</button></div></div>`],set:['Pengaturan',()=>{const row=(t,d,c)=>`<label class="sr"><span><b>${t}</b><small class="mu">${d}</small></span>${c}</label>`,sw=(k,on)=>`<input type="checkbox" class="swt" role="switch"${on?' checked':''} onchange="setPref('${k}',this.checked)">`;
  return`<div class="c sl">${row('Mode gelap','Aktifkan untuk tampilan gelap, matikan untuk tampilan terang.',sw('theme',document.documentElement.getAttribute('data-nx')==='dark').replace('class="swt"','class="swt" id="thm"')).replace('class="sr"','class="sr lp-only"')}${row('Sembunyikan nominal','Tampilkan nominal uang sebagai titik-titik agar privasi terjaga.',sw('hd',!!S.hd))}${row('Getar','Getarkan HP saat menekan lama, menghapus, atau menyimpan.',sw('vb',S.vb!==0))}${row('Animasi','Matikan untuk menghemat baterai atau jika animasi terasa berat.',sw('an',S.an!==0))}${row('Halaman awal','Halaman yang dibuka pertama kali saat aplikasi dimulai.',`<select class="ssel" onchange="setPref('st',this.value)">${TABS.filter(x=>x[0]!='set').map(([v,l])=>`<option value="${v}"${(TABS.some(x=>x[0]==S.st&&x[0]!='set')?S.st:'dash')==v?' selected':''}>${l}</option>`).join('')}</select>`)}</div>`}],
 notif:['Notifikasi',()=>{const n=Object.assign({d:0,dt:'20:00',w:0,wp:80},S.nf),row=(t,d,c)=>`<label class="sr"><span><b>${t}</b><small class="mu">${d}</small></span>${c}</label>`,sw=(k,on)=>`<input type="checkbox" class="swt" role="switch"${on?' checked':''} onchange="nfSet('${k}',this.checked?1:0)">`;
return`<div class="c sl">${row('Pengingat harian','Ingatkan saya mencatat transaksi jika hari ini belum ada yang tercatat.',sw('d',n.d))}${row('Waktu pengingat','Pengingat muncul saat aplikasi dibuka setelah jam ini.',`<input type="time" class="ssel" value="${n.dt}" onchange="if(this.value)nfSet('dt',this.value)">`)}${row('Peringatan pengeluaran','Beri tahu saya jika pengeluaran bulan ini mendekati pemasukan.',sw('w',n.w))}${row('Batas peringatan','Persentase pengeluaran dari pemasukan bulan ini.',`<select class="ssel" onchange="nfSet('wp',+this.value)">${[70,80,90].map(v=>`<option value="${v}"${n.wp==v?' selected':''}>${v}%</option>`).join('')}</select>`)}</div><div class="c"><p class="mu" style="margin:0 0 10px">Pengingat hanya muncul saat aplikasi terbuka. Aplikasi ini tidak mengirim notifikasi saat ditutup.</p><div class="act" style="justify-content:flex-start;margin:0"><button type="button" class="b" onclick="nfToast('Kamu belum mencatat transaksi hari ini.')">Coba pengingat</button></div></div>`}],
 lang:['Bahasa',()=>`<div class="c"><h3>Bahasa aplikasi</h3><p class="mu">Pilih bahasa tampilan aplikasi.</p><div class="seg" role="group" aria-label="Bahasa aplikasi">${[['id','Bahasa Indonesia'],['en','English']].map(([v,l])=>`<button type="button" class="${(S.lang||'id')==v?'on':''}" aria-pressed="${(S.lang||'id')==v}" onclick="setLang('${v}')">${l}</button>`).join('')}</div></div>`]};
let PPK=null;
function openPp(k){const p=$('#pp'),d=PP[k];if(!d)return;PPK=k;$('#ppt').textContent=d[0];$('#ppc').innerHTML=d[1]();const a=document.activeElement;p._ret=a&&a!==document.body?a:$('#av');p.classList.add('on');p.setAttribute('aria-hidden','false');void p.offsetWidth;p.classList.add('show');syncInert();raf2(()=>p.focus({preventScroll:true}))}
function resetAll(){cf('Hapus semua transaksi, budget, saldo, dan tabungan? Anda masih bisa mengurungkannya sesaat setelah ini.',()=>{snap();S.tx=[];S.bud=[];S.goal=[];S.acc=[{id:'main',n:'Saldo',b:0,bt:Date.now()}];save();render();toast('Semua data direset','Urungkan',undoDo,6000);vib([10,30,10])},'Reset')}
function closePp(){const p=$('#pp');if(!p.classList.contains('show'))return;p.classList.remove('show');p.setAttribute('aria-hidden','true');PPK=null;syncInert();const r=p._ret;p._ret=null;if(r&&r.isConnected&&r.focus)r.focus({preventScroll:true});setTimeout(()=>{if(!p.classList.contains('show'))p.classList.remove('on')},RM?0:310)}
/* ---------- Geser toast untuk menutup ---------- */
(()=>{const t=$('#ts');let g=null;
 const rst=()=>{t.style.transition=t.style.transform=t.style.opacity=''};
 t.addEventListener('pointerdown',e=>{if(!t.classList.contains('on')||(e.pointerType=='mouse'&&e.button))return;g={x:e.clientX,y:e.clientY,t:Date.now(),h:null,dx:0,id:e.pointerId}});
 t.addEventListener('pointermove',e=>{if(!g||e.pointerId!=g.id)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;
  if(g.h===null){if(Math.abs(dx)<6&&Math.abs(dy)<6)return;g.h=Math.abs(dx)>Math.abs(dy);if(!g.h){g=null;return}clearTimeout(tst);try{t.setPointerCapture(e.pointerId)}catch(_){}}
  g.dx=dx;t.style.transition='none';t.style.transform=`translateX(${dx}px)`;t.style.opacity=Math.max(.2,1-Math.abs(dx)/(t.offsetWidth*.9))});
 const end=e=>{const s=g;g=null;if(!s||s.h!==true)return;const v=Math.abs(s.dx)/Math.max(1,Date.now()-s.t);
  if(Math.abs(s.dx)>t.offsetWidth*.3||(v>.5&&Math.abs(s.dx)>40)){t.style.transition=RM?'none':'transform .2s ease-out,opacity .2s';t.style.transform=`translateX(${s.dx<0?-120:120}%)`;t.style.opacity='0';vib(6);setTimeout(()=>{hideToast();rst()},RM?0:200)}
  else{t.style.transition=RM?'none':'transform .25s cubic-bezier(.2,.8,.2,1),opacity .2s';t.style.transform='';t.style.opacity='';tst=setTimeout(hideToast,2500);setTimeout(rst,260)}
  const c=ev=>{ev.stopPropagation();ev.preventDefault()};t.addEventListener('click',c,{capture:true,once:true});setTimeout(()=>t.removeEventListener('click',c,true),50)};
 t.addEventListener('pointerup',end);t.addEventListener('pointercancel',end)})();
/* ---------- Backup, restore, theme ---------- */
const backupJSON=()=>JSON.stringify({app:'nexus-finance',v:2,at:new Date().toISOString(),data:S},null,1);
function expData(){sheet('Ekspor data',`<p class="mu" style="margin:6px 0 10px">Simpan file cadangan atau salin teksnya. Impor kembali kapan saja untuk memulihkan data.</p><textarea id="bk" readonly rows="7" aria-label="Isi cadangan" onfocus="this.select()"></textarea>`,`<button type="button" class="b" onclick="closeF()">Tutup</button><button type="button" class="b" onclick="cpData()">Salin</button><button type="button" class="b p" onclick="dlData()">Unduh</button>`);$('#bk').value=backupJSON()}
function cpData(){const t=$('#bk');if(!t)return;t.select();const old=()=>{try{document.execCommand('copy')?toast('Disalin ke clipboard'):toast('Tekan lama teks lalu pilih Salin')}catch(_){toast('Tekan lama teks lalu pilih Salin')}};try{navigator.clipboard.writeText(t.value).then(()=>toast('Disalin ke clipboard'),old)}catch(_){old()}}
function dlData(){const t=$('#bk');if(!t)return;try{const b=new Blob([t.value],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=`nexus-finance-${today}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast('Cadangan diunduh')}catch(_){toast('Gagal mengunduh. Gunakan tombol Salin.')}}
function impData(){sheet('Impor data',`<p class="mu" style="margin:6px 0 10px">Pilih file cadangan (.json) atau tempel isinya. Data saat ini akan <b>diganti</b>.</p><input type="file" id="bf" accept=".json,application/json" onchange="impFile(this)" aria-label="File cadangan"><label for="bt">Atau tempel isi cadangan</label><textarea id="bt" rows="5" placeholder="Tempel isi file cadangan di sini"></textarea>`,`<button type="button" class="b" onclick="closeF()">Batal</button><button type="button" class="b p" onclick="doImp()">Pulihkan</button>`)}
function impFile(i){const f=i.files[0];if(!f)return;if(f.size>5e6){toast('File terlalu besar');return}const r=new FileReader();r.onload=()=>{$('#bt').value=r.result};r.readAsText(f)}
function clean(o){if(!o||typeof o!='object'||![o.tx,o.cat,o.bud,o.goal].every(Array.isArray))return null;
 const id=x=>typeof x=='string'&&/^[\w-]{1,40}$/.test(x),dt=x=>typeof x=='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x),nm=x=>x!==''&&x!==null&&Number.isFinite(+x)?+x:null,st=(x,n)=>String(x??'').slice(0,n);
 const out={acc:[],cat:[],tx:[],bud:[],goal:[]};
 for(const c of o.cat){if(!c||!id(c.id)||(c.t!='in'&&c.t!='out'))return null;out.cat.push({id:c.id,n:st(c.n,60),t:c.t})}
 for(const t of o.tx){if(!t||!id(t.id)||!dt(t.d)||!['in','out','tf'].includes(t.t)||nm(t.m)===null)return null;out.tx.push({id:t.id,t:t.t,m:+t.m,c:st(t.c,40),a:st(t.a,40),...(t.to?{to:st(t.to,40)}:{}),d:t.d,note:st(t.note,200),ts:nm(t.ts)||0})}
 for(const b of o.bud){if(!b||!id(b.id)||nm(b.m)===null)return null;out.bud.push({id:b.id,n:st(b.n,80)||(out.cat.find(c=>c.id==b.c)||{}).n||'',c:st(b.c,40),m:+b.m,u:nm(b.u)||0})}
 for(const g of o.goal){if(!g||!id(g.id)||!dt(g.d)||nm(g.t)===null)return null;out.goal.push({id:g.id,n:st(g.n,80),t:+g.t,s:nm(g.s)||0,d:g.d})}
 for(const a of Array.isArray(o.acc)?o.acc:[]){if(!a||!id(a.id))return null;out.acc.push({id:a.id,n:st(a.n,60),b:nm(a.b)||0,bt:nm(a.bt)||0})}
 if(o.nf&&typeof o.nf=='object'){const q=o.nf;out.nf={d:q.d?1:0,dt:/^\d{2}:\d{2}$/.test(q.dt)?q.dt:'20:00',w:q.w?1:0,wp:[70,80,90].includes(+q.wp)?+q.wp:80,ld:st(q.ld,10),lw:st(q.lw,10)}}if(o.v===2)out.v=2;if(['auto','light','dark'].includes(o.theme))out.theme=o.theme;if(o.ts)out.ts=1;if(o.lang==='en')out.lang='en';if(o.ff==='system')out.ff='system';if(o.hd)out.hd=1;if(o.vb===0)out.vb=0;if(o.an===0)out.an=0;if(['dash','tx','bud','goal','rep'].includes(o.st))out.st=o.st;return out}
function doImp(){const raw=$('#bt')&&$('#bt').value.trim();if(!raw){al('Pilih file atau tempel isi cadangan dulu.');return}let o;try{o=JSON.parse(raw)}catch(e){al('Isi cadangan tidak valid (bukan JSON).');return}
 const c=clean(o&&o.data||o);if(!c){al('Format cadangan tidak dikenali atau datanya rusak.');return}
 cf(`Ganti semua data dengan cadangan ini (${c.tx.length} transaksi)?`,()=>{snap();S=c;migrate();save();closeF();applyTheme();render();toast('Data dipulihkan','Urungkan',undoDo,6000)},'Pulihkan')}
const ICO={light:ic('moon'),dark:ic('sun')};
function setPref(k,v){if(k=='hd')S.hd=v?1:0;else if(k=='vb')S.vb=v?1:0;else if(k=='an'){S.an=v?1:0;RM=OSRM||S.an===0;document.documentElement.classList.toggle('na',S.an===0)}else if(k=='st')S.st=v;else if(k=='theme'){S.theme=v?'dark':'light';S.ts=1}save();if(k=='theme')applyTheme(1);if(k=='hd'){Object.keys(shown).forEach(x=>delete shown[x]);render()}if(k=='vb'&&v)vib(15)}
function applyFont(){document.documentElement.removeAttribute('data-nxf')}
function applyTheme(a){applyFont();const h=document.documentElement,v=S.ts?(S.theme!=='dark'?'light':'dark'):(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');const set=()=>{h.setAttribute("data-nx",v)};const cb=document.getElementById('thm');if(cb)cb.checked=v==='dark';if(a&&!RM&&document.startViewTransition){document.startViewTransition(set)}else{if(a&&!RM){h.classList.add('tt');setTimeout(()=>h.classList.remove('tt'),450)}set()}const tc=document.getElementById('tc');if(tc)tc.setAttribute('content',v==='dark'?'#0B0C0E':'#F7F7F8');const b=document.getElementById('tg');if(b){b.innerHTML=ICO[v];const l=v==='dark'?'Beralih ke tema terang':'Beralih ke tema gelap';b.setAttribute('aria-label',l);b.title=l}}
try{matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>{if(!S.ts)applyTheme(1)})}catch(_){}
function toggleTheme(){S.theme=document.documentElement.getAttribute('data-nx')==='dark'?'light':'dark';S.ts=1;save();applyTheme(1)}

/* ---------- Tab swipe (pager) ---------- */
let sw=null,busy=false;
const nb=d=>{const j=TABS.findIndex(x=>x[0]==tab)+d;return j>=0&&j<TABS.length?TABS[j][0]:null};
document.addEventListener('touchstart',e=>{if(F||SEL||DG||busy||e.touches.length>1||e.target.closest('nav,input,select,textarea,#qa,#mo,#dg,#dp,#sp,#sb,#ts,#dw,#pp')){sw=null;return}const t=e.touches[0];sw={x:t.clientX,y:t.clientY,t:Date.now(),h:null,row:!!e.target.closest('#txl .r[data-k="tx"]')}},{passive:true});
document.addEventListener('touchmove',e=>{if(!sw||busy)return;const t=e.touches[0],dx=t.clientX-sw.x,dy=t.clientY-sw.y;
 if(sw.h===null){if(Math.abs(dx)<8&&Math.abs(dy)<8)return;sw.h=Math.abs(dx)>Math.abs(dy)*1.2;if(!sw.h){sw=null;return}}
 place(0,dx*(nb(dx<0?1:-1)?1:.25))},{passive:true});
const fin=e=>{if(!sw||sw.h!==true){sw=null;return}const dx=e.changedTouches[0].clientX-sw.x,v=Math.abs(dx)/Math.max(1,Date.now()-sw.t),to=nb(dx<0?1:-1),ok=to&&(Math.abs(dx)>innerWidth*.22||(v>.5&&Math.abs(dx)>30));sw=null;busy=true;setTimeout(()=>{busy=false},330);if(ok)go(to);else{moveInd();place(1)}};
document.addEventListener('touchend',fin,{passive:true});document.addEventListener('touchcancel',fin,{passive:true});
/* ---------- Form: naik di atas keyboard, tanpa saran isian otomatis ---------- */
(()=>{
 /* Layout viewport mengecil mengikuti keyboard (resizes-content), jadi posisi form selalu benar dari browser.
    Agar tidak melompat, perpindahannya dianimasikan (FLIP) hanya dengan transform: tanpa overshoot/naik-turun. */
 let top=null,tk=0;
 const sh=()=>document.querySelector('#mo.show .sh');
 const track=()=>{const s=sh();top=s?s.offsetTop:null};
 addEventListener('resize',()=>{
  const s=sh();if(!s||top==null){track();return}
  const nt=s.offsetTop,d=top-nt;top=nt;
  if(Math.abs(d)<24||RM)return;
  const id=++tk;
  s.style.transition='none';s.style.transform=`translate3d(0,${d}px,0)`;s.getBoundingClientRect();
  requestAnimationFrame(()=>{if(id!==tk)return;s.style.transition='transform .3s cubic-bezier(.2,.8,.2,1)';s.style.transform='';
   setTimeout(()=>{if(id===tk){s.style.transition='';s.style.transform=''}},360)})});
 document.addEventListener('focusin',e=>{const t=e.target;if(!t||!t.matches||!t.matches('input,textarea,select'))return;
  if(t.matches('input:not([type=file]):not([type=checkbox]):not([type=radio]),textarea')){t.setAttribute('autocomplete','off');t.setAttribute('autocorrect','off')}
  if(t.closest('#mo .sh')){track();const s=t.closest('.sh');if(s.scrollHeight>s.clientHeight+2)setTimeout(()=>{if(document.activeElement===t&&t.isConnected)t.scrollIntoView({block:'nearest',behavior:RM?'auto':'smooth'})},350)}});
 document.addEventListener('focusout',()=>setTimeout(track,400))})();
/* ---------- Wishlist & Tabungan: tekan lama lalu geser untuk mengurutkan ---------- */
let DD=null,ddp=null,ddSettle=0,ddSupp=0;
const DD_MS=450,DD_SLOP=8,DD_EDGE=56,DD_SEL='#wll .r[data-k="bud"],#p_goal .g2>.c[data-k="goal"]';
function ddPendClear(){if(ddp){clearTimeout(ddp.t);ddp=null}}
document.addEventListener('pointerdown',e=>{
 ddPendClear();
 if(DD||ddSettle||!e.isPrimary||F||SEL||DG||busy||(e.pointerType=='mouse'&&e.button))return;
 const el=e.target.closest(DD_SEL);if(!el)return;
 const p=ddp={id:e.pointerId,x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,el,t:setTimeout(()=>{if(ddp!==p)return;ddp=null;ddStart(p)},DD_MS)}});
addEventListener('pointermove',e=>{if(!ddp||e.pointerId!=ddp.id)return;ddp.x=e.clientX;ddp.y=e.clientY;if(Math.abs(e.clientX-ddp.x0)>DD_SLOP||Math.abs(e.clientY-ddp.y0)>DD_SLOP)ddPendClear()},true);
['pointerup','pointercancel'].forEach(t=>addEventListener(t,e=>{if(ddp&&e.pointerId==ddp.id)ddPendClear()},true));
/* klik setelah drag tidak boleh membuka form edit; hanya berlaku sesaat (tanpa flag yang bisa tersangkut) */
/* cegah seleksi teks bawaan browser (highlight biru) saat tekan lama pada item yang bisa diseret */
document.addEventListener('selectstart',e=>{const t=e.target.nodeType==1?e.target:e.target.parentElement;if(DD||ddp||ddSettle||(t&&t.closest&&t.closest(DD_SEL+',#p_tx [data-k]')))e.preventDefault()},true);
const ddNoSel=()=>{try{const g=getSelection();g&&g.removeAllRanges()}catch(_){}};
addEventListener('click',e=>{if(performance.now()<ddSupp){e.preventDefault();e.stopPropagation()}},true);
function ddStart(p){
 const el=p.el;if(DD||ddSettle||!el.isConnected||F||SEL||DG)return;
 const k=el.dataset.k,sc=$('#p_'+k),list=el.parentElement,rows=[...list.children].filter(r=>r.matches('[data-k="'+k+'"]')),from=rows.indexOf(el);
 if(from<0||!sc)return;
 const sr=sc.getBoundingClientRect(),sc0=sc.scrollTop,tops=[],lefts=[],hs=[],ws=[];
 rows.forEach(r=>{const b=r.getBoundingClientRect();tops.push(b.top-sr.top+sc0);lefts.push(b.left-sr.left);hs.push(b.height);ws.push(b.width)});
 const n=rows.length,grid=lefts.some(l=>Math.abs(l-lefts[0])>2),
  s=DD={k,id:p.id,el,rows,from,n,tops,lefts,hs,ws,grid,gap:n>1&&!grid?Math.max(0,tops[1]-tops[0]-hs[0]):0,sc,sc0,startX:p.x,startY:p.y,px:p.x,py:p.y,target:from,sx:0,sy:0,raf:0,ended:false,ids:rows.map(r=>r.dataset.id),ac:new AbortController(),
  minY:Math.min(...tops)-tops[from],maxY:Math.max(...tops.map((t,i)=>t+hs[i]))-tops[from]-hs[from],
  minX:Math.min(...lefts)-lefts[from],maxX:Math.max(...lefts.map((l,i)=>l+ws[i]))-lefts[from]-ws[from]},o={signal:s.ac.signal};
 sw=null;ddNoSel();
 rows.forEach(r=>r.classList.add(r===el?'dgl':'dgi'));
 sc.style.overflowY='hidden';
 try{el.setPointerCapture(p.id)}catch(_){}
 addEventListener('pointermove',ev=>{if(ev.pointerId==s.id){s.px=ev.clientX;s.py=ev.clientY}},{...o,capture:true});
 addEventListener('pointerup',ev=>{if(ev.pointerId==s.id)ddEnd(s,true)},{...o,capture:true});
 addEventListener('pointercancel',ev=>{if(ev.pointerId==s.id)ddEnd(s,false)},{...o,capture:true});
 addEventListener('touchmove',ev=>{if(ev.cancelable)ev.preventDefault();ev.stopPropagation()},{...o,capture:true,passive:false});
 addEventListener('contextmenu',ev=>ev.preventDefault(),{...o,capture:true});
 addEventListener('keydown',ev=>{if(ev.key=='Escape')ddEnd(s,false)},{...o,capture:true});
 addEventListener('blur',()=>ddEnd(s,false),o);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)ddEnd(s,false)},o);
 vib(15);
 s.raf=requestAnimationFrame(()=>ddFrame(s))}
function ddFrame(s){
 if(DD!==s||s.ended)return;
 if(!s.el.isConnected){ddEnd(s,false);return}
 const r=s.sc.getBoundingClientRect();let v=0;
 if(s.py<r.top+DD_EDGE)v=-Math.min(1,(r.top+DD_EDGE-s.py)/DD_EDGE);else if(s.py>r.bottom-DD_EDGE)v=Math.min(1,(s.py-(r.bottom-DD_EDGE))/DD_EDGE);
 if(v)s.sc.scrollTop+=Math.sign(v)*Math.max(1,Math.round(Math.abs(v)*14));
 /* posisi dihitung dari titik awal (bukan akumulasi delta) + kompensasi scroll */
 const dy=Math.max(s.minY,Math.min(s.maxY,(s.py-s.startY)+(s.sc.scrollTop-s.sc0))),dx=s.grid?Math.max(s.minX,Math.min(s.maxX,s.px-s.startX)):0;
 s.el.style.transform=`translate3d(${dx}px,${dy}px,0) scale(1.02)`;
 const cy=s.tops[s.from]+s.hs[s.from]/2+dy,cx=s.lefts[s.from]+s.ws[s.from]/2+dx;let t=0;
 if(!s.grid){/* daftar satu kolom: hitung item lain yang titik tengah aslinya di atas */
  for(let i=0;i<s.n;i++)if(i!==s.from&&s.tops[i]+s.hs[i]/2<cy)t++}
 else{/* grid: slot asli terdekat */
  let b=1/0;for(let j=0;j<s.n;j++){const a=s.lefts[j]+s.ws[j]/2-cx,c=s.tops[j]+s.hs[j]/2-cy,d=a*a+c*c;if(d<b){b=d;t=j}}}
 if(t!==s.target){s.target=t;ddShift(s);vib(6)}
 s.raf=requestAnimationFrame(()=>ddFrame(s))}
function ddShift(s){
 const ord=[];for(let i=0;i<s.n;i++)if(i!==s.from)ord.push(i);ord.splice(s.target,0,s.from);
 const nt=[],nl=[];
 if(s.grid)ord.forEach((i,j)=>{nt[i]=s.tops[j];nl[i]=s.lefts[j]});
 else{let cur=s.tops[0];ord.forEach(i=>{nt[i]=cur;nl[i]=s.lefts[i];cur+=s.hs[i]+s.gap})}
 s.rows.forEach((r,i)=>{if(i===s.from)return;const y=nt[i]-s.tops[i],x=nl[i]-s.lefts[i];r.style.transform=x||y?`translate3d(${x}px,${y}px,0)`:''});
 s.sx=nl[s.from]-s.lefts[s.from];s.sy=nt[s.from]-s.tops[s.from]}
function ddEnd(s,commit){
 if(DD!==s||s.ended)return;s.ended=true;cancelAnimationFrame(s.raf);s.ac.abort();
 try{s.el.releasePointerCapture(s.id)}catch(_){}
 ddSupp=performance.now()+400;DD=null;
 if(!commit){s.target=s.from;s.sx=s.sy=0;s.rows.forEach(r=>{if(r!==s.el)r.style.transform=''})}
 s.el.classList.add('dgs');s.el.style.transform=s.sx||s.sy?`translate3d(${s.sx}px,${s.sy}px,0)`:'';
 ddSettle=setTimeout(()=>{ddSettle=0;
  s.rows.forEach(r=>{r.classList.remove('dgl','dgi','dgs');r.style.transform=''});
  s.sc.style.overflowY='';
  if(commit&&s.target!==s.from)ddCommit(s)},RM?0:220)}
function ddCommit(s){
 const ids=s.ids.slice(),[m]=ids.splice(s.from,1);ids.splice(s.target,0,m);
 const L=S[s.k],mp=new Map(L.map(b=>[String(b.id),b])),out=[];
 ids.forEach(id=>{const b=mp.get(String(id));if(b){out.push(b);mp.delete(String(id))}});
 S[s.k]=out.concat(L.filter(b=>mp.has(String(b.id))));
 save();render()}
/* ---------- Bahasa / Translate ---------- */
const LC=()=>S.lang==='en'?'en-GB':'id-ID';
const EN={'Menu utama':'Main menu','Buka pengaturan':'Open settings','Bahasa':'Language','Tercapai':'Achieved','Nama dan foto profil':'Name and profile photo','Pengingat dan peringatan':'Reminders and alerts','Ekspor, impor, dan reset data':'Export, import, and reset data','Buka menu':'Open menu','Tutup menu':'Close menu','Kembali':'Back','Menu':'Menu','Dashboard':'Dashboard','Transaksi':'Transactions','Saldo':'Balance','Budget':'Budget','Tabungan':'Savings','Laporan':'Reports',
'Kontrol data':'Data controls','Pengaturan':'Settings','Belum ada pengaturan.':'No settings yet.','Bahasa aplikasi':'App language','Pilih bahasa tampilan aplikasi.':'Choose the display language of the app.',
'Cadangan data':'Data backup','Foto diperbarui':'Photo updated','Foto dihapus':'Photo removed','Upload':'Upload','Sembunyikan nominal':'Hide amounts','Tampilkan nominal uang sebagai titik-titik agar privasi terjaga.':'Show money amounts as dots to keep your balance private.','Mode gelap':'Dark mode','Aktifkan untuk tampilan gelap, matikan untuk tampilan terang.':'Turn on for the dark appearance, turn off for the light one.','Getar':'Vibration','Getarkan HP saat menekan lama, menghapus, atau menyimpan.':'Vibrate your phone on long-press, delete, or save.','Animasi':'Animations','Matikan untuk menghemat baterai atau jika animasi terasa berat.':'Turn off to save battery or if animations feel heavy.','Halaman awal':'Start page','Halaman yang dibuka pertama kali saat aplikasi dimulai.':'The page shown first when the app starts.','Pilih jenis huruf aplikasi.':'Choose the app typeface.','Nama barang':'Item name','Harga (Rp)':'Price (Rp)','Total Harga':'Total Price','Wishlist masih kosong':'Your wishlist is empty','Catat barang yang ingin kamu beli.':'Note down things you want to buy.','Tekan Tambah untuk mencatat barang yang ingin kamu beli.':'Tap Add to note down things you want to buy.','Profil':'Profile','Notifikasi':'Notifications','Ubah foto':'Change photo','Hapus foto':'Remove photo','Nama lengkap':'Full name','Profil disimpan':'Profile saved','Pilih file gambar':'Choose an image file','Gagal memuat foto':'Failed to load the photo','Reset data':'Reset data','Hapus semua transaksi, budget, saldo, dan tabungan. Kategori tetap ada.':'Delete all transactions, budgets, balance, and savings. Categories are kept.','Reset semua data':'Reset all data','Hapus semua transaksi, budget, saldo, dan tabungan? Anda masih bisa mengurungkannya sesaat setelah ini.':'Delete all transactions, budgets, balance, and savings? You can still undo this right after.','Reset':'Reset','Semua data direset':'All data has been reset','Data hanya tersimpan di browser ini. Simpan cadangan secara berkala agar tidak hilang.':'Data is only stored in this browser. Back it up regularly so it is not lost.','Ekspor data':'Export data','Impor data':'Import data',
'Simpan file cadangan atau salin teksnya. Impor kembali kapan saja untuk memulihkan data.':'Save the backup file or copy its text. Import it again any time to restore your data.','Isi cadangan':'Backup contents','Tutup':'Close','Salin':'Copy','Unduh':'Download',
'Pilih file cadangan (.json) atau tempel isinya. Data saat ini akan':'Choose a backup file (.json) or paste its contents. Current data will be','diganti':'replaced','File cadangan':'Backup file','Atau tempel isi cadangan':'Or paste the backup contents','Tempel isi file cadangan di sini':'Paste the backup file contents here','Pulihkan':'Restore',
'Disalin ke clipboard':'Copied to clipboard','Tekan lama teks lalu pilih Salin':'Long-press the text, then choose Copy','Cadangan diunduh':'Backup downloaded','Gagal mengunduh. Gunakan tombol Salin.':'Download failed. Use the Copy button.','File terlalu besar':'File is too large','Data dipulihkan':'Data restored',
'Pilih file atau tempel isi cadangan dulu.':'Choose a file or paste the backup contents first.','Isi cadangan tidak valid (bukan JSON).':'Invalid backup contents (not JSON).','Format cadangan tidak dikenali atau datanya rusak.':'Backup format not recognised or the data is corrupted.',
'Penyimpanan gagal, data tidak tersimpan. Ekspor data untuk cadangan.':'Saving failed, data was not saved. Export your data as a backup.',
'Beralih ke tema terang':'Switch to light theme','Beralih ke tema gelap':'Switch to dark theme','Aksi item terpilih':'Selected item actions','dipilih':'selected','Semua':'All','Batal':'Cancel','Hapus':'Delete','Ubah':'Edit','Simpan':'Save','Urungkan':'Undo','Item dihapus':'Item deleted','Hapus data ini?':'Delete this data?',
'Tambah':'Add','Pilih beberapa':'Select multiple','Pilih banyak':'Select multiple','Tambah cepat':'Quick add','Pilih semua':'Select all','Opsi lainnya':'More options','Riwayat Transaksi':'Transaction History','Budget Bulanan':'Monthly Budget','Tujuan tabungan':'Savings goals','Filter transaksi':'Filter transactions','Masuk':'Income','Keluar':'Expenses',
'Total saldo':'Total balance','Pemasukan':'Income','Pengeluaran':'Expenses','Sisa bulan ini':'Left this month','Pemasukan vs pengeluaran':'Income vs expenses','Pengeluaran bulan ini':'Expenses this month','Transaksi terbaru':'Latest transactions','Lihat semua':'See all',
'Atur saldo':'Set balance','Saldo dihitung dari semua transaksi sampai hari ini. Ubah angka ini untuk menyesuaikan dengan saldo aslimu.':'The balance is calculated from all transactions up to today. Change this number to match your real balance.','Saldo dihitung dari semua transaksi sampai hari ini, termasuk yang bertanggal bulan lalu. Transaksi bertanggal ke depan baru dihitung saat tanggalnya tiba. Tekan Atur saldo untuk menyesuaikan dengan kondisi asli.':'The balance is calculated from all transactions up to today, including those dated last month. Future-dated transactions are counted once their date arrives. Tap Set balance to match your real balance.',
'Aman':'Safe','Belum aman':'Not safe yet','Target tercapai':'Target reached','Transfer':'Transfer',
'Belum ada data':'No data yet','Mulai mencatat untuk melihat ringkasan di sini.':'Start recording to see a summary here.','Belum ada budget':'No budgets yet','Atur batas pengeluaran per kategori.':'Set a spending limit per category.','Atur batas pengeluaran per kategori agar belanja lebih terkontrol.':'Set a spending limit per category to keep spending under control.',
'Belum ada tabungan':'No savings yet','Catat tabungan yang ingin kamu kumpulkan.':'Note down the savings you want to build.','Tekan Tambah untuk mencatat tabungan yang ingin kamu kumpulkan.':'Tap Add to note down the savings you want to build.','Belum ada transaksi':'No transactions yet','Catat transaksi pertamamu dari menu Transaksi.':'Record your first transaction from the Transactions menu.',
'Tekan Tambah untuk mencatat transaksi pertamamu.':'Tap Add to record your first transaction.','Tidak ada transaksi':'No transactions','Belum ada transaksi untuk filter ini.':'No transactions for this filter yet.','Belum ada pengeluaran di periode ini.':'No expenses in this period.',
'Terbesar:':'Largest:','Hari ini':'Today','Bantuan':'Help','Pertanyaan umum':'Common questions','Bagaimana cara mengatur saldo?':'How do I adjust my balance?','Ketuk nominal Total saldo di Dashboard, lalu atur saldonya pada jendela yang muncul.':'Tap the Total balance amount on the Dashboard, then adjust it in the window that appears.','Bagaimana cara mengubah nama pengguna dan foto?':'How do I change my username and photo?','Buka Pengaturan lalu pilih Profil. Nama pengguna akan tampil di sebelah foto Anda.':'Open Settings and choose Profile. Your username appears next to your photo.','Bagaimana melihat laporan periode tertentu?':'How do I view a report for a specific period?','Buka menu Laporan, lalu pilih periode di bagian atas. Pilih Custom range untuk menentukan tanggal sendiri.':'Open the Reports menu and choose a period at the top. Choose Custom range to set your own dates.','Bagaimana cara mengatur pengingat?':'How do I set up reminders?','Buka Pengaturan lalu pilih Notifikasi. Pengingat hanya muncul saat aplikasi sedang dibuka.':'Open Settings and choose Notifications. Reminders only appear while the app is open.','Bagaimana cara mengganti bahasa?':'How do I change the language?','Buka Pengaturan lalu pilih Bahasa.':'Open Settings and choose Language.','Di mana data saya disimpan?':'Where is my data stored?','Data disimpan di browser pada perangkat ini dan tidak dikirim ke server. Data tidak tersinkron antar perangkat, dan akan hilang jika data browser dihapus.':'Your data is stored in the browser on this device and is not sent to a server. It does not sync between devices and will be lost if the browser data is cleared.','Bagaimana cara mencadangkan data?':'How do I back up my data?','Buka Pengaturan, pilih Kontrol data, lalu Ekspor data. Gunakan Impor data untuk memulihkannya. Sebaiknya lakukan secara berkala.':'Open Settings, choose Data controls, then Export data. Use Import data to restore it. It is best to do this regularly.','Bagaimana jika saya tidak sengaja mereset data?':'What if I reset my data by accident?','Setelah Reset semua data, tombol Urungkan muncul sesaat. Ketuk segera untuk mengembalikannya.':'After Reset all data, an Undo button appears briefly. Tap it right away to restore your data.','Pengingat harian':'Daily reminder','Ingatkan saya mencatat transaksi jika hari ini belum ada yang tercatat.':'Remind me to log a transaction if none has been recorded today.','Waktu pengingat':'Reminder time','Pengingat muncul saat aplikasi dibuka setelah jam ini.':'The reminder appears when you open the app after this time.','Peringatan pengeluaran':'Spending alert','Beri tahu saya jika pengeluaran bulan ini mendekati pemasukan.':'Let me know when this month spending nears your income.','Batas peringatan':'Alert threshold','Persentase pengeluaran dari pemasukan bulan ini.':'Spending as a percentage of this month income.','Pengingat hanya muncul saat aplikasi terbuka. Aplikasi ini tidak mengirim notifikasi saat ditutup.':'Reminders only appear while the app is open. This app does not send notifications while closed.','Coba pengingat':'Try a reminder','Nama pengguna':'Username','Dari':'From','Sampai':'To','Ketuk saldo untuk mengatur':'Tap balance to adjust','Minggu ini':'This week','Bulan ini':'This month','Tahun ini':'This year','Custom range':'Custom range','Belum ada data periode lalu':'No data for the previous period','Selisih':'Difference','Defisit':'Deficit','Surplus':'Surplus','Rincian pengeluaran':'Expense breakdown','Nama':'Name','Tanpa nama':'No name','Tren pengeluaran':'Expense trend',
'Jenis':'Type','Pilih tanggal':'Select date','Bulan':'Month','Tahun':'Year','Oke':'OK','Sebelumnya':'Previous','Berikutnya':'Next','Nominal (Rp)':'Amount (Rp)','Kategori':'Category','Tanggal':'Date','Catatan (opsional)':'Note (optional)','Saldo saat ini (Rp)':'Current balance (Rp)','Budget saat ini (Rp)':'Current budget (Rp)','Target budget (Rp)':'Budget target (Rp)','Nama target (mis. Laptop)':'Target name (e.g. Laptop)','Target nominal (Rp)':'Target amount (Rp)','Sudah terkumpul (Rp)':'Saved so far (Rp)','Target tanggal':'Target date','Nominal setoran (Rp)':'Deposit amount (Rp)',
'Tambahkan akun terlebih dulu.':'Add an account first.',
'Gaji':'Salary','Bonus':'Bonus','Freelance':'Freelance','Investasi':'Investment','Lainnya':'Other','Makanan':'Food','Transportasi':'Transport','Belanja':'Shopping','Tagihan':'Bills','Hiburan':'Entertainment','Kesehatan':'Health','Pendidikan':'Education','Kebutuhan rumah':'Household',
'Gaji bulanan':'Monthly salary','Sewa kos':'Boarding house rent','Internet & listrik':'Internet & electricity','Makan siang':'Lunch','Belanja dapur':'Groceries','Ojek online':'Ride-hailing','Bensin':'Fuel','Nonton & kopi':'Movies & coffee','Belanja bulanan':'Monthly shopping','Proyek freelance':'Freelance project','Dana darurat':'Emergency fund','Laptop':'Laptop','Liburan':'Vacation','Motor':'Motorbike','Kartu Kredit':'Credit card'};
const NOUN={transaksi:'transaction',saldo:'balance',budget:'budget',tujuan:'goal',wishlist:'wishlist item','tujuan tabungan':'savings goals'};
const tc=x=>EN[x]||glo(x);
const RX=[[/^(Ubah|Tambah) (transaksi|saldo|wishlist|tujuan)$/,m=>(m[1]=='Ubah'?'Edit ':'Add ')+NOUN[m[2]]],[/^Setor ke budget (.+)$/,m=>'Deposit to budget '+tc(m[1])],[/^Setor ke (.+)$/,m=>'Deposit to '+tc(m[1])],
[/^Hapus (\d+) (transaksi|wishlist|tujuan tabungan) yang dipilih\?$/,m=>`Delete the ${m[1]} selected ${m[2]=='transaksi'?(m[1]>1?'transactions':'transaction'):m[2]=='wishlist'?(m[1]>1?'wishlist items':'wishlist item'):(m[1]>1?'savings goals':'savings goal')}?`],[/^(\d+) item dihapus$/,m=>m[1]+' items deleted'],
[/^Muat lebih banyak \((\d+) lagi\)$/,m=>`Load more (${m[1]} left)`],[/^Perlu (.+)\/bulan$/,m=>`Need ${m[1]}/month`],[/^Kurang (Rp.+)$/,m=>'Short by '+m[1]],[/^Budget (.+)$/,m=>'Budget '+tc(m[1])],[/^Tabungan (.+)$/,m=>'Savings '+tc(m[1])],
[/^Puncak (.+)\/(bln|hari)$/,m=>`Peak ${m[1]}/${m[2]=='bln'?'mo':'day'}`],[/^([▲▼=]) (\d+)% vs periode lalu$/,m=>`${m[1]} ${m[2]}% vs previous period`],[/^Ganti semua data dengan cadangan ini \((\d+) transaksi\)\?$/,m=>`Replace all data with this backup (${m[1]} transactions)?`],[/^([^·]+) · (.+)$/,m=>tc(m[1])+' · '+m[2]],[/^(\d+(?:\.\d)?)(jt|rb)$/,m=>m[1]+(m[2]=='jt'?'M':'K')]];
const GL={'makan siang':'lunch','makan malam':'dinner','makan pagi':'breakfast','uang saku':'allowance','rumah sakit':'hospital','rumah tangga':'household','dana darurat':'emergency fund','orang tua':'parents','tarik tunai':'cash withdrawal','paket data':'data plan','kartu kredit':'credit card','sewa kos':'boarding house rent','belanja bulanan':'monthly shopping','belanja dapur':'groceries','ojek online':'ride-hailing','kebutuhan rumah':'household needs','uang kuliah':'tuition','uang jajan':'pocket money',
gaji:'salary',tabungan:'savings',tabung:'save',dana:'fund',darurat:'emergency',liburan:'vacation',wisata:'trip',nikah:'wedding',pernikahan:'wedding',rumah:'house',kontrakan:'rent',sewa:'rent',kos:'boarding house',kost:'boarding house',listrik:'electricity',air:'water',pdam:'water bill',pulsa:'phone credit',makan:'food',makanan:'food',minum:'drinks',minuman:'drinks',sarapan:'breakfast',kopi:'coffee',jajan:'snacks',camilan:'snacks',belanja:'shopping',bulanan:'monthly',mingguan:'weekly',harian:'daily',tahunan:'yearly',dapur:'kitchen',bensin:'fuel',parkir:'parking',tol:'toll',ojek:'motorcycle taxi',ojol:'ride-hailing',taksi:'taxi',kereta:'train',tiket:'ticket',pesawat:'flight',motor:'motorbike',mobil:'car',sepeda:'bicycle',ponsel:'phone',handphone:'phone',baju:'clothes',pakaian:'clothes',sepatu:'shoes',tas:'bag',hadiah:'gift',kado:'gift',donasi:'donation',sedekah:'charity',arisan:'rotating savings',cicilan:'installment',kredit:'credit',kartu:'card',utang:'debt',hutang:'debt',pinjaman:'loan',bayar:'pay',pembayaran:'payment',pelunasan:'repayment',asuransi:'insurance',pajak:'tax',kesehatan:'health',obat:'medicine',dokter:'doctor',klinik:'clinic',pendidikan:'education',sekolah:'school',kuliah:'college',buku:'books',kursus:'course',hiburan:'entertainment',nonton:'movies',bioskop:'cinema',langganan:'subscription',musik:'music',olahraga:'sports',investasi:'investment',saham:'stocks',reksadana:'mutual funds',emas:'gold',kripto:'crypto',deposito:'time deposit',bunga:'interest',dividen:'dividend',proyek:'project',usaha:'business',bisnis:'business',jualan:'sales',penjualan:'sales',pendapatan:'income',pemasukan:'income',pengeluaran:'expenses',tagihan:'bills',kebutuhan:'needs',keperluan:'needs',lainnya:'other',tunai:'cash',saldo:'balance',awal:'initial',tambahan:'extra',lembur:'overtime',thr:'holiday bonus',pengembalian:'refund',anak:'kids',keluarga:'family',ibu:'mom',ayah:'dad',pacar:'partner',teman:'friends',perabot:'furniture',perawatan:'maintenance',perbaikan:'repair',renovasi:'renovation',kebersihan:'cleaning',cuci:'laundry',galon:'water gallon',beli:'buy',iuran:'dues',cadangan:'backup',warung:'food stall',sembako:'groceries',elektronik:'electronics',kebun:'garden',hewan:'pets',kucing:'cat',anjing:'dog',servis:'service',hp:'phone',tv:'TV',bengkel:'repair shop',salon:'salon',cukur:'haircut',pangkas:'haircut',kemarin:'yesterday',di:'at',ke:'to',dari:'from',untuk:'for',dan:'and'};
const GLR=new RegExp('(?<![A-Za-z])('+Object.keys(GL).sort((a,b)=>b.length-a.length).join('|')+')(?![A-Za-z])','gi');
function glo(t){if(t.length>80||/[@<>]/.test(t))return t;let n=0;const r=t.replace(GLR,w=>{const l=w.toLowerCase();if(!['untuk','dan','di','ke','dari'].includes(l))n++;const e=GL[l];return w[0]===w[0].toUpperCase()&&w[0]!==w[0].toLowerCase()?e[0].toUpperCase()+e.slice(1):e});return n?r:t}
const DAYS=/^(\s*)(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) (?=\d)/;
const cos=x=>x.replace(/\bSept\b/g,'Sep').replace(DAYS,'$1$2, ');
const SM=t=>t.replace(/[\u2063\u2064]/g,'');
function trs(t){if(t.indexOf('\u2063')<0)return trsC(t);const k=[];const p=t.replace(/\u2063([\s\S]*?)\u2064/g,(_,x)=>{k.push(x);return '\u2063'+(k.length-1)+'\u2064'});return trsC(p).replace(/\u2063(\d+)\u2064/g,(_,i)=>k[i])}
function trsC(t){const m=/^(\s*)([\s\S]*?)(\s*)$/.exec(t);if(!m[2])return t;let c=EN[m[2]];if(c===undefined)for(const[r,f]of RX){const x=r.exec(m[2]);if(x){c=f(x);break}}if(c===undefined)c=glo(m[2]);return cos(m[1]+c+m[3])}
const TN=new WeakMap(),AT=['aria-label','title','placeholder'];
function tNode(n){const pe=n.parentNode;if(pe&&pe.closest&&pe.closest('[data-notr]'))return;const v=n.nodeValue,r=TN.get(n),o=r&&v===r.t?r.o:v,res=S.lang==='en'?trs(o):SM(o);if(res!==v){TN.set(n,{o,t:res});n.nodeValue=res}}
function tAttr(e){for(const a of AT){if(!e.hasAttribute(a))continue;const v=e.getAttribute(a),k='_o'+a,r=e[k],o=r&&v===r.t?r.o:v,res=S.lang==='en'?trs(o):SM(o);if(res!==v){e[k]={o,t:res};e.setAttribute(a,res)}}}
function tAll(root){if(!root)return;if(root.nodeType==3){tNode(root);return}if(root.nodeType!=1)return;if(/^(SCRIPT|STYLE|TEXTAREA)$/.test(root.tagName))return;tAttr(root);const w=document.createTreeWalker(root,5);let n;while(n=w.nextNode()){if(n.nodeType==3){if(!/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode.tagName))tNode(n)}else tAttr(n)}}
new MutationObserver(ms=>{for(const m of ms){if(m.type=='childList')m.addedNodes.forEach(tAll);else if(m.type=='characterData')tNode(m.target);else if(m.type=='attributes')tAttr(m.target)}}).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:AT});

/* ---------- Dropdown kustom (pengganti pilihan bawaan browser) ---------- */
const CHV='<svg class="cch" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M5 9l7 7 7-7"/></svg>';
function csLbl(b){const s=b._sel,o=s.options[s.selectedIndex];b.querySelector('.cst').textContent=o?o.text:''}
function csEnh(){document.querySelectorAll('select:not([data-cs])').forEach(sel=>{sel.dataset.cs=1;const b=document.createElement('button');b.type='button';b.className=((sel.className||'')+' csel').trim();b.style.cssText=sel.style.cssText;b.setAttribute('aria-haspopup','listbox');b.setAttribute('aria-expanded','false');const al=sel.getAttribute('aria-label');if(al)b.setAttribute('aria-label',al);b.innerHTML='<span class="cst"></span>'+CHV;b._sel=sel;csLbl(b);b.addEventListener('click',()=>spOpen(b));sel.after(b)})}
let SP=null;
function spOpen(b){const sel=b._sel;if(!sel||!sel.isConnected)return;SP={b,sel};b.setAttribute('aria-expanded','true');const el=$('#sp');
 el.innerHTML=`<div class="spc" role="dialog" aria-modal="true" tabindex="-1"><div class="spl" role="listbox" onkeydown="spKey(event)">${[...sel.options].map((o,i)=>`<button type="button" class="spo" role="option" data-i="${i}" aria-selected="${i==sel.selectedIndex}" onclick="spPick(${i})"><span>${esc(o.text)}</span><span class="spr" aria-hidden="true"></span></button>`).join('')}</div></div>`;
 el._ret=b;openLayer(el);raf2(()=>{const c=el.querySelector('.spo[aria-selected="true"]')||el.querySelector('.spo');if(c){c.focus({preventScroll:true});c.scrollIntoView({block:'center'})}})}
function spPick(i){const D=SP;if(!D)return;const{b,sel}=D;vib(5);spClose();if(sel.selectedIndex!=i){sel.selectedIndex=i;csLbl(b);sel.dispatchEvent(new Event('change',{bubbles:true}))}}
function spClose(){if(!SP)return;const b=SP.b;SP=null;b.setAttribute('aria-expanded','false');const el=$('#sp');el._ret=b;closeLayer(el)}
function spKey(e){const k={ArrowDown:1,ArrowUp:-1}[e.key];const L=[...e.currentTarget.querySelectorAll('.spo')],i=L.indexOf(document.activeElement);let t;if(k)t=i<0?0:Math.max(0,Math.min(L.length-1,i+k));else if(e.key=='Home')t=0;else if(e.key=='End')t=L.length-1;else return;e.preventDefault();L[t].focus()}
new MutationObserver(()=>{if(document.querySelector('select:not([data-cs])'))csEnh()}).observe(document.body,{childList:true,subtree:true});csEnh();
function setLang(v){S.lang=v==='en'?'en':'id';save();document.documentElement.lang=S.lang;tAll(document.body);render();if(PPK&&PP[PPK]){$('#ppc').innerHTML=PP[PPK][1]();tAll($('#ppc'))}}
const DK=matchMedia('(min-width:1024px)');
function syncDock(){const d=$('#dw'),a=d.querySelector('.pn2');if(DK.matches){if(d.classList.contains('show')){d.classList.remove('show','on');syncInert()}a.removeAttribute('role');a.removeAttribute('aria-modal')}else{a.setAttribute('role','dialog');a.setAttribute('aria-modal','true')}}
DK.addEventListener('change',syncDock);
addEventListener('popstate',()=>{const t=hashTab();if(t&&t!=tab)go(t,1)});
document.documentElement.lang=S.lang==='en'?'en':'id';buildPager();syncDock();applyTheme(0);render();place(0);route(tab,0);tAll(document.body);
try{if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}catch(_){}

(function(){const H=document.querySelector('header'),P=document.getElementById('pg');if(!H||!P)return;
function hh(){const v=H.offsetHeight;if(v)document.documentElement.style.setProperty('--hh',v+'px');return v}
function vis(){const w=P.clientWidth;return [...P.querySelectorAll('.pn')].find(p=>Math.abs(p.getBoundingClientRect().left-P.getBoundingClientRect().left)<w/2)}
function sync(){const p=vis(),y=p?Math.max(0,Math.min(p.scrollTop,H.offsetHeight)):0;H.style.transform=y?'translateY('+(-y)+'px)':''}
P.addEventListener('scroll',e=>{if(e.target.classList&&e.target.classList.contains('pn'))sync()},true);
P.addEventListener('transitionend',sync,true);addEventListener('resize',()=>{hh();sync()});
const og=window.go;if(typeof og==='function')window.go=function(t,np){const from=tab,r=og.apply(this,arguments);if(t!=from){const p=document.getElementById('p_'+t);if(p)p.scrollTop=0;sync()}return r};
hh();sync();setTimeout(()=>{hh();sync()},300);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{hh();sync()});
})();
