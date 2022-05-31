const http = require('http');

//
// Main function should be imported and wrapped with the function handleSummary
//
function sendMetricsToPromGateway(data, opts = {}) {

    if (!opts.url) {
        throw new Error("Please provide the url for the prometheus push-gateway")
    }
    if (!opts.job) {
      opts.job = "k6_tests_job"
    }

    let url = `${opts.host}/metrics/job/${opts.job}`;
    console.log(`Configuring the push-gateway path to ${url}`)
    
    console.log("Computing test summary metrics...")

    const metrics = data.metrics;
    let metricsPayload = '';

    for (let metric in metrics) {
        if (metric.includes('{')){
            continue;
        }
        var metricObj = metrics[metric];
        let metricValues = metricObj['values'];
        
        metricsPayload += createGauge(metric);
        for (const [key, value] of Object.entries(metricValues)) {
            metricsPayload += addValues(metric, value, key);
        }
    }

    sendMetrics(opts.url, opts.job, metricsPayload)
}

function createGauge(name){
    let type = "gauge";
    let help = getMetricHelp(name);
    return `# TYPE ${name} ${type}\n# HELP ${name} ${help}\n`
}

function addValues(metricName, value, key){
    if (typeof key !== `undefined`){
        return key.includes('p(') ? `${metricName}{quantile="${key}"} ${value}\n` : `${metricName}{label="${key}"} ${value}\n`;
    }
}

function sendMetrics(url, job, payload){
    console.log("Sending test metrics to the Prometheus Pushgateway");
    console.log("payload is: " + payload);
    
     var host = new URL(url).host

    const options = {
        host: host,
        path: `/metrics/job/${job}`,
        method: 'POST',
        headers: {'Content-Type': 'text/plain'}
    };

    callback = function(response) {
        var str = ''
        response.on('data', function (chunk) {
          str += chunk;
        });
      
        response.on('end', function () {
          console.log(str);
        });
    }

    var req = http.request(options, callback);
    req.write(payload);
    req.end(); 
}

function getMetricHelp(metricName){
    return builtinMetrics[metricName.split('{')[0]]
}

let builtinMetrics = {
    "vus":                "Current number of active virtual users",
    "vus_max":            "Max possible number of virtual users",
    "iterations":         "The aggregate number of times the VUs in the test have executed",
    "iteration_duration": "The time it took to complete one full iteration",
    "dropped_iterations": "The number of iterations that could not be started",
    "data_received":      "The amount of received data",
    "data_sent":          "The amount of data sent",
    "checks":             "The rate of successful checks",

    "http_reqs":                "How many HTTP requests has k6 generated, in total",
    "http_req_blocked":         "Time spent blocked  before initiating the request",
    "http_req_connecting":      "Time spent establishing TCP connection",
    "http_req_tls_handshaking": "Time spent handshaking TLS session",
    "http_req_sending":         "Time spent sending data",
    "http_req_waiting":         "Time spent waiting for response",
    "http_req_receiving":       "Time spent receiving response data",
    "http_req_duration":        "Total time for the request",
    "http_req_failed":          "The rate of failed requests",
}

module.exports = sendMetricsToPromGateway;