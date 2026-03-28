import { Link } from 'react-router-dom';

export default function MailboxLink() {
    return (
        <Link to="/mailbox" className="mailbox-entrance">
            <span>📬 匿名信箱</span>
        </Link>
    );
}