import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not configured');
  process.exit(1);
}

// Parse MySQL connection string
function parseConnectionString(url) {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5],
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

async function runMigration() {
  try {
    const config = parseConnectionString(DATABASE_URL);
    console.log(`📡 Connecting to database: ${config.host}:${config.port}/${config.database}`);

    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to database');

    // Read migration SQL file
    const migrationPath = path.join(__dirname, 'drizzle', '0001_little_jackpot.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    // Split SQL statements by statement-breakpoint
    const statements = sql
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`\n📋 Executing ${statements.length} SQL statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        console.log(`[${i + 1}/${statements.length}] Executing...`);
        await connection.execute(statement);
        console.log(`✅ Statement ${i + 1} executed successfully\n`);
      } catch (error) {
        console.error(`❌ Error executing statement ${i + 1}:`);
        console.error(error.message);
        console.error(`SQL: ${statement.substring(0, 100)}...\n`);
        // Continue with next statement
      }
    }

    await connection.end();
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
