import React, { useState } from 'react';
import './Mailbox.css';

const Mailbox = () => {
    // 模拟初始数据：answered 表示是否已回答
    const [questions, setQuestions] = useState([
        { id: 1, text: "你最近在忙什么项目？", answered: true },
        { id: 2, text: "React和Vue更喜欢哪个？", answered: false },
        { id: 3, text: "设计灵感来源哪里？", answered: true },
        { id: 4, text: "今天天气不错对吧？", answered: false },
    ]);

    const [inputValue, setInputValue] = useState("");

    // 处理回车提交
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            const newQuestion = {
                id: Date.now(),
                text: inputValue.trim(),
                answered: false, // 新输入的默认未回答（浅色）
            };
            setQuestions([newQuestion, ...questions]);
            setInputValue("");
        }
    };

    // 截取前15个字符
    const formatText = (text) => {
        return text.length > 15 ? text.substring(0, 15) + "..." : text;
    };

    return (
        <div className="mailbox-container">
            {/* 问题墙 */}
            <div className="question-wall">
                {questions.map((q, index) => (
                    <div
                        key={q.id}
                        className={`question-brick ${q.answered ? 'answered' : 'unanswered'}`}
                        style={{
                            // 关键：通过 index 产生波浪偏移感
                            animationDelay: `${index * 0.2}s`,
                            animationDuration: `${2 + Math.random()}s` // 增加一点随机感更自然
                        }}
                    >
                        {formatText(q.text)}
                    </div>
                ))}
            </div>

            {/* 输入区域 */}
            <input
                className="mail-input"
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
            />
        </div>
    );
};

export default Mailbox;