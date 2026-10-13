// engine/components/Billboard.js

import { GameObject } from '../GameObject.js';

export class Billboard extends GameObject {
    constructor(x = 0, y = 0, z = 0, options = {}) {
        super(x, y, z);
        this.image = options.image || null; // Image 객체
        this.width = options.width || 5;    // 3D 월드 단위의 가로 크기
        this.height = options.height || 5;  // 3D 월드 단위의 세로 크기
        this.pivot = options.pivot || { x: 0.5, y: 1.0 }; // 기본값: 발밑 기준 (0.5, 1.0)
    }

    render(camera, ctx, canvasWidth, canvasHeight, dpr = 1) {
        if (!this.image || !this.image.complete) {
            super.render(camera, ctx, canvasWidth, canvasHeight, dpr);
            return;
        }

        const worldPt = this.getWorldPosition();
        const viewPt = worldPt.subtract(camera.position);

        // 카메라 뒤에 있는 경우 렌더링 무시
        if (viewPt.z <= camera.nearClip) return;

        // 3D 중심점 스크린 투영
        const proj = camera.project(worldPt, canvasWidth, canvasHeight, dpr);
        if (!proj) return;

        // Z-Depth 거리 비례 스케일링 계산
        const effectiveFov = camera.fovScale * dpr;
        const scale = effectiveFov / viewPt.z;

        const renderWidth = this.width * scale;
        const renderHeight = this.height * scale;

        // 피벗 기준 화면 위치 계산
        const drawX = proj.x - (renderWidth * this.pivot.x);
        const drawY = proj.y - (renderHeight * this.pivot.y);

        ctx.save();
        ctx.drawImage(this.image, drawX, drawY, renderWidth, renderHeight);
        ctx.restore();

        super.render(camera, ctx, canvasWidth, canvasHeight, dpr);
    }
}