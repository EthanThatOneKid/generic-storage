# generic-storage
Generic storage interface for declarative resources.

#### Update `lock.json`

After updating a dependency version in `deps.ts`, run the following command to re-lock the dependencies:

```bash
deno cache --reload --lock=lock.json --lock-write deps.ts
```