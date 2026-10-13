// game/events/MoveEvents.js

import { GameEvent } from '../../engine/events/GameEvent.js';

export class MoveForwardEvent extends GameEvent {
    constructor(speed = 15) {
        super('MoveForward');
        this.speed = speed;
    }
    execute(target, deltaTime) {
        target.position.z += this.speed * deltaTime;
    }
}

export class MoveBackwardEvent extends GameEvent {
    constructor(speed = 15) {
        super('MoveBackward');
        this.speed = speed;
    }
    execute(target, deltaTime) {
        target.position.z -= this.speed * deltaTime;
    }
}

export class MoveLeftEvent extends GameEvent {
    constructor(speed = 15) {
        super('MoveLeft');
        this.speed = speed;
    }
    execute(target, deltaTime) {
        target.position.x -= this.speed * deltaTime;
    }
}

export class MoveRightEvent extends GameEvent {
    constructor(speed = 15) {
        super('MoveRight');
        this.speed = speed;
    }
    execute(target, deltaTime) {
        target.position.x += this.speed * deltaTime;
    }
}