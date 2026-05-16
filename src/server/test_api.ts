async function testApi() {
  try {
    const response = await fetch('http://localhost:3001/api/agents/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflow: 'system-check', target: 'localhost' })
    });
    const data = await response.json();
    console.log("API Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("API Test Failed:", err);
  }
}

testApi();
