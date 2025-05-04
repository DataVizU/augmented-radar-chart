import { ARCConfig, ARCStyle, ARCDimension } from '../types';
import { AugmentedRadarChartBase } from './AugmentedRadarChartBase';
import { applyStyle } from '../utils';

export class AugmentedRadarChartCanvas extends AugmentedRadarChartBase {
  protected renderChartImpl(config: ARCConfig, style: ARCStyle, dimension: ARCDimension): void {
    const { cx, cy, vertices, averages, labels, pathData, colors } = this.calculateChartGeometry(
      config,
      style,
      dimension,
    );

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error();
    }
    const dpr = window.devicePixelRatio || 1;
    canvas.width = config.size * dpr;
    canvas.height = config.size * dpr;
    canvas.style.width = `${config.size}px`;
    canvas.style.height = `${config.size}px`;
    context.scale(dpr, dpr);

    // calc bound
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    const updateBounds = (x: number, y: number) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    };

    // set font style
    const setFont = () => {
      const fontSize =
        typeof style.label?.['font-size'] === 'number' ? style.label['font-size'] : 16;
      const fontFamily = style.label?.['font-family'] || 'Arial';
      context.font = `${fontSize}px ${fontFamily}`;
      return fontSize;
    };

    vertices.forEach(([x, y]) => updateBounds(x, y));
    averages.forEach(([x, y]) => updateBounds(x, y));
    labels.forEach(({ x, y, text, anchor }) => {
      updateBounds(x, y);
      context.save();
      applyStyle(context, style.label);
      const fontSize = setFont();
      const textMetrics = context.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;
      if (anchor === 'start') {
        updateBounds(x, y - textHeight / 2);
        updateBounds(x + textWidth, y + textHeight / 2);
      } else if (anchor === 'end') {
        updateBounds(x - textWidth, y - textHeight / 2);
        updateBounds(x, y + textHeight / 2);
      } else {
        updateBounds(x - textWidth / 2, y - textHeight / 2);
        updateBounds(x + textWidth / 2, y + textHeight / 2);
      }
      context.restore();
    });
    Object.values(pathData).forEach((layers) => {
      Object.values(layers).forEach((points) => {
        points.forEach(({ x, y }) => updateBounds(x, y));
      });
    });

    const bboxWidth = maxX - minX;
    const bboxHeight = maxY - minY;
    const scale = Math.min(config.size / bboxWidth, config.size / bboxHeight) * 0.95;
    const translateX = (config.size - bboxWidth * scale) / 2 - minX * scale;
    const translateY = (config.size - bboxHeight * scale) / 2 - minY * scale;
    context.save();
    context.translate(translateX, translateY);
    context.scale(scale, scale);

    // render paths
    Object.entries(pathData).forEach(([, layers]) => {
      Object.entries(layers).forEach(([layerStr, points]) => {
        const layer = parseInt(layerStr);
        const sortedPoints = points.sort((a, b) => a.point - b.point);
        context.save();
        context.fillStyle = colors[layer + 1];
        context.beginPath();
        sortedPoints.forEach((point, i) => {
          if (i === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        context.closePath();
        context.fill();
        context.restore();
      });
    });

    context.save();
    context.beginPath();
    vertices.forEach(([x, y], index) => {
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.closePath();
    applyStyle(context, style.area);
    context.stroke();
    context.restore();

    // render average point
    averages.forEach(([x, y]) => {
      context.save();
      context.beginPath();
      context.arc(x, y, Number(style.line?.r) || 3, 0, Math.PI * 2);
      applyStyle(context, style.line);
      context.fill();
      context.restore();
    });

    // render average line
    context.save();
    context.beginPath();
    averages.forEach(([x, y], index) => {
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.lineTo(averages[0][0], averages[0][1]);
    applyStyle(context, style.line);
    context.stroke();
    context.restore();

    // render axis
    vertices.forEach(([vx, vy]) => {
      context.save();
      context.beginPath();
      context.moveTo(cx, cy);
      context.lineTo(vx, vy);
      applyStyle(context, style.area);
      context.stroke();
      context.restore();
    });

    // render label
    labels.forEach(({ x, y, text, anchor }) => {
      context.save();
      applyStyle(context, style.label);
      setFont();
      context.textAlign = (anchor === 'middle' ? 'center' : anchor) as CanvasTextAlign;
      context.textBaseline = 'middle';
      context.fillText(text, x, y);
      context.restore();
    });

    context.restore();

    this._container!.appendChild(canvas);
  }
}
