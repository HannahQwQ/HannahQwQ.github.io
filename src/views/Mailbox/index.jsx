import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './Mailbox.css';

const Mailbox = () => {
    // 初始状态设为空数组
    const [questions, setQuestions] = useState([]);
    const [inputValue, setInputValue] = useState("");

    // --- 1. 页面加载时拉取数据 ---
    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages') // 确保表名是 messages
                .select('*')
                .eq('is_visible', true) // 只显示你允许公开的
                .order('created_at', { ascending: false });

            if (error) {
                console.error('获取数据失败:', error.message);
            } else {
                setQuestions(data);
            }
        };

        fetchMessages();
    }, []);

    // --- 2. 处理提交到数据库 ---
    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            const content = inputValue.trim();

            // 构造要插入的数据（字段名需与数据库一致）
            const { data, error } = await supabase
                .from('messages')
                .insert([
                    {
                        content: content,
                        is_answered: false,
                        is_visible: true // 如果你想先发后审，这里设为 false
                    }
                ])
                .select(); // 插入后返回该行数据，包含 ID

            if (error) {
                console.error('发送失败:', error.message);
                alert("发送失败，请检查网络或权限配置");
            } else if (data) {
                // 将新消息插入到列表首位
                setQuestions([data[0], ...questions]);
                setInputValue("");
            }
        }
    };

    const formatText = (text) => {
        if (!text) return "";
        return text.length > 15 ? text.substring(0, 15) + "..." : text;
    };

    return (
        <div className="mailbox-container">
            <div className="question-wall">
                {questions.map((q, index) => (
                    <div
                        key={q.id} // 现在使用数据库生成的真实 ID
                        className={`question-brick ${q.is_answered ? 'answered' : 'unanswered'}`}
                        style={{
                            animationDelay: `${index * 0.2}s`,
                            animationDuration: `${2 + Math.random()}s`
                        }}
                    >
                        {/* 这里的 q.content 对应数据库的列名 */}
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
        </div>
    );
};

export default Mailbox;