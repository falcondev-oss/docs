# Getting Started

## Installation

::: code-group

```sh [npm]
$ npm install @falcondev-oss/caps
```

```sh [yarn]
$ yarn add @falcondev-oss/caps
```

```sh [pnpm]
$ pnpm add @falcondev-oss/caps
```

```sh [bun]
$ bun add @falcondev-oss/caps
```

:::

## Basic Concepts

This library is built around several key concepts:

- **Actor**: The entity performing an action (user, service, etc.)
- **Subject**: The target of an action (document, user profile, etc.)
- **Capability**: A specific permission or action that can be performed
- **Generator Functions**: Define capabilities using yield for permissions and return for final results

## Simple Example

Let's start with a basic example that demonstrates core concepts:

```ts
import { createActor } from '@falcondev-oss/caps'

// Define what an actor looks like
type User = {
  role: 'user' | 'admin'
}

// Create an actor definition
const useActor = createActor<User>().build((cap) => ({
  // Define a simple capability
  documents: cap.define(function* ({ actor }) {
    // All users can read documents
    yield ['read']

    // Only admins can create and delete
    if (actor.role === 'admin') {
      yield ['create', 'delete']
    }

    return []
  }),
}))

// Use the capabilities
const user = { role: 'user' }
const admin = { role: 'admin' }

const userCaps = useActor(user)
const adminCaps = useActor(admin)

// Check capabilities
userCaps.documents.can('read').check() // true
userCaps.documents.can('delete').check() // false

adminCaps.documents.can('read').check() // true
adminCaps.documents.can('delete').check() // true

// List all available capabilities
userCaps.documents.list() // ['read']
adminCaps.documents.list() // ['read', 'create', 'delete']
```

## Subject-Based Permissions

Often you need to check permissions on specific objects (subjects):

```ts
type User = {
  id: string
  role: 'user' | 'admin'
}

type Document = {
  id: string
  ownerId: string
  isPublic: boolean
}

const useActor = createActor<User>().build((cap) => ({
  document: cap.subject<Document>().define(function* ({ actor, subject }) {
    // Everyone can read public documents
    if (subject.isPublic) {
      yield ['read']
    }

    // Owners can read and edit their own documents
    if (actor.id === subject.ownerId) {
      yield ['read', 'edit', 'delete']
    }

    // Admins can do everything
    if (actor.role === 'admin') {
      yield ['read', 'edit', 'delete', 'publish']
    }

    return []
  }),
}))

const user = { id: '1', role: 'user' }
const caps = useActor(user)

const publicDoc = { id: 'doc1', ownerId: '2', isPublic: true }
const ownDoc = { id: 'doc2', ownerId: '1', isPublic: false }
const privateDoc = { id: 'doc3', ownerId: '2', isPublic: false }

// Check permissions on specific documents
caps.document.subject(publicDoc).can('read').check() // true
caps.document.subject(ownDoc).can('edit').check() // true
caps.document.subject(privateDoc).can('read').check() // false
```

## Arguments and Conditional Logic

You can pass arguments to capability checks for more complex logic:

```ts
import { arg } from '@falcondev-oss/caps'

type User = {
  id: string
  role: 'user' | 'moderator' | 'admin'
}

const useActor = createActor<User>().build((cap) => ({
  user: cap.subject<User>().define(
    function* ({ actor, subject, args }) {
      // Everyone can read users
      yield ['read']

      // Users can update themselves
      if (actor.id === subject.id) {
        yield ['update']
      }

      // Role-based permissions with arguments
      if (actor.role === 'admin') {
        yield ['ban', 'promote']

        // Admins can delete, but only with confirmation
        if (args.delete?.confirmed) {
          yield ['delete']
        }
      }

      if (
        actor.role === 'moderator' && // Moderators can only promote to certain roles
        (args.promote?.targetRole === 'user' || args.promote?.targetRole === 'moderator')
      ) {
        yield ['promote']
      }

      return []
    },
    // Define argument types
    {
      delete: arg<{ confirmed: boolean }>(),
      promote: arg<{ targetRole: 'user' | 'moderator' | 'admin' }>(),
    },
  ),
}))

const admin = { id: '1', role: 'admin' }
const moderator = { id: '2', role: 'moderator' }
const targetUser = { id: '3', role: 'user' }

const adminCaps = useActor(admin)
const modCaps = useActor(moderator)

// Using arguments in capability checks
adminCaps.user.subject(targetUser).can('delete', { confirmed: true }).check() // true

adminCaps.user.subject(targetUser).can('delete', { confirmed: false }).check() // false

modCaps.user.subject(targetUser).can('promote', { targetRole: 'moderator' }).check() // true

modCaps.user.subject(targetUser).can('promote', { targetRole: 'admin' }).check() // false
```

## Bulk Operations

Act on multiple subjects at once:

```ts
type User = {
  id: string
  role: 'user' | 'moderator' | 'admin'
  department: string
}

const useActor = createActor<User>().build((cap) => ({
  user: cap.subject<User>().define(function* ({ actor, subject }) {
    yield ['read']

    // Can edit users in same department
    if (actor.department === subject.department && actor.role === 'moderator') {
      yield ['edit']
    }

    if (actor.role === 'admin') {
      yield ['edit', 'delete']
    }

    return []
  }),
}))

const admin = { id: '1', role: 'admin', department: 'IT' }
const caps = useActor(admin)

const users = [
  { id: '2', role: 'user', department: 'IT' },
  { id: '3', role: 'user', department: 'HR' },
  { id: '4', role: 'moderator', department: 'IT' },
]

// Filter users that can be edited
caps.user.subjects(users).filter(['edit']) // all users (admin can edit everyone)

// Check if admin can edit all users
caps.user.subjects(users).canEvery('edit').check() // true

// Check if admin can delete any user
caps.user.subjects(users).canSome('delete').check() // true
```

## Advanced Example: User Management System

Here's a comprehensive example showing a realistic user management system:

```ts
import { arg, createActor, MissingCapabilityError } from '@falcondev-oss/caps'

type Role = 'user' | 'moderator' | 'admin'

type User = {
  userId: string
  role: Role
  isBanned?: boolean
}

const useActor = createActor<User>().build((cap) => ({
  user: cap.subject<User>().define(
    function* ({ actor, subject, args }) {
      // Banned users can't do anything
      if (actor.isBanned) return []

      // Everyone can read users
      yield ['read']

      // Users can update and delete themselves
      if (actor.userId === subject.userId) {
        yield ['update', 'delete']
      }

      // Admin permissions
      if (actor.role === 'admin') {
        yield ['create', 'update', 'set_role']

        // Admins can delete, but only with delay confirmation
        if (args.delete?.delayed) {
          yield ['delete']
        }
      }

      // Moderator permissions
      if (
        actor.role === 'moderator' &&
        subject.role !== 'admin' && // Can't affect admins
        (args.set_role?.role === 'user' || args.set_role?.role === 'moderator')
      ) {
        yield ['set_role']
      }

      return []
    },
    {
      set_role: arg<{ role: Role }>(),
      delete: arg<{ delayed: boolean }>(),
    },
  ),
}))

// Example usage
const regularUser = { userId: '1', role: 'user' as const }
const moderator = { userId: '2', role: 'moderator' as const }
const admin = { userId: '3', role: 'admin' as const }
const targetUser = { userId: '4', role: 'user' as const }

// Regular user capabilities
const userCaps = useActor(regularUser)
userCaps.user.subject(targetUser).list({}) // ['read']

// Admin capabilities
const adminCaps = useActor(admin)

adminCaps.user.subject(targetUser).list({
  delete: { delayed: true },
  set_role: { role: 'moderator' },
}) // ['read', 'create', 'update', 'set_role', 'delete']

// Error handling
try {
  userCaps.user.subject(targetUser).can('delete', { delayed: true }).throw()
} catch (err) {
  err instanceof MissingCapabilityError // true
  err.message // "Missing capability: 'delete'"
}

// Bulk operations with complex filtering
const allUsers = [regularUser, moderator, admin, targetUser]
adminCaps.user.subjects(allUsers).filter(['delete'], { delete: { delayed: true } }) // all users
```

## Working with Modes

For complex scenarios where subjects can have different "modes" or states:

```ts
import { mode, type Modes } from '@falcondev-oss/caps'

type DocumentModes = Modes<{
  draft: { content: string; authorId: string }
  published: { content: string; authorId: string; publishedAt: Date }
  archived: { content: string; authorId: string; archivedAt: Date }
}>

const useActor = createActor<User>().build((cap) => ({
  document: cap.subject<DocumentModes>().define(function* ({ actor, subject }) {
    switch (subject.__mode) {
      case 'draft': {
        if (subject.authorId === actor.id) {
          yield ['read', 'edit', 'publish', 'delete']
        }
        break
      }

      case 'published': {
        yield ['read'] // Everyone can read published docs
        if (subject.authorId === actor.id) {
          yield ['edit', 'archive']
        }
        break
      }

      case 'archived': {
        if (actor.role === 'admin') {
          yield ['read', 'restore', 'delete']
        }
        break
      }
    }

    return []
  }),
}))

// Usage with modes
const author = { id: '1', role: 'user' }
const caps = useActor(author)

const draftDoc = mode('draft', { content: 'Hello', authorId: '1' })
const publishedDoc = mode('published', {
  content: 'Hello World',
  authorId: '1',
  publishedAt: new Date(),
})

caps.document.subject(draftDoc).can('edit').check() // true
caps.document.subject(publishedDoc).can('publish').check() // false
```
