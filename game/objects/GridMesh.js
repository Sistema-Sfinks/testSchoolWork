// game/objects/GridMesh.js

import { GameObject } from '../../engine/GameObject.js';
// (본인의 경로에 맞게 Math.js 에서 Vector3를 불러오세요)
import { Vector3 } from '../../engine/Math.js'; 

export class GridMesh extends GameObject {
    constructor(size = 100, divisions = 20) {
        super(0, 0, 0);
        this.color = '#34495e'; // 어두운 철창 색상
        this.lines = []; // 선의 시작점과 끝점을 저장할 배열

        const halfSize = size / 2;
        const step = size / divisions;

        for (let i = 0; i <= divisions; i++) {
            const linePos = -halfSize + (i * step);
            
            // 세로선 (Z축 방향)
            this.lines.push([
                new Vector3(linePos, 0, -halfSize), 
                new Vector3(linePos, 0, halfSize)
            ]);

            // 가로선 (X축 방향)
            this.lines.push([
                new Vector3(-halfSize, 0, linePos), 
                new Vector3(halfSize, 0, linePos)
            ]);
        }
    }

    render(camera, ctx, canvasWidth, canvasHeight, dpr = 1) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();

        // 모든 3D 선을 카메라 기준으로 스크린에 투영하여 그리기
        for (const [startNode, endNode] of this.lines) {
            const p1 = camera.project(startNode, canvasWidth, canvasHeight, dpr);
            const p2 = camera.project(endNode, canvasWidth, canvasHeight, dpr);

            // 두 점 모두 카메라 앞쪽에 있을 때만 선 긋기
            if (p1 && p2) {
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
            }
        }

        ctx.stroke();
        ctx.restore();

        super.render(camera, ctx, canvasWidth, canvasHeight, dpr);
    }
}