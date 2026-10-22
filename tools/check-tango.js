// 単語データの検査: node tools/check-tango.js
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..','public');
const d=JSON.parse(fs.readFileSync(path.join(root,'data','tango.json'),'utf8'));
let bad=0; const err=m=>{console.log('NG',m);bad++;};
const ids=new Set(),ens=new Set(),jas=new Set(),grp={};
for(const w of d){
  for(const k of ['id','en','ja','pos','ex','exJa','tip']) if(!w[k]) err(w.id+' 必須項目なし '+k);
  if(ids.has(w.id)) err('id重複 '+w.id); ids.add(w.id);
  if(ens.has(w.en)) err('en重複 '+w.en); ens.add(w.en);
  if(jas.has(w.ja)) err('ja重複 '+w.ja); jas.add(w.ja);
  if(!['名詞','動詞','形容詞','副詞'].includes(w.pos)) err(w.id+' pos不正');
  if(!new RegExp('\\b('+w.en+'|'+w.en.replace(/y$/,'i')+')\\w*','i').test(w.ex)) err(w.id+' 例文に単語がない（活用形含む） '+w.ex);
  if(w.grp) grp[w.grp]=(grp[w.grp]||0)+1;
  for(const f of [w.id+'.mp3',w.id+'x.mp3']) if(!fs.existsSync(path.join(root,'audio','w',f))) err('音声なし '+f);
}
for(const g in grp) if(grp[g]<2) err('1語だけのgrp '+g);
console.log(bad?bad+' 件のNG':'ALL OK ('+d.length+'語)');
process.exit(bad?1:0);
