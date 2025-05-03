import { ARCStyle } from '../types';
import { DEFAULT_STYLE } from '../constant';

export function refineStyle(style: Partial<ARCStyle> = {}): ARCStyle {
  return {
    x: { from: style.x?.from ?? DEFAULT_STYLE.x.from, to: style.x?.to ?? DEFAULT_STYLE.x.to },
    y: { from: style.y?.from ?? DEFAULT_STYLE.y.from, to: style.y?.to ?? DEFAULT_STYLE.y.to },
    offset: style.offset ?? DEFAULT_STYLE.offset,
    band: { fill: style.band?.fill ?? DEFAULT_STYLE.band.fill },
    label: { ...DEFAULT_STYLE.label, ...style.label },
    area: { ...DEFAULT_STYLE.area, ...style.area },
    line: { ...DEFAULT_STYLE.line, ...style.line },
    border: { ...DEFAULT_STYLE.border, ...style.border },
  };
}
