// game/objects/RotatingCube.js

import { Mesh } from '../../engine/components/Mesh.js';
import { Vector3 } from '../../engine/Math.js';

export class RotatingCube extends Mesh {
    constructor(x = 0, y = 0, z = 0, size = 10) {
        super(x, y, z);
        this.color = '#00ffcc'; // 기본 색상 (청록색)

        // 큐브 중심을 기준으로 한 절반 크기
        const s = size / 2;
        
        // 1. 큐브의 8개 정점 (로컬 좌표계)
        this.vertices = [
            new Vector3(-s, -s, -s), // 0: 좌하단 앞
            new Vector3( s, -s, -s), // 1: 우하단 앞
            new Vector3( s,  s, -s), // 2: 우상단 앞
            new Vector3(-s,  s, -s), // 3: 좌상단 앞
            new Vector3(-s, -s,  s), // 4: 좌하단 뒤
            new Vector3( s, -s,  s), // 5: 우하단 뒤
            new Vector3( s,  s,  s), // 6: 우상단 뒤
            new Vector3(-s,  s,  s)  // 7: 좌상단 뒤
        ];

        // 2. 큐브의 12개 간선 (정점 인덱스 연결)
        this.edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // 앞면
            [4, 5], [5, 6], [6, 7], [7, 4], // 뒷면
            [0, 4], [1, 5], [2, 6], [3, 7]  // 기둥(옆면)
        ];
    }

    // 매 프레임 엔진 Core -> Scene -> GameObject 계층을 타고 내려와 실행되는 로직
    update(deltaTime) {
        // DeltaTime을 곱해 기기 프레임에 상관없이 1초에 90도씩 일정하게 회전
        this.rotation.x += 90 * deltaTime;
        this.rotation.y += 90 * deltaTime;

        // 부모(Mesh)의 update를 호출하여 자식 객체가 있다면 연쇄적으로 업데이트 처리
        super.update(deltaTime);
    }
}
