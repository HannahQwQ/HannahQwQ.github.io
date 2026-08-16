import { Link, useParams } from 'react-router-dom';
import './InfoPage.css';

export default function Project() {
  const { id } = useParams();

  return (
    <main className="info-page fade-in">
      <section className="info-shell">
        <Link className="info-back" to="/world">Back to world</Link>
        <h1 className="info-title">Project Gate</h1>
        <p className="info-lead">
          Placeholder detail page for `{id}`. The first world version uses this
          route as the landing spot for project portals before real assets are added.
        </p>
        <div className="info-grid">
          <article className="info-card">
            <h2>Role</h2>
            <p>Describe your work, decisions, and technical ownership here.</p>
          </article>
          <article className="info-card">
            <h2>Media</h2>
            <p>Images, videos, live demos, and 3D models can be attached later.</p>
          </article>
          <article className="info-card">
            <h2>33 says</h2>
            <p>A project should feel like a trace you can inspect, not a trophy.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
