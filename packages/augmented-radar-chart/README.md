# Augmented Radar Chart

- **Radar Chart** is suitable for displaying multi-dimensional data, but each dimension can only represent a single attribute.
- **Horizon Chart** is suitable for showing distribution of single-dimensional data but is hard to handle multi-dimensional data.


We propose **Augmented Radar Chart**, which combines the features of both radar charts and horizon charts, allowing simultaneously visualize single attribute of multidimensional data and distribution of each dimension.

![overview](https://github.com/user-attachments/assets/7c44ea99-6d77-4d91-80a9-95e1657639ad)


## Usage

```html
<augmented-radar-chart-svg id="chart"></augmented-radar-chart-svg>

<script type="module">
import { AugmentedRadarChartSVG } from 'augmented-radar-chart';
customElements.define('augmented-radar-chart-svg', AugmentedRadarChartSVG);

const chart = document.getElementById('chart');
chart.data = {
  'Dimension 1': { data: [25, 30, 28] },
  'Dimension 2': { data: [15, 20, 18] }
};
chart.config = {
  size: 600,
  band: 2
};
</script>
```
## Pipeline

```mermaid
flowchart TD
    A[Data Input] --> B{Validation}
    B --> C[Data Calculation]
    C --> D[Renderer Selection]
    D -->|SVG| E[SVG Rendering]
    D -->|Canvas| F[Canvas Rendering]
    
    subgraph Calculation
        C --> C1[Average Calculation]
        C --> C2[Distribution Analysis]
    end
    
    style E fill:#f9d5e5,stroke:#333
    style F fill:#d5e8d4,stroke:#333
```

---
## Develop Guidelines
- Run the following code in **root directory** to install required dependencies：
```bash
pnpm install
```
- Start development servers
```bash
pnpm dev:umd    # UMD build
pnpm dev:esm    # ES Module build 
pnpm dev:vite   # Vite playground
```

### Structure

```text
src/
├── components/        # Chart implementation classes
│   ├── AugmentedRadarChartBase.ts
│   ├── AugmentedRadarChartSVG.ts
│   └── AugmentedRadarChartCanvas.ts
├── constant.ts        # Configuration defaults
├── utils/             # Utility functions
├── types.ts           # Type definitions
└── index.ts           # Public API entry
```


