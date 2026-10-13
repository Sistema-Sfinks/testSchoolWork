// engine/gui/GUIElement.js

import { GameObject } from '../GameObject.js';

export class GUIElement extends GameObject {
    constructor(options = {}) {
        super(0, 0, 0);

        this.anchor = options.anchor || 'top-left';
        this.offset = { x: options.x || 0, y: options.y || 0 };
        this.size = { width: options.width || 0, height: options.height || 0 };
        this.referenceHeight = options.referenceHeight || 1080;

        // 앵커에 따른 기본 피벗(Pivot) 자동 할당 (사용자가 직접 지정한 경우 최우선)
        this.pivot = options.pivot || this.getDefaultPivotForAnchor(this.anchor);
    }

    getDefaultPivotForAnchor(anchor) {
        const pivot = { x: 0, y: 0 };
        if (anchor.includes('center')) {
            if (['top-center', 'center', 'bottom-center'].includes(anchor)) pivot.x = 0.5;
            if (['center-left', 'center', 'center-right'].includes(anchor)) pivot.y = 0.5;
        }
        if (anchor.includes('right')) pivot.x = 1.0;
        if (anchor.includes('bottom')) pivot.y = 1.0;
        return pivot;
    }

    getLayoutRect(canvasWidth, canvasHeight) {
        let parentRect;
        let scale;

        if (this.parent && this.parent instanceof GUIElement) {
            // 자식 요소인 경우 부모의 레이아웃 영역 및 스케일 계승
            parentRect = this.parent.getLayoutRect(canvasWidth, canvasHeight);
            scale = parentRect.scale;
        } else {
            // 최상위 Root GUI 요소인 경우 뷰포트 전체 기준 연산
            scale = canvasHeight / this.referenceHeight;
            parentRect = { x: 0, y: 0, width: canvasWidth, height: canvasHeight, scale: scale };
        }

        // 앵커(Anchor) 기준 위치 산출
        let anchorX = parentRect.x;
        let anchorY = parentRect.y;

        if (this.anchor.includes('center')) {
            if (['top-center', 'center', 'bottom-center'].includes(this.anchor)) anchorX = parentRect.x + parentRect.width / 2;
            if (['center-left', 'center', 'center-right'].includes(this.anchor)) anchorY = parentRect.y + parentRect.height / 2;
        }
        if (this.anchor.includes('right')) anchorX = parentRect.x + parentRect.width;
        if (this.anchor.includes('bottom')) anchorY = parentRect.y + parentRect.height;

        const scaledWidth = this.size.width * scale;
        const scaledHeight = this.size.height * scale;
        const scaledOffsetX = this.offset.x * scale;
        const scaledOffsetY = this.offset.y * scale;

        const posX = anchorX + scaledOffsetX;
        const posY = anchorY + scaledOffsetY;

        return {
            x: posX - (scaledWidth * this.pivot.x),
            y: posY - (scaledHeight * this.pivot.y),
            width: scaledWidth,
            height: scaledHeight,
            scale: scale
        };
    }

    render(camera, ctx, canvasWidth, canvasHeight, dpr = 1) {
        const rect = this.getLayoutRect(canvasWidth, canvasHeight);

        ctx.save();
        this.drawSelf(ctx, rect, dpr);
        ctx.restore();

        for (const child of this.children) {
            child.render(camera, ctx, canvasWidth, canvasHeight, dpr);
        }
    }

    drawSelf(ctx, rect, dpr) {}
}