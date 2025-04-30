import { ARCStyle } from '../types';
import { DEFAULT_STYLE } from '../constant';

export function preprocessStyle(style: Partial<ARCStyle> = {}): ARCStyle {
  return {
    x: { start: style.x?.start ?? DEFAULT_STYLE.x.start, end: style.x?.end ?? DEFAULT_STYLE.x.end },
    y: { start: style.y?.start ?? DEFAULT_STYLE.y.start, end: style.y?.end ?? DEFAULT_STYLE.y.end },
    band: { fill: style.band?.fill ?? DEFAULT_STYLE.band.fill },
    label: { ...DEFAULT_STYLE.label, ...style.label },
    area: { ...DEFAULT_STYLE.area, ...style.area },
    line: { ...DEFAULT_STYLE.line, ...style.line },
    border: { ...DEFAULT_STYLE.border, ...style.border },
  };
}
