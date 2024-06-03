// Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
// Type completion not working? You might want to reload your TypeScript Server to pick up the changes
import { createSeedClient } from '@snaplet/seed';

const main = async () => {
  console.log('Seeding...');
  const seed = await createSeedClient();

  await seed.$resetDatabase();

  await seed.users((x) => x(5));

  await seed.projects((x) => x(10));

  await seed.milestones((x) => x(100));

  await seed.initatives((x) => x(10));

  await seed.projectInitatives((x) => x(10));

  console.log('Database seeded successfully!');

  process.exit();
};

main();
