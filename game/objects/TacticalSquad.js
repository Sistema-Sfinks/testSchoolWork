import { GameObject } from '../../engine/GameObject.js';
import { Vector3 } from '../../engine/Math.js';

export class TacticalSquad extends GameObject {
    constructor(x, z, columns = 5, rows = 4, team = 'blue') {
        super(x, 0, z); // 부대의 중앙 위치
        
        this.team = team;
        this.color = team === 'blue' ? '#3498db' : '#e74c3c';
        
        // 진형 설정 (열과 오)
        this.columns = columns;
        this.rows = rows;
        this.spacing = 15; // 병사 간의 간격
        
        this.soldiers = []; // 개별 병사들의 로컬 좌표(부대 중심 기준)
        this.initFormation();

        // 이동 관련
        this.targetPosition = new Vector3(x, 0, z);
        this.moveSpeed = 40; // 이동 속도
        this.angle = 0; // 부대가 바라보는 방향 (라디안)
    }

    initFormation() {
        const startX = -((this.columns - 1) * this.spacing) / 2;
        const startZ = -((this.rows - 1) * this.spacing) / 2;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                this.soldiers.push(new Vector3(
                    startX + col * this.spacing,
                    0,
                    startZ + row * this.spacing
                ));
            }
        }
    }

    // 마우스로 이동 지시를 내릴 때 호출
    orderMove(x, z) {
        this.targetPosition = new Vector3(x, 0, z);
        // 이동할 방향을 바라보도록 각도 계산
        const dx = x - this.position.x;
        const dz = z - this.position.z;
        this.angle = Math.atan2(dx, dz); 
    }

    update(deltaTime) {
        const dx = this.targetPosition.x - this.position.x;
        const dz = this.targetPosition.z - this.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        // 목표 지점에 도달하지 않았다면 이동
        if (dist > 1) {
            const moveAmt = this.moveSpeed * deltaTime;
            if (dist <= moveAmt) {
                this.position.x = this.targetPosition.x;
                this.position.z = this.targetPosition.z;
            } else {
                this.position.x += Math.sin(this.angle) * moveAmt;
                this.position.z += Math.cos(this.angle) * moveAmt;
            }
        }
    }

    render(camera, ctx, canvasWidth, canvasHeight, dpr) {
        ctx.fillStyle = this.color;

        // 진형 내 모든 병사 그리기
        for (const localPos of this.soldiers) {
            // 부대의 회전(angle)을 적용하여 병사의 실제 월드 좌표 계산
            const worldX = this.position.x + (localPos.x * Math.cos(this.angle) - localPos.z * Math.sin(this.angle));
            const worldZ = this.position.z + (localPos.x * Math.sin(this.angle) + localPos.z * Math.cos(this.angle));
            const worldPos = new Vector3(worldX, 0, worldZ);

            // 카메라 투영
            const p = camera.project(worldPos, canvasWidth, canvasHeight, dpr);
            if (p) {
                // 병사 한 명을 작은 점(원)으로 렌더링
                const scale = p.scale * 300 * dpr; 
                ctx.beginPath();
                ctx.arc(p.x, p.y, scale, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}