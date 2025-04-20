import { AugmentedRadarChart } from './AugmentedRadarChart';
import * as d3 from 'd3';
import  chroma from 'chroma-js';

export class AugmentedRadarChartCanvas extends AugmentedRadarChart {
  public render(): void {
    const config = this.config;
    const style = this.style;
    const dimension = this.dimension;
    
    const container = config.container;
    const containerSize = config.size;
    
    // 雷达图的中心位置
    const cx = containerSize / 2;
    const cy = containerSize / 2;
    
    // 雷达图的半径
    const r = containerSize / 2;
    
    // 雷达图的维度数量以及每个维度的角度
    const dimensionCount = Object.keys(dimension).length;
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

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context){
      throw new Error('failed to get 2D context')
    }
    canvas.width = containerSize;
    canvas.height = containerSize;  

    //存储所有路径点数据
    const pathData:{
      [key:string]:{[layer:number]: Array<{x:number ; y:number ; point:number}>;};
    } = {};
    
    // 循环data的每一个维度
    Object.entries(dimension).forEach((d, i) => {
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
          return 'center';
        } else if (tx > cx) {
          return 'start';
        } else if (tx < cx) {
          return 'end';
        } else return 'center';
      };

      context.font =`${style.label?.fontSize || "16px"} ${style.label?.fontFamily || "Arial"}`;
      context.textAlign = text_anchor() as CanvasTextAlign;
      context.textBaseline = 'middle';
      context.fillStyle = typeof style.label?.fill==='string'? style.label.fill : 'black';
      context.fillText(key, tx, ty);
      
      // 添加平均值点的坐标
      const ax = cx - r * Math.sin(alpha) * scaleX(value.average);
      const ay = cy - r * Math.cos(alpha) * scaleX(value.average);
      averages.push([ax, ay]);

      // 循环每个维度的distribution的每个元素
      value.distribution.forEach((d) => {
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
        for (let currentLayer = 0; currentLayer < config.band; currentLayer++) {
        // 如果我现在画的layer在数据点所在的layer下面，那么添加一个辅助点，用该数据的终止点坐标
        // 如果我现在画的layer在数据点所在的layer上面，那么添加一个辅助点，用该数据的起始点坐标
        // 如果我现在画的layer就是数据点所在的layer，那么添加这个数据点
        let x : number , y : number;
        if (currentLayer > layer){
          x = sx;
          y = sy;
        } else if (currentLayer < layer){
          x = ex;
          y = ey;
        } else{
          x = px;
          y = py;
        }
        //存储路径点
        if (!pathData[key]) pathData[key] = {};
        if (!pathData[key][currentLayer]) {
          pathData[key][currentLayer] = [];
          // 添加中心点
          pathData[key][currentLayer].push({ x: cx, y: cy, point: -Infinity });
        }
        pathData[key][currentLayer].push({ x, y, point: scaleX(d.point) });
        //添加顶点
        if (currentLayer === config.band-1){
          pathData[key][currentLayer].push({x: vx, y:vy, point: Infinity});
        }
        }
      });
    });

    //绘制所有路径
    Object.entries(pathData).forEach(([dimensionKey, layers]) => {
      Object.entries(layers).forEach(([layerStr, points]) => {
        const layer = parseInt(layerStr);
        const sortedPoints = points.sort((a, b) => a.point - b.point);

        context.beginPath();
        context.fillStyle = colors[layer + 1];
        sortedPoints.forEach((point, i) => {
          if (i === 0) {
            context.moveTo(point.x, point.y);
          } else {
            context.lineTo(point.x, point.y);
          }
        });
        context.closePath();
        context.fill();
      });
    });

    //画边框
    context.beginPath();
    vertices.forEach(([x,y], index) => {
      if (index === 0) {
        context.moveTo(x,y);
      } else{
        context.lineTo(x,y);
      }
    });
    context.closePath();
    context.strokeStyle =  'grey';
    context.lineWidth = 1;
    context.stroke();

    //画平均点
    averages.forEach(([ax,ay]) => {
      context.beginPath();
      const radius : number = Number(style.line?.radius) || 3;
      context.arc(ax, ay, radius, 0, Math.PI * 2);
      const fillColor = typeof style.line?.fill === 'string'?style.line.fill : '#ff0000';
      context.fillStyle = fillColor;
      context.fill();
    });

    //画平均线
    context.beginPath();  
    averages.forEach(([x, y], index) => {  
      if (index === 0) {
        context.moveTo(x, y); 
      } else {
        context.lineTo(x, y);  
      }
    });
    context.closePath();

    const borderColor = typeof style.area?.stroke === 'string' ? style.area.stroke : '#666';
    context.strokeStyle = borderColor;  
    context.lineWidth =  Number(style.area?.strokeWidth) || 1;
    context.stroke(); 

    //画每个维度的边界
    vertices.forEach(([vx, vy]) => { 
      context.beginPath(); 
      context.moveTo(cx, cy); 
      context.lineTo(vx, vy); 

      const lineColor = typeof style.area?.stroke === 'string' ? style.area.stroke : '#666';
      context.strokeStyle = lineColor;  
      context.lineWidth =  Number(style.area?.strokeWidth) || 1;  
      context.stroke();
    });

    //缩放Canvas使其保持在规定的Size里
      const parent = d3.select(config.container);
      parent.node()?.appendChild(canvas);
    }
  }