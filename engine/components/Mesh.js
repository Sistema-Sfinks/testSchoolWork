// engine/components/Mesh.js

import { GameObject } from '../GameObject.js';

export class Mesh extends GameObject {
    constructor(x = 0, y = 0, z = 0) {
        super(x, y, z);
        this.vertices = []; // Vector3 정점 배열
        this.edges = [];    // [인덱스1, 인덱스2] 간선 배열
        this.color = '#ffffff'; // 와이어프레임 색상
    }

    render(camera, ctx, canvasWidth, canvasHeight) {
        if (this.vertices.length === 0 || this.edges.length === 0) {
            super.render(camera, ctx, canvasWidth, canvasHeight);
            return;
        }

        // 1. 로컬 정점을 월드 좌표계로 변환 후 카메라를 통해 2D 화면 좌표로 투영
        const projectedPoints = this.vertices.map(vertex => {
            const worldPoint = this.transformPoint(vertex);
            return camera.project(worldPoint, canvasWidth, canvasHeight);
        });

        // 2. 2D 화면에 선(Edge) 그리기
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;

        for (const edge of this.edges) {
            const p1 = projectedPoints[edge[0]];
            const p2 = projectedPoints[edge[1]];

            // Z-Clipping에 의해 무효화된 정점은 그리고 생략
            if (!p1 || !p2) continue;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }

        // 자식 객체들 계층적 렌더링 호출
        super.render(camera, ctx, canvasWidth, canvasHeight);
    }
}
