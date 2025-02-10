import { AugmentedRadarChart } from './AugmentedRadarChart';
import * as d3 from 'd3';
import chroma from 'chroma-js';

export class AugmentedRadarChartSVG extends AugmentedRadarChart {
  public render(): void {
    const data = this.data;
    const config = this.config;
    const style = this.style;

    const container = config.container;
    const containerSize = config.size;

    // 雷达图的中心位置
    const cx = containerSize / 2;
    const cy = containerSize / 2;

    // 雷达图的半径
    const r = containerSize / 2;

    // 雷达图的维度数量以及每个维度的角度
    const dimensionCount = Object.keys(data).length;
    const angle = (2 * Math.PI) / dimensionCount;

    // 雷达图顶点的坐标集
    const vertices: Array<[number, number]> = [];
    // 每个维度平均值点的坐标集
    const averages: Array<[number, number]> = [];

    // x坐标的比例尺，将数据从[0, 1]映射到一个包含在[0, 1]内的区间
    // 考虑到每个维度的坐标系有点像极坐标，越靠近中心越难读清y值
    const scaleX = d3.scaleLinear().domain([0, 1]).range([style.x.start, style.x.end]);

    const band_start = Math.min(
      style.y.start,
      Object.values(data)
        .flatMap((d) => d.distribution!)
        .reduce((min, curr) => (curr.value < min ? curr.value : min), Infinity),
    );

    const band_end = Math.max(
      style.y.end,
      Object.values(data)
        .flatMap((d) => d.distribution!)
        .reduce((max, curr) => (curr.value > max ? curr.value : max), -Infinity),
    );

    // y坐标的比例尺，将数据从value的[start, end]映射到[0, config.band]，其中每一层都是单位1
    // 比如说如果有四层的话，就会映射到[0, 4]（value会在后面映射到这个区间内）
    // 映射后value在[0, 1]的表示在第0层，[1, 2]的表示在第1层，[2, 3]的表示在第2层，[3, 4]的表示在第3层
    // 每个数据点的value在对应层的相对位置（在这一层百分之多少的位置）就是映射后value的小数部分
    const scaleY = d3.scaleLinear().domain([band_start, band_end]).nice().range([0, config.band]);

    // 创建一个颜色序列，第i个元素表示第i层的颜色
    const colors = chroma
      .scale([chroma(style.band.fill as string).alpha(0), chroma(style.band.fill as string)])
      .mode('lab')
      .colors(config.band + 1);

    const line = d3
      .line()
      .x((d) => d[0]) // x 坐标
      .y((d) => d[1]); // y 坐标

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', containerSize)
      .attr('height', containerSize);

    // 循环data的每一个维度
    Object.entries(data).forEach((d, i) => {
      const [key, value] = d;

      // 当前循环的角度
      const alpha = angle * i;

      // 下一次循环的角度
      const beta = angle * (i + 1);

      // 添加顶点坐标
      const vx = cx - r * Math.sin(alpha);
      const vy = cy - r * Math.cos(alpha);

      vertices.push([vx, vy]);

      // 画label
      const tx = cx - r * Math.sin(alpha) * 1.05;
      const ty = cy - r * Math.cos(alpha) * 1.05;

      const text_anchor = () => {
        if (tx.toFixed() === cx.toFixed()) {
          return 'middle';
        } else if (tx > cx) {
          return 'start';
        } else if (tx < cx) {
          return 'end';
        } else return 'middle';
      };

      svg
        .append('text')
        .call((text) => {
          Object.entries(style.label).forEach(([key, value]) => {
            text.attr(key, value);
          });
        })
        .attr('x', tx)
        .attr('y', ty)
        .attr('font-family', 'Arial')
        .attr('text-anchor', text_anchor)
        .attr('dominant-baseline', 'middle')
        .text(key);

      // 添加平均值点的坐标
      const ax = cx - r * Math.sin(alpha) * scaleX(value.average!);
      const ay = cy - r * Math.cos(alpha) * scaleX(value.average!);
      averages.push([ax, ay]);

      // 循环每个维度的distribution的每个元素
      value.distribution!.forEach((d) => {
        // 画数据点，可以理解为先在对应的x值处先画一条与y轴平行的线，起始点表示y=0，终止点表示y=1
        // 每一层都是单位1，并且每一层的起始点和终止点的坐标都是相同的
        // 然后再在这条线段上取百分之多少的位置，把数据点画在那个位置

        // 起始点坐标
        const sx = cx - r * Math.sin(alpha) * scaleX(d.point);
        const sy = cy - r * Math.cos(alpha) * scaleX(d.point);

        // 终止点坐标
        const ex = cx - r * Math.sin(beta) * scaleX(d.point);
        const ey = cy - r * Math.cos(beta) * scaleX(d.point);

        // 数据点坐标
        const px = d3.scaleLinear().domain([0, 1]).range([sx, ex])(scaleY(d.value) % 1);
        const py = d3.scaleLinear().domain([0, 1]).range([sy, ey])(scaleY(d.value) % 1);

        // 数据点所在的层数
        const layer = Math.trunc(scaleY(d.value));

        // 对每一层循环
        // 地平线图可以理解为叠加了config.band个图形
        for (let i = 0; i < config.band; i++) {
          // 如果我现在画的layer在数据点所在的layer下面，那么添加一个辅助点，用该数据的终止点坐标
          // 如果我现在画的layer在数据点所在的layer上面，那么添加一个辅助点，用该数据的起始点坐标
          // 如果我现在画的layer就是数据点所在的layer，那么添加这个数据点
          const x = () => {
            if (i > layer) {
              return sx;
            } else if (i < layer) {
              return ex;
            } else return px;
          };

          const y = () => {
            if (i > layer) {
              return sy;
            } else if (i < layer) {
              return ey;
            } else return py;
          };

          // 添加辅助点或者数据点
          svg
            .append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 0)
            .attr('fill', colors[i + 1])
            .attr('dimension', key) // 区分维度，每个维度分开画
            .attr('layer', i) // 区分层数，每次以层数相同的点为顶点画封闭图形
            .attr('point', scaleX(d.point)) // 记录x值，最后会根据x值从小到大依次连接（其实是提供了一个方向）
            .attr('role', i === layer ? 'arc-data' : ''); // 区分辅助点或者数据点

          // 添加中心点和该维度的顶点坐标，因为最后要形成一个封闭的图形
          svg
            .append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', 0)
            .attr('fill', colors[i + 1])
            .attr('dimension', key)
            .attr('layer', i)
            .attr('point', -Infinity) // 保证每一层从中心点开始依次连接各个点
            .attr('role', 'arc-start');
          svg
            .append('circle')
            .attr('cx', vx)
            .attr('cy', vy)
            .attr('r', 0)
            .attr('fill', colors[i + 1])
            .attr('dimension', key)
            .attr('layer', i)
            .attr('point', Infinity) // 保证每一层到顶点结束（最后和顶点连接，封闭图形）
            .attr('role', 'arc-end');
        }
      });
    });

    // 选中所有的circle（辅助点，数据点，中心点，顶点）根据fill（也就是层级）和维度分组
    d3.group(
      d3.selectAll('circle').nodes(),
      (d) => d3.select(d).attr('fill'),
      (d) => d3.select(d).attr('dimension'),
    ).forEach((group, fill) => {
      group.forEach((dimension) => {
        const circles = dimension
          .map((c) => {
            // 得到每个组（每个维度每层）的所有点的坐标
            const x = d3.select(c).attr('cx');
            const y = d3.select(c).attr('cy');
            const point = d3.select(c).attr('point');
            return {
              point: Number(point),
              coord: [Number(x), Number(y)],
            };
          })
          .sort((a, b) => a.point - b.point); // 按照x值排序

        const coordinates: Array<[number, number]> = circles.map((c) => c.coord) as Array<
          [number, number]
        >;

        // 依次连接
        svg.append('path').data([coordinates]).attr('d', line).attr('fill', fill);
      });
    });

    // 画边框
    svg
      .append('polygon')
      .call((area) => {
        Object.entries(style.area).forEach(([key, value]) => {
          area.attr(key, value);
        });
      })
      .attr('points', vertices.map((v) => Object.values(v).join(',')).join(' '));

    // 画平均点
    averages.forEach((d) => {
      svg
        .append('circle')
        .call((circle) => {
          Object.entries(style.line).forEach(([key, value]) => {
            circle.attr(key, value);
          });
        })
        .attr('cx', d[0])
        .attr('cy', d[1]);
    });

    // 画平均线
    svg
      .selectAll('line')
      .data(averages.slice(0, -1))
      .enter()
      .append('line')
      .call((line) => {
        Object.entries(style.line).forEach(([key, value]) => {
          line.attr(key, value);
        });
      })
      .attr('x1', (d) => d[0]) // 设置每个 line 的起点 x 坐标 (当前点的第一个值)
      .attr('y1', (d) => d[1]) // 设置每个 line 的起点 y 坐标 (当前点的第二个值)
      .attr('x2', (d, i) => averages[i + 1][0]) // 设置每个 line 的终点 x 坐标 (下一个点的第一个值)
      .attr('y2', (d, i) => averages[i + 1][1]); // 设置每个 line 的终点 y 坐标 (下一个点的第二个值)

    svg
      .append('line')
      .call((line) => {
        Object.entries(style.line).forEach(([key, value]) => {
          line.attr(key, value);
        });
      })
      .attr('x1', averages[averages.length - 1][0])
      .attr('y1', averages[averages.length - 1][1])
      .attr('x2', averages[0][0])
      .attr('y2', averages[0][1]);

    // 移除辅助点
    svg
      .selectAll('circle')
      .filter(function () {
        return d3.select(this).attr('role') === '';
      })
      .remove();

    // 画每个维度的边界
    vertices.forEach((v) => {
      svg
        .append('line')
        .call((line) => {
          Object.entries(style.area).forEach(([key, value]) => {
            line.attr(key, value);
          });
        })
        .attr('x1', cx)
        .attr('y1', cy)
        .attr('x2', v[0])
        .attr('y2', v[1]);
    });

    // 缩放svg使其保持在规定的size里
    const bbox = svg.node()!.getBBox();
    svg
      .attr('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
  }
}
