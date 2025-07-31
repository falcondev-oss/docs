---
title: SQLite
---

# {{ $frontmatter.title }}

Driver: `sqlite`

::: warning

It is recommended to use a more robust database driver for production use.

:::

## Configuration

### `DB_SQLITE_PATH`

- Default: `.data/sqlite.db`

The path to the SQLite database file. This file will be created if it does not exist.
