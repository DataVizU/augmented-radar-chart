import { ARCConfig, ARCDimension, ARCStyle } from '../types';
import { AugmentedRadarChartBase } from './AugmentedRadarChartBase';
import * as d3 from 'd3';

export class AugmentedRadarChartSVG extends AugmentedRadarChartBase {
  protected renderChartImpl(config: ARCConfig, style: ARCStyle, dimension: ARCDimension): void {
    const { cx, cy, vertices, averages, labels, pathData, colors } = this.calculateGeometry(
      config,
      style,
      dimension,
    );

    const svg = this.setupSVG(config);

    const defs = svg.append('defs');
    defs.append('style').attr('type', 'text/css').text(`
        .chart-style { ${Object.entries(style.chart)
          .map(([k, v]) => `${k}: ${v};`)
          .join(' ')} }
        .line-style { ${Object.entries(style.line)
          .map(([k, v]) => `${k}: ${v};`)
          .join(' ')} }
        .label-style { ${Object.entries(style.label)
          .map(([k, v]) => `${k}: ${v};`)
          .join(' ')} }
        .background-style { ${Object.entries(style.background)
          .map(([k, v]) => `${k}: ${v};`)
          .join(' ')} }
      `);

    const mainGroup = svg.append('g').attr('class', 'main-group');

    const axisGroup = mainGroup.append('g').attr('class', 'axis-group');
    const averageGroup = mainGroup.append('g').attr('class', 'average-group');
    const labelsGroup = mainGroup.append('g').attr('class', 'labels-group');
    const pathsGroup = mainGroup.append('g').attr('class', 'paths-group');

    this.renderAxis(axisGroup, style, vertices, cx, cy);
    this.renderAveragePoints(averageGroup, style, averages);
    this.renderAverageLine(averageGroup, style, averages);
    this.renderLabels(labelsGroup, style, labels);
    this.renderPaths(pathsGroup, pathData, colors);

    this.calculateTransform(svg);
  }

  private setupSVG(config: ARCConfig): d3.Selection<SVGSVGElement, unknown, null, undefined> {
    return d3
      .select(this._container!)
      .append('svg')
      .attr('width', config.size)
      .attr('height', config.size);
  }

  private calculateTransform(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>): void {
    const bbox = svg.node()!.getBBox();
    svg
      .attr('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
  }

  private renderPaths(
    pathsGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
    pathData: {
      [key: string]: { [layer: number]: Array<{ x: number; y: number; point: number }> };
    },
    colors: string[],
  ): void {
    const line = d3
      .line()
      .x((d) => d[0])
      .y((d) => d[1]);

    Object.entries(pathData).forEach(([key, layers]) => {
      const dimensionGroup = pathsGroup
        .append('g')
        .attr('class', `dimension-group dimension-${key}`);

      Object.entries(layers).forEach(([layerStr, points]) => {
        const layer = parseInt(layerStr);
        const layerGroup = dimensionGroup.append('g').attr('class', `layer-group layer-${layer}`);

        const coordinates = points
          .sort((a, b) => a.point - b.point)
          .map((p) => [p.x, p.y] as [number, number]);

        layerGroup
          .append('path')
          .data([coordinates])
          .attr('d', line)
          .attr('fill', colors[layer + 1]);
      });
    });
  }

  private renderAxis(
    axisGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
    style: ARCStyle,
    vertices: Array<[number, number]>,
    cx: number,
    cy: number,
  ): void {
    // 创建子组：多边形和辐条
    const polygonGroup = axisGroup.append('g').attr('class', 'polygon-group');
    const spokesGroup = axisGroup.append('g').attr('class', 'spokes-group');

    // 渲染多边形
    polygonGroup
      .append('polygon')
      .attr('points', vertices.map((v) => v.join(',')).join(' '))
      .attr('class', 'background-style')
      .call((area) => Object.entries(style.chart).forEach(([k, v]) => area.attr(k, v)));

    // 渲染辐条
    spokesGroup
      .selectAll('line')
      .data(vertices)
      .enter()
      .append('line')
      .attr('class', 'background-style')
      .call((line) => Object.entries(style.chart).forEach(([k, v]) => line.attr(k, v)))
      .attr('x1', cx)
      .attr('y1', cy)
      .attr('x2', (d) => d[0])
      .attr('y2', (d) => d[1]);
  }

  private renderAveragePoints(
    averageGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
    style: ARCStyle,
    averages: Array<[number, number]>,
  ): void {
    const pointsGroup = averageGroup.append('g').attr('class', 'average-points-group');

    pointsGroup
      .selectAll('circle')
      .data(averages)
      .enter()
      .append('circle')
      .attr('cx', (d) => d[0])
      .attr('cy', (d) => d[1])
      .attr('class', 'line-style')
      .call((circle) => Object.entries(style.line).forEach(([k, v]) => circle.attr(k, v)));
  }

  private renderAverageLine(
    averageGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
    style: ARCStyle,
    averages: Array<[number, number]>,
  ): void {
    const lineGroup = averageGroup.append('g').attr('class', 'average-line-group');

    // 渲染除最后一段的线
    lineGroup
      .selectAll('line')
      .data(averages.slice(0, -1))
      .enter()
      .append('line')
      .attr('class', 'line-style')
      .call((line) => Object.entries(style.line).forEach(([k, v]) => line.attr(k, v)))
      .attr('x1', (d) => d[0])
      .attr('y1', (d) => d[1])
      .attr('x2', (d, i) => averages[i + 1][0])
      .attr('y2', (d, i) => averages[i + 1][1]);

    // 渲染最后一段闭合线
    lineGroup
      .append('line')
      .attr('class', 'line-style')
      .call((line) => Object.entries(style.line).forEach(([k, v]) => line.attr(k, v)))
      .attr('x1', averages[averages.length - 1][0])
      .attr('y1', averages[averages.length - 1][1])
      .attr('x2', averages[0][0])
      .attr('y2', averages[0][1]);
  }

  private renderLabels(
    labelsGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
    style: ARCStyle,
    labels: Array<{ x: number; y: number; text: string; anchor: string }>,
  ): void {
    const textGroup = labelsGroup.append('g').attr('class', 'labels-text-group');

    textGroup
      .selectAll('text')
      .data(labels)
      .enter()
      .append('text')
      .attr('class', 'label-style')
      .call((text) => Object.entries(style.label).forEach(([k, v]) => text.attr(k, v)))
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('font-family', 'Arial')
      .attr('text-anchor', (d) => d.anchor)
      .attr('dominant-baseline', 'middle')
      .text((d) => d.text);
  }

  protected destroy() {
    if (this._container) {
      d3.select(this._container).select('svg').remove();
    }
  }
}
