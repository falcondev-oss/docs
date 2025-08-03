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
    image: ghcr.io/falcondev-oss/github-actions-cache-server:latest
    ports:
      - '3000:3000'
    environment:
      API_BASE_URL: http://localhost:3000
    volumes:
      - cache-data:/app/.data

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

The base URL of your cache server. This needs to be accessible by your runners as it is used for making API requests and downloading cached files.

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

#### `CACHE_CLEANUP_OLDER_THAN_DAYS`

- Default: `90`

The number of days to keep stale cache data and metadata before deleting it. Set to `0` to disable cache cleanup.

#### `CACHE_CLEANUP_CRON`

- Default: `0 0 * * *`

The cron schedule for running the cache cleanup job.

#### `UPLOAD_CLEANUP_CRON`

- Default: `*/10 * * * *`

The cron schedule for running the upload cleanup job. This job will delete any dangling (failed or incomplete) uploads.

#### `NITRO_PORT`

- Default: `3000`

The port the server should listen on.

#### `TEMP_DIR`

- Default: os temp dir

The directory to use for temporary files.

## 2. Self-Hosted Runner Setup

Set the environment variable `ACTIONS_RESULTS_URL` on your runner to the Cache Server API URL.

::: warning
Ensure `ACTIONS_RESULTS_URL` ends with a trailing slash.
:::

Because the runner does not allow setting the `ACTIONS_RESULTS_URL` yourself, we need to patch the runner binary/source to allow configuring it.

You can patch the runner binary yourself or use our forked runner image that has its source code modified.

### Forked Runner (recommended)

We provide a forked runner image that has the source code modified to allow setting `ACTIONS_RESULTS_URL` without patching the binary.

- Repo: [falcondev-oss/github-actions-runner](https://github.com/falcondev-oss/github-actions-runner)
- Image: `ghcr.io/falcondev-oss/actions-runner:latest`

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

For more information, see [How it works](/how-it-works).

::: info
It is recommended to install `zstd` on your runners for faster compression and decompression.
:::

## 3. Usage

There is no need to change any of your workflows! 🔥

If you've set up your self-hosted runners correctly, they will automatically use the cache server for caching.
