// game/events/ToggleProjectionEvent.js

import { GameEvent } from '../../engine/events/GameEvent.js';

export class ToggleProjectionEvent extends GameEvent {
    constructor(targetCube = null, statusLabel = null) {
        super('ToggleProjection');
        this.targetCube = targetCube;
        this.statusLabel = statusLabel;
    }

    execute(camera, deltaTime) {
        if (camera.projectionMode === 'perspective') {
            camera.setProjectionMode('orthographic');
            if (this.targetCube) this.targetCube.color = '#ff3366';
            if (this.statusLabel) {
                this.statusLabel.text = 'Mode: Orthographic';
                this.statusLabel.color = '#ff3366';
            }
        } else {
            camera.setProjectionMode('perspective');
            if (this.targetCube) this.targetCube.color = '#00ffcc';
            if (this.statusLabel) {
                this.statusLabel.text = 'Mode: Perspective';
                this.statusLabel.color = '#00ffcc';
            }
        }
    }
}