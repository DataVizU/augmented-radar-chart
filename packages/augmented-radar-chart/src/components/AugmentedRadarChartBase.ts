import { ARCConfig, ARCData, ARCDimension, ARCStyle } from '../types';
import { refineConfig, refineStyle, refineData } from '../utils';
import { DEFAULT_STYLE } from '../constant';
import * as d3 from 'd3';
import chroma from 'chroma-js';

export abstract class AugmentedRadarChartBase extends HTMLElement {
  protected _data: ARCData | null;
  protected _config: ARCConfig;
  protected _chartStyle: ARCStyle;
  protected _dimension: ARCDimension;
  protected _container: HTMLDivElement | null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._data = null;
    this._config = { size: 600, band: 2 };
    this._chartStyle = DEFAULT_STYLE;
    this._dimension = {};
    this._container = null;
  }

  static get observedAttributes(): string[] {
    return ['data', 'config', 'chart-style'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue && newValue !== null) {
      if (name === 'data') {
        this._data = JSON.parse(newValue) as ARCData;
        this._dimension = refineData(this._data);
      } else if (name === 'config') {
        this._config = refineConfig(JSON.parse(newValue) as ARCConfig);
      } else if (name === 'chart-style') {
        this._chartStyle = refineStyle(JSON.parse(newValue) as Partial<ARCStyle>);
      }
      this.renderChart();
    }
  }

  connectedCallback(): void {
    const container = document.createElement('div');
    container.style.width = `${this._config.size}px`;
    container.style.height = `${this._config.size}px`;
    this.shadowRoot!.appendChild(container);
    this._container = container;
    this.renderChart();
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  protected renderChart(): void {
    if (!this._container) {
      const container = document.createElement('div');
      container.style.width = `${this._config.size}px`;
      container.style.height = `${this._config.size}px`;
      this.shadowRoot!.appendChild(container);
      this._container = container;
    }

    if (!this._data || !Object.keys(this._dimension).length) {
      return;
    }

    // Clean previous instance
    this.destroy();

    const config = { ...this._config, container: this._container };
    this.renderChartImpl(config, this._chartStyle, this._dimension);
  }

  protected calculateGeometry(config: ARCConfig, style: ARCStyle, dimension: ARCDimension) {
    const { size, band } = config;

    const cx = size / 2;
    const cy = size / 2;

    const r = size / 2;

    const dimensionCount = Object.keys(dimension).length;
    const angle = (2 * Math.PI) / dimensionCount;

    const vertices: Array<[number, number]> = [];
    const averages: Array<[number, number]> = [];
    const labels: Array<{ x: number; y: number; text: string; anchor: string }> = [];
    const pathData: {
      [key: string]: { [layer: number]: Array<{ x: number; y: number; point: number }> };
    } = {};

    const y_from = Math.min(
      style.y.from,
      Object.values(dimension)
        .flatMap((d) => d.distribution)
        .reduce((min, curr) => (curr.value < min ? curr.value : min), Infinity),
    );
    const y_to = Math.max(
      style.y.to,
      Object.values(dimension)
        .flatMap((d) => d.distribution)
        .reduce((max, curr) => (curr.value > max ? curr.value : max), -Infinity),
    );

    const scaleX = d3.scaleLinear().domain([0, 1]).range([style.x.from, style.x.to]);
    const scaleY = d3.scaleLinear().domain([y_from, y_to]).nice().range([0, band]);

    const colors = chroma
      .scale([chroma(style.chart.fill as string).alpha(0), chroma(style.chart.fill as string)])
      .mode('lab')
      .colors(band + 1);

    console.log(colors);

    Object.entries(dimension).forEach(([key, value], i) => {
      const alpha = angle * i;
      const beta = angle * (i + 1);

      const vx = cx - r * Math.sin(alpha);
      const vy = cy - r * Math.cos(alpha);
      vertices.push([vx, vy]);

      const tx = cx - r * Math.sin(alpha) * (1 + <number>style.label.offset);
      const ty = cy - r * Math.cos(alpha) * (1 + <number>style.label.offset);
      const textAnchor = tx.toFixed() === cx.toFixed() ? 'middle' : tx > cx ? 'start' : 'end';
      labels.push({ x: tx, y: ty, text: key, anchor: textAnchor });

      const ax = cx - r * Math.sin(alpha) * scaleX(value.average);
      const ay = cy - r * Math.cos(alpha) * scaleX(value.average);
      averages.push([ax, ay]);

      pathData[key] = {};
      value.distribution.forEach((d) => {
        const sx = cx - r * Math.sin(alpha) * scaleX(d.point);
        const sy = cy - r * Math.cos(alpha) * scaleX(d.point);
        const ex = cx - r * Math.sin(beta) * scaleX(d.point);
        const ey = cy - r * Math.cos(beta) * scaleX(d.point);
        const px = d3.scaleLinear().domain([0, 1]).range([sx, ex])(scaleY(d.value) % 1);
        const py = d3.scaleLinear().domain([0, 1]).range([sy, ey])(scaleY(d.value) % 1);
        const layer = Math.trunc(scaleY(d.value));

        for (let i = 0; i < band; i++) {
          const x = i > layer ? sx : i < layer ? ex : px;
          const y = i > layer ? sy : i < layer ? ey : py;

          if (!pathData[key][i]) {
            pathData[key][i] = [];
            pathData[key][i].push({
              x: cx - r * Math.sin(alpha) * style.offset,
              y: cy - r * Math.cos(alpha) * style.offset,
              point: -Infinity,
            });
          }
          pathData[key][i].push({ x, y, point: scaleX(d.point) });
          pathData[key][i].push({
            x: vx + r * Math.sin(alpha) * style.offset,
            y: vy + r * Math.cos(alpha) * style.offset,
            point: Infinity,
          });
        }
      });
    });

    return { cx, cy, r, vertices, averages, labels, pathData, scaleX, scaleY, colors };
  }

  protected abstract renderChartImpl(
    config: ARCConfig,
    style: ARCStyle,
    dimension: ARCDimension,
  ): void;

  protected abstract destroy(): void;

  set data(value: ARCData | null) {
    this._data = value;
    this._dimension = value ? refineData(value) : {};
    this.renderChart();
  }

  get data(): ARCData | null {
    return this._data;
  }

  set config(value: Partial<ARCConfig>) {
    this._config = refineConfig({ ...this._config, ...value });
    this.renderChart();
  }

  get config(): ARCConfig {
    return this._config;
  }

  set chartStyle(value: Partial<ARCStyle>) {
    this._chartStyle = refineStyle(value);
    this.renderChart();
  }

  get chartStyle(): ARCStyle {
    return this._chartStyle;
  }
}
