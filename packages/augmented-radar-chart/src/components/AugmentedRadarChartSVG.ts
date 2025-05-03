import * as d3 from 'd3';
import { ARCConfig, ARCStyle, ARCDimension } from '../types';
import { AugmentedRadarChartBase } from './AugmentedRadarChartBase';

export class AugmentedRadarChartSVG extends AugmentedRadarChartBase {
  protected renderChartImpl(config: ARCConfig, style: ARCStyle, dimension: ARCDimension): void {
    const { cx, cy, vertices, averages, labels, pathData, colors } = this.calculateChartGeometry(
      config,
      style,
      dimension,
    );
    const svg = d3
      .select(this._container!)
      .append('svg')
      .attr('width', config.size)
      .attr('height', config.size);

    // Render paths
    const line = d3
      .line()
      .x((d) => d[0])
      .y((d) => d[1]);
    Object.entries(pathData).forEach(([, layers]) => {
      Object.entries(layers).forEach(([layerStr, points]) => {
        const layer = parseInt(layerStr);
        const coordinates = points
          .sort((a, b) => a.point - b.point)
          .map((p) => [p.x, p.y] as [number, number]);
        svg
          .append('path')
          .data([coordinates])
          .attr('d', line)
          .attr('fill', colors[layer + 1]);
      });
    });

    // Render polygon
    svg
      .append('polygon')
      .attr('points', vertices.map((v) => v.join(',')).join(' '))
      .call((area) => Object.entries(style.area).forEach(([k, v]) => area.attr(k, v)));

    // Render averages
    averages.forEach(([x, y]) => {
      svg
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .call((circle) => Object.entries(style.line).forEach(([k, v]) => circle.attr(k, v)));
    });

    // Render average lines
    svg
      .selectAll('line')
      .data(averages.slice(0, -1))
      .enter()
      .append('line')
      .call((line) => Object.entries(style.line).forEach(([k, v]) => line.attr(k, v)))
      .attr('x1', (d) => d[0])
      .attr('y1', (d) => d[1])
      .attr('x2', (d, i) => averages[i + 1][0])
      .attr('y2', (d, i) => averages[i + 1][1]);

    svg
      .append('line')
      .call((line) => Object.entries(style.line).forEach(([k, v]) => line.attr(k, v)))
      .attr('x1', averages[averages.length - 1][0])
      .attr('y1', averages[averages.length - 1][1])
      .attr('x2', averages[0][0])
      .attr('y2', averages[0][1]);

    // Render labels
    labels.forEach(({ x, y, text, anchor }) => {
      svg
        .append('text')
        .call((text) => Object.entries(style.label).forEach(([k, v]) => text.attr(k, v)))
        .attr('x', x)
        .attr('y', y)
        .attr('font-family', 'Arial')
        .attr('text-anchor', anchor)
        .attr('dominant-baseline', 'middle')
        .text(text);
    });

    // Render spokes
    vertices.forEach(([vx, vy]) => {
      svg
        .append('line')
        .call((line) => Object.entries(style.area).forEach(([k, v]) => line.attr(k, v)))
        .attr('x1', cx)
        .attr('y1', cy)
        .attr('x2', vx)
        .attr('y2', vy);
    });

    // Set viewBox
    const bbox = svg.node()!.getBBox();
    svg
      .attr('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
  }
}
