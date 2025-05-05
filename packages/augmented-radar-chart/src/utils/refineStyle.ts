import { ARCStyle } from '../types';
import { DEFAULT_STYLE } from '../constant';

export function refineStyle(style: Partial<ARCStyle> = {}): ARCStyle {
  return {
    x: { from: style.x?.from ?? DEFAULT_STYLE.x.from, to: style.x?.to ?? DEFAULT_STYLE.x.to },
    y: { from: style.y?.from ?? DEFAULT_STYLE.y.from, to: style.y?.to ?? DEFAULT_STYLE.y.to },
    offset: style.offset ?? DEFAULT_STYLE.offset,
    label: { ...DEFAULT_STYLE.label, ...style.label },
    chart: { ...DEFAULT_STYLE.chart, ...style.chart },
    line: { ...DEFAULT_STYLE.line, ...style.line },
    background: { ...DEFAULT_STYLE.background, ...style.background },
  };
}
