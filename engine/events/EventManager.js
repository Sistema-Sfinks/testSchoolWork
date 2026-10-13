// engine/events/EventManager.js

export class EventManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.activeKeys = new Set();
        this.guiButtons = [];
        this.activePointerId = null;

        this.initInputListeners();
    }

    // GUI 버튼 등록
    registerButton(button) {
        this.guiButtons.push(button);
    }

    initInputListeners() {
        // 키보드 입력
        window.addEventListener('keydown', (e) => {
            this.activeKeys.add(e.key.toLowerCase());
        });

        window.addEventListener('keyup', (e) => {
            this.activeKeys.delete(e.key.toLowerCase());
        });

        // 마우스 및 터치 포인터 입력
        const handlePointer = (e, isDown) => {
            const rect = this.canvas.getBoundingClientRect();
            // CSS 화면 좌표를 캔버스 버퍼 좌표계로 변환
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            const pointerX = (e.clientX - rect.left) * scaleX;
            const pointerY = (e.clientY - rect.top) * scaleY;

            for (const btn of this.guiButtons) {
                if (btn.containsPoint(pointerX, pointerY, this.canvas.width, this.canvas.height)) {
                    btn.isPressed = isDown;
                } else if (!isDown) {
                    btn.isPressed = false;
                }
            }
        };

        this.canvas.addEventListener('pointerdown', (e) => handlePointer(e, true));
        window.addEventListener('pointerup', (e) => {
            this.guiButtons.forEach(btn => btn.isPressed = false);
        });
    }

    // 매 프레임 업데이트 시 호출되어 키 누름 및 버튼 눌림 상태에 맞춰 이벤트 트리거
    update(deltaTime) {
        for (const btn of this.guiButtons) {
            // 단축키 눌림 확인 또는 GUI 버튼 직접 클릭 확인
            const isHotkeyActive = btn.hotkey && this.activeKeys.has(btn.hotkey.toLowerCase());
            
            if (isHotkeyActive || btn.isPressed) {
                btn.isPressed = true;
                btn.trigger(deltaTime);
            }
        }
    }
}