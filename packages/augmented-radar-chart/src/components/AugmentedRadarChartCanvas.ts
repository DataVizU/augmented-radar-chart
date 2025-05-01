import * as d3 from 'd3';
import chroma from 'chroma-js';
import { ARCConfig, ARCStyle, ARCDimension } from '../types';
import { AugmentedRadarChartBase } from './AugmentedRadarChartBase';
import { applyStyle } from '../utils';

export class AugmentedRadarChartCanvas extends AugmentedRadarChartBase {
  protected renderChartImpl(config: ARCConfig, style: ARCStyle, dimension: ARCDimension): void {
    const { size, band } = config;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2;

    const dimensionCount = Object.keys(dimension).length;
    const angle = (2 * Math.PI) / dimensionCount;
    const vertices: Array<[number, number]> = [];
    const averages: Array<[number, number]> = [];

    // Bounding box to track min/max coordinates
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

    const scaleX = d3.scaleLinear().domain([0, 1]).range([style.x.start, style.x.end]);
    const band_start = Math.min(
      style.y.start,
      Object.values(dimension)
        .flatMap((d) => d.distribution)
        .reduce((min, curr) => (curr.value < min ? curr.value : min), Infinity),
    );
    const band_end = Math.max(
      style.y.end,
      Object.values(dimension)
        .flatMap((d) => d.distribution)
        .reduce((max, curr) => (curr.value > max ? curr.value : max), -Infinity),
    );
    const scaleY = d3.scaleLinear().domain([band_start, band_end]).nice().range([0, band]);

    const colors = chroma
      .scale([chroma(style.band.fill as string).alpha(0), chroma(style.band.fill as string)])
      .mode('lab')
      .colors(band + 1);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context');
    }

    // 调整 Canvas 尺寸以匹配设备像素比
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`; // 设置 CSS 尺寸
    canvas.style.height = `${size}px`;
    context.scale(dpr, dpr); // 缩放上下文以匹配 DPR

    const pathData: {
      [key: string]: { [layer: number]: Array<{ x: number; y: number; point: number }> };
    } = {};

    // Step 1: Calculate vertices, averages, labels, and path points
    Object.entries(dimension).forEach(([key, value], i) => {
      const alpha = angle * i;
      const beta = angle * (i + 1);

      const vx = cx - r * Math.sin(alpha);
      const vy = cy - r * Math.cos(alpha);
      vertices.push([vx, vy]);
      updateBounds(vx, vy);

      const tx = cx - r * Math.sin(alpha) * 1.05;
      const ty = cy - r * Math.cos(alpha) * 1.05;
      updateBounds(tx, ty);

      // Measure text for bounds
      context.save();
      applyStyle(context, style.label);
      context.font = `${style.label?.['font-size'] || '16px'} ${style.label?.['font-family'] || 'Arial'}`;
      const textMetrics = context.measureText(key);
      const textWidth = textMetrics.width;
      const textHeight = Number(style.label?.['font-size'] || 16);
      const textAnchor = tx.toFixed() === cx.toFixed() ? 'middle' : tx > cx ? 'start' : 'end';
      if (textAnchor === 'start') {
        updateBounds(tx, ty - textHeight / 2);
        updateBounds(tx + textWidth, ty + textHeight / 2);
      } else if (textAnchor === 'end') {
        updateBounds(tx - textWidth, ty - textHeight / 2);
        updateBounds(tx, ty + textHeight / 2);
      } else {
        updateBounds(tx - textWidth / 2, ty - textHeight / 2);
        updateBounds(tx + textWidth / 2, ty + textHeight / 2);
      }
      context.restore();

      const ax = cx - r * Math.sin(alpha) * scaleX(value.average);
      const ay = cy - r * Math.cos(alpha) * scaleX(value.average);
      averages.push([ax, ay]);
      updateBounds(ax, ay);

      value.distribution.forEach((d) => {
        const sx = cx - r * Math.sin(alpha) * scaleX(d.point);
        const sy = cy - r * Math.cos(alpha) * scaleX(d.point);
        const ex = cx - r * Math.sin(beta) * scaleX(d.point);
        const ey = cy - r * Math.cos(beta) * scaleX(d.point);
        const px = d3.scaleLinear().domain([0, 1]).range([sx, ex])(scaleY(d.value) % 1);
        const py = d3.scaleLinear().domain([0, 1]).range([sy, ey])(scaleY(d.value) % 1);
        const layer = Math.trunc(scaleY(d.value));

        updateBounds(sx, sy);
        updateBounds(ex, ey);
        updateBounds(px, py);

        for (let i = 0; i < band; i++) {
          const x = i > layer ? sx : i < layer ? ex : px;
          const y = i > layer ? sy : i < layer ? ey : py;

          if (!pathData[key]) pathData[key] = {};
          if (!pathData[key][i]) {
            pathData[key][i] = [];
            pathData[key][i].push({ x: cx, y: cy, point: -Infinity });
          }
          pathData[key][i].push({ x, y, point: scaleX(d.point) });
          pathData[key][i].push({ x: vx, y: vy, point: Infinity });
        }
      });
    });

    const bboxWidth = maxX - minX;
    const bboxHeight = maxY - minY;
    const scale = Math.min(size / bboxWidth, size / bboxHeight) * 0.95;
    const translateX = (size - bboxWidth * scale) / 2 - minX * scale;
    const translateY = (size - bboxHeight * scale) / 2 - minY * scale;

    context.save();
    context.translate(translateX, translateY);
    context.scale(scale, scale);

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

    averages.forEach(([x, y]) => {
      context.save();
      context.beginPath();
      context.arc(x, y, Number(style.line?.r) || 3, 0, Math.PI * 2);
      applyStyle(context, style.line);
      context.fill();
      context.restore();
    });

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

    vertices.forEach(([vx, vy]) => {
      context.save();
      context.beginPath();
      context.moveTo(cx, cy);
      context.lineTo(vx, vy);
      applyStyle(context, style.area);
      context.stroke();
      context.restore();
    });

    Object.entries(dimension).forEach(([key], i) => {
      const alpha = angle * i;
      const tx = cx - r * Math.sin(alpha) * 1.05;
      const ty = cy - r * Math.cos(alpha) * 1.05;
      const textAnchor = tx.toFixed() === cx.toFixed() ? 'center' : tx > cx ? 'start' : 'end';

      context.save();
      applyStyle(context, style.label);
      context.font = `${style.label?.['font-size'] || '16px'} ${style.label?.['font-family'] || 'Arial'}`;
      context.textAlign = textAnchor as CanvasTextAlign;
      context.textBaseline = 'middle';
      context.fillText(key, tx, ty);
      context.restore();
    });

    context.restore(); // Restore the context to remove scaling

    // Append canvas to container
    this._container!.appendChild(canvas);
  }
}
