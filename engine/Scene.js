// engine/Scene.js

export class Scene {
    constructor() {
        // 씬에 등록된 최상위 게임 객체들을 담는 배열 (Scene Graph의 루트 노드들)
        this.children = [];
        // 이 씬을 렌더링할 메인 카메라 객체
        this.camera = null;
    }

    // 현재 씬의 메인 카메라 설정
    setCamera(camera) {
        this.camera = camera;
    }

    // 씬에 새로운 게임 객체(GameObject) 추가
    addChild(gameObject) {
        this.children.push(gameObject);
    }

    // 씬에서 게임 객체 제거
    removeChild(gameObject) {
        const index = this.children.indexOf(gameObject);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    // 1단계: 로직 업데이트 (EngineCore에서 매 프레임 호출됨)
    update(deltaTime) {
        // 씬에 있는 모든 최상위 자식들의 update를 순회하며 실행
        for (const child of this.children) {
            child.update(deltaTime);
        }
    }

    // 2단계: 렌더링 (EngineCore에서 매 프레임 호출됨)
    render(ctx, canvasWidth, canvasHeight, aspectRatio) {
        // 카메라가 없으면 월드의 기준점이 없으므로 렌더링 중지
        if (!this.camera) {
            console.warn("Scene에 렌더링할 Camera가 설정되지 않았습니다.");
            return;
        }

        // 씬에 있는 모든 최상위 자식들에게 렌더링 명령 하달
        // 렌더링 파이프라인 연산에 필요한 카메라 객체와 뷰포트(캔버스 크기) 정보를 함께 넘겨줌
        for (const child of this.children) {
            child.render(this.camera, ctx, canvasWidth, canvasHeight, aspectRatio);
        }
    }
}
