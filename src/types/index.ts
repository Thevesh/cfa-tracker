export interface ProgressData {
  date: string;
  actual: number;
  target: number;
}

export interface ChartData {
  labels: string[];
  actual: number[];
  target: number[];
}

export interface CombinedData {
  daily: ChartData;
  cumulative: ChartData;
}

export type ViewMode = 'daily' | 'cumulative'; 