# AI Database Integration POC

> Shows how to use LangChain and a chat model to connect NLP to a database.

## Scenario 1: Query your Data

```sh
curl -X POST -H "Content-Type: application/json" -d '{"question": "how many projects are there?"}' localhost:9002/nlp-query
```

Sample Response

```json
{
  "answer": "There are 120 projects in the database."
}
```

## Scenario 2: Associated Entities

```sh
curl -X POST -H "Content-Type: application/json" -d '{"entity": "Milestones", "id": 1}' localhost:9002/associated-entities
```

Sample Response

```json
[
  {
    "entity_type": "Milestones",
    "id": 1,
    "display_name": "Ubi in tum multa legi ea, praeseri modo primis voluptatis facio endi viveriunt."
  },
  {
    "entity_type": "Projects",
    "id": 11,
    "display_name": "Cum vult quosque latur aequit eos e."
  }
]
```

## Scenario 3: Similar Entities

```sh
curl -X POST -H "Content-Type: application/json" -d '{"id": 3}' localhost:9002/similar-projects
```

Sample Response

```json
[
  {
    "id":1,
    "name":"AI Research"
  },
  {
    "id":3,
    "name":"Research"
  }
]
```

## [Contributing](./CONTRIBUTING.md)

## [Data Seeding](./DataSeed.md)
