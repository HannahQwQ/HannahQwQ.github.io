import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
    const [password, setPassword] = useState('');
    const [authorized, setAuthorized] = useState(false);
    const [questions, setQuestions] = useState([]);

    // 获取数据（记得在 AdminPanel 里不需要额外鉴权，获取数据是公开的）
    const fetchMessages = async () => {
        const res = await fetch('https://hannahs-letter-box.dengxhxhwk.workers.dev');
        const data = await res.json();
        // 只显示未回答的问题
        setQuestions(data.filter(q => !q.is_answered));
    };

    const submitAnswer = async (id, answer) => {
        const res = await fetch('https://hannahs-letter-box.dengxhxhwk.workers.dev/answer', {
            method: 'POST',
            headers: {
                'Authorization': password, // 将密码作为 Token 传给后端
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, answer })
        });

        if (res.ok) {
            alert("回答已发布！");
            fetchMessages(); // 刷新列表
        } else {
            alert("提交失败，请检查密码或网络");
        }
    };

    if (!authorized) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
                <input type="password" placeholder="输入管理密码" onChange={(e) => setPassword(e.target.value)} />
                <button onClick={() => setAuthorized(true)}>解锁管理台</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>管理后台</h1>
            {questions.map(q => (
                <div key={q.id} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
                    <p><strong>问题:</strong> {q.content}</p>
                    <textarea id={`ans-${q.id}`} placeholder="写下你的回答..." style={{ width: '100%' }} />
                    <button onClick={() => submitAnswer(q.id, document.getElementById(`ans-${q.id}`).value)}>
                        提交
                    </button>
                </div>
            ))}
        </div>
    );
};

export default AdminPanel;