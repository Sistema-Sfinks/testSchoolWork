// engine/components/Camera.js

import { GameObject } from '../GameObject.js';

export class Camera extends GameObject {
    constructor(x = 0, y = 0, z = -100) {
        super(x, y, z);
        this.projectionMode = 'perspective'; // 'perspective' 또는 'orthographic'
        this.fovScale = 400; // 원근투영 시야각(FOV) / 초점 거리 스케일
        this.orthoScale = 1; // 직교투영 배수
        this.nearClip = 0.1; // Z-Clipping 임계값
    }

    // 투영 방식 변경 메서드
    setProjectionMode(mode) {
        if (mode === 'perspective' || mode === 'orthographic') {
            this.projectionMode = mode;
        }
    }

    // 월드 좌표계 정점을 뷰 변환 및 2D 투영을 거쳐 화면 픽셀 좌표계로 변환
    project(worldPoint, canvasWidth, canvasHeight, aspectRatio = 1) {
        const viewPoint = worldPoint.subtract(this.position);
        const halfW = canvasWidth / 2;
        const halfH = canvasHeight / 2;

        if (this.projectionMode === 'perspective') {
            if (viewPoint.z <= this.nearClip) return null;

            // X축에 aspectRatio를 나누어주어 화면 비율에 따른 찌그러짐 보정
            const x = ((viewPoint.x / viewPoint.z) * this.fovScale) / aspectRatio + halfW;
            const y = -(viewPoint.y / viewPoint.z) * this.fovScale + halfH;
            return { x, y };
        } else {
            // 직교 투영도 동일하게 보정
            const x = (viewPoint.x * this.orthoScale) / aspectRatio + halfW;
            const y = -viewPoint.y * this.orthoScale + halfH;
            return { x, y };
        }
    }
}
