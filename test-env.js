console.log('DEEPSEEK_API_KEY present:', !!process.env.DEEPSEEK_API_KEY);
console.log('OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);

if (process.env.DEEPSEEK_API_KEY) {
  console.log('DEEPSEEK_API_KEY length:', process.env.DEEPSEEK_API_KEY.length);
}

if (process.env.OPENAI_API_KEY) {
  console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY.length);
}

console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('KEY') || key.includes('API')));
