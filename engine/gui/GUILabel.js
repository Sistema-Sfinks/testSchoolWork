// engine/gui/GUILabel.js

import { GUIElement } from './GUIElement.js';

export class GUILabel extends GUIElement {
    constructor(text = '', options = {}) {
        super(options);
        this.text = text;
        this.fontSize = options.fontSize || 28; // 기준 폰트 크기 (px)
        this.fontFamily = options.fontFamily || 'Arial, sans-serif';
        this.color = options.color || '#ffffff';
        this.align = options.align || 'left';   // 'left', 'center', 'right'
        this.baseline = options.baseline || 'top'; // 'top', 'middle', 'bottom'
        this.fontWeight = options.fontWeight || 'bold';
    }

    drawSelf(ctx, rect, dpr) {
        if (!this.text) return;

        // 화면 스케일에 비례하는 반응형 폰트 크기 계산 (최소 10px 보장)
        const responsiveFontSize = Math.max(10, Math.round(this.fontSize * rect.scale));

        ctx.font = `${this.fontWeight} ${responsiveFontSize}px ${this.fontFamily}`;
        ctx.fillStyle = this.color;
        ctx.textAlign = this.align;
        ctx.textBaseline = this.baseline;

        // 정렬에 따른 x, y 렌더링 원점 위치 연산
        let drawX = rect.x;
        if (this.align === 'center') drawX = rect.x + rect.width / 2;
        else if (this.align === 'right') drawX = rect.x + rect.width;

        let drawY = rect.y;
        if (this.baseline === 'middle') drawY = rect.y + rect.height / 2;
        else if (this.baseline === 'bottom') drawY = rect.y + rect.height;

        ctx.fillText(this.text, drawX, drawY);
    }
}