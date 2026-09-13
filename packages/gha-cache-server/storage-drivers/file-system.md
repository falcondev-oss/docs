---
title: File System
description: The File System storage driver stores the cache in the local file system of the cache server. This is the default storage driver and is used when no other storage driver is specified.
---

# {{ $frontmatter.title }}

Driver: `filesystem`

{{ $frontmatter.description }}

## Configuration

### `STORAGE_FILESYSTEM_PATH`

- Default: `.data/storage/filesystem`

The path to the filesystem storage location. The folder will be created if it does not exist.

The cache server process needs read and write access to this path (and permission to create it). No other permissions are required for this driver.

## Eager merge

The filesystem driver has no direct downloads, so [`EAGER_MERGE`](/getting-started#eager-merge) gains little here. It streams the parts into the merged file at upload time and doubles disk use per entry until the parts cleanup job runs. Leave it off unless you want the first restore to read a single file.
