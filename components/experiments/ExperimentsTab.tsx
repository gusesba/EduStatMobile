import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { getUserExperiments, readEdsJsonFiles } from "@/app/libs/experiments";
import { ScrollView } from "react-native-gesture-handler";
import { getTeams } from "@/app/libs/teams";
import { TExperiment } from "@/types/experiments";
import ExperimentsGroup from "./experiments/ExperimentsGroup";
import NotesModal from "./experiments/NotesModal";
import { isUserLogged } from "@/app/libs/login";

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
  const [eexperiments, setEexperiments] = useState<{
    user: TExperiment[];
    local: TExperiment[];
    team: TExperiment[];
  }>(defaultExp);
  const [modal, setModal] = useState(false);
  const [noteExperiment, setNoteExperiment] = useState<TExperiment | null>(
    null
  );

  const handleGetExperiments = async () => {
    const user = await isUserLogged()
    const exp = defaultExp;
    if(user){
      const [userExp, statusUserExp] = await getUserExperiments();
      const [teamsExp, statusTeamsExp] = await getTeams();
      if (statusUserExp == 200) exp.user = userExp;
      if (statusTeamsExp == 200) exp.team = teamsExp;
    }
    else{
      exp.user = []
      exp.team = []
    }
    const localExp = await readEdsJsonFiles();
    exp.local = localExp;

    setEexperiments(exp);
  };

  const handleOpenNotes = (experiment: TExperiment) => {
    setNoteExperiment(experiment);
    setModal(true);
  };

  useEffect(() => {
    handleGetExperiments();
  }, []);

  return (
    <>
      <View style={styles.tabTeamContent}>
        <ScrollView>
          <ExperimentsGroup
            experiments={eexperiments.local}
            handleOpenNotes={handleOpenNotes}
            selectedExperiments={selectedExperiments}
            setSelectedExperiments={setSelectedExperiments}
            title="Local Experiments"
            type="local"
          />
          <ExperimentsGroup
            experiments={eexperiments.user}
            handleOpenNotes={handleOpenNotes}
            selectedExperiments={selectedExperiments}
            setSelectedExperiments={setSelectedExperiments}
            title="User's Experiments"
            type="user"
          />
          <ExperimentsGroup
            experiments={eexperiments.team}
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
