import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import { GraphScreen } from "../graphComponent";
import { Button } from "react-native-paper";
import { TExperiment } from "@/types/experiments";

interface GraphTabProps {
  selectedExperiments: TExperiment[];
}

export default function GraphTab({ selectedExperiments }: GraphTabProps) {
  const [noise, setNoise] = useState(false);
  const [meanExperiments, setMeanExperiments] = useState<TExperiment[]>([]);
  const [selectedNoiseExperiments, setSelectedNoiseExperiments] = useState<
    TExperiment[]
  >([]);

  const width = Dimensions.get("window").width;
  const handleCalculateMean = () => {
    var meanPoints: { x: number; y: number }[] | null = [];
    if (!noise)
      meanPoints = calculateMeanGraphFromExperiments(selectedExperiments);
    else
      meanPoints = calculateMeanGraphFromExperiments(selectedNoiseExperiments);
    if (meanPoints)
      setMeanExperiments([
        { name: "mean", graphData: { points: meanPoints } } as TExperiment,
      ]);
  };

  function calculateMeanGraphFromExperiments(
    experiments: TExperiment[]
  ): { x: number; y: number }[] | null {
    if (!experiments || experiments.length === 0) {
      return null;
    }

    experiments = experiments.filter((exp) => {
      return (
        exp.graphData && exp.graphData.points && exp.graphData.points.length > 0
      );
    });

    const len = experiments[0].graphData.points.length;

    for (var exp of experiments) {
      if (exp.graphData.points.length != len) {
        alert("Experiments should have the same parameters");
        return null;
      }
    }

    for (var i = 0; i < len; i++) {
      var x = experiments[0].graphData.points[i].x;
      for (var exp of experiments) {
        if (exp.graphData.points[i].x != x) {
          alert("Experiments should have the same parameters");
          return null;
        }
      }
    }
    var points: { x: number; y: number }[] = [];
    for (var i = 0; i < len; i++) {
      var total = 0;
      for (var exp of experiments) total += exp.graphData.points[i].y;
      points = [
        ...points,
        {
          x: experiments[0].graphData.points[i].x,
          y: total / experiments.length,
        },
      ];
    }
    return points;
  }

  const removeNoise = (experiment: TExperiment): TExperiment => {
    if (!experiment.graphData || !experiment.graphData.points)
      return experiment;

    const points = [...experiment.graphData.points]; // Preserva a imutabilidade
    const length = points.length;

    if (length === 0) return experiment;

    // Soma acumulada para otimização
    let cumulativeSum = 0;

    // Suavização para os primeiros 9 pontos
    for (let i = 0; i < Math.min(9, length); i++) {
      cumulativeSum += points[i].y;
      points[i] = { ...points[i], y: cumulativeSum / (i + 1) };
    }

    // Suavização para os pontos restantes
    for (let i = 9; i < length; i++) {
      cumulativeSum += points[i].y - (points[i - 10]?.y || 0);
      points[i] = { ...points[i], y: cumulativeSum / 10 };
    }

    return {
      ...experiment,
      graphData: { ...experiment.graphData, points },
    };
  };

  useEffect(() => {
    const noNoiseExp = selectedExperiments.map((exp) => removeNoise(exp));
    setSelectedNoiseExperiments(noNoiseExp);
  }, [selectedExperiments]);

  return (
    <View className="m-16">
      {noise ? (
        <GraphScreen
          width_height={width * 0.9}
          actual={false}
          experiments={selectedNoiseExperiments.concat(meanExperiments)}
        />
      ) : (
        <GraphScreen
          width_height={width * 0.9}
          actual={false}
          experiments={selectedExperiments.concat(meanExperiments)}
        />
      )}
      {selectedExperiments.filter((exp) => exp.graphData != null).length >
        0 && (
        <>
          <Button onPress={handleCalculateMean}>Mean</Button>
          <Button onPress={() => setNoise((noise) => !noise)}>
            {noise ? "Remove Noise" : "Add Noise"}
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
