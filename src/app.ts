require('dotenv').config();
import {
  StringOutputParser,
  JsonOutputParser,
} from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import {
  RunnablePassthrough,
  RunnableSequence,
} from '@langchain/core/runnables';
import { ChatOpenAI } from '@langchain/openai';
import { getSchema, query } from './db';
import { AssociationResult } from './types';

// AI
const chatModel = new ChatOpenAI({
  model: 'gpt-3.5-turbo',
  temperature: 0,
});

// Get the SQL query for a single entity.
const prompt =
  PromptTemplate.fromTemplate(`Based on the table schema below, write a MySQL query that would answer the user's question:
{schema}

Question: {question}
MySQL Query:
`);
const outputParser = new StringOutputParser();
const jsonParser = new JsonOutputParser();

export async function getAssociatedEntities(
  entity: string,
  id: number,
): Promise<AssociationResult[]> {
  //
  // Setup Prompt
  //
  const setup = `What are all the associated entities for entity: ${entity} with id: ${id}?`;
  const instructions =
    'For each entity type, only include the type as "entity_type", the id as "id", the title or name as "display_name"';
  const question = `${setup}\n${instructions}`;
  console.log({ question });

  //
  // Chain
  // 1. Retrieve the schema
  // 2. Augment the prompt (templated) with the schema and the question
  // 3. Generate the SQL query
  //
  const sqlQueryGeneratorChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      schema: async () => await getSchema(),
    }),
    prompt,
    chatModel.bind({ stop: ['\nSQLResult:'] }),
    outputParser,
  ]);
  const aiGeneratedQuery =
    await sqlQueryGeneratorChain.invoke({ question });
  console.log({ aiGeneratedQuery });

  //
  // Use the Query to get the results
  //
  const results = await query(aiGeneratedQuery);
  return results as AssociationResult[];
}

export async function nlpQuery(question: string) {
  const schema = await getSchema();
  //
  // Chain
  // 1. [R]etrieve the schema
  // 2. [A]ugment the prompt (templated) with the schema and the question
  // 3. [G]enerate the SQL query
  //
  const sqlQueryGeneratorChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      schema: () => schema,
    }),
    prompt,
    chatModel.bind({ stop: ['\nSQLResult:'] }),
    outputParser,
  ]);
  const aiGeneratedQuery =
    await sqlQueryGeneratorChain.invoke({ question });
  console.log({ aiGeneratedQuery });

  //
  // Answer the original question with the data.
  //
  const finalResponsePrompt = PromptTemplate.fromTemplate(
    `Based on the table schema below, question, MySQL query, and sql response, write a natural language response:
{schema}

Question: {question}
MySQL Query: {query}
SQL Response: {response}`,
  );

  //
  // Another RAG
  // This approach DOES SHIP DATA TO THE AI.
  //
  const fullChain = RunnableSequence.from([
    // tbh, I don't know why we pass the previous chain as the query here.
    RunnablePassthrough.assign({
      query: sqlQueryGeneratorChain,
    }),
    {
      schema: () => schema,
      question: (input) => input.question,
      query: (input) => input.query,
      response: async (input) =>
        JSON.stringify(await query(input.query)),
    },
    finalResponsePrompt,
    chatModel,
  ]);

  const finalResponse = await fullChain.invoke({
    question,
  });
  console.log(finalResponse);

  return finalResponse.content;
}

export async function getSimilarProjects(id: number) {
  // 1. query the project and get the description.
  const projectQueryResult = await query(
    `SELECT description FROM Projects WHERE id = ${id}`,
  );
  const description = (projectQueryResult as any)[0]
    .description;
  console.log({ description });

  // 2. use ai to detect 2 keywords from the description.
  const keywordsPrompt =
    PromptTemplate.fromTemplate(`Based on the description below, detect 2 single word keywords:
Project Description: {description}
Return the keywords in a JSON list of strings.
`);
  const keywordsChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      description: () => description,
    }),
    keywordsPrompt,
    chatModel,
    jsonParser,
  ]);
  const aiGeneratedKeywords = await keywordsChain.invoke({
    description,
  });
  console.log({ aiGeneratedKeywords });

  // 3. query the db for projects that contain all those keywords.
  const keywords = aiGeneratedKeywords.keywords;
  const similarProjectsQuery = `SELECT id, name FROM Projects WHERE description LIKE '%${keywords.join(
    "%' AND description LIKE '%",
  )}%'`;
  console.log({ similarProjectsQuery });

  // 4. return the results
  const results = await query(similarProjectsQuery);
  return results;
}
