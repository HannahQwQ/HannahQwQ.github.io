import { useState } from 'react';
import './ChatInput.css';

export default function ChatInput({ onSend }) {
    const [text, setText] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && text.trim() !== '') {
            onSend(text);
            setText('');
        }
    };

    return (
        <div className="chat-input-container">
            <input
                type="text"
                value={text}
                placeholder="hello..."
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <div className="input-glow"></div>
        </div>
    );
}