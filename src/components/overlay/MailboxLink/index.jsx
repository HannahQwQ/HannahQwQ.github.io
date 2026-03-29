import { Link } from 'react-router-dom';
import './MailboxLink.css';

export default function MailboxLink() {
    return (
        <Link to="/mailbox" className="mailbox-card">
            <span className="text">📬 匿名信箱</span>
            <div className="shimmer"></div>
        </Link>
    );
}