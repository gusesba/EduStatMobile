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
  maxVoltage: number;
  minVoltage: number;
  step: number;
  delay: number;
  timeIV: number;
  cyclesNumber: number;
  finalVoltage: number;
};

export type TGraphData = {
  points: TPoints;
};

export type TPoints = {
  x: number;
  y: number;
}[];
