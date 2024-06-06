import express from 'express';
import {
  getAssociatedEntities,
  getSimilarProjects,
  nlpQuery,
} from './app';

const app = express();
app.use(express.json());
const port = 9002;

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

//
// Will return all associated entities for a given entity and id
// based on the db schema.
//
app.post('/associated-entities', async (req, res) => {
  const { entity, id } = req.body;
  console.log({ entity, id });
  const results = await getAssociatedEntities(entity, id);
  res.json(results);
});

//
// Does a general nlp mapping to the db data.
//
app.post('/nlp-query', async (req, res) => {
  const { question } = req.body;
  console.log({ question });
  const answer = await nlpQuery(question);
  res.json({ answer });
});

//
// TODO: could expand into "similar-entities" by passing and id, and list of fields to match on.
// Will return projects with similar descriptions.
//
app.post('/similar-projects', async (req, res) => {
  const { id } = req.body;
  console.log({ id });
  const results = await getSimilarProjects(id);
  res.json(results);
});

app.listen(port, () => {
  console.log(
    `AI DB Interaction App listening on port ${port}`,
  );
});
