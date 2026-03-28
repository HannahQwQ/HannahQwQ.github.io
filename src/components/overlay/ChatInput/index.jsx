import { useState } from 'react';

export default function ChatInput({ onSend }) {
    const [text, setText] = useState('');

    return (
        <div className="chat-input-wrapper">
            <input
                type="text"
                value={text}
                placeholder="hello..."
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (onSend(text), setText(''))}
            />
        </div>
    );
}