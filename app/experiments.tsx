import { GraphScreen } from "@/components/graphComponent";
import { useEffect, useState } from "react";
import { deleteJsonFile, deleteUserExperiment, getTeamExperiments, getUserExperiments, readEdsJsonFiles, saveJsonToFile } from "./libs/experiments";
import { StyleSheet, View } from "react-native";
import { BottomNavigation, Button, IconButton, Text } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { isUserLogged } from "./libs/login";

export type TExperiment = {
  id: string,
  name: string,
  graphData: {
    points: { x: number, y: number }[]
  }
  parameters: {
    maxV: number,
    minv: number,
    step: number,
    delay: number
  },
  notes: string,
  teamId: string,
  userId: string
}

export default function Experiment() {
  const [index, setIndex] = useState(0);
  const [selectedExperiments, setSelectedExperiments] = useState<TExperiment[]>([])
  const [meanExperiments, setMeanExperiments] = useState<TExperiment[]>([])
  const [routes] = useState([
    { key: 'experiments', title: 'Experiments', icon: 'account-group' },
    { key: 'notes', title: 'Notes', icon: 'account-group' },
    { key: 'graph', title: 'Graph', icon: 'account-group' },
  ]);
  const [experiments, setExperiments] = useState<TExperiment[]>([]);
  const [localExperiments, setLocalExperiments] = useState<TExperiment[]>([]);

  const [userLogged, setUserLogged] = useState<string | null | undefined>(null);

  useEffect(() => {
    isUserLogged().then((a) => {
      setUserLogged(a);
    })
  }, [])

  const handleDeleteLocal = (id: string) => {
    deleteJsonFile(id).then(() => handleGetLocalExperiments());
  }

  const handleDeleteUser = async (id: string) => {
    const [data, status] = await deleteUserExperiment(id);
    handleGetUserExperiments();
  }


  const renderScene = BottomNavigation.SceneMap({
    experiments: () => (
      <>
        <View style={styles.tabTeamContent}>
          <Text style={styles.expTitle}>Local Experiments</Text>
          {localExperiments.length > 0 ? (
            localExperiments.map((experiment) => {
              if (selectedExperiments.find((x) => x.id == experiment.id))
                return <View key={experiment.id} style={styles.teamNameSelected}><TouchableOpacity style={{ padding: 15 }} onPress={() => { setSelectedExperiments((experiments) => experiments.filter((ex) => ex.id != experiment.id)) }}><Text>{experiment.name}</Text></TouchableOpacity><IconButton onPress={() => handleDeleteLocal(experiment.id)} style={{ height: 20, margin: 0 }} icon="delete" /></View>
              return <View key={experiment.id} style={styles.teamName}><TouchableOpacity style={{ padding: 15 }} onPress={() => setSelectedExperiments((experiments) => [...experiments, experiment])}><Text>{experiment.name}</Text></TouchableOpacity><IconButton onPress={() => handleDeleteLocal(experiment.id)} style={{ height: 20, margin: 0 }} icon="delete" /></View>
            })
          ) : (
            <Text style={{ marginLeft: 10 }}>No Local Experiments Available.</Text>
          )}
          <Text style={styles.expTitle}>User Experiments</Text>
          {experiments.length > 0 ? (
            experiments.map((experiment) => {
              if (selectedExperiments.find((x) => x.id == experiment.id))
                return <View key={experiment.id} style={styles.teamNameSelected}><TouchableOpacity style={{ padding: 15 }} onPress={() => { setSelectedExperiments((experiments) => experiments.filter((ex) => ex.id != experiment.id)) }}><Text>{experiment.name}</Text></TouchableOpacity><IconButton onPress={() => handleDeleteUser(experiment.id)} style={{ height: 20, margin: 0 }} icon="delete" /></View>
              return <View key={experiment.id} style={styles.teamName}><TouchableOpacity style={{ padding: 15 }} onPress={() => setSelectedExperiments((experiments) => [...experiments, experiment])} ><Text>{experiment.name}</Text></TouchableOpacity><IconButton onPress={() => handleDeleteUser(experiment.id)} style={{ height: 20, margin: 0 }} icon="delete" /></View>
            })
          ) : (
            <Text style={{ marginLeft: 10 }}>No User Experiments Available.</Text>
          )}

        </View>
      </>
    ),
    graph: () => {
      return <View><GraphScreen actual={false} experiments={selectedExperiments.concat(meanExperiments)} /><Button onPress={handleCalculateMean}>Mean</Button></View>
    },
    notes: () => (
      <>
        <View>
          {selectedExperiments.map((experiment) => {
            if (!experiment.notes) return null
            return <View key={experiment.id}><Text style={styles.noteTitle}>{experiment.name}</Text><Text>{experiment.notes}</Text></View>
          })}
        </View>
      </>
    )
  })

  const handleCalculateMean = () => {
    const meanPoints = calculateMeanGraphFromExperiments(selectedExperiments);
    setMeanExperiments([{ name: 'mean', graphData: { points: meanPoints } } as TExperiment])
  }

  useEffect(() => {
    setMeanExperiments([])
  }, [selectedExperiments])

  function interpolateY(points: { x: number; y: number }[], x: number): number {
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      if (x >= p1.x && x <= p2.x) {
        // Linear interpolation formula
        return p1.y + ((x - p1.x) * (p2.y - p1.y)) / (p2.x - p1.x);
      }
    }
    // If x is out of bounds, return the nearest y-value
    return x < points[0].x ? points[0].y : points[points.length - 1].y;
  }

  // Function to calculate the mean graph from a list of TExperiment objects
  function calculateMeanGraphFromExperiments(experiments: TExperiment[]): { x: number; y: number }[] {
    if (!experiments || experiments.length === 0) {
      throw new Error("Experiment list cannot be empty.");
    }

    // Combine all unique x-values from the graphs
    const xValues = [
      ...new Set(
        experiments.flatMap(exp => exp.graphData.points.map(point => point.x))
      ),
    ].sort((a, b) => a - b);

    // Calculate mean points
    const meanPoints = xValues.map(x => {
      const yValues = experiments.map(exp => interpolateY(exp.graphData.points, x));
      const meanY = yValues.reduce((sum, y) => sum + y, 0) / yValues.length;
      return { x, y: meanY };
    });

    return meanPoints;
  }

  useEffect(() => {
    if (userLogged) {
      handleGetUserExperiments();
    }
  }, [userLogged])

  useEffect(() => {
    handleGetLocalExperiments();
  }, [])
  const handleGetUserExperiments = async () => {
    const [data, status] = await getUserExperiments();

    if (status == 200) {
      setExperiments(data);
    }
  }

  const handleGetLocalExperiments = async () => {
    const exp = await readEdsJsonFiles();
    setLocalExperiments(exp);
  }

  return <BottomNavigation
    navigationState={{ index, routes }}
    onIndexChange={setIndex}
    renderScene={renderScene}
    shifting={false} // Shifting animation for active tabs
  />
}

const styles = StyleSheet.create({
  tabTeamContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  teamNameSelected: {
    backgroundColor: '#ddd',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamName: {
    backgroundColor: '#eee',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  noteTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  expTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10
  },
})