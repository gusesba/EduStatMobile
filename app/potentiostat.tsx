import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  BleManager,
  Device,
  BleError,
  Characteristic,
} from "react-native-ble-plx";
import { Base64 } from "js-base64";
import { Button, Modal, TextInput } from "react-native-paper";
import { GraphScreen } from "@/components/graphComponent";
import { TExperiment } from "@/types/experiments";
import { ScrollView } from "react-native-gesture-handler";
import {
  createTeamExperiment,
  createUserExperiment,
  saveJsonToFile,
  saveTeamExperiment,
  saveUserExperiment,
} from "./libs/experiments";
import { isUserLogged } from "./libs/login";
import { useIsFocused } from "@react-navigation/native";
import { getTeams } from "./libs/teams";
import { Picker } from "@react-native-picker/picker";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";

export const bleManager = new BleManager();
const DATA_SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"; // * Get from the device manufacturer - 9800 for the BLE iOs Tester App "MyBLESim"
const CHARACTERISTIC_UUID = "6d68efe5-04b6-4a85-abc4-c2670b7bf7fd"; // * Get from the device manufacturer - 9801-9805 for the BLE iOs Tester App "MyBLESim"
const CHARACTERISTIC_UUID_Param = "f27b53ad-c63d-49a0-8c0f-9f297e6cc520"; // * Get from the device manufacturer - 9801-9805 for the BLE iOs Tester App "MyBLESim"

export default function Potentiostat() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [minVoltage, setMinVoltage] = useState<string>("");
  const [maxVoltage, setMaxVoltage] = useState<string>("");
  const [step, setStep] = useState<string>("");
  const [delay, setDelay] = useState<string>("");
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [experimentName, setExperimentName] = useState("");
  const [userLogged, setUserLogged] = useState<string | null | undefined>(null);
  const [teams, setTeams] = useState<{ name: string; id: string }[]>([]);
  const [expTeam, setExpTeam] = useState("");
  const isFocused = useIsFocused();
  const [lastData, setLastData] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(0);
  // const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isUserLogged().then((a) => {
      setUserLogged(a);
    });
    //Zerando variaveis de estado
    //setLastData("0\n0");
    setTeams([]);
    setMinVoltage("");
    setMaxVoltage("");
    setStep("");
    setDelay("");
    setPoints([]);
    setExperimentName("");
    setShowModal(false);
  }, [isFocused]);

  useEffect(() => {
    if (userLogged) {
      getTeamsHandler();
    }
  }, [userLogged, isFocused]);
  useEffect(() => {
    if (estimatedTime > 0) {
      const interval = setInterval(() => {
        setEstimatedTime(estimatedTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    // else if (estimatedTime <= 0 && intervalRef.current) {
    //   stopSimulation();
    // }
  }, [estimatedTime]);
  const getTeamsHandler = async () => {
    const [teams, status] = await getTeams();

    if (status == 200) {
      setTeams(teams);
    } else alert("Error Getting Teams!");
  };

  const handleCreateExperiment = async () => {
    const fileUri = await saveJsonToFile(experimentName, {
      name: experimentName,
      id: experimentName,
      graphData: {
        points,
      },
      parameters: {
        minVoltage,
        maxVoltage,
        step,
        delay,
      },
    });
    if (fileUri) alert("Experiment Saved!");
    else alert("Error saving experiment!");
  };

  const handleCreateExperimentUser = async () => {
    const [experiment, _] = await createUserExperiment(experimentName);

    experiment.graphData = { points };
    experiment.parameters = {
      minVoltage,
      maxVoltage,
      step,
      delay,
    };

    await saveUserExperiment(experiment);

    alert("Experiment Saved!");
  };

  const handleCreateExperimentTeam = async () => {
    const [experiment, _] = await createTeamExperiment(experimentName, expTeam);

    experiment.graphData = { points };
    experiment.parameters = {
      minVoltage,
      maxVoltage,
      step,
      delay,
    };

    await saveTeamExperiment(experiment, expTeam);

    alert("Experiment Saved!");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  // Managers Central Mode - Scanning for devices
  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;
  function scanForPeripherals() {
    console.log("Scanning for peripherals...");
    bleManager.stopDeviceScan();
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
      }
      if (device) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
        if (device.name?.includes("Edu")) {
          connectToDevice(device);
          //bleManager.stopDeviceScan();
        }
      }
    });
  }

  // Decoding the data received from the device and defining the callback
  async function startStreamingData(device: Device) {
    if (device) {
      device.monitorCharacteristicForService(
        DATA_SERVICE_UUID,
        CHARACTERISTIC_UUID,
        onDataUpdate
      );
    } else {
      console.log("No Device Connected");
    }
  }

  // Called when data is received on the connected device
  const onDataUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.error(error);
      return;
    } else if (!characteristic?.value) {
      console.warn("No Data was received!");
      return;
    }

    try {
      const dataInput = Base64.decode(characteristic.value);
      setLastData(dataInput);
      // Divida a string por linhas
      const lines = dataInput.split("\n"); // ["1.234", "5.678"]

      // Extraia os valores e crie o objeto atual
      const newPoint = {
        x: parseFloat(lines[0]), // Converte para número
        y: parseFloat(lines[1]), // Converte para número
      };

      setPoints((state) => {
        // Combine o novo ponto com os últimos 10 pontos existentes
        //const lastTenPoints = state.slice(-10); // Pega os últimos 10 pontos
        //const allPoints = [...lastTenPoints, newPoint]; // Adiciona o novo ponto

        // Calcule as médias de x e y
        // const avgX = allPoints.reduce((sum, point) => sum + point.x, 0) / allPoints.length;
        // const avgY = allPoints.reduce((sum, point) => sum + point.y, 0) / allPoints.length;

        // Cria o ponto médio
        // const averagedPoint = { x: avgX, y: avgY };

        // Adiciona o ponto médio ao estado
        return [...state, newPoint];
      });
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };
  // const startSimulation = () => {
  //   if (intervalRef.current) return; // Evita múltiplas execuções

  //   let step = 0;
  //   const totalSteps = 200;
  //   const range = 2;
  //   let direction = 1;
  //   let x = -range;
  //   const stepSize = (range * 2) / totalSteps;

  //   intervalRef.current = setInterval(() => {
  //     if (step >= totalSteps) {
  //       direction *= -1; // Inverte a direção
  //       step = 0;
  //     }

  //     x += direction * stepSize;
  //     const noise = (Math.random() - 0.5) * 0.2; // Ruído aleatório
  //     const y = direction === 1 ? -(x * x) + noise + 4 : x * x + noise - 4;

  //     setPoints(prev => [...prev, { x, y }]);
  //     setLastData(`${x}\n${y}`);

  //     step++;
  //   }, 50);
  // };

  // const stopSimulation = () => {
  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current);
  //     intervalRef.current = null;
  //   }
  // };
  // Managers Central Mode - Connecting to a device
  async function connectToDevice(device: Device) {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
    } catch (e) {
      console.error("FAILED TO CONNECT", e);
    }
  }

  async function sendMessageToDevice() {
    if (connectedDevice) {
      try {
        setEstimatedTime(0);

        // Criar variáveis temporárias corrigidas
        const correctedMinVoltage = minVoltage.replace(",", ".");
        const correctedMaxVoltage = maxVoltage.replace(",", ".");
        const correctedStep = step.replace(",", "").replace(".", "");
        const correctedDelay = delay.replace(",", "").replace(".", "");

        // Atualizar o estado (mas não depender dele imediatamente)
        setMinVoltage(correctedMinVoltage);
        setMaxVoltage(correctedMaxVoltage);
        setStep(correctedStep);
        setDelay(correctedDelay);

        console.log(correctedMinVoltage);
        console.log(parseFloat(correctedMinVoltage));

        // Verificações com os valores corrigidos
        if (
          correctedMinVoltage === "" ||
          correctedMaxVoltage === "" ||
          correctedStep === "" ||
          correctedDelay === ""
        )
          return alert("Please fill all fields!");

        if (
          parseFloat(correctedMinVoltage) < -2 ||
          parseFloat(correctedMinVoltage) > 2
        )
          return alert("Min Voltage must be between -2 and 2!");

        if (
          parseFloat(correctedMaxVoltage) < -2 ||
          parseFloat(correctedMaxVoltage) > 2
        )
          return alert("Max Voltage must be between -2 and 2!");

        if (parseFloat(correctedStep) < 50 || parseFloat(correctedStep) > 500)
          return alert("Step must be between 50 and 500!");

        if (parseFloat(correctedDelay) < 50 || parseFloat(correctedDelay) > 500)
          return alert("Delay must be between 50 and 500 ms!");

        if (parseFloat(correctedMinVoltage) >= parseFloat(correctedMaxVoltage))
          return alert("Min Voltage must be less than Max Voltage!");

        const estimatedTimeCalc =
          (2 * parseInt(correctedStep) * parseFloat(correctedDelay)) / 1000;
        setEstimatedTime(estimatedTimeCalc + 5);
        // Criar mensagem e enviar
        const encodedMessage = Base64.encode(
          `${correctedMinVoltage} ${correctedMaxVoltage} ${correctedStep} ${correctedDelay} 1`
        );
        //startSimulation();
        await connectedDevice.writeCharacteristicWithResponseForService(
          DATA_SERVICE_UUID,
          CHARACTERISTIC_UUID_Param,
          encodedMessage
        );

        console.log(
          "Message sent:",
          `${correctedMinVoltage} ${correctedMaxVoltage} ${correctedStep} ${correctedDelay} 1`
        );
      } catch (error) {
        setEstimatedTime(0);
        console.error("Failed to send message:", error);
      }
    } else {
      setEstimatedTime(0);
      console.warn("No device connected!");
    }
  }

  return (
    <>
      <ScrollView>
        <View>
          <View style={styles.containerButtons}>
            <Button mode="contained" onPress={scanForPeripherals}>
              {connectedDevice ? "Disconnect" : "Connect"}
            </Button>
          </View>
        </View>
        {/* {connectedDevice && ( 
        <>*/}
        <View>
          <View style={styles.containerScreen2}>
            <Text className="text-center mb-2 text-lg">
              Fill in all the parameters for measurement with the potentiostat.
              After this, simply click "Start Measurement."
            </Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <View style={{ width: "50%" }}>
                  <Text style={{ color: "gray" }}>
                    {"Min Voltage (>= -2 V)"}
                  </Text>
                  <TextInput
                    style={styles.textInput2}
                    keyboardType="numeric"
                    placeholder="Min Voltage"
                    value={minVoltage}
                    onChangeText={setMinVoltage}
                  />
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={{ color: "gray" }}>
                    {"Max Voltage (<= 2 V)"}
                  </Text>
                  <TextInput
                    style={styles.textInput2}
                    placeholder="Max Voltage"
                    keyboardType="numeric"
                    value={maxVoltage}
                    onChangeText={setMaxVoltage}
                  />
                </View>
              </View>
              <View style={styles.inputWrapper}>
                <View style={{ width: "50%" }}>
                  <Text style={{ color: "gray" }}>Step [50, 500]</Text>
                  <TextInput
                    style={styles.textInput2}
                    placeholder="Step"
                    keyboardType="numeric"
                    value={step}
                    onChangeText={setStep}
                  />
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={{ color: "gray" }}>Delay [50 ms, 500 ms]</Text>
                  <TextInput
                    style={styles.textInput2}
                    placeholder="Delay"
                    keyboardType="numeric"
                    value={delay}
                    onChangeText={setDelay}
                  />
                </View>
              </View>
            </View>
            {lastData !== "" && (
              <>
                <View className="items-center justify-center border-2 border-color1 mx-16 my-8 p-4 rounded-lg bg-color4">
                  <Text className="text-purple-900 text-lg font-bold">
                    Last Data Received
                  </Text>

                  {lastData.includes("\n") ? (
                    <>
                      <Text className="text-color2">
                        Voltage:{" "}
                        {parseFloat(lastData.split("\n")[0] || "0").toFixed(8)}V
                      </Text>
                      <Text className="text-color2">
                        Current:{" "}
                        {parseFloat(lastData.split("\n")[1] || "0").toFixed(8)}A
                      </Text>
                    </>
                  ) : (
                    <Text className="text-red-500 text-sm">
                      Invalid data format
                    </Text>
                  )}
                  {estimatedTime > 0 && (
                    <>
                      <Text> Estimated time remaining: {estimatedTime}s</Text>
                    </>
                  )}
                </View>
              </>
            )}

            <GraphScreen
              experiments={
                points.length > 1
                  ? [
                    {
                      id: "Experimento Atual",
                      name: "Experimento Atual",
                      graphData: {
                        points,
                      },
                    } as TExperiment,
                  ]
                  : []
              }
              actual={true}
              width_height={400}
            />
            <View style={styles.buttonContainer}>
              {points.length > 0 && (
                <Button
                  mode="contained"
                  onPress={() => {
                    setPoints([]);
                    setEstimatedTime(0);
                  }}
                >
                  Clear
                </Button>
              )}
              <Button mode="contained" onPress={sendMessageToDevice}>
                Start Measurement
              </Button>
              <Button mode="contained" onPress={handleShowModal}>
                Save
              </Button>
            </View>
          </View>
        </View>
        {/* </>
        )} */}
      </ScrollView>
      <Modal
        visible={showModal}
        onDismiss={handleHideModal}
        contentContainerStyle={styles.modalContainer}
      >
        <TextInput
          mode="outlined"
          label="Experiment Name"
          value={experimentName}
          onChangeText={(text) => setExperimentName(text)}
        />
        {userLogged && (
          <Picker
            selectedValue={expTeam}
            onValueChange={(itemValue) => setExpTeam(itemValue)}
            style={styles.picker}
          >
            {teams.map((team) => (
              <Picker.Item label={team.name} value={team.id} />
            ))}
          </Picker>
        )}
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handleHideModal}>
            Close
          </Button>
          <Button mode="contained" onPress={handleCreateExperiment}>
            Save Local
          </Button>
          {userLogged && (
            <Button mode="contained" onPress={handleCreateExperimentUser}>
              Save for User
            </Button>
          )}
          {userLogged && (
            <Button mode="contained" onPress={handleCreateExperimentTeam}>
              Save for Team
            </Button>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 40,
  },
  containerScreen: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 12,
    padding: 24,
  },
  containerMain: {
    flex: 1,
    flexDirection: "column",
  },
  containerDevices: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    padding: 12,
  },
  containerButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 24,
  },
  containerConnectedDevice: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#f0f0f0",
  },
  viewDevice: {
    flexDirection: "row",
  },

  textTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  containerScreen2: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 24,
  },
  inputContainer: {
    flexDirection: "column",
    gap: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  textInput2: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    paddingVertical: 12,
    gap: 5,
  },
  picker: {
    height: 50,
    marginBottom: 15,
  },
});
