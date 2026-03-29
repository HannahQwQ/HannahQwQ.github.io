import characterImg from '@/assets/33-placeholder.png';
import './Character.css';

export default function Character() {
    return (
        <div className="character-wrapper">
            <img
                src={characterImg}
                alt="Character Idle"
                className="floating-character"
                style={{ height: '60vh' }}
            />
            {/* 增加一个底部的暗影，增加空间感 */}
            <div className="character-shadow"></div>
        </div>
    );
}