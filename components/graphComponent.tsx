import { TExperiment } from "@/types/experiments";
import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Path, Line, Text as SvgText } from "react-native-svg";

// Tipagem para pontos de dados
type Point = {
  x: number;
  y: number;
};

// Tipagem para cada conjunto de dados
type Dataset = {
  name: string;
  graphData: { points: Point[] };
};

// Propriedades do componente CyclicVoltammetryGraph
interface CyclicVoltammetryGraphProps {
  datasets: Dataset[];
  width?: number;
  height?: number;
  margin?: number;
}

const CyclicVoltammetryGraph: React.FC<CyclicVoltammetryGraphProps> = ({
  datasets,
  width = 400,
  height = 400,
  margin = 40,
}) => {
  // Achando os valores globais mínimo e máximo
  const allPoints = datasets.flatMap((dataset) => dataset.graphData.points);
  const xMin = Math.min(...allPoints.map((point) => point.x));
  const xMax = Math.max(...allPoints.map((point) => point.x));
  const yMin = Math.min(...allPoints.map((point) => point.y));
  const yMax = Math.max(...allPoints.map((point) => point.y));

  // Funções de normalização
  const normalizeX = (x: number) =>
    margin + ((x - xMin) / (xMax - xMin)) * (width - 2 * margin);
  const normalizeY = (y: number) =>
    height - margin - ((y - yMin) / (yMax - yMin)) * (height - 2 * margin);

  // Cores para os conjuntos de dados
  const colors = ["blue", "red", "green", "orange", "purple"];

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Grid Lines */}
        {/* Vertical Grid Lines */}
        {Array.from({ length: 11 }, (_, i) => {
          const xValue = xMin + (i * (xMax - xMin)) / 10; // 11 divisões = 10 intervalos
          const xPosition = normalizeX(xValue);
          return (
            <Line
              key={`grid-x-${i}`}
              x1={xPosition}
              y1={margin}
              x2={xPosition}
              y2={height - margin}
              stroke="lightgray"
              strokeWidth={0.5}
            />
          );
        })}
        {/* Horizontal Grid Lines */}
        {Array.from({ length: 11 }, (_, i) => {
          const yValue = yMin + (i * (yMax - yMin)) / 10; // 11 divisões = 10 intervalos
          const yPosition = normalizeY(yValue);
          return (
            <Line
              key={`grid-y-${i}`}
              x1={margin}
              y1={yPosition}
              x2={width - margin}
              y2={yPosition}
              stroke="lightgray"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Eixo X */}
        <Line
          x1={margin}
          y1={height - margin}
          x2={width - margin}
          y2={height - margin}
          stroke="black"
          strokeWidth={1}
        />
        {/* Eixo Y */}
        <Line
          x1={margin}
          y1={margin}
          x2={margin}
          y2={height - margin}
          stroke="black"
          strokeWidth={1}
        />
        {/* Rótulos do eixo X */}
        {Array.from({ length: 6 }, (_, i) => {
          const xValue = xMin + (i * (xMax - xMin)) / 5;
          return (
            <SvgText
              key={`x-label-${i}`}
              x={normalizeX(xValue)}
              y={height - margin + 15}
              fontSize="10"
              fill="black"
              textAnchor="middle"
            >
              {xValue.toFixed(1)}
            </SvgText>
          );
        })}
        <SvgText
          x={width / 2}
          y={height - margin + 30}
          fontSize="12"
          fill="black"
          textAnchor="middle"
        >
          Voltage (V)
        </SvgText>
        {/* Rótulos do eixo Y */}
        {Array.from({ length: 6 }, (_, i) => {
          const yValue = yMin + (i * (yMax - yMin)) / 5;
          return (
            <SvgText
              key={`y-label-${i}`}
              x={margin - 5}
              y={normalizeY(yValue) + 5}
              fontSize="10"
              fill="black"
              textAnchor="end"
            >
              {yValue.toFixed(1)}
            </SvgText>
          );
        })}
        <SvgText
          x={margin - 20}
          y={height / 2}
          fontSize="12"
          fill="black"
          textAnchor="middle"
          transform={`rotate(-90, ${margin - 30}, ${height / 2})`}
        >
          Current (mA)
        </SvgText>
        {/* Conjuntos de dados */}
        {datasets.map((dataset, index) => {
          const path = dataset.graphData.points
            .map((point, i) =>
              i === 0
                ? `M ${normalizeX(point.x)} ${normalizeY(point.y)}`
                : `L ${normalizeX(point.x)} ${normalizeY(point.y)}`
            )
            .join(" ");
          return (
            <Path
              key={`dataset-${index}`}
              d={path}
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth={2}
            />
          );
        })}
      </Svg>
      {/* Legenda */}
      <View style={styles.legendContainer}>
        {datasets.map((dataset, index) => (
          <View key={`legend-${index}`} style={styles.legendItem}>
            <View
              style={{
                ...styles.colorBox,
                backgroundColor: colors[index % colors.length],
              }}
            />
            <Text style={styles.legendText}>{dataset.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    marginVertical: 3,
  },
  colorBox: {
    width: 15,
    height: 15,
    marginRight: 5,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 12,
    color: "black",
  },
});

// Componente principal
export const GraphScreen: React.FC<{
  experiments: TExperiment[];
  actual: boolean;
  width_height: number;
}> = ({ experiments, actual, width_height }) => {
  const newExperiments = experiments.filter(
    (experiment) => experiment.graphData != null
  );

  if (newExperiments.length == 0 && !actual)
    return (
      <Text>No experiment data available for the selected experiments</Text>
    );
  if (newExperiments.length == 0 && actual) return <></>;
  return (
    <CyclicVoltammetryGraph
      height={width_height}
      width={width_height}
      datasets={newExperiments}
    />
  );
};
