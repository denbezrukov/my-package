export interface TicksChartProps {
  width: number;
  height: number;
  barWidth: number;
  barPadding: number;
  start: number;
  end: number;
}

export interface DomainTick {
  x0: number;
  x1: number;
  low: number;
  high: number;
  close: number;
  open: number;
}
