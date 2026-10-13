// engine/gui/GUIPanel.js

import { GUIElement } from './GUIElement.js';

export class GUIPanel extends GUIElement {
    constructor(options = {}) {
        super(options);
        this.backgroundColor = options.backgroundColor || 'rgba(0, 0, 0, 0.6)';
        this.borderColor = options.borderColor || '#00ffcc';
        this.borderWidth = options.borderWidth || 2;
        this.borderRadius = options.borderRadius || 10;
    }

    drawSelf(ctx, rect, dpr) {
        ctx.fillStyle = this.backgroundColor;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth * rect.scale;

        const radius = this.borderRadius * rect.scale;

        ctx.beginPath();
        if (radius > 0 && ctx.roundRect) {
            ctx.roundRect(rect.x, rect.y, rect.width, rect.height, radius);
        } else {
            ctx.rect(rect.x, rect.y, rect.width, rect.height);
        }

        if (this.backgroundColor !== 'transparent') ctx.fill();
        if (this.borderColor !== 'transparent' && this.borderWidth > 0) ctx.stroke();
    }
}