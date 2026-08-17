import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_VISITOR_SIGNAL, VISITOR_SIGNAL_OPTIONS } from '@/data/worldNodes';
import './Avatar.css';

export default function Avatar() {
  const navigate = useNavigate();
  const [signal, setSignal] = useState(() => {
    try {
      const saved = localStorage.getItem('visitorSignal');
      return saved ? { ...DEFAULT_VISITOR_SIGNAL, ...JSON.parse(saved) } : DEFAULT_VISITOR_SIGNAL;
    } catch {
      return DEFAULT_VISITOR_SIGNAL;
    }
  });

  const previewStyle = useMemo(() => ({ '--visitor-color': signal.color }), [signal.color]);

  const updateSignal = (key, value) => {
    setSignal((current) => ({ ...current, [key]: value }));
  };

  const confirm = (nextSignal = signal) => {
    localStorage.setItem('visitorSignal', JSON.stringify(nextSignal));
    navigate('/world');
  };

  const useDefault = () => {
    localStorage.setItem('visitorSignal', JSON.stringify(DEFAULT_VISITOR_SIGNAL));
    navigate('/world');
  };

  return (
    <main className="avatar-page fade-in">
      <section className="avatar-preview" style={previewStyle}>
        <div className="signal-orbit" />
        <div className="signal-body">
          <span>{signal.nickname.slice(0, 2) || 'V'}</span>
        </div>
        <p>{signal.scale} · {signal.trail}</p>
      </section>

      <section className="avatar-panel">
        <span className="avatar-kicker">Visitor signal</span>
        <h1>Build a light identity, not a full body.</h1>
        <p>
          The first MVP saves only a small signal: nickname, color, scale, and trail.
          It keeps the Avatar gate useful without blocking the world.
        </p>

        <label className="avatar-field">
          Nickname
          <input
            value={signal.nickname}
            maxLength={16}
            onChange={(event) => updateSignal('nickname', event.target.value)}
          />
        </label>

        <div className="avatar-field">
          Color
          <div className="signal-swatches">
            {VISITOR_SIGNAL_OPTIONS.colors.map((color) => (
              <button
                key={color}
                type="button"
                className={signal.color === color ? 'selected' : ''}
                style={{ backgroundColor: color }}
                aria-label={`Choose ${color}`}
                onClick={() => updateSignal('color', color)}
              />
            ))}
          </div>
        </div>

        <div className="avatar-field">
          Scale
          <div className="segmented-control">
            {VISITOR_SIGNAL_OPTIONS.scales.map((scale) => (
              <button
                key={scale}
                type="button"
                className={signal.scale === scale ? 'selected' : ''}
                onClick={() => updateSignal('scale', scale)}
              >
                {scale}
              </button>
            ))}
          </div>
        </div>

        <div className="avatar-field">
          Trail
          <div className="segmented-control">
            {VISITOR_SIGNAL_OPTIONS.trails.map((trail) => (
              <button
                key={trail}
                type="button"
                className={signal.trail === trail ? 'selected' : ''}
                onClick={() => updateSignal('trail', trail)}
              >
                {trail}
              </button>
            ))}
          </div>
        </div>

        <div className="avatar-actions">
          <button type="button" onClick={() => confirm()}>
            Confirm identity
          </button>
          <button type="button" onClick={useDefault}>
            Use default
          </button>
        </div>
      </section>
    </main>
  );
}
