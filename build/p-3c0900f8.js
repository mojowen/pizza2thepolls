const t=async t=>{const a=await fetch(`https://spreadsheets.google.com/feeds/list/1mxmW0YljLEcNP1BUJoUlAEtzzE0FXwbaDBPN26dlloo/${t}/public/basic?alt=json`),{feed:s}=await a.json();return(s||{}).entry.map(t=>({content:t.content.$t,title:t.title.$t}))},a=async()=>{const[a,s,o,e]=(await t("2")).map(t=>t.content.split(": ")[1]);return{pizzas:a,locations:s,states:o,raised:e}},s=async()=>(await t("4")).reverse().map(({content:t,title:a})=>{const[s,o,e,n,c,i]=t.split(",").map(t=>t.split(": ")[1]);return{location:`${e} pizzas to ${a} ${s}, ${o} on ${n}, ${c} PST`,url:i}});export{a,s as g}