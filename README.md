# K6 summary prometheus exporter
This will transform the data metrics json object available in _handleSummary_ callback hook to Prometheus compatible metrics that can be sent to a remote write endpoint or to a [Prometheus push-gateway](https://prometheus.io/docs/practices/pushing/#when-to-use-the-pushgateway)

# Usage

This extension to K6 is intended to be used by adding into your K6 test code (JavaScript) and utilizes the _handleSummary_ callback hook. When your test completes, the data.metrics object containing test summary data is transformed into Prometheus compatible metrics that can be sent via http request to a Prometheus instance.

To use, add this module to your test code.

Import the `convertMtrics` function from the bundled module hosted remotely on GitHub

```js
import { convertMetrics } from "https://raw.githubusercontent.com/ctlnmhl/k6-summary-to-promgateway/master/dist/bundle.js";
```
Then outside the test's default function, wrap it with the `handleSummary(data)` function which [K6 calls at the end of any test](https://github.com/loadimpact/k6/pull/1768), as follows:

```js
import http from 'k6/http';

export function handleSummary(data) {
    const prometheusMetrics = convertMetrics(data);
    sendMetrics(prometheusMetrics);
}

function sendMetrics(prometheusMetrics){
    const host = "http://<prometheus_instance>";
    const requestParams = {
        headers: {
          'Content-Type': 'text/plain',
        },
    };
    http.post(host, prometheusMetrics, params);
}
```