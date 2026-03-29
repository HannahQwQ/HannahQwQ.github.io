import Character from '@/components/canvas/Character';
import ChatInput from '@/components/overlay/ChatInput';
import MailboxLink from '@/components/overlay/MailboxLink';
import './Home.css'; // 所有的定位逻辑都在这里

export default function Home() {
    const handleInteraction = (msg) => {
        console.log("用户输入了:", msg);
    };

    return (
        <main className="home-page fade-in">
            {/* Canvas 层：作为背景 */}
            <div className="canvas-layer">
                <Character />
            </div>

            {/* Overlay 层：UI 交互 */}
            <div className="ui-overlay">
                {/* 1. 角色占位（通过 CSS 控制在右上角） */}
                <div className="character-pos">
                    <Character />
                </div>

                {/* 2. 输入框（左上角 1/4 处） */}
                <div className="input-pos">
                    <ChatInput onSend={handleInteraction} />
                </div>

                {/* 3. 匿名信箱（中下方 2/5 处） */}
                <div className="mailbox-pos">
                    <MailboxLink />
                </div>
            </div>
        </main>
    );
}