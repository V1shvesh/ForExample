const client = require('./pgClient');
const initialValues = require('./initialValues');

const CREATE_QUERY = `
CREATE TABLE IF NOT EXISTS currencies (
  label char(3) CONSTRAINT currencies_pkey PRIMARY KEY,
  value float
)
`;

const UPSERT_QUERY = `
INSERT INTO currencies(label, value)
VALUES($1, $2)
ON CONFLICT ON CONSTRAINT currencies_pkey
DO
  UPDATE
  SET value = EXCLUDED.value
RETURNING *
`;

function lerp(oldValue, newValue, ratio) {
  return oldValue * ratio + newValue * (1 - ratio);
}

async function createTable() {
  await client.query(CREATE_QUERY);
}

async function initializeTable() {
  try {
    const pendingOperations = initialValues.map(
      ({ label, value }) => client.query(UPSERT_QUERY, [label, value]),
    );
    const res = await Promise.all(pendingOperations);
    const returns = res.map(({ rows }) => rows);
    process.stdout.write(JSON.stringify(returns, null, 2));
  } catch (err) {
    process.stderr.write(JSON.stringify(err.stack, null, 2));
  }
}

async function updateTable() {
  try {
    console.log('Reached');
    const pendingOperations = initialValues
      .filter(({ label }) => label !== 'USD')
      .map(
        ({ label, value }) => {
          const newValue = value * 0.95 + value * 0.1 * Math.random();
          return client.query(UPSERT_QUERY, [
            label,
            lerp(value, newValue, 0.7),
          ]);
        },
      );
    const res = await Promise.all(pendingOperations);
    const returns = res.map(({ rows }) => rows);
    process.stdout.write(JSON.stringify(returns, null, 2));
  } catch (err) {
    process.stderr.write(JSON.stringify(err.stack, null, 2));
  }
}

async function main() {
  try {
    await client.connect();
    // console.log('Connected');
    await createTable();
    // console.log('Created Table');
    await initializeTable();
    // console.log('Initialized Table');
    const tid = setInterval(
      updateTable,
      1000,
    );
    process.on('SIGINT', () => {
      clearInterval(tid);
      client.end();
      process.stdout.write('\n\nServer Terminated...\n\n');
    });
  } catch (err) {
    console.error(err);
  } finally {
    console.log('Ended');
  }
}

main();
