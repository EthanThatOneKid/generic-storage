# <https://etok.codes/generic-storage>

Generic storage interface `Storer` for declarative resources.

## Purpose

Generic storage is a public key-value storage HTTP server.

Generic storage is intended for projects that are **in development**. This
repository provides a minimal way (requiring few steps) of persisting arbitrary,
unknown data online.

## Usage

### API usage

_TODO(@EthanThatOneKid): Describe intended API usage by providing an example_.

### Deno Deploy

_TODO(@EthanThatOneKid): Document the process of spinning up a simple, generic
storage system on [Deno Deploy](https://deno.com/deploy/docs/deployments)._

## Development

### Testing

Pass all existing unit tests.

```bash
deno test
```

Cover code completely.

```bash
deno test --coverage="cov" && deno coverage cov/
```

### Formatting

Properly format.

```bash
deno fmt
```

### Linting

Check for lint errors.

```bash
deno lint
```

### Running locally

Run the server locally.

Run this command alongside `npm run dev` to develop with local dev storage.

```bash
deno run --allow-net demos/default/main.ts
```

---

Created with 💖 by [**@EthanThatOneKid**](https://etok.codes)
