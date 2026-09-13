---
title: Google Cloud Storage
description: This storage driver stores the cache in a GCS bucket.
---

# {{ $frontmatter.title }}

Driver: `gcs`

{{ $frontmatter.description }}

## Configuration

### `docker-compose` GCS bucket

```yaml [docker-compose.yml]
version: '3.9'

services:
  cache-server:
    image: ghcr.io/falcondev-oss/github-actions-cache-server:latest
    ports:
      - '3000:3000'
    environment:
      API_BASE_URL: http://localhost:3000

      STORAGE_DRIVER: gcs
      STORAGE_GCS_BUCKET: gh-actions-cache
      # Optional, not required if running on GCP
      STORAGE_GCS_SERVICE_ACCOUNT_KEY: /gcp/config/application_default_credentials.json
    volumes:
      - cache-data:/app/.data

      # Use host's application default credentials
      - $HOME/.config/gcloud:/gcp/config:ro

volumes:
  cache-data:
```

### Environment Variables

Don't forget to set the `STORAGE_DRIVER` environment variable to `gcs` to use the GCS storage driver.

#### `STORAGE_GCS_BUCKET`

Example: `gh-actions-cache`

The name of the GCS bucket used for storage.

#### `STORAGE_GCS_SERVICE_ACCOUNT_KEY`

Example: `/config/auth/serviceaccount.json`

Path to the service account key used for authentication. If not set, [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials) is used.

#### `STORAGE_GCS_ENDPOINT`

Example: `http://localhost:9000`

The API endpoint for GCS.

## Minimal permissions

All cache objects live under the `gh-actions-cache/` prefix in the bucket. The service account needs these IAM permissions on the bucket:

| Permission               | Used for                                    |
| ------------------------ | ------------------------------------------- |
| `storage.buckets.get`    | Startup bucket check                        |
| `storage.objects.get`    | Downloading cache entries, existence checks |
| `storage.objects.list`   | Listing/counting cache objects              |
| `storage.objects.create` | Uploading cache entries, merging parts      |
| `storage.objects.delete` | Cache cleanup and abandoned uploads         |

The predefined [`roles/storage.objectAdmin`](https://cloud.google.com/storage/docs/access-control/iam-roles) role covers all the object permissions but **not** `storage.buckets.get`. Either grant `roles/storage.objectAdmin` together with `roles/storage.legacyBucketReader`, or create a custom role with the five permissions above.

If you enable direct downloads (`ENABLE_DIRECT_DOWNLOADS`) without a `STORAGE_GCS_SERVICE_ACCOUNT_KEY` (i.e. using Application Default Credentials), signing download URLs additionally requires the `iam.serviceAccounts.signBlob` permission (granted by `roles/iam.serviceAccountTokenCreator`). This is not needed when a service account key file is provided, since URLs are then signed locally.

With [`EAGER_MERGE`](/getting-started#eager-merge) the server merges parts inside the bucket using `compose`, covered by the permissions above. The merged object is a composite object; it downloads like any other object.
