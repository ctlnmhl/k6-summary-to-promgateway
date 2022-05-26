const client = require('prom-client')

//
// Main function should be imported and wrapped with the function handleSummary
//
export function sendMetricsToPromGateway(data, opts = {}) {
    // Default options
    if (!opts.host) {
        throw new Error("Please provide the host for the prometheus push-gateway")
    }
    let gateway = new client.Pushgateway(opts.host);

    if (!opts.job) {
      opts.job = "k6_tests_job"
    }

    console.log("Computing test summary metrics...")

    for (let metric in data) {
        if (metric.includes('{')){
            continue;
        }
        var metricObj = data[metric];
        if (metricObj.hasOwnProperty('type')){
            let metricType = metricObj['type'];
            let metricValues = metricObj['values'];
            switch (metricType) {
                case 'trend':
                    promMetric = createGauge(client, metric, ['quantile'])
                    for (const [key, value] of Object.entries(metricValues)) {
                        promMetric.set({ quantile: key }, value)
                    }
                    break;
                case 'gauge':
                    promMetric = createGauge(client, metric, [])
                    for (const [key, value] of Object.entries(metricValues)) {
                        if (key === 'value') {
                            promMetric.set(value)
                        }
                    }
                    break;
                case 'counter':
                    promMetric = createGauge(client, metric, ['rate'])
                    for (const [key, value] of Object.entries(metricValues)) {
                        if (key === 'count') {
                            promMetric.set(value);
                        }
                        else{
                            promMetric.set({ rate: 'seconds' }, value);
                        }
                    }
                    break;
                case 'rate':
                    promMetric = createGauge(client, metric, [])
                    for (const [key, value] of Object.entries(metricValues)) {
                        if (key === 'rate') {
                            promMetric.set(value)
                        }
                    }
                    break;
                default:
                    console.log(`Unsupported metric type: ${metricType}.`);
              }
        }
    }
    sendMetrics(gateway, opts.job)
}

function createGauge(promClient, metricName, labelNames){
    const gauge = new promClient.Gauge({
        name: metricName,
        help: getMetricHelp(metricName),
        labelNames: labelNames
    });
    return gauge;
}

function sendMetrics(gateway, jobName){
    console.log("Sending test metrics to the Prometheus Pushgateway")

    gateway.pushAdd({ jobName: jobName })
    .then(({ resp, body }) => {
        console.log(`PushGate Response: ${body}`);
        console.log(`PushGate Response status: ${resp.statusCode}`);
    })
    .catch(err => {
        console.log(`Error when sending metrics to the pushgateway: ${err}`);
    });  
};

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
