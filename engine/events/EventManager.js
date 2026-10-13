// engine/events/EventManager.js

export class EventManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.activeKeys = new Set();
        this.guiButtons = [];

        this.initInputListeners();
    }

    registerButton(button) {
        if (!this.guiButtons.includes(button)) {
            this.guiButtons.push(button);
        }
    }

    initInputListeners() {
        // 키보드 눌림 / 뗌 감지
        window.addEventListener('keydown', (e) => {
            this.activeKeys.add(e.key.toLowerCase());
        });

        window.addEventListener('keyup', (e) => {
            this.activeKeys.delete(e.key.toLowerCase());
        });

        // 화면 포커스 해제 시 키 고착 방지
        window.addEventListener('blur', () => {
            this.activeKeys.clear();
            this.guiButtons.forEach(btn => {
                btn.isPointerDown = false;
                btn.isHotkeyActive = false;
            });
        });

        // 캔버스 마우스/터치 좌표 변환 함수
        const getPointerCoords = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        };

        this.canvas.addEventListener('pointerdown', (e) => {
            const coords = getPointerCoords(e);
            for (const btn of this.guiButtons) {
                if (btn.containsPoint(coords.x, coords.y, this.canvas.width, this.canvas.height)) {
                    btn.isPointerDown = true;
                }
            }
        });

        window.addEventListener('pointerup', () => {
            this.guiButtons.forEach(btn => btn.isPointerDown = false);
        });

        window.addEventListener('pointercancel', () => {
            this.guiButtons.forEach(btn => btn.isPointerDown = false);
        });
    }

    update(deltaTime) {
        for (const btn of this.guiButtons) {
            if (btn.hotkey) {
                btn.isHotkeyActive = this.activeKeys.has(btn.hotkey);
            }

            const currentlyPressed = btn.isPressed;

            if (btn.triggerMode === 'click') {
                // 단발성 클릭: 이전에 안 눌렸다가 지금 눌린 순간에만 1회 실행
                if (currentlyPressed && !btn.wasPressed) {
                    btn.trigger(deltaTime);
                }
            } else {
                // 지속 누름 (hold)
                if (currentlyPressed) {
                    btn.trigger(deltaTime);
                }
            }

            // 이전 프레임 상태 기록
            btn.wasPressed = currentlyPressed;
        }
    }
}