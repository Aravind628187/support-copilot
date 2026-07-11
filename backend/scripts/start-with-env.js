const { spawn } = require('node:child_process');
const path = require('node:path');

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: false,
      cwd: path.resolve(__dirname, '..'),
      env: process.env,
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL_NON_POOLING || process.env.DATABASE_URL_UNPOOLED || process.env.DB_URL || process.env.POSTGRESQL_URL;

  if (!databaseUrl) {
    console.error('❌ No database URL found in environment variables.');
    process.exit(1);
  }

  await run('npx', ['prisma', 'migrate', 'deploy']);
  await run('node', ['dist/src/index.js']);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
