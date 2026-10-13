// engine/gui/GUIButton.js

import { GUIElement } from './GUIElement.js';

export class GUIButton extends GUIElement {
    constructor(text = '', options = {}) {
        super(options);
        this.text = text;
        this.hotkey = options.hotkey || null; // 예: 'w', 'a', 's', 'd'
        this.boundEvent = options.boundEvent || null; // 바인딩할 GameEvent
        this.targetObject = options.targetObject || null; // 이벤트를 적용할 대상 객체

        this.normalColor = options.normalColor || 'rgba(30, 41, 59, 0.85)';
        this.pressedColor = options.pressedColor || 'rgba(0, 255, 204, 0.6)';
        this.borderColor = options.borderColor || '#00ffcc';
        this.textColor = options.textColor || '#ffffff';
        this.fontSize = options.fontSize || 20;

        this.isPressed = false;
    }

    // 화면 픽셀 좌표(x, y)가 버튼 레이아웃 영역 내부에 들어왔는지 확인
    containsPoint(px, py, canvasWidth, canvasHeight) {
        const rect = this.getLayoutRect(canvasWidth, canvasHeight);
        return px >= rect.x && px <= rect.x + rect.width &&
               py >= rect.y && py <= rect.y + rect.height;
    }

    // 바인딩된 이벤트 실행
    trigger(deltaTime) {
        if (this.boundEvent && this.targetObject) {
            this.boundEvent.execute(this.targetObject, deltaTime);
        }
    }

    drawSelf(ctx, rect, dpr) {
        // 버튼 배경 (눌렸을 때 색상 변경)
        ctx.fillStyle = this.isPressed ? this.pressedColor : this.normalColor;
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

        // 텍스트 및 단축키 라벨 출력
        const responsiveFontSize = Math.max(12, Math.round(this.fontSize * rect.scale));
        ctx.font = `bold ${responsiveFontSize}px Arial, sans-serif`;
        ctx.fillStyle = this.isPressed ? '#000000' : this.textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;
        
        const displayText = this.hotkey ? `${this.text} [${this.hotkey.toUpperCase()}]` : this.text;
        ctx.fillText(displayText, centerX, centerY);
    }
}