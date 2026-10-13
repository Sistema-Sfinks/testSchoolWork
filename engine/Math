// engine/Math.js

export class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // 다른 벡터와의 덧셈 (위치 이동/Translation 에 사용)
    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    // 다른 벡터와의 뺄셈 (카메라 뷰 변환 등 상대 거리 계산에 사용)
    subtract(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    // X축(가로축) 기준 회전 (Pitch)
    // 각도는 일반적인 '도(Degree)' 단위를 입력받아 내부에서 '라디안(Radian)'으로 변환합니다.
    rotateX(angle) {
        const rad = angle * (Math.PI / 180);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const y = this.y * cos - this.z * sin;
        const z = this.y * sin + this.z * cos;
        return new Vector3(this.x, y, z);
    }

    // Y축(세로축) 기준 회전 (Yaw)
    rotateY(angle) {
        const rad = angle * (Math.PI / 180);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const x = this.x * cos + this.z * sin;
        const z = -this.x * sin + this.z * cos;
        return new Vector3(x, this.y, z);
    }

    // Z축(깊이축) 기준 회전 (Roll)
    rotateZ(angle) {
        const rad = angle * (Math.PI / 180);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        return new Vector3(x, y, this.z);
    }
}
