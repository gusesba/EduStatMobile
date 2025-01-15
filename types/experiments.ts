export type TExperiment = {
  id: string;
  name: string;
  graphData: TGraphData;
  parameters: TParameters;
  notes: string;
  teamId: string;
  userId: string;
};

export type TParameters = {
  maxV: number;
  minv: number;
  step: number;
  delay: number;
};

export type TGraphData = {
  points: TPoints;
};

export type TPoints = {
  x: number;
  y: number;
}[];
