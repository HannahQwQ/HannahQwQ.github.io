import { useState } from 'react';
import Character from '@/components/canvas/Character';
import ChatInput from '@/components/overlay/ChatInput';
import MailboxLink from '@/components/overlay/MailboxLink';
import './Home.css'; // 所有的定位逻辑都在这里

export default function Home() {
    // 状态控制：'idle' (初始) 或 'chatting' (对话中)
    const [mode, setMode] = useState('idle');
    const [chatHistory, setChatHistory] = useState({ user: '', ai: '' });

    const handleInteraction = (msg) => {
        if (!msg.trim()) return;

        console.log("用户输入了:", msg);

        // 1. 设置对话内容（AI 先给占位符）
        setChatHistory({ user: msg, ai: "..." });

        // 2. 切换模式，触发 3D 镜头平滑拉近
        setMode('chatting');

        // 3. 模拟 AI 回答（延迟 1.5s）
        setTimeout(() => {
            setChatHistory(prev => ({
                ...prev,
                ai: "我收到你的消息了！这是一个 3D 的球体作为替身，我们已经跑通了镜头拉近的逻辑。等你准备好 GLB 模型，我们可以随时替换它。"
            }));
        }, 1500);
    };

    return (
        <main className="home-page fade-in">
            {/* 1. 角色层 (3D Canvas) --- 全屏覆盖 */}
            <div className="character-pos full-screen">
                <Character isChatting={mode === 'chatting'} />
            </div>

            {/* Overlay 层：UI 交互 */}
            <div className="ui-overlay">
                {/* 2. 输入框（左上角 1/4 处） */}
                <div className="input-pos">
                    <ChatInput onSend={handleInteraction} />

                    {/* 3. 对话框显示 (只在聊天模式) */}
                    {mode === 'chatting' && (
                        <div className="dialogue-container">
                            <p className="user-bubble">{chatHistory.user}</p>
                            <p className="ai-bubble">{chatHistory.ai}</p>
                        </div>
                    )}
                </div>

                {/* 4. 匿名信箱 */}
                <div className="mailbox-pos">
                    <MailboxLink />
                </div>
            </div>
        </main>
    );
}