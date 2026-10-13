// engine/gui/GUIButton.js

import { GUIElement } from './GUIElement.js';

export class GUIButton extends GUIElement {
    constructor(text = '', options = {}) {
        super(options);
        this.text = text;
        this.hotkey = options.hotkey ? options.hotkey.toLowerCase() : null;
        this.boundEvent = options.boundEvent || null;
        this.targetObject = options.targetObject || null;

        this.normalColor = options.normalColor || 'rgba(30, 41, 59, 0.85)';
        this.pressedColor = options.pressedColor || 'rgba(0, 255, 204, 0.6)';
        this.borderColor = options.borderColor || '#00ffcc';
        this.textColor = options.textColor || '#ffffff';
        this.fontSize = options.fontSize || 20;

        // 마우스 포인터 상태와 키보드 상태 분리
        this.isPointerDown = false;
        this.isHotkeyActive = false;
    }

    // 포인터 또는 단축키 중 하나라도 눌려있으면 true 반환
    get isPressed() {
        return this.isPointerDown || this.isHotkeyActive;
    }

    containsPoint(px, py, canvasWidth, canvasHeight) {
        const rect = this.getLayoutRect(canvasWidth, canvasHeight);
        return px >= rect.x && px <= rect.x + rect.width &&
               py >= rect.y && py <= rect.y + rect.height;
    }

    trigger(deltaTime) {
        if (this.boundEvent && this.targetObject) {
            this.boundEvent.execute(this.targetObject, deltaTime);
        }
    }

    drawSelf(ctx, rect, dpr) {
        const pressed = this.isPressed;
        ctx.fillStyle = pressed ? this.pressedColor : this.normalColor;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 2 * rect.scale;

        const radius = 8 * rect.scale;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(rect.x, rect.y, rect.width, rect.height, radius);
        } else {
            ctx.rect(rect.x, rect.y, rect.width, rect.height);
        }
        ctx.fill();
        ctx.stroke();

        const responsiveFontSize = Math.max(12, Math.round(this.fontSize * rect.scale));
        ctx.font = `bold ${responsiveFontSize}px Arial, sans-serif`;
        ctx.fillStyle = pressed ? '#000000' : this.textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;
        
        const displayText = this.hotkey ? `${this.text} [${this.hotkey.toUpperCase()}]` : this.text;
        ctx.fillText(displayText, centerX, centerY);
    }
}