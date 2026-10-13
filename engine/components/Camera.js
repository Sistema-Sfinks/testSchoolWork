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
    project(worldPoint, canvasWidth, canvasHeight) {
        // 1. View Transform (카메라 위치 기준 상대 좌표 계산)
        const viewPoint = worldPoint.subtract(this.position);

        const halfW = canvasWidth / 2;
        const halfH = canvasHeight / 2;

        if (this.projectionMode === 'perspective') {
            // 원근 투영 (Perspective Projection)
            // 카메라 뒤쪽이거나 너무 가까운 정점(Near Clip) 잘라내기
            if (viewPoint.z <= this.nearClip) {
                return null;
            }

            // 원근 분할 (Perspective Divide) 적용
            const x = (viewPoint.x / viewPoint.z) * this.fovScale + halfW;
            const y = -(viewPoint.y / viewPoint.z) * this.fovScale + halfH; // 캔버스 Y축 반전 반영

            return { x, y };
        } else {
            // 직교 투영 (Orthographic Projection)
            // Z값으로 나누지 않고 고정 스케일 적용
            const x = viewPoint.x * this.orthoScale + halfW;
            const y = -viewPoint.y * this.orthoScale + halfH;

            return { x, y };
        }
    }
}
