const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✓ Database connected successfully!');
    console.log('Current time:', result[0].current_time);
    
    // Test if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('\n✓ Available tables:');
    tables.forEach(table => console.log(`  - ${table.table_name}`));
    
    // Test inserting a sample user
    console.log('\n✓ Testing user creation...');
    const userResult = await sql`
      INSERT INTO users (id, username, email) 
      VALUES ('test-user-' || extract(epoch from now()), 'TestUser', 'test@nocturne.com')
      ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username
      RETURNING id, username, email
    `;
    console.log('Sample user created:', userResult[0]);
    
    // Test inserting a diary entry
    console.log('\n✓ Testing diary creation...');
    const diaryResult = await sql`
      INSERT INTO diaries (content, is_public, mood, author_id) 
      VALUES ('Database test entry - the night is full of possibilities!', true, 'excited', ${userResult[0].id})
      RETURNING id, content, mood
    `;
    console.log('Sample diary created:', diaryResult[0]);
    
    // Test inserting a whisper
    console.log('\n✓ Testing whisper creation...');
    const whisperResult = await sql`
      INSERT INTO whispers (content) 
      VALUES ('The midnight hour brings clarity to clouded thoughts ✨')
      RETURNING id, content, hearts
    `;
    console.log('Sample whisper created:', whisperResult[0]);
    
    console.log('\n🎉 Database integration successful! All tests passed.');
    
  } catch (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }
}

testDatabase();