const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkExpenses() {
  const client = new Client({
    connectionString: process.env.NEXT_PUBLIC_DATABASE_URL || process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    
    // Check if expenses table exists
    console.log('\nChecking expenses table structure:');
    const tableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'expenses';
    `);
    
    tableInfo.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
    });

    // Check existing expenses
    console.log('\nChecking existing expenses:');
    const expenses = await client.query('SELECT * FROM expenses');
    if (expenses.rows.length === 0) {
      console.log('No expenses found in the database');
    } else {
      expenses.rows.forEach(expense => {
        console.log(expense);
      });
    }

    // Try inserting a test expense
    console.log('\nTrying to insert a test expense...');
    const insertResult = await client.query(`
      INSERT INTO expenses (name, amount, "budgetId", "createdAt")
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, ['Test Expense', 100.00, null, '14/03/2024']);
    
    console.log('Test expense inserted:', insertResult.rows[0]);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkExpenses(); 