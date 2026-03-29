import characterImg from '@/assets/33-placeholder.png';

export default function Character() {
    return (
        <div className="character-container" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {/* 暂时用图片替代 3D 模型，并添加一个简单的浮动动画 */}
            <img
                src={characterImg}
                alt="Character Idle"
                className="character-idle"
                style={{ height: '60vh' }}
            />
        </div>
    );
}