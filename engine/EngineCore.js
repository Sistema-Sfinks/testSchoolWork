// engine/EngineCore.js

export class EngineCore {
    constructor(canvasId, config = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.activeScene = null;
        this.lastTime = 0;
        this.isRunning = false;

        // --- 환경 설정 (기본값 세팅) ---
        this.config = {
            resolutionMode: config.resolutionMode || 'adaptive', // 'adaptive' (상시적응) | 'fixed' (고정)
            fixedWidth: config.fixedWidth || 800,                // 고정 해상도 X
            fixedHeight: config.fixedHeight || 600,              // 고정 해상도 Y
            scaleMode: config.scaleMode || 'fit'                 // 'stretch' (꽉채우기) | 'fit' (비율유지 레터박스)
        };

        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas(); // 초기 해상도 및 스케일 적용
    }

    resizeCanvas() {
        // 1. 내부 렌더링 해상도(버퍼 크기) 설정
        if (this.config.resolutionMode === 'adaptive') {
            // 상시 적응: 기기의 실제 픽셀 비율(DPI)까지 고려하여 선명하게 렌더링
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = window.innerWidth * dpr;
            this.canvas.height = window.innerHeight * dpr;
        } else {
            // 고정 해상도
            this.canvas.width = this.config.fixedWidth;
            this.canvas.height = this.config.fixedHeight;
        }

        // 2. 화면 스케일링(CSS) 설정
        this.applyScaleMode();
    }

    applyScaleMode() {
        if (this.config.resolutionMode === 'adaptive') {
            // 적응형일 경우 CSS는 무조건 화면 전체를 덮도록 설정
            this.canvas.style.width = '100vw';
            this.canvas.style.height = '100vh';
            this.canvas.style.objectFit = 'fill';
            return;
        }

        // 고정 해상도일 때의 스케일링 처리
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';

        if (this.config.scaleMode === 'stretch') {
            // 비율 무시하고 화면에 꽉 채움 (찌그러짐 발생 가능)
            this.canvas.style.objectFit = 'fill';
        } else if (this.config.scaleMode === 'fit') {
            // 짧은 방향 기준으로 비율을 유지하며 최대 확대 (남는 공간은 레터박스 처리)
            this.canvas.style.objectFit = 'contain';
        }
    }

    setScene(scene) { this.activeScene = scene; }
    start() { /* 기존과 동일 */ if (!this.isRunning) { this.isRunning = true; this.lastTime = performance.now(); requestAnimationFrame((time) => this.gameLoop(time)); } }
    stop() { this.isRunning = false; }
    
    gameLoop(currentTime) {
        if (!this.isRunning) return;
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.update(deltaTime);
        this.render();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) { if (this.activeScene) this.activeScene.update(deltaTime); }

    render() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // 종횡비(AspectRatio)를 카메라에 넘겨주기 위해 계산
        const aspectRatio = this.canvas.width / this.canvas.height;
        if (this.activeScene) this.activeScene.render(this.ctx, this.canvas.width, this.canvas.height, aspectRatio);
    }
}
