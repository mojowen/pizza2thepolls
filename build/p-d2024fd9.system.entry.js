System.register(["./p-a43e70fd.system.js"],(function(e){"use strict";var t,l,a;return{setters:[function(e){t=e.r;l=e.h;a=e.H}],execute:function(){var s='page-report .container{padding-top:30px}page-report .report{background-color:#00c1cc;background-image:url("/images/bg2.png");background-attachment:fixed;background-size:400px;color:#fff;padding-bottom:40px}page-report .report h1{color:white;text-align:left;padding-bottom:8px}page-report .report input[type=submit],page-report .report .submit{background-color:#29335c}';var r=e("page_report",function(){function e(e){t(this,e)}e.prototype.render=function(){return l(a,null,l("div",{id:"report",class:"report"},l("div",{class:"container"},l("h1",null,"Report a line"),l("p",{id:"submit_message",class:"message",hidden:true}),l("form",{id:"form"},l("div",{class:"form-item"},l("label",{htmlFor:"social-link"},"Link to a report on social media"),l("input",{id:"social-link",type:"text",name:"social_link"}),l("span",{class:"help"},l("strong",null,"Required:")," We'll make sure there's really a line.")),l("div",{class:"form-item"},l("label",{htmlFor:"address"},"Polling place address"),l("input",{type:"text",id:"autocomplete",name:"full_place"}),l("span",{class:"help"},l("strong",null,"Required:"),' Search by the name of the place ("St. John\'s Library") or street address.')),l("div",{id:"address",class:"form-item",hidden:true},l("table",null,l("tr",null,l("td",{class:"label"},"Place"),l("td",{colSpan:4},l("input",{id:"premise",disabled:true}))),l("tr",null,l("td",{class:"label"},"Street address"),l("td",{class:"slimField"},l("input",{name:"street_number",class:"field",id:"street_number",disabled:true})),l("td",{class:"wideField",colSpan:2},l("input",{class:"field",name:"route",id:"route",disabled:true}))),l("tr",null,l("td",{class:"label"},"City"),l("td",{class:"wideField",colSpan:3},l("input",{name:"locality",class:"field",id:"locality",disabled:true}))),l("tr",null,l("td",{class:"label"},"State"),l("td",{class:"slimField"},l("input",{name:"state",class:"field",id:"administrative_area_level_1",disabled:true})),l("td",{class:"label"},"Zip code"),l("td",{class:"wideField"},l("input",{name:"zip",class:"field",id:"postal_code",disabled:true})),l("input",{type:"hidden",name:"formatted_address",id:"formatted_address"})))),l("div",{class:"form-item"},l("label",{htmlFor:"address"},"Your phone number or email address"),l("input",{type:"text",name:"contact"}),l("br",null),l("span",{class:"help"},"Optional: So we can follow up when the pizza is inbound")),l("button",{class:"submit",type:"button"},"Submit report. Feed democracy")))))};return e}());r.style=s}}}));