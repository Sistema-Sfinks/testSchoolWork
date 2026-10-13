// game/objects/TexturedCube.js

import { Mesh } from '../../engine/components/Mesh.js';
import { Math } from '../../engine/Math.js';

export class TexturedCube extends Mesh {
    constructor(x = 0, y = 0, z = 0, size = 10, textureImage = null) {
        super(x, y, z);
        this.texture = textureImage;
        this.cullBackFaces = true; // 후면 선별 활성화

        const s = size / 2;

        // 8개 정점 생성
        this.vertices = [
            new Vector3(-s, -s,  s), new Vector3( s, -s,  s), new Vector3( s,  s,  s), new Vector3(-s,  s,  s),
            new Vector3(-s, -s, -s), new Vector3( s, -s, -s), new Vector3( s,  s, -s), new Vector3(-s,  s, -s)
        ];

        const uvSquare = [
            [[0, 0], [1, 0], [1, 1]],
            [[0, 0], [1, 1], [0, 1]]
        ];

        // 6개 면 (면당 2개 삼각형 = 총 12개 삼각형, Counter-Clockwise Winding Order)
        this.triangles = [
            // Front
            { indices: [0, 1, 2], uvs: uvSquare[0] }, { indices: [0, 2, 3], uvs: uvSquare[1] },
            // Back
            { indices: [5, 4, 7], uvs: uvSquare[0] }, { indices: [5, 7, 6], uvs: uvSquare[1] },
            // Top
            { indices: [3, 2, 6], uvs: uvSquare[0] }, { indices: [3, 6, 7], uvs: uvSquare[1] },
            // Bottom
            { indices: [4, 5, 1], uvs: uvSquare[0] }, { indices: [4, 1, 0], uvs: uvSquare[1] },
            // Right
            { indices: [1, 5, 6], uvs: uvSquare[0] }, { indices: [1, 6, 2], uvs: uvSquare[1] },
            // Left
            { indices: [4, 0, 3], uvs: uvSquare[0] }, { indices: [4, 3, 7], uvs: uvSquare[1] }
        ];
    }

    update(deltaTime) {
        // 지속적인 Y축, X축 3D 회전
        this.rotation.y += 0.8 * deltaTime;
        this.rotation.x += 0.4 * deltaTime;
    }
}