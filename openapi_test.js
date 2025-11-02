// callOpenAI.js
// Node.js 18+ (内置 fetch)。若用 Node 16/17，可引入 node-fetch。

async function callOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY in environment variables');
  }

  const resp = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-5-nano',
      input: '你好',
      store: true,
    }),
  });

  if (!resp.ok) {
    // 便于排错：把返回文本一起抛出
    const errText = await resp.text().catch(() => '');
    throw new Error(`OpenAI API error: ${resp.status} ${resp.statusText} ${errText}`);
  }

  const data = await resp.json();
  // 需要的话你也可以 console.log(data);
  console.log(data);
  return data;
}

module.exports = callOpenAI;
// 使用：
// (async () => { const result = await callOpenAI(); console.log(result); })();
