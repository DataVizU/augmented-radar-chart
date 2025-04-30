import * as d3 from 'd3';
import chroma from 'chroma-js';
import { ARCConfig, ARCStyle, ARCDimension } from '../types';
import { AugmentedRadarChartBase } from './AugmentedRadarChartBase';

export class AugmentedRadarChartSVG extends AugmentedRadarChartBase {
  protected renderChartImpl(config: ARCConfig, style: ARCStyle, dimension: ARCDimension): void {
    const { size, band } = config;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2;

    const dimensionCount = Object.keys(dimension).length;
    const angle = (2 * Math.PI) / dimensionCount;
    const vertices: Array<[number, number]> = [];
    const averages: Array<[number, number]> = [];

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

    const line = d3
      .line()
      .x((d) => d[0])
      .y((d) => d[1]);

    const svg = d3.select(this._container!).append('svg').attr('width', size).attr('height', size);

    Object.entries(dimension).forEach(([key, value], i) => {
      const alpha = angle * i;
      const beta = angle * (i + 1);
      const vx = cx - r * Math.sin(alpha);
      const vy = cy - r * Math.cos(alpha);
      vertices.push([vx, vy]);

      const tx = cx - r * Math.sin(alpha) * 1.05;
      const ty = cy - r * Math.cos(alpha) * 1.05;
      const text_anchor = tx.toFixed() === cx.toFixed() ? 'middle' : tx > cx ? 'start' : 'end';

      svg
        .append('text')
        .call((text) => {
          Object.entries(style.label).forEach(([k, v]) => text.attr(k, v));
        })
        .attr('x', tx)
        .attr('y', ty)
        .attr('font-family', 'Arial')
        .attr('text-anchor', text_anchor)
        .attr('dominant-baseline', 'middle')
        .text(key);

      const ax = cx - r * Math.sin(alpha) * scaleX(value.average);
      const ay = cy - r * Math.cos(alpha) * scaleX(value.average);
      averages.push([ax, ay]);

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

          svg
            .append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 0)
            .attr('fill', colors[i + 1])
            .attr('dimension', key)
            .attr('layer', i)
            .attr('point', scaleX(d.point))
            .attr('role', i === layer ? 'arc-data' : '');

          svg
            .append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', 0)
            .attr('fill', colors[i + 1])
            .attr('dimension', key)
            .attr('layer', i)
            .attr('point', -Infinity)
            .attr('role', 'arc-start');

          svg
            .append('circle')
            .attr('cx', vx)
            .attr('cy', vy)
            .attr('r', 0)
            .attr('fill', colors[i + 1])
            .attr('dimension', key)
            .attr('layer', i)
            .attr('point', Infinity)
            .attr('role', 'arc-end');
        }
      });
    });

    d3.group(
      d3.select(this._container!).selectAll('circle').nodes(),
      (d) => d3.select(d).attr('fill'),
      (d) => d3.select(d).attr('dimension'),
    ).forEach((group, fill) => {
      group.forEach((dimension) => {
        const circles = dimension
          .map((c) => ({
            point: Number(d3.select(c).attr('point')),
            coord: [Number(d3.select(c).attr('cx')), Number(d3.select(c).attr('cy'))],
          }))
          .sort((a, b) => a.point - b.point);

        const coordinates: Array<[number, number]> = circles.map((c) => c.coord) as Array<
          [number, number]
        >;
        svg.append('path').data([coordinates]).attr('d', line).attr('fill', fill);
      });
    });

    svg
      .append('polygon')
      .call((area) => {
        Object.entries(style.area).forEach(([k, v]) => area.attr(k, v));
      })
      .attr('points', vertices.map((v) => v.join(',')).join(' '));

    averages.forEach(([x, y]) => {
      svg
        .append('circle')
        .call((circle) => {
          Object.entries(style.line).forEach(([k, v]) => circle.attr(k, v));
        })
        .attr('cx', x)
        .attr('cy', y);
    });

    svg
      .selectAll('line')
      .data(averages.slice(0, -1))
      .enter()
      .append('line')
      .call((line) => {
        Object.entries(style.line).forEach(([k, v]) => line.attr(k, v));
      })
      .attr('x1', (d) => d[0])
      .attr('y1', (d) => d[1])
      .attr('x2', (d, i) => averages[i + 1][0])
      .attr('y2', (d, i) => averages[i + 1][1]);

    svg
      .append('line')
      .call((line) => {
        Object.entries(style.line).forEach(([k, v]) => line.attr(k, v));
      })
      .attr('x1', averages[averages.length - 1][0])
      .attr('y1', averages[averages.length - 1][1])
      .attr('x2', averages[0][0])
      .attr('y2', averages[0][1]);

    svg
      .selectAll('circle')
      .filter((d, i, nodes) => d3.select(nodes[i]).attr('role') === '')
      .remove();

    vertices.forEach(([vx, vy]) => {
      svg
        .append('line')
        .call((line) => {
          Object.entries(style.area).forEach(([k, v]) => line.attr(k, v));
        })
        .attr('x1', cx)
        .attr('y1', cy)
        .attr('x2', vx)
        .attr('y2', vy);
    });

    const bbox = svg.node()!.getBBox();
    svg
      .attr('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
  }
}
