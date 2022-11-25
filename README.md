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
# Step 1: Install UDD tool, https://github.com/hayd/deno-udd
deno install -rf --allow-read=. --allow-write=. --allow-net https://deno.land/x/udd/main.ts

# Step 2: Update dependencies
udd *.ts

# Step 3: Update lock.json
deno cache --reload --lock=lock.json --lock-write deps.ts test.deps.ts
```

Locking in Deno:
<https://deno.land/manual/linking_to_external_code/integrity_checking>

### Running locally

```bash
deno run --allow-net demos/default/main.ts
```

---

Created with 💖 by [**@EthanThatOneKid**](https://etok.codes)
