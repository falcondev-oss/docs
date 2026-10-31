---
title: SQLite
description: 'Use SQLite as the cache metadata database of the self-hosted GitHub Actions cache server. The default, with no extra service to run.'
---

# SQLite

Driver: `sqlite`

::: warning

It is recommended to use a more robust database driver for production use.

:::

## Configuration

### `DB_SQLITE_PATH`

- Default: `.data/sqlite.db`

The path to the SQLite database file. This file will be created if it does not exist.

The database runs in [WAL mode](https://www.sqlite.org/wal.html) with `synchronous=normal`, so it keeps `-wal` and `-shm` files next to the database file. A power loss or OS crash can drop the last commits, but never corrupts the database.
