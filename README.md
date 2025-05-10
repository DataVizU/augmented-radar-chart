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

> **For develop guidance**: refer to `packages/augmented-radar-chart/README.md`

## TODO

- [ ] Responsive design
- [ ] Add legend for chart
- [ ] More style support for canvas renderer



## Cite

The visualization approach in this work was introduced by Wang et al. in their paper "JobViz: Skill-driven visual exploration of job advertisements" (2024). 
The authors (Wang, Chen, Wang, Xiong, and Shen) developed an augmented radar-chart glyph visualization as part of their JobViz system to address the challenge of efficiently exploring and understanding skill requirements in job advertisements. 
This innovative chart design helps job seekers better comprehend the required skills for specific positions within large job posting datasets. 
The visualization is particularly notable for its ability to represent multiple dimensions of job-related information in an intuitive way, making it easier for users to identify positions that match their skill sets among numerous job listings.

```bibtex
@article{WANG202418,
title = {JobViz: Skill-driven visual exploration of job advertisements},
journal = {Visual Informatics},
volume = {8},
number = {3},
pages = {18-28},
year = {2024},
issn = {2468-502X},
doi = {https://doi.org/10.1016/j.visinf.2024.07.001},
url = {https://www.sciencedirect.com/science/article/pii/S2468502X24000391},
author = {Ran Wang and Qianhe Chen and Yong Wang and Lewei Xiong and Boyang Shen},
keywords = {Visual exploration, Job advertisements, Skill-driven},
abstract = {Online job advertisements on various job portals or websites have become the most popular way for people to find potential career opportunities nowadays. However, the majority of these job sites are limited to offering fundamental filters such as job titles, keywords, and compensation ranges. This often poses a challenge for job seekers in efficiently identifying relevant job advertisements that align with their unique skill sets amidst a vast sea of listings. Thus, we propose well-coordinated visualizations to provide job seekers with three levels of details of job information: a skill-job overview visualizes skill sets, employment posts as well as relationships between them with a hierarchical visualization design; a post exploration view leverages an augmented radar-chart glyph to represent job posts and further facilitates users’ swift comprehension of the pertinent skills necessitated by respective positions; a post detail view lists the specifics of selected job posts for profound analysis and comparison. By using a real-world recruitment advertisement dataset collected from 51Job, one of the largest job websites in China, we conducted two case studies and user interviews to evaluate JobViz. The results demonstrated the usefulness and effectiveness of our approach.}
}
```
