import { Link, useNavigate } from 'react-router-dom';
import DialoguePanel from '@/components/overlay/DialoguePanel';
import useCompanionDialogue from '@/hooks/useCompanionDialogue';
import './Start.css';

export default function Start() {
  const navigate = useNavigate();
  const dialogue = useCompanionDialogue({ pageState: 'opening' });

  return (
    <main className="start-page fade-in">
      <section className="start-canvas-lite" aria-hidden="true">
        <div className="start-ring start-ring-large" />
        <div className="start-ring start-ring-small" />
        <div className="start-core">33</div>
      </section>

      <section className="start-shell">
        <span className="start-kicker">3D Portfolio World</span>
        <h1>Before the world opens, meet 33.</h1>
        <p>
          A compact entry scene for quick orientation. Dify owns the dialogue state;
          this page keeps the topic focused, then you can build a visitor signal and enter.
        </p>

        <div className="start-actions">
          <button type="button" onClick={() => navigate('/avatar')}>
            Continue
          </button>
          <Link to="/world?mode=2d">Enter low performance mode</Link>
        </div>
      </section>

      <aside className="start-dialogue">
        <div className="dialogue-meta">
          <span>33 opening channel</span>
          <span>{dialogue.turns} turns</span>
        </div>
        <DialoguePanel
          messages={dialogue.messages}
          onSend={dialogue.sendMessage}
          placeholder="Ask about the portfolio world..."
        />
      </aside>
    </main>
  );
}
