---
title: Getting Started
description: The cache server is available as a Docker image and can be deployed via Docker Compose or Kubernetes.
outline: [2, 4]
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## 1. Deployment

### Docker

```yaml [docker-compose.yml]
services:
  cache-server:
    image: ghcr.io/falcondev-oss/github-actions-cache-server
    ports:
      - '3000:3000'
    environment:
      API_BASE_URL: http://localhost:3000
      STORAGE_DRIVER: filesystem
      STORAGE_FILESYSTEM_PATH: /data/cache
      DB_DRIVER: sqlite
      DB_SQLITE_PATH: /data/cache-server.db
    volumes:
      - cache-data:/data

volumes:
  cache-data:
```

### Kubernetes with Helm

You can deploy the cache server in Kubernetes using the Helm chart hosted in a OCI repository.

#### Prerequisites

- Helm version 3.8.0 or later (required for OCI support)
- A running Kubernetes cluster

#### Steps

<br>

##### 1. Install the Helm chart

```bash
helm install <release-name> oci://ghcr.io/falcondev-oss/charts/github-actions-cache-server
```

Replace `<release-name>` with your desired release name (e.g., `cache-server`). This will deploy the cache server with all default values.

##### 2. Verify the deployment

```bash
kubectl get deployments
kubectl get svc
```

Ensure the deployment `<release-name>-github-actions-cache-server` is running and the service is accessible.

#### Customization

To customize the deployment, you can override the default values by creating a `values.yaml` file.

For all possible configuration options, refer to the [values.yaml file](https://github.com/falcondev-oss/github-actions-cache-server/blob/master/install/kubernetes/github-actions-cache-server/values.yaml).

For more details on customizing Helm charts, see the [Customizing the Chart Before Installing](https://helm.sh/docs/intro/using_helm/#customizing-the-chart-before-installing).

Then install the chart with your custom values:

```bash
helm install <release-name> oci://ghcr.io/falcondev-oss/charts/github-actions-cache-server -f values.yaml
```

### Environment Variables

#### `API_BASE_URL`

- Example: `http://localhost:3000`

The base URL of your cache server. This needs to be accessible by your runners as it is used for cache uploads and downloads.

::: warning

Make sure the actions runner can reach the cache server on this url!

:::

#### `STORAGE_DRIVER`

- Default: `filesystem`

The storage driver to use for storing cache data. For more information, see [Storage Drivers](/storage-drivers).

#### `DB_DRIVER`

- Default `sqlite`

The database driver to use for storing cache metadata. For more information, see [Database Drivers](/database-drivers).

#### `ENABLE_DIRECT_DOWNLOADS`

- Default: `false`

If set to `true`, will send a signed URL to the runner. The runner can then download the cache directly from the storage provider. This is useful if you have a large cache and don't want to proxy the download through the cache server.

::: warning

The actions runner needs to be able to reach the storage provider directly to use direct downloads.

:::

#### `DEFAULT_ACTIONS_RESULTS_URL`

- Default: `https://results-receiver.actions.githubusercontent.com`

The upstream GitHub Actions Results service that requests the cache server does not handle (e.g. artifact uploads/downloads) are transparently forwarded to. On **GitHub Enterprise Server** this must point at your instance's Results host (see [GitHub Enterprise Server](#github-enterprise-server-ghes)).

#### `ACTIONS_TOKEN_ISSUER`

- Default: `https://token.actions.githubusercontent.com`

The OIDC issuer whose signature the cache server verifies on runner tokens. The JWKS endpoint is derived as `{issuer}/.well-known/jwks`. Only change this for **GitHub Enterprise Server**, where tokens are issued by your instance (see [GitHub Enterprise Server](#github-enterprise-server-ghes)).

#### `CACHE_CLEANUP_OLDER_THAN_DAYS`

- Default: `90`

The number of days to keep stale cache data and metadata before deleting it. Set to `0` to disable cache cleanup.

#### `CACHE_MAX_SIZE_BYTES`

- Optional

Hard cap, in bytes, on the total size of finalized cache payloads. When set, the server runs **capacity-based eviction** after each completed upload: if the total exceeds this budget, the least-recently-used cache entries are deleted until usage is back down to 90% of the budget. Recency is the last time an entry was downloaded, falling back to when it was last saved. Entries with an in-progress download are never evicted.

Applies to any storage driver. Leave unset for unlimited object storage, or use `CACHE_FILESYSTEM_MAX_USAGE_PERCENT` below to cap by disk usage instead.

::: tip
Eviction runs _after_ an upload finalizes, so the total may briefly exceed the budget under concurrent uploads. Leave headroom for in-flight uploads.
:::

#### `CACHE_FILESYSTEM_MAX_USAGE_PERCENT`

- Default: `90`
- Only applies to the `filesystem` storage driver when `CACHE_MAX_SIZE_BYTES` is **not** set.

Maximum percentage of the storage volume's total capacity (including data outside the cache directory) that may be used before capacity-based eviction starts reclaiming space. Ignored when `CACHE_MAX_SIZE_BYTES` is set.

#### `NITRO_PORT`

- Default: `3000`

The port the server should listen on.

#### `SKIP_TOKEN_VALIDATION`

- Default: `false`

Skip verification of the GitHub token used for computing the cache scope. This is useful for testing and development purposes, but should not be used in production.

#### `MANAGEMENT_API_KEY`

Set this to a random string to enable the management API. Docs can be found at `https://<your-cache-server-url>/management-api/_docs`.

## 2. Self-Hosted Runner Setup

Set the environment variable `ACTIONS_RESULTS_URL` on your runner to the Cache Server API URL.

::: warning
Ensure `ACTIONS_RESULTS_URL` ends with a trailing slash.
:::

Because the runner does not allow setting the `ACTIONS_RESULTS_URL` yourself, we need to patch the runner binary/source to allow configuring it.

You can patch the runner binary yourself or use our forked runner image that has its source code modified.

### Forked Runner (recommended)

We provide a forked runner image that has the source code modified to allow overriding `ACTIONS_RESULTS_URL` by setting `CUSTOM_ACTIONS_RESULTS_URL`.

- Repo: [falcondev-oss/github-actions-runner](https://github.com/falcondev-oss/github-actions-runner)
- Image: `ghcr.io/falcondev-oss/actions-runner:latest`

::: tip Auto-update is handled for you
Recent forked-runner images skip runner self-update while `CUSTOM_ACTIONS_RESULTS_URL` is set, so a server-triggered update can't silently overwrite the patched binary and revert you to GitHub's central cache. You still need to update manually — see [Keep the runner up to date](#keep-the-runner-up-to-date) below.
:::

### Binary Patch

::: code-group

```dockerfile [Dockerfile]
FROM ghcr.io/actions/actions-runner:latest
# Modify runner binary to retain custom ACTIONS_RESULTS_URL
RUN sed -i 's/\x41\x00\x43\x00\x54\x00\x49\x00\x4F\x00\x4E\x00\x53\x00\x5F\x00\x52\x00\x45\x00\x53\x00\x55\x00\x4C\x00\x54\x00\x53\x00\x5F\x00\x55\x00\x52\x00\x4C\x00/\x41\x00\x43\x00\x54\x00\x49\x00\x4F\x00\x4E\x00\x53\x00\x5F\x00\x52\x00\x45\x00\x53\x00\x55\x00\x4C\x00\x54\x00\x53\x00\x5F\x00\x4F\x00\x52\x00\x4C\x00/g' /home/runner/bin/Runner.Worker.dll
```

```bash [Linux]
sed -i 's/\x41\x00\x43\x00\x54\x00\x49\x00\x4F\x00\x4E\x00\x53\x00\x5F\x00\x52\x00\x45\x00\x53\x00\x55\x00\x4C\x00\x54\x00\x53\x00\x5F\x00\x55\x00\x52\x00\x4C\x00/\x41\x00\x43\x00\x54\x00\x49\x00\x4F\x00\x4E\x00\x53\x00\x5F\x00\x52\x00\x45\x00\x53\x00\x55\x00\x4C\x00\x54\x00\x53\x00\x5F\x00\x4F\x00\x52\x00\x4C\x00/g' /path_to_your_runner/bin/Runner.Worker.dll
```

```bash [MacOS]
gsed -i 's/\x41\x00\x43\x00\x54\x00\x49\x00\x4F\x00\x4E\x00\x53\x00\x5F\x00\x52\x00\x45\x00\x53\x00\x55\x00\x4C\x00\x54\x00\x53\x00\x5F\x00\x55\x00\x52\x00\x4C\x00/\x41\x00\x43\x00\x54\x00\x49\x00\x4F\x00\x4E\x00\x53\x00\x5F\x00\x52\x00\x45\x00\x53\x00\x55\x00\x4C\x00\x54\x00\x53\x00\x5F\x00\x4F\x00\x52\x00\x4C\x00/g' /path_to_your_runner/bin/Runner.Worker.dll
```

```bash [Windows]
[byte[]] -split (((Get-Content -Path ./bin/Runner.Worker.dll -Encoding Byte) | ForEach-Object ToString X2) -join '' -Replace '41004300540049004F004E0053005F0052004500530055004C00540053005F00550052004C00','41004300540049004F004E0053005F0052004500530055004C00540053005F004F0052004C00' -Replace '..', '0x$& ') | Set-Content -Path /path_to_your_runner/bin/Runner.Worker.dll -Encoding Byte
```

:::

This patch prevents the runner from overwriting your custom `ACTIONS_RESULTS_URL`.

::: warning Disable runner auto-update
By default the runner self-updates when GitHub pushes a new version, which restores the stock binary and **silently reverts you to GitHub's central cache** — no error, caching just stops. A binary patch does not survive that. Register the runner with `config.sh --disableupdate` (or set `disableUpdate: true` with [ARC](https://github.com/actions/actions-runner-controller)) to stop auto-updates; it works on both github.com and GitHub Enterprise Server. The [forked runner](#forked-runner-recommended) skips self-update automatically while `CUSTOM_ACTIONS_RESULTS_URL` is set.
:::

### Keep the runner up to date

Whichever approach you use, GitHub still requires self-hosted runners to stay current. If a runner falls more than ~30 days behind the latest release — or below GitHub's enforced minimum version — GitHub **stops queuing jobs to it**. So you must update on your own schedule: pull the latest forked-runner image (or rebuild your patched image) and re-deploy periodically. Freezing a runner forever is not an option.

For more information, see [How it works](/how-it-works).

::: info
It is recommended to install `zstd` on your runners for faster compression and decompression.
:::

## 3. Usage

There is no need to change any of your workflows! 🔥

If you've set up your self-hosted runners correctly, they will automatically use the cache server for caching.

## GitHub Enterprise Server (GHES)

GHES is supported on a best-effort basis. The cache server implements the **v2** cache protocol only, and GHES hard-codes a few values differently from github.com, so a GHES deployment needs the following on top of the standard setup:

1. **The v2 cache service must be enabled on your instance.** The runner only talks to `ACTIONS_RESULTS_URL` (and therefore the cache server) when GitHub sets `ACTIONS_CACHE_SERVICE_V2=true` on it. If your GHES version does not enable v2, the runner falls back to the legacy v1 protocol, which the cache server does not implement — caching will not work. You can confirm v2 is active by checking for `ACTIONS_CACHE_SERVICE_V2` in the runner's environment.

   ::: warning
   `ACTIONS_CACHE_URL` is the legacy v1 endpoint and is **not** used by the cache server. Setting it has no effect.
   :::

2. **Point token validation at your instance.** GHES issues runner tokens from your own host, so set [`ACTIONS_TOKEN_ISSUER`](#actions-token-issuer) to your instance's issuer — the exact `iss` claim of a runner's OIDC token (decode one to confirm the value). The cache server derives the JWKS endpoint as `{issuer}/.well-known/jwks`; if your instance serves keys elsewhere, this won't work yet — please open an issue. Without a matching issuer, every request is rejected with `401 Invalid token`.

3. **Point Results passthrough at your instance.** Set [`DEFAULT_ACTIONS_RESULTS_URL`](#default-actions-results-url) to your instance's Results host (e.g. `https://results-receiver.actions.<your-ghes-host>`). Otherwise artifact uploads/downloads and other passthrough requests are forwarded to github.com and fail.
