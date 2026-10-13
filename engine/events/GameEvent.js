// engine/events/GameEvent.js

export class GameEvent {
    constructor(name = 'GameEvent') {
        this.name = name;
    }

    // 파생 클래스에서 구현할 실질적인 실행 로직
    execute(target, deltaTime) {
        // target: 이벤트를 적용받을 대상 (예: RotatingCube)
    }
}