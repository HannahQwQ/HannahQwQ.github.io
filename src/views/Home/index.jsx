import Character from '@/components/canvas/Character';
import ChatInput from '@/components/overlay/ChatInput';
import MailboxLink from '@/components/overlay/MailboxLink';

export default function Home() {
    const handleInteraction = (msg) => {
        console.log("用户输入了:", msg);
        // 以后在这里写触发 3D 角色动画的逻辑
    };

    return (
        <main className="home-page fade-in">
            {/* Canvas 层 */}
            <div className="canvas-wrapper" style={{ position: 'absolute', inset: 0 }}>
                <Character />
            </div>

            {/* Overlay 层 */}
            <div className="ui-wrapper" style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100vh',
                paddingBottom: '10vh',
                alignItems: 'center',
                pointerEvents: 'none'
            }}>
                <div style={{ pointerEvents: 'auto' }}>
                    <ChatInput />
                    <MailboxLink />
                </div>
            </div>
        </main>
    );
}