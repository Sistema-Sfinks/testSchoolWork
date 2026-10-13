// engine/gui/GUIElement.js

import { GameObject } from '../GameObject.js';

export class GUIElement extends GameObject {
    constructor(options = {}) {
        super(0, 0, 0);

        // 9개 정렬 앵커: 'top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'
        this.anchor = options.anchor || 'top-left';
        
        // 앵커 기준 오프셋 위치 (X, Y)
        this.offset = { x: options.x || 0, y: options.y || 0 };
        
        // 크기 (Width, Height)
        this.size = { width: options.width || 0, height: options.height || 0 };
        
        // 피벗 (0~1): 자기 자신의 기준점 (0.5, 0.5 이면 정중앙 기준)
        this.pivot = options.pivot || { x: 0, y: 0 };

        // 반응형 스케일 계산용 기준 높이 (1080p 기준)
        this.referenceHeight = options.referenceHeight || 1080;
    }

    // 부모(또는 뷰포트) 영역과 스케일 비율을 기반으로 최종 화면 좌표 구하기
    getLayoutRect(canvasWidth, canvasHeight) {
        let parentRect = { x: 0, y: 0, width: canvasWidth, height: canvasHeight };

        // 부모 객체가 GUIElement라면 부모의 레이아웃 영역을 기준으로 삼음
        if (this.parent && this.parent instanceof GUIElement) {
            parentRect = this.parent.getLayoutRect(canvasWidth, canvasHeight);
        }

        // 1. 반응형 스케일 비율 계산 (현재 화면 높이 / 기준 높이)
        const scale = parentRect.height / this.referenceHeight;

        // 2. 앵커(Anchor) 기준점 구하기
        let anchorX = parentRect.x;
        let anchorY = parentRect.y;

        if (this.anchor.includes('center')) {
            if (['top-center', 'center', 'bottom-center'].includes(this.anchor)) {
                anchorX = parentRect.x + parentRect.width / 2;
            }
            if (['center-left', 'center', 'center-right'].includes(this.anchor)) {
                anchorY = parentRect.y + parentRect.height / 2;
            }
        }
        if (this.anchor.includes('right')) {
            anchorX = parentRect.x + parentRect.width;
        }
        if (this.anchor.includes('bottom')) {
            anchorY = parentRect.y + parentRect.height;
        }

        // 3. 스케일 반영된 오프셋 및 크기 계산
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

    // 3D 카메라는 무시하고 2D 화면 공간에 바로 렌더링
    render(camera, ctx, canvasWidth, canvasHeight, dpr = 1) {
        const rect = this.getLayoutRect(canvasWidth, canvasHeight);

        ctx.save();
        this.drawSelf(ctx, rect, dpr);
        ctx.restore();

        // 자식 GUI 요소들도 순차적으로 렌더링
        for (const child of this.children) {
            child.render(camera, ctx, canvasWidth, canvasHeight, dpr);
        }
    }

    // 파생 클래스에서 오버라이딩하여 자발적 그리기 수행
    drawSelf(ctx, rect, dpr) {}
}