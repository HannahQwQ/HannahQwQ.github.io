import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

// 🎥 镜头控制器（内部组件）
function CameraController({ isChatting }) {
    // 定义两个镜头的目标位置 [x, y, z]
    // 初始模式：相机偏右 [1.5, 0.5, 5]， lookAt 中心
    const idlePosition = new THREE.Vector3(1.5, 0.5, 5);
    // 对话模式：相机居中且拉近 [0, 0, 3]
    const chattingPosition = new THREE.Vector3(0, 0, 3);

    // useFrame 是 R3F 的核心，每一帧都会执行
    useFrame((state) => {
        // 获取当前相机
        const camera = state.camera;
        // 根据状态选择目标位置
        const target = isChatting ? chattingPosition : idlePosition;

        // 🏎️ 关键：使用 .lerp (线性插值) 实现平滑过渡
        // 0.05 是平滑系数（0-1），越小越丝滑，越大越僵硬
        camera.position.lerp(target, 0.05);

        // 始终让相机盯着原点 (0,0,0) 的球体
        camera.lookAt(0, 0, 0);
    });

    return null; // 这个组件只处理逻辑，不渲染东西
}

// 🌐 主 Character 组件
export default function Character({ isChatting }) {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* 1. Canvas：3D 世界的入口 */}
            <Canvas
                shadows
                camera={{ position: [1.5, 0.5, 5], fov: 60 }} // 初始相机参数
                dpr={[1, 2]} // 响应式分辨率
            >
                {/* 💡 灯光 */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                {/* 🔮 你的 3D “替身”：一个带一点扭曲动画的球体 */}
                <Suspense fallback={null}>
                    <Sphere args={[1, 64, 64]} position={[0, 0, 0]}>
                        {/* 这里的 Material 让球体看起来像水滴一样微微波动，增加互动感 */}
                        <MeshDistortMaterial
                            color="#38bdf8" // 你的天蓝色 accent 色
                            attach="material"
                            distort={0.4} // 扭曲程度
                            speed={2} // 动画速度
                            roughness={0} // 表面粗糙度（0 为光滑）
                            metalness={0.1}
                        />
                    </Sphere>
                </Suspense>

                {/* 🎬 镜头控制脚本 */}
                <CameraController isChatting={isChatting} />

                {/* 调试用：正式版可以关掉，允许用户手动旋转球体 */}
                {/* <OrbitControls enableZoom={false} /> */}
            </Canvas>
        </div>
    );
}
