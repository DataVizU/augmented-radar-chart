import { ARCConfig, ARCStyle, ARCDimension } from '../types';
import { AugmentedRadarChartBase } from './AugmentedRadarChartBase';
import * as d3 from 'd3';

export class AugmentedRadarChartCanvas extends AugmentedRadarChartBase {
  protected renderChartImpl(config: ARCConfig, style: ARCStyle, dimension: ARCDimension): void {
    const { cx, cy, vertices, averages, labels, pathData, colors } = this.calculateGeometry(
      config,
      style,
      dimension,
    );

    const { context, canvas } = this.setupCanvas(config);

    const { translateX, translateY, scale } = this.calculateTransform(
      config,
      vertices,
      averages,
      labels,
      pathData,
      style,
      context,
    );

    context.save();
    context.translate(translateX, translateY);
    context.scale(scale, scale);

    this.renderPaths(context, pathData, colors);
    this.renderAxis(context, config, style, vertices, cx, cy);
    this.renderAveragePoints(context, style, averages);
    this.renderAverageLine(context, style, averages);
    this.renderLabels(context, style, labels);

    context.restore();

    this._container!.appendChild(canvas);
  }

  private setupCanvas(config: ARCConfig): {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
  } {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new ReferenceError('Context identifier is not supported');
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = config.size * dpr;
    canvas.height = config.size * dpr;
    canvas.style.width = `${config.size}px`;
    canvas.style.height = `${config.size}px`;
    context.scale(dpr, dpr);

    return { canvas, context };
  }

  private calculateTransform(
    config: ARCConfig,
    vertices: Array<[number, number]>,
    averages: Array<[number, number]>,
    labels: Array<{ x: number; y: number; text: string; anchor: string }>,
    pathData: {
      [key: string]: { [layer: number]: Array<{ x: number; y: number; point: number }> };
    },
    style: ARCStyle,
    context: CanvasRenderingContext2D,
  ): { translateX: number; translateY: number; scale: number } {
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

    const setFont = () => {
      context.font = `${style.label['font-size']}px ${style.label?.['font-family']}`;
      return <number>style.label['font-size'];
    };

    vertices.forEach(([x, y]) => updateBounds(x, y));
    averages.forEach(([x, y]) => updateBounds(x, y));
    labels.forEach(({ x, y, text, anchor }) => {
      updateBounds(x, y);
      context.save();
      this.applyStyle(context, style.label);
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
    const scale = Math.min(config.size / bboxWidth, config.size / bboxHeight);
    const translateX = (config.size - bboxWidth * scale) / 2 - minX * scale;
    const translateY = (config.size - bboxHeight * scale) / 2 - minY * scale;

    return { translateX, translateY, scale };
  }

  private renderPaths(
    context: CanvasRenderingContext2D,
    pathData: {
      [key: string]: { [layer: number]: Array<{ x: number; y: number; point: number }> };
    },
    colors: string[],
  ): void {
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
  }

  private renderAxis(
    context: CanvasRenderingContext2D,
    style: ARCStyle,
    vertices: Array<[number, number]>,
    cx: number,
    cy: number,
  ): void {
    context.save();
    context.beginPath();
    vertices.forEach(([x, y], index) => {
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.closePath();
    this.applyStyle(context, style.background);
    context.stroke();
    context.restore();

    vertices.forEach(([vx, vy]) => {
      context.save();
      context.beginPath();
      context.moveTo(cx, cy);
      context.lineTo(vx, vy);
      this.applyStyle(context, style.background);
      context.stroke();
      context.restore();
    });
  }

  private renderAveragePoints(
    context: CanvasRenderingContext2D,
    style: ARCStyle,
    averages: Array<[number, number]>,
  ): void {
    averages.forEach(([x, y]) => {
      context.save();
      context.beginPath();
      context.arc(x, y, <number>style.line.r, 0, Math.PI * 2);
      this.applyStyle(context, style.line);
      context.fill();
      context.restore();
    });
  }

  private renderAverageLine(
    context: CanvasRenderingContext2D,
    style: ARCStyle,
    averages: Array<[number, number]>,
  ): void {
    context.save();
    context.beginPath();
    averages.forEach(([x, y], index) => {
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.lineTo(averages[0][0], averages[0][1]);
    this.applyStyle(context, style.line);
    context.stroke();
    context.restore();
  }

  private renderLabels(
    context: CanvasRenderingContext2D,
    style: ARCStyle,
    labels: Array<{ x: number; y: number; text: string; anchor: string }>,
  ): void {
    const setFont = () => {
      context.font = `${style.label['font-size']}px ${style.label?.['font-family']}`;
    };

    labels.forEach(({ x, y, text, anchor }) => {
      context.save();
      this.applyStyle(context, style.label);
      setFont();
      context.textAlign = <CanvasTextAlign>(anchor === 'middle' ? 'center' : anchor);
      context.textBaseline = 'middle';
      context.fillText(text, x, y);
      context.restore();
    });
  }

  private applyStyle(ctx: CanvasRenderingContext2D, styleObj: object) {
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
  }

  protected destroy() {
    if (this._container) {
      const canvas = d3.select(this._container).select('canvas').node() as HTMLCanvasElement;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }
}
