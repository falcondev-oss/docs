---
title: Metrics
description: Scrape Prometheus metrics to monitor cache performance.
outline: [2, 4]
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

The server exposes [Prometheus](https://prometheus.io/) metrics at `GET /metrics` in the standard text exposition format. The endpoint is always enabled and unauthenticated.

::: warning
`/metrics` has no authentication. Restrict access at the network layer (firewall, Kubernetes `NetworkPolicy`, or a reverse proxy) if the endpoint should not be publicly reachable.
:::

## Scraping

Point Prometheus at the server:

```yaml [prometheus.yml]
scrape_configs:
  - job_name: gha-cache-server
    static_configs:
      - targets: ['cache-server:3000']
```

## Exposed metrics

| Metric                                       | Type    | Description                                                                                                 |
| -------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| `cache_requests_total{result="hit"\|"miss"}` | counter | Cache download-URL lookups by result. A restore-key prefix match counts as a `hit`.                         |
| `cache_uploads_total`                        | counter | Cache uploads finalized into cache entries.                                                                 |
| `cache_storage_bytes`                        | gauge   | Total size of finalized cache payloads currently in storage.                                                |
| `process_*`, `nodejs_*`                      | gauge   | Default process metrics: CPU, resident memory, `process_start_time_seconds` (uptime), event loop, and heap. |

Rates are derived in [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) — e.g. requests per minute and hit ratio:

```promql
# cache lookups per minute
rate(cache_requests_total[1m]) * 60

# hit ratio
sum(rate(cache_requests_total{result="hit"}[5m]))
  / sum(rate(cache_requests_total[5m]))
```

When [`CACHE_MAX_SIZE_BYTES`](/getting-started#cache-max-size-bytes) is configured, you can chart how full the cache is against the budget:

```promql
# fraction of the budget in use (0–1)
sum(cache_storage_bytes) / <CACHE_MAX_SIZE_BYTES>
```

::: info
`cache_storage_bytes` reflects payload sizes recorded at upload time. Entries created before capacity tracking was enabled count as `0` until reconciled on the next server startup.
:::

## Scaling and multiple workers

Metrics are collected per process. In the default deployment — one worker per container — the numbers are exact, and multiple replicas are aggregated by Prometheus:

```promql
sum(rate(cache_requests_total[5m])) by (result)
```

::: warning
Setting `NITRO_CLUSTER_WORKERS` above `1` runs several workers behind one shared port. A scrape reaches whichever worker answers, so counters reflect a single worker rather than the whole process group. For accurate metrics, keep one worker per container (the default) and scale horizontally with replicas.
:::
