// engine/GameObject.js

import { Vector3 } from './Math.js';

export class GameObject {
    constructor(x = 0, y = 0, z = 0) {
        // Transform 정보 (D3D의 World Matrix를 구성하는 3가지 요소)
        this.position = new Vector3(x, y, z);
        this.rotation = new Vector3(0, 0, 0); // 각 축 기준 회전 각도 (도/Degree)
        this.scale = new Vector3(1, 1, 1);

        // 계층 구조 (Scene Graph Node)
        this.parent = null;
        this.children = [];
    }

    // 자식 객체 추가 (부모-자식 계층 생성)
    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }

    // 자식 객체 제거
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children[index].parent = null;
            this.children.splice(index, 1);
        }
    }

    // 로컬 좌표계(Local Space)의 정점을 부모 계층까지 반영한 최종 월드 좌표계(World Space)로 변환
    // D3D의 World Matrix 변환 연산(SRT: Scale -> Rotate -> Translate)을 직접 계산합니다.
    transformPoint(localPoint) {
        // 1. Scale (크기 적용)
        let p = new Vector3(
            localPoint.x * this.scale.x,
            localPoint.y * this.scale.y,
            localPoint.z * this.scale.z
        );

        // 2. Rotation (회전 적용 - X, Y, Z 순)
        p = p.rotateX(this.rotation.x);
        p = p.rotateY(this.rotation.y);
        p = p.rotateZ(this.rotation.z);

        // 3. Translation (위치 이동)
        p = p.add(this.position);

        // 4. 부모 객체가 존재할 경우, 부모의 Transform을 재귀적으로 추가 적용
        if (this.parent) {
            p = this.parent.transformPoint(p);
        }

        return p;
    }

    // 1단계: 로직 업데이트 (파생 클래스에서 오버라이딩하여 자율적으로 로직 작성)
    update(deltaTime) {
        // 자식 객체들도 계층적으로 함께 업데이트
        for (const child of this.children) {
            child.update(deltaTime);
        }
    }

    // 2단계: 렌더링 (Mesh 등 렌더링 가능한 파생 클래스에서 오버라이딩)
    render(camera, ctx, canvasWidth, canvasHeight, aspectRatio) {
        // 자식 객체들도 계층적으로 함께 렌더링
        for (const child of this.children) {
            child.render(camera, ctx, canvasWidth, canvasHeight, aspectRatio);
        }
    }
}
