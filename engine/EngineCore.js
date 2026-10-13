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
        // 실제 화면의 논리적 픽셀 크기
        const w = window.innerWidth;
        const h = window.innerHeight;

        if (this.config.resolutionMode === 'adaptive') {
            const dpr = window.devicePixelRatio || 1;
            // 캔버스 자체의 렌더링 해상도 (망막 디스플레이 대응)
            this.canvas.width = w * dpr;
            this.canvas.height = h * dpr;
        } else {
            this.canvas.width = this.config.fixedWidth;
            this.canvas.height = this.config.fixedHeight;
        }

        this.applyScaleMode(w, h);
    }

    applyScaleMode(w, h) {
        // vh/vw 대신 실제 계산된 픽셀값을 명시하여 브라우저의 강제 스트레칭 방지
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';

        if (this.config.resolutionMode === 'adaptive') {
            this.canvas.style.objectFit = 'fill';
        } else {
            if (this.config.scaleMode === 'stretch') {
                this.canvas.style.objectFit = 'fill';
            } else if (this.config.scaleMode === 'fit') {
                this.canvas.style.objectFit = 'contain';
            }
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
