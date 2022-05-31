(()=>{"use strict";var e={d:(t,o)=>{for(var n in o)e.o(o,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:o[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function o(e,t={}){if(!t.host)throw new Error("Please provide the host for the prometheus push-gateway");t.job||(t.job="k6_tests_job");let o=`${t.host}/metrics/job/${t.job}`;console.log(`Configuring the push-gateway path to ${o}`),console.log("Computing test summary metrics...");let s="";for(let t in e){if(t.includes("{"))continue;var i=e[t];let o=i.type,a=i.values;switch(o){case"trend":s+=n(t);for(const[e,o]of Object.entries(a))s+=r(t,o,e);break;case"gauge":s+=n(t);for(const[e,o]of Object.entries(a))"value"===e&&(s+=r(t,o));break;case"counter":s+=n(t);for(const[e,o]of Object.entries(a))"count"===e&&(s+=r(t,o));break;case"rate":s+=n(t);for(const[e,o]of Object.entries(a))"rate"===e&&(s+=r(t,o));break;default:console.log(`Unsupported metric type: ${o}.`)}}var a;a=s,console.log("Sending test metrics to the Prometheus Pushgateway"),console.log("payload is: "+a)}function n(e){return function(e){if(!e.name)throw new Error("Metric options doesn't include a name");let t=e.name;return`# TYPE ${t} ${e.type||"gauge"}\n# HELP ${e.help||`This metric is called ${t}`}\n`}({name:e,type:"gauge",help:s(e)})}function r(e,t,o){return void 0!==o?`${e}${o.includes("p(")?`{quantile="${o}"}`:`{label="${o}"}`} ${t}\n`:`${e} ${t}\n`}function s(e){return i[e.split("{")[0]]}e.r(t),e.d(t,{sendMetricsToPromGateway:()=>o});let i={vus:"Current number of active virtual users",vus_max:"Max possible number of virtual users",iterations:"The aggregate number of times the VUs in the test have executed",iteration_duration:"The time it took to complete one full iteration",dropped_iterations:"The number of iterations that could not be started",data_received:"The amount of received data",data_sent:"The amount of data sent",checks:"The rate of successful checks",http_reqs:"How many HTTP requests has k6 generated, in total",http_req_blocked:"Time spent blocked  before initiating the request",http_req_connecting:"Time spent establishing TCP connection",http_req_tls_handshaking:"Time spent handshaking TLS session",http_req_sending:"Time spent sending data",http_req_waiting:"Time spent waiting for response",http_req_receiving:"Time spent receiving response data",http_req_duration:"Total time for the request",http_req_failed:"The rate of failed requests"};var a=exports;for(var u in t)a[u]=t[u];t.__esModule&&Object.defineProperty(a,"__esModule",{value:!0})})();
//# sourceMappingURL=bundle.js.map