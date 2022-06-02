//
// Main function should be imported and wrapped with the function handleSummary
//
export function convertMetrics(data) {
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
    return metricsPayload;
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
