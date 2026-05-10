import { useState, useEffect, useRef } from 'react';
import Character from '@/components/canvas/Character';
import ChatInput from '@/components/overlay/ChatInput';
import MailboxLink from '@/components/overlay/MailboxLink';
import './Home.css'; // 所有的定位逻辑都在这里

export default function Home() {
    // 状态控制：'idle' (初始) 或 'chatting' (对话中)
    const [mode, setMode] = useState('idle');
    // 1. 将状态改为数组，存放消息对象 { role: 'user' | 'ai', text: string }
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // 加载状态

    // 用于存储 Dify 返回的会话 ID，实现连续对话
    const conversationIdRef = useRef("");
    // 用于自动定位滚动条的引用
    const scrollRef = useRef(null);

    // 2. 自动滚动逻辑：每当聊天记录更新，滚动到底部
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleInteraction = async (msg) => {
        if (!msg.trim() || isLoading) return;

        setMode('chatting');
        setIsLoading(true); // 开始请求，禁用输入或展示等待状态

        // 1. 先把用户的话塞进聊天框
        const userMsg = { role: 'user', text: msg };
        setChatHistory(prev => [...prev, userMsg]);

        try {
            // 2. 请求你在 Vercel 上的后端函数
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: msg,
                    conversation_id: conversationIdRef.current // 传递上次的 ID
                }),
            });

            const data = await response.json();

            if (data.answer) {
                // 3. 更新会话 ID
                conversationIdRef.current = data.conversation_id;

                // 4. 将 AI 的真回复塞进聊天框
                const aiMsg = { role: 'ai', text: data.answer };
                setChatHistory(prev => [...prev, aiMsg]);
            }
        } catch (error) {
            console.error("Dify Error:", error);
            setChatHistory(prev => [...prev, { role: 'ai', text: "（信号中断...请检查网络）" }]);
        } finally {
            setIsLoading(false); // 结束加载
        }
    };

    return (
        <main className="home-page fade-in">
            <div className="character-pos full-screen">
                <Character isChatting={mode === 'chatting'} />
            </div>

            <div className="ui-overlay">
                <div className="input-pos">
                    {/* 加载时禁用输入框防止刷屏 */}
                    <ChatInput onSend={handleInteraction} disabled={isLoading} />

                    {/* 5. 渲染对话列表 */}
                    {mode === 'chatting' && (
                        <div className="dialogue-container" ref={scrollRef}>
                            {chatHistory.map((chat, index) => (
                                <div key={index} className={`${chat.role}-bubble`}>
                                    {chat.text}
                                </div>
                            ))}
                            {isLoading && <div className="ai-bubble">33 is on the way...</div>}
                        </div>
                    )}
                </div>

                <div className="mailbox-pos">
                    <MailboxLink />
                </div>
            </div>
        </main>
    );
}