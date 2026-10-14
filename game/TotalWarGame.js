import { EngineCore } from '../engine/EngineCore.js';
import { Scene } from '../engine/Scene.js';
import { Camera } from '../engine/components/Camera.js';
import { GridMesh } from './objects/GridMesh.js';
import { TacticalSquad } from './objects/TacticalSquad.js';

// 1. 엔진 및 씬 초기화
const engine = new EngineCore('gameCanvas', { resolutionMode: 'adaptive' });
const scene = new Scene();

// 2. 전술 카메라 세팅 (위에서 비스듬히 내려다보는 쿼터뷰)
const camera = new Camera(0, 300, -350); 
camera.rotation.x = 0.8; // 아래를 향해 숙임 (라디안)
scene.setCamera(camera);

// 3. 전장(Grid) 세팅
const battlefield = new GridMesh(800, 40);
scene.addChild(battlefield);

// 4. 부대(Squad) 배치
// 6열 4오(24명) 블루팀 부대
const playerSquad = new TacticalSquad(0, 0, 6, 4, 'blue');
scene.addChild(playerSquad);

// 5열 5오(25명) 레드팀 부대 (적군 대기)
const enemySquad = new TacticalSquad(0, 200, 5, 5, 'red');
scene.addChild(enemySquad);


// 5. 마우스 우클릭으로 부대 이동 지시 (토탈워 스타일)
engine.canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // 기본 우클릭 메뉴 방지

    // 화면 중심(0,0)을 기준으로 클릭한 위치의 3D 월드 좌표 근사치 계산
    // (완벽한 Raycasting은 복잡하므로, 현재 카메라 뷰에 맞춘 간이 역투영 연산)
    const rect = engine.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // 카메라 각도와 높이에 비례하여 클릭 지점을 월드의 X, Z 좌표로 변환
    const worldX = mouseX * 0.7; 
    const worldZ = (mouseY * 1.2) + 200; // 카메라가 뒤(-350)에 있으므로 보정

    // 플레이어 부대에 이동 명령
    playerSquad.orderMove(worldX, worldZ);
});

// 시작
engine.setScene(scene);
engine.start();