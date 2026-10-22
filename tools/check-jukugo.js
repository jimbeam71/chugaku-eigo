// 熟語データの検査: node tools/check-jukugo.js
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..','public');
const d=JSON.parse(fs.readFileSync(path.join(root,'data','jukugo.json'),'utf8'));
let bad=0; const err=m=>{console.log('NG',m);bad++;};
const ids=new Set(),ens=new Set(),jas=new Set(),grp={};
for(const w of d){
  for(const k of ['id','en','key','ja','ex','exJa','tip']) if(!w[k]) err(w.id+' 必須項目なし '+k);
  if(ids.has(w.id)) err('id重複 '+w.id); ids.add(w.id);
  if(ens.has(w.en)) err('en重複 '+w.en); ens.add(w.en);
  if(jas.has(w.ja)) err('ja重複 '+w.ja); jas.add(w.ja);
  const parts=w.key.split(' '); const first=parts.shift();
  const re=new RegExp('\\b'+first+'(s|es|ed|ing|d)?\\b'+(parts.length?' '+parts.join(' '):''),'i');
  if(!re.test(w.ex)) err(w.id+' 例文に熟語がない '+w.ex);
  if(w.grp) grp[w.grp]=(grp[w.grp]||0)+1;
  for(const f of [w.id+'.mp3',w.id+'x.mp3']) if(!fs.existsSync(path.join(root,'audio','j',f))) err('音声なし '+f);
}
for(const g in grp) if(grp[g]<2) err('1つだけのgrp '+g);
console.log(bad?bad+' 件のNG':'ALL OK ('+d.length+'個)');
process.exit(bad?1:0);
