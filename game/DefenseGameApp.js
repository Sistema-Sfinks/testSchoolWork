// game/DefenseGameApp.js

import { EngineCore } from '../engine/EngineCore.js';
import { Scene } from '../engine/Scene.js';
import { Camera } from '../engine/components/Camera.js';
import { EventManager } from '../engine/events/EventManager.js';

import { GUIPanel } from '../engine/gui/GUIPanel.js';
import { GUILabel } from '../engine/gui/GUILabel.js';
import { GUIButton } from '../engine/gui/GUIButton.js';
import { GameEvent } from '../engine/events/GameEvent.js';

import { AssetBuilder } from './utils/AssetBuilder.js';
import { GridMesh } from './objects/GridMesh.js';
import { DefenseUnit, DefenseBase } from './objects/DefenseEntities.js';

const engine = new EngineCore('gameCanvas', { resolutionMode: 'adaptive' });

const scene = new Scene();
scene.backgroundColor = '#1a1a2e';

// 3D 측면 원근 카메라 세팅 (위에서 약간 비스듬히 내려다봄)
const camera = new Camera(0, 20, -60);
camera.fovScale = 700;
scene.setCamera(camera);

// 텍스처 에셋 즉석 생성
const texPlayerBase = AssetBuilder.createTexture('아군', '#0984e3');
const texEnemyBase  = AssetBuilder.createTexture('적군', '#d63031');
const texAlly1 = AssetBuilder.createTexture('보병', '#74b9ff', '#000', 64, 64);
const texEnemy1 = AssetBuilder.createTexture('에일리언', '#ff7675', '#000', 64, 64);

// 게임 스테이트 및 오브젝트 리스트
const state = {
    money: 0,
    moneyRate: 20, // 초당 생성되는 돈
    units: []
};

// 1. 배경 및 기지 배치
const ground = new GridMesh(120, 30);
scene.addChild(ground);

const playerBase = new DefenseBase(-40, 5, 0, 10, texPlayerBase, 1);
const enemyBase = new DefenseBase(40, 5, 0, 10, texEnemyBase, -1);
scene.addChild(playerBase);
scene.addChild(enemyBase);

// ===================================================
// 전투 및 AI 업데이트 루프 (Scene Update 확장)
// ===================================================
const originalUpdate = scene.update.bind(scene);
scene.update = function(deltaTime) {
    originalUpdate(deltaTime);
    if (playerBase.isDead || enemyBase.isDead) return;

    // 1. 자원 획득
    state.money += state.moneyRate * deltaTime;
    moneyLabel.text = `Cost: ${Math.floor(state.money)} $`;

    // 2. 적군 자동 스폰 AI (3초마다 무작위 스폰)
    if (Math.random() < 0.01 * (deltaTime * 60)) {
        spawnUnit(-1);
    }

    // 3. 유닛 AI 및 충돌 판정 (1D 축 기반)
    for (const unit of state.units) {
        if (unit.isDead) continue;
        
        unit.currentCooldown -= deltaTime;
        let target = null;
        let closestDist = Infinity;

        // 적 탐색
        const enemies = unit.team === 1 ? [...state.units.filter(u => u.team === -1), enemyBase] 
                                        : [...state.units.filter(u => u.team === 1), playerBase];

        for (const e of enemies) {
            if (e.isDead) continue;
            const dist = Math.abs(e.position.x - unit.position.x);
            // 같은 라인에 있는 적 중에 가장 가까운 적 탐색
            if (dist < closestDist && (unit.team === 1 ? e.position.x > unit.position.x : e.position.x < unit.position.x)) {
                closestDist = dist;
                target = e;
            }
        }

        // 행동 결정
        if (target && closestDist <= unit.range) {
            // 공격 거리 내면 정지 후 타격
            if (unit.currentCooldown <= 0) {
                target.hp -= unit.damage;
                unit.currentCooldown = unit.attackCooldown;
                
                // 타격 연출 (살짝 커졌다 작아짐)
                unit.width = 7; setTimeout(() => unit.width = 5, 100);

                if (target.hp <= 0) target.isDead = true;
            }
        } else {
            // 공격 대상이 없으면 전진
            unit.position.x += unit.team * unit.speed * deltaTime;
        }
    }

    // 4. 시체 정리
    state.units = state.units.filter(u => {
        if (u.isDead) scene.children = scene.children.filter(child => child !== u);
        return !u.isDead;
    });

    // 5. 게임 종료 판정
    if (playerBase.isDead) gameOveLabel.text = "DEFEAT...";
    if (enemyBase.isDead) gameOveLabel.text = "VICTORY!";
};

// ===================================================
// 유닛 스폰 함수 (Z축을 랜덤으로 주어 3D 공간감 획득)
// ===================================================
function spawnUnit(team) {
    if (team === 1) {
        if (state.money < 50) return;
        state.money -= 50;
    }
    
    // Z축 거리를 -5 ~ 5 사이로 분산 배치하여 겹침 방지 및 3D 깊이감 생성
    const randomZ = (Math.random() - 0.5) * 10;
    const startX = team === 1 ? playerBase.position.x + 8 : enemyBase.position.x - 8;
    
    const unit = new DefenseUnit(startX, 2.5, randomZ, {
        image: team === 1 ? texAlly1 : texEnemy1,
        width: 5, height: 5,
        team: team,
        hp: 50, damage: 15, speed: 12, range: 6, attackCooldown: 0.8
    });

    state.units.push(unit);
    scene.addChild(unit);
}

// ===================================================
// GUI 시스템 및 스폰 버튼 (정공법 수정)
// ===================================================
const eventManager = new EventManager(engine.canvas);

// 상단 자원 HUD
const hudPanel = new GUIPanel({
    anchor: 'top-center', x: 0, y: 20, width: 250, height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 10
});
const moneyLabel = new GUILabel('Cost: 0 $', { anchor: 'center', x: 0, y: 0, color: '#f1c40f', fontSize: 24, align: 'center', baseline: 'middle' });
hudPanel.addChild(moneyLabel);
scene.addChild(hudPanel);

// 1. 명시적인 스폰 이벤트 클래스 정의
class SpawnAllyEvent {
    execute() {
        // 돈이 부족하면 여기서 차단
        if (state.money >= 50) {
            spawnUnit(1);
        }
    }
}

// 2. 버튼 객체 생성 (익명 클래스 제거, 명시적 이벤트 바인딩)
const spawnBtn = new GUIButton('보병 생산 (50$)', {
    anchor: 'bottom-center', x: 0, y: -30, width: 220, height: 60,
    hotkey: 'space' // 스페이스바 단축키 맵핑
});

// 3. 버튼에 이벤트 장착
spawnBtn.boundEvent = new SpawnAllyEvent();

// 4. 매니저와 씬에 등록
eventManager.registerButton(spawnBtn);
scene.addChild(spawnBtn);

// 승패 라벨
const gameOveLabel = new GUILabel('', { anchor: 'center', x: 0, y: 0, color: '#ff3366', fontSize: 80, align: 'center', baseline: 'middle' });
scene.addChild(gameOveLabel);

// 엔진에 이벤트 루프 통합
const engineLoop = engine.update.bind(engine);
engine.update = function(deltaTime) {
    eventManager.update(deltaTime);
    engineLoop(deltaTime);
};

engine.setScene(scene);
engine.start();