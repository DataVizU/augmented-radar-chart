# Augmented Radar Chart

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
