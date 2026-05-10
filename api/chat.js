// api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query, conversation_id } = req.body;

    try {
        const response = await fetch('https://api.dify.ai/v1/chat-messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: {},
                query: query,
                response_mode: "blocking",
                user: "web_user_123", // 这里建议稍微改下，或者从前端传过来
                conversation_id: conversation_id || ""
            }),
        });

        // 检查 API 是否返回了错误（比如 API Key 填错了）
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();

        // 重要：Chatflow 模式下，AI 的回复在 data.answer 中
        // 建议原样返回给前端，或者只返回前端需要的字段
        res.status(200).json({
            answer: data.answer,
            conversation_id: data.conversation_id,
            status: 'success'
        });

    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}