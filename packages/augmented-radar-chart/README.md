# Argument Radar Chart

- 雷达图：适合展示多维度数据，但每个维度只能表示单一属性，难以同时展示数据分布情况。
- 地平线图：适合展示单一维度数据的分布情况，但无法处理多维度数据。

增强雷达图结合了雷达图与地平线图的特点，能够在一个视图中同时展示多维度数据的单一属性和单一维度数据的分布情况。


## Pipeline
```swift
调用最外层暴露的draw()函数，传入数据和样式 => {
    创建一个ArgumentRadarChart对象 {
        验证参数是否合法;
        计算每个维度的平均值和分布;
    };
    调用类的draw()方法渲染出增强雷达图
}
```

---
## 开发指南

安装项目所需的依赖：
```bash
pnpm install
```
TODO:

### 文件结构

```text
augmented-radar-chart/
├── dist/                     # 构建后的输出目录
├── node_modules/             # 项目依赖
├── src/
│   ├── calculation/          # 数据计算逻辑
│   ├── rendering/            # 渲染逻辑
│   ├── validation/           # 参数验证逻辑
│   ├── chart.ts              # 雷达图类的实现
│   ├── index.ts              # 导出主入口
│   ├── type.ts               # 类型定义

```
`index.ts`是项目的主入口，其中只暴露了`draw()`函数，用户使用时会直接调用该函数，并传入数据和样式（数据和样式是画一张图所必须的），最终在指定的DOM element中渲染出一个增强雷达图

`type.ts`定义了所有该项目使用到的数据类型，主要是两类：
- `AugmentedRadarChartData`是增强雷达图需要的数据类型
- `AugmentedRadarChartConfig`是增强雷达图需要的样式类型，其中包含了一些用户可以指定的配置项，具体见代码

`chart.ts`定义了抽象类`AugmentRaderChart`，并根据不同的渲染器(Canvas、SVG...)继承，所有继承AugmentRaderChart的类都需要实现一个`draw()`方法。使用抽象类主要是考虑可扩展性和复用验证和计算逻辑：验证和计算逻辑是可以共用的，但是不同的渲染方式的渲染逻辑难以完全共用

`validation/`、`calculation/`和`rendering/`目录分别是验证、计算和渲染的具体实现与测试代码。

`validation/`下需要验证传入的数据和样式是否是合法的（考虑一些可能会导致出错的边界情况，例如size为负数，或者数据和样式不一致的维度名称...）

`calculation/`下需要计算每个维度的平均值和分布

`rendering/`下需要实现渲染雷达图部分和渲染地平线图部分的代码

以上的内容在必要情况下可以修改调整


