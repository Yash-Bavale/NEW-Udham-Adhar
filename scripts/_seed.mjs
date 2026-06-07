import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const sqlParts = fs.readFileSync("/tmp/seo_articles.sql", "utf8").split(/(?=INSERT INTO public\.seo_pages)/);
console.log("parts", sqlParts.length);

// Re-parse from source instead, then upsert via Supabase client.
const mod = await import("/dev-server/scripts/_seed-input.js");
const pages = mod.seoPages;

// Replicate logic.
const fs2 = fs;
function escapeHtml(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function buildSections(content){const sections=[],faq=[];let cur=null,bulletBuf=[],pendingQ=null;
  const flushBullets=()=>{if(bulletBuf.length){const html="<ul>"+bulletBuf.map(b=>`<li>${escapeHtml(b)}</li>`).join("")+"</ul>";if(!cur)cur={body_html:""};cur.body_html+=html;bulletBuf=[];}};
  const flushSection=()=>{flushBullets();if(cur){sections.push(cur);cur=null;}};
  for(const item of content){const t=item.type,text=item.text||"";
    if(t==="h2"){flushSection();cur={h2:text,body_html:""};}
    else if(t==="h3"){flushBullets();if(!cur)cur={body_html:""};cur.body_html+=`<h3>${escapeHtml(text)}</h3>`;}
    else if(t==="body"){flushBullets();if(!cur)cur={body_html:""};cur.body_html+=`<p>${escapeHtml(text)}</p>`;}
    else if(t==="bullet"){bulletBuf.push(text);}
    else if(t==="faq_q"){pendingQ=text;}
    else if(t==="faq_a"){if(pendingQ){faq.push({q:pendingQ,a:escapeHtml(text)});pendingQ=null;}}
  }
  flushSection();return{sections,faq};
}
const existing=new Set(fs2.readdirSync("/dev-server/src/routes").filter(f=>f.endsWith(".tsx")).map(f=>f.replace(/\.tsx$/,"")));
const rows=pages.map(p=>{const{sections,faq}=buildSections(p.content);let slug=p.slug;if(existing.has(slug))slug+="-guide";return{slug,label:p.keyword,enabled:true,sort_order:1000+p.num,page_type:"article",h1:p.h1,meta_title:p.metaTitle,meta_description:p.metaDesc,sections,faq,published_at:new Date().toISOString()};});
console.log("rows", rows.length);
const{data,error}=await client.from("seo_pages").upsert(rows,{onConflict:"slug"}).select("slug");
if(error){console.error(error);process.exit(1);}
console.log("upserted",data.length);
