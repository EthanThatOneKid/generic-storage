# <https://etok.codes/generic-storage>

Generic storage interface for declarative resources.

## Purpose

Generic storage is for use in experimental projects that are **in development**.

This repository provides a minimal way (requiring few steps) of persisting
arbitrary data online.

## Development

### Testing

```bash
deno test --allow-all --coverage=cov/
deno coverage --lcov cov/
```

### Formatting

```bash
deno fmt
```

### Linting

```bash
deno lint
```

### Running the server locally

```bash
# TODO(@EthanThatOneKid): Create an example HTTP server that extends the given StorageInterface and example resource.
# TODO(@EthanThatOneKid): Generate declarative resource via Protobuf hosted online.
```

### Running the server on Deno Deploy

_TODO(@EthanThatOneKid): Document the process of spinning up a simple, generic
storage system on [Deno Deploy](https://deno.com/deploy/docs/deployments)._

---

Created with 💖 by [**@EthanThatOneKid**](https://etok.codes)
