import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Mailbox.css';

const WORKER_URL = 'https://hannahs-letter-box.dengxhxhwk.workers.dev';
const FALLBACK_MESSAGES = [
  {
    id: 'local-1',
    content: 'What should I inspect first?',
    is_answered: true,
    answer: 'Start with the world. The rest can become gates.',
  },
  {
    id: 'local-2',
    content: 'Can I leave quietly?',
    is_answered: false,
  },
];

function getAnswer(message) {
  return message.answer || message.reply || message.answer_content || '33 has not answered this one yet.';
}

export default function Mailbox() {
  const [questions, setQuestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [status, setStatus] = useState('loading');

  const loadMessages = async () => {
    try {
      const response = await fetch(WORKER_URL);
      if (!response.ok) {
        throw new Error(`Worker responded with ${response.status}`);
      }
      const data = await response.json();
      setQuestions(Array.isArray(data) ? data : []);
      setStatus('ready');
    } catch (error) {
      console.error('Failed to load mailbox messages:', error);
      setQuestions(FALLBACK_MESSAGES);
      setStatus('offline');
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleKeyDown = async (event) => {
    if (event.key !== 'Enter' || !inputValue.trim()) return;

    const newContent = inputValue.trim();

    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });

      if (!response.ok) {
        throw new Error(`Worker responded with ${response.status}`);
      }

      setInputValue('');
      await loadMessages();
    } catch (error) {
      console.error('Failed to send mailbox message:', error);
      setStatus('offline');
      setQuestions((current) => [
        { id: `local-${Date.now()}`, content: newContent, is_answered: false },
        ...current,
      ]);
      setInputValue('');
    }
  };

  const formatText = (text) => {
    const source = String(text || '');
    return source.length > 15 ? `${source.substring(0, 15)}...` : source;
  };

  return (
    <div className="mailbox-container">
      <Link className="mailbox-back" to="/world">Back to world</Link>
      <p className="mailbox-guide">33: Leave a question. Answered notes become readable bricks.</p>

      <div className="question-wall">
        {questions.map((question, index) => {
          const answered = Boolean(question.is_answered);
          return (
            <button
              key={question.id || `${question.content}-${index}`}
              type="button"
              className={`question-brick ${answered ? 'answered' : 'unanswered'}`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: `${2 + (index % 4) * 0.18}s`,
              }}
              onClick={() => answered && setSelectedQuestion(question)}
              disabled={!answered}
            >
              {formatText(question.content)}
            </button>
          );
        })}
      </div>

      <input
        className="mail-input"
        placeholder={status === 'offline' ? 'Offline draft...' : 'Ask me anything...'}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />

      {status === 'offline' && (
        <p className="mail-status">Worker is unreachable, so this page is showing local drafts.</p>
      )}

      {selectedQuestion && (
        <div className="modal-overlay" onClick={() => setSelectedQuestion(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setSelectedQuestion(null)}>
              Close
            </button>
            <p className="answer-text">{getAnswer(selectedQuestion)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
