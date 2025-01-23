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
  selectedExperiments: TExperiment[];
  setSelectedExperiments: React.Dispatch<React.SetStateAction<TExperiment[]>>;
}

const defaultExp: {
  user: TExperiment[];
  local: TExperiment[];
  team: TExperiment[];
} = { user: [], local: [], team: [] };

export default function ExperimentsTab({
  selectedExperiments,
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
  const isFocused = useIsFocused();

  const handleGetExperiments = async () => {
    console.log("Get experiments");
    const user = await isUserLogged();
    console.log(user);
    const exp = defaultExp;
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
    console.log(exp);

    setExperiments(exp);
  };

  const handleOpenNotes = (experiment: TExperiment) => {
    setNoteExperiment(experiment);
    setModal(true);
  };

  useEffect(() => {
    console.log(isFocused);
    if (isFocused) handleGetExperiments();
  }, [isFocused]);

  return (
    <>
      <View style={styles.tabTeamContent}>
        <ScrollView>
          <ExperimentsGroup
            experiments={experiments.local}
            handleOpenNotes={handleOpenNotes}
            selectedExperiments={selectedExperiments}
            setSelectedExperiments={setSelectedExperiments}
            title="Local Experiments"
            type="local"
          />
          <ExperimentsGroup
            experiments={experiments.user}
            handleOpenNotes={handleOpenNotes}
            selectedExperiments={selectedExperiments}
            setSelectedExperiments={setSelectedExperiments}
            title="User's Experiments"
            type="user"
          />
          <ExperimentsGroup
            experiments={experiments.team}
            handleOpenNotes={handleOpenNotes}
            selectedExperiments={selectedExperiments}
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
