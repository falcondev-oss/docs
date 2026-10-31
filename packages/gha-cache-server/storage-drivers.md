---
description: 'Storage backends for the self-hosted GitHub Actions cache server: filesystem, S3 (RustFS, MinIO, R2), Google Cloud Storage and Azure Blob Storage.'
---

# Storage Drivers

A list of storage drivers available for the GitHub Actions Cache Server

- [File System](/storage-drivers/file-system)
- [S3 / RustFS / MinIO / R2](/storage-drivers/s3)
- [GCS](/storage-drivers/google-cloud-storage)
- [Azure Blob Storage](/storage-drivers/azure-blob-storage)

## Object storage

On S3, GCS and Azure Blob Storage, parts are uploaded through presigned URLs, so the credentials must be able to sign. Without that, uploads fall back to multipart.

The server trusts an object it has seen to exist for a minute instead of checking storage on every cache hit. Data deleted behind the server's back (another replica, a bucket lifecycle rule) can still be promised to a runner for up to a minute.
