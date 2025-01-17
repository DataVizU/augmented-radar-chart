type AugmentedRadarChartData = Record<string, Array<{
    point: number;
    value: number;
}>>;
interface AugmentedRadarChartConfig {
    container: HTMLElement;
    size: number;
    bins: Record<string, {
        start: number;
        end: number;
    }>;
    styles: {
        area: {
            bands: number;
            colors: string | Array<string>;
        };
        label: {
            color: string;
        };
        line: {
            color: string;
            width: number;
        };
    };
}

declare function draw(data: AugmentedRadarChartData, options: AugmentedRadarChartConfig, renderer: 'SVG' | 'Canvas'): void;
declare function helloWorld(): void;

export { draw, helloWorld };
