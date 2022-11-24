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

```bash
deno test
```

### Formatting

```bash
deno fmt
```

### Linting

```bash
deno lint
```

### Updating dependencies

Our dependencies are divided into `deps.ts` and `test.deps.ts`.

```
# TODO: Explain https://github.com/hayd/deno-udd usage
```

#### Updating `lock.json`

After updating a dependency version in `deps.ts`, run the following command to
re-lock the dependencies:

```bash
deno cache --reload --lock=lock.json --lock-write deps.ts test.deps.ts
```

### Running locally

```bash
deno run --allow-net demos/default/main.ts
```

---

Created with 💖 by [**@EthanThatOneKid**](https://etok.codes)
