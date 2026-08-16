import { Link } from 'react-router-dom';
import './InfoPage.css';

export default function Contact() {
  return (
    <main className="info-page fade-in">
      <section className="info-shell">
        <Link className="info-back" to="/world">Back to world</Link>
        <h1 className="info-title">Signal Terminal</h1>
        <p className="info-lead">
          This page is the low-friction exit from the 3D world. It keeps contact
          links reachable even when visitors do not want to explore.
        </p>
        <div className="info-grid">
          <article className="info-card">
            <h2>Email</h2>
            <p>Add your preferred email here.</p>
          </article>
          <article className="info-card">
            <h2>GitHub</h2>
            <p>Add your repository or profile link here.</p>
          </article>
          <article className="info-card">
            <h2>Next</h2>
            <p>Replace these placeholders once the public contact surface is final.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
