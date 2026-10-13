// engine/components/Mesh.js

import { GameObject } from '../GameObject.js';

export class Mesh extends GameObject {
    constructor(x = 0, y = 0, z = 0) {
        super(x, y, z);
        this.vertices = [];   // Vector3 배열
        this.triangles = [];  // { indices: [0, 1, 2], uvs: [[0,0], [1,0], [0,1]] }
        this.texture = null;   // Image 또는 Canvas 객체
        this.color = '#ffffff';
        this.cullBackFaces = true; // 후면 선별 여부
        this.wireframe = false;    // 디버그용 와이어프레임 토글
    }

    render(camera, ctx, canvasWidth, canvasHeight, dpr = 1) {
        if (this.vertices.length === 0 || this.triangles.length === 0) {
            super.render(camera, ctx, canvasWidth, canvasHeight, dpr);
            return;
        }

        // 1. 모든 정점의 월드 변환 및 카메라 투영 (Z 깊이 정보 포함)
        const projected = this.vertices.map(v => {
            const worldPt = this.transformPoint(v);
            const viewPt = worldPt.subtract(camera.position); // 카메라 기준 좌표
            const proj = camera.project(worldPt, canvasWidth, canvasHeight, dpr);
            return {
                screen: proj,
                z: viewPt.z // 깊이 연산용 카메라 Z 좌표
            };
        });

        // 2. 그려질 삼각형 추출 및 Depth Sorting (Painter's Algorithm)
        const renderableTriangles = [];

        for (const tri of this.triangles) {
            const p0 = projected[tri.indices[0]];
            const p1 = projected[tri.indices[1]];
            const p2 = projected[tri.indices[2]];

            // 카메라 뒤에 있는 정점이 하나라도 있으면 스킵 (Near Clip)
            if (!p0.screen || !p1.screen || !p2.screen) continue;

            const p0s = p0.screen;
            const p1s = p1.screen;
            const p2s = p2.screen;

            // 3. 후면 선별 (Back-Face Culling: 2D 외적으로 Winding Order 판별)
            const crossProduct = (p1s.x - p0s.x) * (p2s.y - p0s.y) - (p1s.y - p0s.y) * (p2s.x - p0s.x);
            if (this.cullBackFaces && crossProduct <= 0) {
                continue; // 카메라 뒤쪽을 향하는 면은 그리지 않음
            }

            // 삼각형의 평균 Z 깊이 연산 (카메라에서 먼 것부터 정렬하기 위함)
            const avgZ = (p0.z + p1.z + p2.z) / 3;

            renderableTriangles.push({
                pts: [p0s, p1s, p2s],
                uvs: tri.uvs || [[0, 0], [1, 0], [0, 1]],
                z: avgZ
            });
        }

        // 먼 삼각형부터 그리도록 Z-Depth 내림차순 정렬
        renderableTriangles.sort((a, b) => b.z - a.z);

        // 4. 삼각형 라스터라이제이션 (텍스처 / 솔리드 채우기)
        for (const tri of renderableTriangles) {
            const [p0, p1, p2] = tri.pts;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.closePath();

            if (this.texture && this.texture.complete && tri.uvs) {
                // Canvas 2D 아핀 행렬을 활용한 텍스처 매핑
                ctx.clip();
                this.drawTexturedTriangle(ctx, this.texture, p0, p1, p2, tri.uvs[0], tri.uvs[1], tri.uvs[2]);
            } else {
                // 단색 채우기
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            if (this.wireframe) {
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 1 * dpr;
                ctx.stroke();
            }
            ctx.restore();
        }

        super.render(camera, ctx, canvasWidth, canvasHeight, dpr);
    }

    // Canvas2D Affine Transform을 이용한 3D 삼각형 텍스처 맵핑 기법
    drawTexturedTriangle(ctx, img, p0, p1, p2, uv0, uv1, uv2) {
        const tw = img.width;
        const th = img.height;

        const u0 = uv0[0] * tw, v0 = uv0[1] * th;
        const u1 = uv1[0] * tw, v1 = uv1[1] * th;
        const u2 = uv2[0] * tw, v2 = uv2[1] * th;

        const delta = u0 * (v1 - v2) + u1 * (v2 - v0) + u2 * (v0 - v1);
        if (Math.abs(delta) < 0.0001) return;

        const a = (p0.x * (v1 - v2) + p1.x * (v2 - v0) + p2.x * (v0 - v1)) / delta;
        const b = (p0.y * (v1 - v2) + p1.y * (v2 - v0) + p2.y * (v0 - v1)) / delta;
        const c = (p0.x * (u2 - u1) + p1.x * (u0 - u2) + p2.x * (u1 - u0)) / delta;
        const d = (p0.y * (u2 - u1) + p1.y * (u0 - u2) + p2.y * (u1 - u0)) / delta;
        const e = (p0.x * (u1 * v2 - u2 * v1) + p1.x * (u2 * v0 - u0 * v2) + p2.x * (u0 * v1 - u1 * v0)) / delta;
        const f = (p0.y * (u1 * v2 - u2 * v1) + p1.y * (u2 * v0 - u0 * v2) + p2.y * (u0 * v1 - u1 * v0)) / delta;

        ctx.transform(a, b, c, d, e, f);
        ctx.drawImage(img, 0, 0);
    }
}