// game/objects/GridMesh.js

import { Mesh } from '../../engine/components/Mesh.js';
import { Vector3 } from '../../engine/Math.js';

export class GridMesh extends Mesh {
    constructor(size = 100, divisions = 20) {
        super(0, 0, 0);
        this.wireframe = true;
        this.color = '#34495e'; // 어두운 철창 색상

        const halfSize = size / 2;
        const step = size / divisions;

        // 정점 및 간선 생성 (Z와 X축 평면)
        let index = 0;
        for (let i = 0; i <= divisions; i++) {
            const linePos = -halfSize + (i * step);
            
            // 세로선 (Z축 방향)
            this.vertices.push(new Vector3(linePos, 0, -halfSize));
            this.vertices.push(new Vector3(linePos, 0, halfSize));
            this.edges.push([index, index + 1]);
            index += 2;

            // 가로선 (X축 방향)
            this.vertices.push(new Vector3(-halfSize, 0, linePos));
            this.vertices.push(new Vector3(halfSize, 0, linePos));
            this.edges.push([index, index + 1]);
            index += 2;
        }
    }
}