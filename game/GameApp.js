// game/GameApp.js

import { EngineCore } from '../engine/EngineCore.js';
import { Scene } from '../engine/Scene.js';
import { Camera } from '../engine/components/Camera.js';
import { RotatingCube } from './objects/RotatingCube.js';
import { EventManager } from '../engine/events/EventManager.js';

// GUI 모듈 불러오기
import { GUIPanel } from '../engine/gui/GUIPanel.js';
import { GUILabel } from '../engine/gui/GUILabel.js';

// GUI 컴포넌트 및 게임 이벤트
import { GUIButton } from '../engine/gui/GUIButton.js';
import { MoveForwardEvent, MoveBackwardEvent, MoveLeftEvent, MoveRightEvent } from './events/MoveEvents.js';

// 1. 엔진 코어 초기화 (index.html의 캔버스 ID 연결)
const engine = new EngineCore('gameCanvas', {
    resolutionMode: 'adaptive',
    //resolutionMode: 'fit',
    //fixedWidth: 1920,
    fixedWidth: 1920,
    fixedHeight: 1080
});

// 2. 씬(Scene) 생성
const scene = new Scene();
scene.backgroundColor = '#724826'; // 뷰포트(캔버스) 배경색을 설정

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

// 1. 이벤트 매니저 생성 및 씬 업데이트에 바인딩
const eventManager = new EventManager(engine.canvas);

// 씬의 update 로직 확장 (매 프레임 이벤트 처리)
const originalUpdate = scene.update.bind(scene);
scene.update = function(deltaTime) {
    eventManager.update(deltaTime);
    originalUpdate(deltaTime);
};

/// ===================================================
// 2. 우측 하단 D-Pad 조종 패널 (WASD)
// ===================================================
const dpadPanel = new GUIPanel({
    anchor: 'bottom-right',
    x: -30, y: -30,
    width: 220, height: 220,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderColor: '#00ffcc',
    borderRadius: 16
});

const btnW = new GUIButton('전진', {
    anchor: 'top-center', x: 0, y: 15,
    width: 80, height: 55, hotkey: 'w',
    boundEvent: new MoveForwardEvent(20), targetObject: cube
});

const btnA = new GUIButton('좌', {
    anchor: 'center-left', x: 15, y: 0,
    width: 60, height: 55, hotkey: 'a',
    boundEvent: new MoveLeftEvent(20), targetObject: cube
});

const btnS = new GUIButton('후진', {
    anchor: 'bottom-center', x: 0, y: -15,
    width: 80, height: 55, hotkey: 's',
    boundEvent: new MoveBackwardEvent(20), targetObject: cube
});

const btnD = new GUIButton('우', {
    anchor: 'center-right', x: -15, y: 0,
    width: 60, height: 55, hotkey: 'd',
    boundEvent: new MoveRightEvent(20), targetObject: cube
});

[btnW, btnA, btnS, btnD].forEach(btn => {
    dpadPanel.addChild(btn);
    eventManager.registerButton(btn);
});

scene.addChild(dpadPanel);

// ===================================================
// 1. 상단 HUD 및 투영 모드 전환 버튼 (앵커: top-left)
// ===================================================
const topHudPanel = new GUIPanel({
    anchor: 'top-left',
    x: 20, y: 20,
    width: 280, height: 110,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderColor: '#00ffcc',
    borderRadius: 12
});

const statusLabel = new GUILabel('Mode: Perspective', {
    anchor: 'top-left', x: 15, y: 15,
    fontSize: 16, color: '#00ffcc'
});

// 단발성 클릭 버튼 생성 (단축키 P)
const toggleBtn = new GUIButton('투영 전환', {
    anchor: 'bottom-center', x: 0, y: -12,
    width: 250, height: 45,
    hotkey: 'p',
    triggerMode: 'click', // 1회 클릭 트리거
    boundEvent: new ToggleProjectionEvent(cube, statusLabel),
    targetObject: camera
});

topHudPanel.addChild(statusLabel);
topHudPanel.addChild(toggleBtn);
eventManager.registerButton(toggleBtn);
scene.addChild(topHudPanel);

// 2. 화면 하단 중앙 반응형 안내 라벨 (앵커: bottom-center)
const infoLabel = new GUILabel('Click anywhere to toggle Projection Mode', {
    anchor: 'bottom-center',
    x: 0, y: -40,
    fontSize: 20,
    color: '#f8efba',
    align: 'center',
    baseline: 'bottom'
});
scene.addChild(infoLabel);

// ===================================================

// 5. 엔진에 씬을 등록하고 게임 루프 가동
engine.setScene(scene);
engine.start();

// [테스트 기능] 화면 클릭 시 원근투영(Perspective) <-> 직교투영(Orthographic) 전환
window.addEventListener('click', () => {
    if (camera.projectionMode === 'perspective') {
        camera.setProjectionMode('orthographic');
        cube.color = '#ff3366'; // 직교 투영 모드일 때는 붉은색 와이어프레임
        console.log("현재 모드: 직교 투영 (Orthographic)");
        statusLabel.text = 'Mode: Orthographic';
        statusLabel.color = '#ff3366';
    } else {
        camera.setProjectionMode('perspective');
        cube.color = '#00ffcc'; // 원근 투영 모드일 때는 청록색 와이어프레임
        console.log("현재 모드: 원근 투영 (Perspective)");
        statusLabel.text = 'Mode: Perspective';
        statusLabel.color = '#00ffcc';
    }
});