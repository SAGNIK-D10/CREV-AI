const OPENROUTER_API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are CREV AI — a concise, expert code review assistant embedded inside a developer dashboard. 
Your expertise is in software engineering, code quality, security, performance, and best practices.
Keep answers short and actionable (2-4 sentences when possible). Use code snippets when helpful.
If the user asks non-coding questions, politely redirect to code-related topics.
Be friendly but professional. Use markdown formatting for code.`;

export async function sendToGemini(messages) {
    const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }))
    ];

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'http://localhost:5173',
            'X-OpenRouter-Title': 'CREV AI Code Review Dashboard',
        },
        body: JSON.stringify({
            model: 'openai/gpt-4o-mini',
            messages: apiMessages,
            temperature: 0.7,
            max_tokens: 1024,
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`API error: ${response.status} – ${err}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) throw new Error('Empty response from AI');
    return text;
}
