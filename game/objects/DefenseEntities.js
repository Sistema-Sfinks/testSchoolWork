// game/objects/DefenseEntities.js

import { Billboard } from '../../engine/components/Billboard.js';
import { TexturedCube } from './TexturedCube.js';

// 1. 유닛 (빌보드 기반 2D 스프라이트)
export class DefenseUnit extends Billboard {
    constructor(x, y, z, options = {}) {
        super(x, y, z, options);
        this.team = options.team || 1; // 1: 아군(우측이동), -1: 적군(좌측이동)
        
        // 전투 스탯
        this.maxHp = options.hp || 100;
        this.hp = this.maxHp;
        this.damage = options.damage || 10;
        this.speed = options.speed || 5;
        this.range = options.range || 5;
        this.attackCooldown = options.attackCooldown || 1.0; // 1초
        
        this.currentCooldown = 0;
        this.isDead = false;
    }

    // 체력바 렌더링 오버라이드
    render(camera, ctx, canvasWidth, canvasHeight, dpr) {
        super.render(camera, ctx, canvasWidth, canvasHeight, dpr);
        
        if (this.isDead) return;
        
        // 3D 머리 위 좌표 계산 (체력바용)
        const headPos = this.getWorldPosition();
        headPos.y += this.height * 1.2; // 유닛 머리 위
        
        const proj = camera.project(headPos, canvasWidth, canvasHeight, dpr);
        if (!proj) return;

        const hpRatio = Math.max(0, this.hp / this.maxHp);
        const barWidth = 40 * dpr;
        const barHeight = 6 * dpr;
        const barX = proj.x - barWidth / 2;
        const barY = proj.y;

        ctx.fillStyle = 'red';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = '#00ffcc';
        ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
    }
}

// 2. 기지 (3D 큐브 기반)
export class DefenseBase extends TexturedCube {
    constructor(x, y, z, size, texture, team) {
        super(x, y, z, size, texture);
        this.team = team;
        this.maxHp = 500;
        this.hp = this.maxHp;
        this.isDead = false;
    }

    render(camera, ctx, canvasWidth, canvasHeight, dpr) {
        super.render(camera, ctx, canvasWidth, canvasHeight, dpr);

        if (this.isDead) return;

        const headPos = this.getWorldPosition();
        headPos.y += 6; 
        const proj = camera.project(headPos, canvasWidth, canvasHeight, dpr);
        if (!proj) return;

        const hpRatio = Math.max(0, this.hp / this.maxHp);
        const barWidth = 80 * dpr;
        const barHeight = 10 * dpr;
        
        ctx.fillStyle = 'red';
        ctx.fillRect(proj.x - barWidth/2, proj.y, barWidth, barHeight);
        ctx.fillStyle = this.team === 1 ? '#00ffcc' : '#ff3366';
        ctx.fillRect(proj.x - barWidth/2, proj.y, barWidth * hpRatio, barHeight);
    }
}