import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  getTeamExperiments,
  getUserExperiments,
  readEdsJsonFiles,
} from "@/app/libs/experiments";
import { ScrollView } from "react-native-gesture-handler";
import { getTeams } from "@/app/libs/teams";
import { TExperiment } from "@/types/experiments";
import ExperimentsGroup from "./experiments/ExperimentsGroup";
import NotesModal from "./experiments/NotesModal";
import { isUserLogged } from "@/app/libs/login";
import { useIsFocused } from "@react-navigation/native";

interface ExperimentsTabProps {
  setSelectedExperiments: (experiment: TExperiment, selected: boolean) => void;
}

const defaultExp: {
  user: TExperiment[];
  local: TExperiment[];
  team: TExperiment[];
} = { user: [], local: [], team: [] };

export default function ExperimentsTab({
  setSelectedExperiments,
}: ExperimentsTabProps) {
  const [experiments, setExperiments] = useState<{
    user: TExperiment[];
    local: TExperiment[];
    team: TExperiment[];
  }>(defaultExp);
  const [modal, setModal] = useState(false);
  const [noteExperiment, setNoteExperiment] = useState<TExperiment | null>(
    null
  );
  const [user, setUser] = useState<string | null>(null);
  const isFocused = useIsFocused();

  const handleGetExperiments = async () => {
    const startTime = performance.now();

    const exp = { ...defaultExp };
    if (user) {
      const [userExp, statusUserExp] = await getUserExperiments();
      const [teams, statusTeamsExp] = (await getTeams()) as [
        [{ id: string }],
        number
      ];
      for (var team of teams) {
        exp.team.concat(await getTeamExperiments(team.id));
      }
      if (statusUserExp == 200) exp.user = userExp;
    } else {
      exp.user = [];
      exp.team = [];
    }
    const localExp = await readEdsJsonFiles();
    exp.local = localExp;

    setExperiments({ ...exp });
    const endTime = performance.now(); // Fim da medição
    console.log(
      `handleGetExperiments levou ${(endTime - startTime).toFixed(2)}ms`
    );
  };

  const handleOpenNotes = (experiment: TExperiment) => {
    setNoteExperiment(experiment);
    setModal(true);
  };

  const handleGetUser = async () => {
    setUser(await isUserLogged());
  };

  useEffect(() => {
    console.log("Re-render");
  }, []);

  useEffect(() => {
    if (isFocused) handleGetUser();
  }, [isFocused]);

  useEffect(() => {
    handleGetExperiments();
  }, [user]);

  return (
    <>
      <View style={styles.tabTeamContent}>
        <ScrollView>
          <ExperimentsGroup
            experiments={experiments.local}
            handleOpenNotes={handleOpenNotes}
            setSelectedExperiments={setSelectedExperiments}
            title="Local Experiments"
            type="local"
          />
          <ExperimentsGroup
            experiments={experiments.user}
            handleOpenNotes={handleOpenNotes}
            setSelectedExperiments={setSelectedExperiments}
            title="User's Experiments"
            type="user"
          />
          <ExperimentsGroup
            experiments={experiments.team}
            handleOpenNotes={handleOpenNotes}
            setSelectedExperiments={setSelectedExperiments}
            title="Teams' Experiments"
            type="team"
          />
        </ScrollView>
      </View>
      <NotesModal
        modal={modal}
        noteExperiment={noteExperiment}
        setModal={setModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabTeamContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
