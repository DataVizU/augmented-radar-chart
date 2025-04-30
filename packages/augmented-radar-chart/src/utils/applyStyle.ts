export const applyStyle = (ctx: CanvasRenderingContext2D, styleObj: any) => {
  Object.entries(styleObj).forEach(([key, value]) => {
    if (key === 'fill' && typeof value === 'string') {
      ctx.fillStyle = value;
    } else if (key === 'stroke' && typeof value === 'string') {
      ctx.strokeStyle = value;
    } else if (key === 'stroke-width') {
      ctx.lineWidth = Number(value) || 1;
    } else if (key === 'font-size') {
      ctx.font = `${value} ${ctx.font.split(' ').slice(1).join(' ')}`;
    } else if (key === 'font-family') {
      ctx.font = `${ctx.font.split(' ')[0]} ${value}`;
    }
  });
};
