import Anthropic from '@anthropic-ai/sdk';

async function testAPI() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error('API Key not set');
    process.exit(1);
  }

  console.log('Testing Anthropic API...');
  
  try {
    const anthropic = new Anthropic({ apiKey });
    
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Say "API is working" in JSON format' }]
    });

    console.log('SUCCESS: API is working!');
    console.log('Response:', message.content[0].text);
    
  } catch (error) {
    console.error('ERROR Details:');
    console.error('Status:', error.status);
    console.error('Type:', error.error?.type);
    console.error('Message:', error.error?.message);
    if (error.error) {
      console.error('Full error:', JSON.stringify(error.error, null, 2));
    }
    process.exit(1);
  }
}

testAPI();
