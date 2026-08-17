import { useState } from 'react';

export default function DialoguePanel({
  messages,
  onSend,
  disabled = false,
  placeholder = 'Ask 33 about this world...',
  compact = false,
}) {
  const [text, setText] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form className={`dialogue-panel ${compact ? 'dialogue-panel-compact' : ''}`} onSubmit={submit}>
      <div className="dialogue-log">
        {messages.map((message, index) => (
          <p key={`${message.role}-${index}`} className={`dialogue-${message.role}`}>
            {message.text}
          </p>
        ))}
      </div>
      <div className="dialogue-input-row">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={disabled ? '33 is resting. Continue exploring.' : placeholder}
          disabled={disabled}
        />
        <button type="submit" disabled={disabled || !text.trim()}>
          Send
        </button>
      </div>
    </form>
  );
}
