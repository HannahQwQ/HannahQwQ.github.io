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

    // 用于自动定位滚动条的引用
    const scrollRef = useRef(null);

    // 2. 自动滚动逻辑：每当聊天记录更新，滚动到底部
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleInteraction = (msg) => {
        if (!msg.trim()) return;

        setMode('chatting');

        // 3. 将用户消息加入数组
        const userMsg = { role: 'user', text: msg };
        setChatHistory(prev => [...prev, userMsg]);

        // 4. 模拟 AI 响应
        setTimeout(() => {
            const aiMsg = { role: 'ai', text: "这是历史记录中的一条回复..." };
            setChatHistory(prev => [...prev, aiMsg]);
        }, 1000);
    };

    return (
        <main className="home-page fade-in">
            <div className="character-pos full-screen">
                <Character isChatting={mode === 'chatting'} />
            </div>

            <div className="ui-overlay">
                <div className="input-pos">
                    <ChatInput onSend={handleInteraction} />

                    {/* 5. 渲染对话列表 */}
                    {mode === 'chatting' && (
                        <div className="dialogue-container" ref={scrollRef}>
                            {chatHistory.map((chat, index) => (
                                <div key={index} className={`${chat.role}-bubble`}>
                                    {chat.text}
                                </div>
                            ))}
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