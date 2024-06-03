# Data Seeding

> Used to shove lots of data in the db.

## Reverse Engineer the DB

> NOTE: An working schema lives at `prisma/schema.prisma` but is likely out of date.

Ensure your `.env` sets a proper `DATABASE_URL` to point to a real DB.

Use prisma to create a schema from the db.

```sh
npx prisma db pull
```

Generate the prisma client.

```sh
npx prisma generate
```

## Seed with @Snaplet

Update the Seeder's schema handling.

```sh
npx @snaplet/seed init prisma/seed
```

Restart your TypeScript server to pick up the generated client.

Update `prisma/seed/seed.ts` to include a single project.

Run the seeder.

```sh
npx tsx prisma/seed/seed.ts
```
