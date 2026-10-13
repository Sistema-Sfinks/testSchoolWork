// engine/EngineCore.js

export class EngineCore {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`캔버스를 찾을 수 없습니다: ${canvasId}`);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.activeScene = null;
        this.lastTime = 0;
        this.isRunning = false;

        // 화면 크기 변경 시 캔버스 해상도 자동 조절
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas(); // 초기 해상도 설정
    }

    // 캔버스 크기를 브라우저 창 크기에 맞춤
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // 렌더링할 현재 씬(Scene) 등록
    setScene(scene) {
        this.activeScene = scene;
    }

    // 엔진 가동 (게임 루프 시작)
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }

    // 엔진 정지
    stop() {
        this.isRunning = false;
    }

    // 메인 게임 루프 (Direct3D의 메인 렌더링 루프 역할)
    gameLoop(currentTime) {
        if (!this.isRunning) return;

        // DeltaTime (이전 프레임부터 현재 프레임까지 걸린 시간, 초 단위) 계산
        // 기기 성능(프레임레이트)에 상관없이 일정한 속도를 보장하기 위해 사용
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        // 다음 프레임 요청
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // 1단계: 로직 업데이트
    update(deltaTime) {
        if (this.activeScene) {
            this.activeScene.update(deltaTime);
        }
    }

    // 2단계: 화면 그리기
    render() {
        // 화면 지우기 (Clear) - D3D의 Clear 기능
        this.ctx.fillStyle = '#000000'; // 배경색 검정
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 현재 씬 렌더링 (Scene 내부의 Camera, Mesh 들이 처리됨)
        if (this.activeScene) {
            this.activeScene.render(this.ctx, this.canvas.width, this.canvas.height);
        }
    }
}
