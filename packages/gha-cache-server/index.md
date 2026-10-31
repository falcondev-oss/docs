---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: Self-Hosted GitHub Actions Cache Server
titleTemplate: false
description: 'Self-hosted GitHub Actions cache server written in Rust. Drop-in replacement for actions/cache, setup-* caches and BuildKit type=gha on self-hosted runners. 29 MB image, 3 MiB idle memory.'
head:
  - - script
    - type: application/ld+json
    - '{"@context": "https://schema.org", "@type": "SoftwareApplication", "name": "GitHub Actions Cache Server", "description": "Self-hosted GitHub Actions cache server written in Rust. Drop-in replacement for the GitHub cache backend: actions/cache, setup-* caches and BuildKit type=gha work unchanged on self-hosted runners.", "url": "https://gha-cache-server.falcondev.io", "applicationCategory": "DeveloperApplication", "operatingSystem": "Linux, Docker, Kubernetes", "programmingLanguage": "Rust", "license": "https://opensource.org/licenses/MIT", "isAccessibleForFree": true, "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}, "featureList": ["Drop-in replacement for actions/cache, setup-* caches and BuildKit type=gha", "29 MB image, 0.5 s startup, 3 MiB idle memory", "7.9 GiB/s first download", "Storage: filesystem, S3 (RustFS, MinIO, R2), Google Cloud Storage, Azure Blob Storage", "Database: SQLite, PostgreSQL, MySQL", "OIDC-verified, per-repo scoped caches"], "sameAs": ["https://github.com/falcondev-oss/github-actions-cache-server"], "author": {"@type": "Organization", "name": "falconDev", "url": "https://falcondev.io"}}'

hero:
  name: GitHub Actions
  text: 'Cache Server'
  tagline: Easily deploy your own GitHub actions cache without needing to change any workflow files
  image:
    src: /logo.svg
    alt: GitHub Actions Cache Server
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: How it works
      link: /how-it-works

features:
  - title: Storage Drivers
    details: Support for multiple storage drivers like S3, GCS, Azure Blob Storage, and file system.
    icon: 📦
  - title: No Workflow Changes
    details: No need to change any workflow files, just deploy and start using.
    icon: ⚙️
  - title: Self-Hosted
    details: Host your own cache server to keep your data private and increase caching speed.
    icon: 🔒
---
