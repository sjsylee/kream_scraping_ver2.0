"use strict";exports.id=404,exports.ids=[404],exports.modules={3404:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.d(t,{Lt:()=>get_first_data,dG:()=>check_auth,hL:()=>get_final_data,x4:()=>login});var s=a(9648),o=e([s]);s=(o.then?(await o)():o)[0];let i=["web;f4384a74-2407-413f-9a44-bd73e758cbed","web;fe697138-677f-43aa-96e5-20587052e56c","web;84d0153f-dc09-4cc8-8b74-8db9ddd0e284"],kream_api=()=>{let e=new Date,t=e.getMonth()+1,a=e.getDate(),r=e.getHours(),s=e.getMinutes(),o=e.getSeconds();return t=t>=10?t:"0"+t,a=a>=10?a:"0"+a,r=r>=10?r:"0"+r,s=s>=10?s:"0"+s,o=o>=10?o:"0"+o,{"X-Kream-Api-Version":"28","X-Kream-Client-Datetime":`${e.getFullYear()}${t}${a}${r}${s}${o}+0900`,"X-Kream-Web-Build-Version":"5.1.1","X-Kream-Device-Id":i[Math.floor(Math.random()*i.length)]}};async function login(e,t){let a=await get_new_rq_key(),r=`https://kream.co.kr/api/auth/login?request_key=${a}`,o=kream_api(),i=await s.default.post(r,JSON.stringify({email:e,password:t}),{headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36","Content-Type":"application/json",...o,Referer:"https://kream.co.kr/login"}}),l=i.data.access_token;return console.log(l),l}async function get_new_rq_key(){let e=await s.default.get("https://kream.co.kr",{headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"}}),t=e.headers["set-cookie"],a=t.filter(e=>e.includes("did"))[0],r=a.split("=")[1].split(";")[0];return r}async function check_auth(e){let t=await get_new_rq_key(),a=kream_api();await s.default.get(`https://kream.co.kr/api/users/me?request_key=${t}`,{headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",...a,Authorization:`Bearer ${e}`}})}async function get_first_data(e,t,a){let r=await get_new_rq_key(),o=kream_api(),i=await s.default.get("https://kream.co.kr/api/p/tabs/all",{params:{request_key:r},headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36","Content-Type":"application/json",...o,Referer:"https://kream.co.kr/search",Authorization:`Bearer ${e}`}});console.log(i);let l=i.data.items,n=l.map(e=>{let t=e.product;try{return{상품명:t.release.translated_name,상품번호:t.release.id,링크:`https://kream.co.kr/products/${t.release.id}`,모델명:t.release.style_code,컬러:t.release.colorway,사이즈:"",평균가_30개:"",평균가_50개:"","수집범위/날짜범위_30개":"","수집범위/날짜범위_50개":"",최저_보판가:"",최저_95점_보판가:"",최저_일판가:"",즉시_판매가:""}}catch{return null}});return n.filter(e=>null!==e)}async function get_final_data(e,t){let a=await get_new_rq_key(),r=kream_api(),o=`https://kream.co.kr/api/p/products/${t}?request_key=${a}`,i=await s.default.get(o,{headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",...r,Authorization:`Bearer ${e}`}}),l=i.data.sales_options;if(!l)return[{사이즈:"X",최저_보판가:"X",최저_95점_보판가:"X",최저_일판가:"X",즉시_판매가:"X"}];let n=[];for(let a of l){let r,s,o,i,l=await get_option_sales_data(e,t,a.option),c=new Date;if(0===l.length);else if(Math.ceil(Math.abs(c-new Date(l[0].date_created))/864e5)>30);else{if(l.length>=30){let e=l.filter((e,t)=>t<30);r=Math.round(e.reduce((e,t)=>e+t.price,0)/e.length);let t=Math.ceil(Math.abs(c-new Date(l[29].date_created))/864e5);o=30/t}if(l.length>=70){let e=l.filter((e,t)=>t<50);s=Math.round(e.reduce((e,t)=>e+t.price,0)/e.length);let t=Math.ceil(Math.abs(c-new Date(l[49].date_created))/864e5);i=50/t}}n.push({사이즈:a.option,평균가_30개:r,평균가_50개:s,"수집범위/날짜범위_30개":o,"수집범위/날짜범위_50개":i,최저_보판가:a.lowest_100,최저_95점_보판가:a.lowest_95,최저_일판가:a.lowest_normal,즉시_판매가:a.highest_bid}),await sleep(2e3)}return n}async function get_option_sales_data(e,t,a){let r=[],o=await get_new_rq_key(),i=kream_api(),l=`https://kream.co.kr/api/p/products/${t}/${a}/sales`,n=!0;for(let a=1;a<2;a++){console.log(a);let c={cursor:a,per_page:70,sort:"date_created[desc]",request_key:o};for(;;)try{let a=await s.default.get(l,{params:c,headers:{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36","Content-Type":"application/json",...i,Referer:`https://kream.co.kr/products/${t}`,Authorization:`Bearer ${e}`}}),o=a.data.items;r.push(...o),await sleep(1e3);break}catch(e){try{if(e.response.data.message.includes("was not found")){console.log(e.response.statusText),n=!1;break}e.response.statusText.includes("MANY")&&(console.log(e.response.statusText),console.log("1분 대기..."),await sleep(6e4))}catch(e){console.log(e)}}if(await sleep(2e3),!n)break}return r}let sleep=e=>new Promise(t=>setTimeout(t,e));r()}catch(e){r(e)}})}};