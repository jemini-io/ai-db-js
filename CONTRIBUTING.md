# Contributing

## Setup

Install dependencies.

```bash
npm i
```

Ensure you have an `.env` file with a `DATABASE_URL` var.

Setup the database.

```sh
docker-compose up -d
npm run db:setup
```

Seed additional data with the [Data Seed](./DataSeed.md) guide.

Add your `OPENAI_API_KEY` to the `.env` file.

Start the app

```sh
npm run dev
```

Open POSTMAN and test out the APIs mentioned in the [README.md](./README.md)

## Structure

Everything is under `src`.

- `server.ts` - a simple express server.
- `db.ts` - the database connection info.
- `app.ts` - contains the AI orchestration code.

## References

To get up to speed on concepts, check out these useful docs.

- <https://www.freecodecamp.org/news/beginners-guide-to-langchain/>
- <https://js.langchain.com/v0.1/docs/expression_language/cookbook/sql_db/>
