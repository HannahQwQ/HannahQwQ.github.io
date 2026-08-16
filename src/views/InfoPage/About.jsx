import { Link } from 'react-router-dom';
import './InfoPage.css';

export default function About() {
  return (
    <main className="info-page fade-in">
      <section className="info-shell">
        <Link className="info-back" to="/world">Back to world</Link>
        <h1 className="info-title">Archive Wall</h1>
        <p className="info-lead">
          I work between computer science and design, with a focus on computer
          vision, virtual worlds, and the way feedback changes how people explore.
        </p>
        <div className="info-grid">
          <article className="info-card">
            <h2>Direction</h2>
            <p>3D human generation, visual computing, and world-building interfaces.</p>
          </article>
          <article className="info-card">
            <h2>Stack</h2>
            <p>React, Three.js, R3F, WebGL, Python, and creative tooling.</p>
          </article>
          <article className="info-card">
            <h2>33 says</h2>
            <p>Good boundaries make exploration feel alive.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
