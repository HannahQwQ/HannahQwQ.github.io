import React, { useState, useEffect } from 'react';
import './Mailbox.css';

const Mailbox = () => {
    // console.log("Mailbox 组件开始渲染！"); // 防止静默失败
    // Cloudflare Worker 实际地址
    const WORKER_URL = 'https://hannahs-letter-box.dengxhxhwk.workers.dev';
    // 模拟初始数据：answered 表示是否已回答
    // const [questions, setQuestions] = useState([
    //     { id: 1, text: "你最近在忙什么项目？", answered: true },
    //     { id: 2, text: "React和Vue更喜欢哪个？", answered: false },
    //     { id: 3, text: "设计灵感来源哪里？", answered: true },
    //     { id: 4, text: "今天天气不错对吧？", answered: false },
    // ]);

    const [questions, setQuestions] = useState([]);
    const [inputValue, setInputValue] = useState("");

    // 新增：追踪当前被点击的留言
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    // 1. 页面加载时拉取数据
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(WORKER_URL);
                const data = await response.json();
                // 这里的 data 就是数据库返回的数组
                setQuestions(data);
            } catch (error) {
                console.error("加载留言失败:", error);
            }
        };
        fetchMessages();
    }, []);

    // 2. 处理回车提交
    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            const newContent = inputValue.trim();

            try {
                const response = await fetch(WORKER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: newContent }),
                });

                if (response.ok) {
                    // 发送成功后，手动刷新一次列表，或者把新消息加到列表开头
                    // 最简单的方法是重新获取一次，确保数据和数据库一致
                    const res = await fetch(WORKER_URL);
                    const newData = await res.json();
                    setQuestions(newData);
                    setInputValue("");
                }
            } catch (error) {
                console.error("发送失败:", error);
                alert("发送失败，请检查网络");
            }
        }
    };

    // 截取前15个字符
    const formatText = (text) => {
        return text.length > 15 ? text.substring(0, 15) + "..." : text;
    };

    return (
        <div className="mailbox-container">
            <div className="question-wall">
                {questions.map((q, index) => (
                    <div
                        key={q.id} // 使用数据库返回的真实 ID
                        // 注意这里：从 q.is_answered 读取布尔值
                        className={`question-brick ${q.is_answered ? 'answered' : 'unanswered'}`}
                        // 逻辑：只有已回答的才允许触发点击
                        onClick={() => q.is_answered && setSelectedQuestion(q)}
                        style={{
                            animationDelay: `${index * 0.1}s`,
                            animationDuration: `${2 + Math.random()}s`,
                            cursor: q.is_answered ? 'pointer' : 'default' // 给用户视觉提示
                        }}
                    >
                        {/* 注意这里：从 q.content 读取留言内容 */}
                        {formatText(q.content)}
                    </div>
                ))}
            </div>

            <input
                className="mail-input"
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
            />

            {/* 回答弹窗 UI */}
            {selectedQuestion && (
                <div className="modal-overlay" onClick={() => setSelectedQuestion(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>问题：</h3>
                        <p>{selectedQuestion.content}</p>
                        <hr />
                        <h3>我的回答：</h3>
                        {/* 假设你的数据库字段是 answer */}
                        <p className="answer-text">{selectedQuestion.answer || "思考中..."}</p>
                        <button onClick={() => setSelectedQuestion(null)}>关闭</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mailbox;