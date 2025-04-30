import { ARCConfig, ARCData, ARCDimension, ARCStyle } from '../types';
import { preprocessConfig, preprocessStyle, preprocessData } from '../utils';
import { DEFAULT_STYLE } from '../constant';
import * as d3 from 'd3';

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
      try {
        if (name === 'data') {
          this._data = JSON.parse(newValue) as ARCData;
          this._dimension = preprocessData(this._data);
        } else if (name === 'config') {
          this._config = preprocessConfig(JSON.parse(newValue) as ARCConfig);
        } else if (name === 'chart-style') {
          this._chartStyle = preprocessStyle(JSON.parse(newValue) as Partial<ARCStyle>);
        }
        this.renderChart();
      } catch (error) {
        console.error(`Error parsing ${name}:`, error);
      }
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

    this.destroy(); // 清理之前的渲染内容
    const config = { ...this._config, container: this._container };
    try {
      this.renderChartImpl(config, this._chartStyle, this._dimension);
    } catch (error) {
      console.error(`Error rendering chart:`, error);
    }
  }

  // 抽象方法，子类必须实现具体渲染逻辑
  protected abstract renderChartImpl(
    config: ARCConfig,
    style: ARCStyle,
    dimension: ARCDimension,
  ): void;

  // 抽象方法，子类实现具体的清理逻辑
  protected destroy() {
    if (this._container) {
      d3.select(this._container).select('svg').remove();
      d3.select(this._container).select('canvas').remove();
    }
  }

  set data(value: ARCData | null) {
    this._data = value;
    this._dimension = value ? preprocessData(value) : {};
    this.renderChart();
  }

  get data(): ARCData | null {
    return this._data;
  }

  set config(value: Partial<ARCConfig>) {
    this._config = preprocessConfig({ ...this._config, ...value });
    this.renderChart();
  }

  get config(): ARCConfig {
    return this._config;
  }

  set chartStyle(value: Partial<ARCStyle>) {
    this._chartStyle = preprocessStyle(value);
    this.renderChart();
  }

  get chartStyle(): ARCStyle {
    return this._chartStyle;
  }
}
