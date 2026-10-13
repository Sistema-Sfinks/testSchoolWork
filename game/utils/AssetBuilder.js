// game/utils/AssetBuilder.js

export class AssetBuilder {
    static createTexture(text, bgColor, textColor = '#ffffff', width = 128, height = 128) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // 배경색
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // 테두리
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, width - 4, height - 4);

        // 텍스트
        ctx.fillStyle = textColor;
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width / 2, height / 2);

        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }
}