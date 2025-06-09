---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Caps
  text: Type-safe access control made simple
  tagline: Model complex authorization logic with simple generator functions
  image:
    src: /logo.svg
    alt: Caps
  actions:
    - theme: brand
      text: Get Started
      link: /guide
    - theme: alt
      text: Examples
      link: /examples

features:
  - title: Actor-Subject Model
    details: Define permissions based on relationships between actors (users) and
      subjects (resources)
    icon: 👤
  - title: Generator-Based Logic
    details: Use generator functions to yield capabilities dynamically based on
      context and conditions
    icon: ⚡
  - title: Batch Operations
    details: Check permissions across multiple subjects at once with filter,
      canSome, and canEvery methods
    icon: 📦
  - title: Type Safety
    details: Catch permission errors at compile time and get full autocomplete for
      capabilities
    icon: 🛡️
  - title: Flexible Querying
    details: 'Multiple ways to check permissions: can(), list(), throw(), and
      check() methods'
    icon: 🔍
  - title: Custom Error Handling
    details: Configure custom error creation for missing capabilities and
      authorization failures
    icon: ⚠️
---
