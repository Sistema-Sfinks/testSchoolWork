// game/GameApp.js

import { EngineCore } from '../engine/EngineCore.js';
import { Scene } from '../engine/Scene.js';
import { Camera } from '../engine/components/Camera.js';
import { RotatingCube } from './objects/RotatingCube.js';

// 1. 엔진 코어 초기화 (index.html의 캔버스 ID 연결)
const engine = new EngineCore('gameCanvas', {
    resolutionMode: 'fit'
});

// 2. 씬(Scene) 생성
const scene = new Scene();
scene.backgroundColor = '#b018cf'; // 뷰포트(캔버스) 배경을 짙은 네이비로 설정

// HTML 전체 화면(레터박스가 생기는 빈 공간)의 배경색은 CSS로 제어
document.body.style.backgroundColor = '#000000';

// 3. 카메라 생성 및 설정
// 큐브가 원점(0,0,0)에 생성될 것이므로, 카메라는 Z축 뒤로(-30) 이동시켜 큐브를 바라보게 세팅
const camera = new Camera(0, 0, -30);
camera.fovScale = 600;     // 원근 투영 시 화면에 그릴 스케일(초점 거리)
camera.orthoScale = 15;    // 직교 투영 시 화면에 그릴 배수
scene.setCamera(camera);

// 4. 게임 객체 생성 및 씬 등록
const cube = new RotatingCube(0, 0, 0, 10);
scene.addChild(cube);

// 5. 엔진에 씬을 등록하고 게임 루프 가동
engine.setScene(scene);
engine.start();

// [테스트 기능] 화면 클릭 시 원근투영(Perspective) <-> 직교투영(Orthographic) 전환
window.addEventListener('click', () => {
    if (camera.projectionMode === 'perspective') {
        camera.setProjectionMode('orthographic');
        cube.color = '#ff3366'; // 직교 투영 모드일 때는 붉은색 와이어프레임
        console.log("현재 모드: 직교 투영 (Orthographic)");
    } else {
        camera.setProjectionMode('perspective');
        cube.color = '#00ffcc'; // 원근 투영 모드일 때는 청록색 와이어프레임
        console.log("현재 모드: 원근 투영 (Perspective)");
    }
});
