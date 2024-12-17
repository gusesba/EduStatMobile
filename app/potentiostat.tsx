import React, { useEffect } from "react";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { BleManager, Device, BleError, Characteristic } from "react-native-ble-plx";
import { Base64 } from "js-base64";
import { Button, Modal, TextInput } from "react-native-paper";
import { GraphScreen } from "@/components/graphComponent";
import { TExperiment } from "./experiments";
import { ScrollView } from "react-native-gesture-handler";
import { createUserExperiment, saveJsonToFile, saveUserExperiment } from "./libs/experiments";
import { isUserLogged } from "./libs/login";

export const bleManager = new BleManager();
const DATA_SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"; // * Get from the device manufacturer - 9800 for the BLE iOs Tester App "MyBLESim"
const CHARACTERISTIC_UUID = "6d68efe5-04b6-4a85-abc4-c2670b7bf7fd"; // * Get from the device manufacturer - 9801-9805 for the BLE iOs Tester App "MyBLESim"
const CHARACTERISTIC_UUID_Param = "f27b53ad-c63d-49a0-8c0f-9f297e6cc520"; // * Get from the device manufacturer - 9801-9805 for the BLE iOs Tester App "MyBLESim"

export default function Potentiostat() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [dataReceived, setDataReceived] = useState<string>("...waiting.");
  const [minVoltage, setMinVoltage] = useState<string>("");
  const [maxVoltage, setMaxVoltage] = useState<string>("");
  const [step, setStep] = useState<string>("");
  const [delay, setDelay] = useState<string>("");
  const [points, setPoints] = useState<{ x: number, y: number }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [experimentName, setExperimentName] = useState('');
  const [userLogged, setUserLogged] = useState<string | null | undefined>(null);

  useEffect(() => {
    isUserLogged().then((a) => {
      setUserLogged(a);
    })
  }, [])

  const handleCreateExperiment = () => {
    saveJsonToFile(experimentName, {
      name: experimentName, id: experimentName, graphData: {
        points
      }, parameters: {
        minVoltage,
        maxVoltage,
        step,
        delay
      }
    })
  }

  const handleCreateExperimentUser = async () => {
    const [experiment, status] = await createUserExperiment(experimentName);

    experiment.graphData = { points };
    experiment.parameters = {
      minVoltage,
      maxVoltage,
      step,
      delay
    }

    saveUserExperiment(experiment);
  }

  const handleShowModal = () => {
    setShowModal(true)
  }

  const handleHideModal = () => {
    setShowModal(false)
  }


  // Managers Central Mode - Scanning for devices
  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;
  function scanForPeripherals() {
    console.log("Scanning for peripherals...");
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
        if (device.name?.includes('Edu')) {
          connectToDevice(device)
          bleManager.stopDeviceScan();
        }
      }
    });
  }

  // Decoding the data received from the device and defining the callback
  async function startStreamingData(device: Device) {
    if (device) {
      device.monitorCharacteristicForService(DATA_SERVICE_UUID, CHARACTERISTIC_UUID, onDataUpdate);
    } else {
      console.log("No Device Connected");
    }
  }

  // Called when data is received on the connected device
  const onDataUpdate = (error: BleError | null, characteristic: Characteristic | null) => {
    if (error) {
      console.error(error);
      return;
    } else if (!characteristic?.value) {
      console.warn("No Data was received!");
      return;
    }

    const dataInput = Base64.decode(characteristic.value);

    // Divida a string por linhas
    const lines = dataInput.split('\n'); // ["sentVoltage 1.234", "MeasuredVoltage 5.678"]

    // Extraia os valores e crie o objeto
    const result = {
      x: parseFloat(lines[0]), // Pega "1.234" e converte para número
      y: parseFloat(lines[1]) // Pega "5.678" e converte para número
    };


    setPoints((state)=>[...state,result])

    setDataReceived(dataInput);
  };

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
        const encodedMessage = Base64.encode(`${minVoltage} ${maxVoltage} ${step} ${delay} 1`);
        await connectedDevice.writeCharacteristicWithResponseForService(
          DATA_SERVICE_UUID,
          CHARACTERISTIC_UUID_Param,
          encodedMessage
        );
        console.log("Message sent:", `${minVoltage} ${maxVoltage} ${step} ${delay} 1`);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    } else {
      console.warn("No device connected!");
    }
  }

  return (
    <>
      <ScrollView>
        <View>
          <View style={styles.containerButtons}>
            <Button mode="contained" onPress={scanForPeripherals}>{connectedDevice ? 'Disconnect' : 'Connect'}</Button>
          </View>
        </View>
        {connectedDevice && (
          <>
            <View style={styles.containerScreen2}>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput2}
                    placeholder="Min Voltage"
                    value={minVoltage}
                    onChangeText={setMinVoltage}
                  />
                  <TextInput
                    style={styles.textInput2}
                    placeholder="Max Voltage"
                    value={maxVoltage}
                    onChangeText={setMaxVoltage}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput2}
                    placeholder="Step"
                    value={step}
                    onChangeText={setStep}
                  />
                  <TextInput
                    style={styles.textInput2}
                    placeholder="Delay"
                    value={delay}
                    onChangeText={setDelay}
                  />
                </View>
              </View>
              <GraphScreen experiments={points.length > 1 ? [{
                id: 'Experimento Atual', name: 'Experimento Atual', graphData: {
                  points
                }
              } as TExperiment] : []} actual={true} />
              <View style={styles.buttonContainer}>
                <Button mode='contained' onPress={sendMessageToDevice}>Start Measurement</Button>
                <Button mode='contained' onPress={handleShowModal}>Save</Button>
              </View>
            </View>

          </>
        )}
      </ScrollView>
      <Modal visible={showModal} onDismiss={handleHideModal} contentContainerStyle={styles.modalContainer}>
        <TextInput
          mode="outlined"
          label="Experiment Name"
          value={experimentName}
          onChangeText={text => setExperimentName(text)}
        />
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handleHideModal} >
            Close
          </Button>
          <Button mode="contained" onPress={handleCreateExperiment} >
            Save Local
          </Button>
          {userLogged && <Button mode="contained" onPress={handleCreateExperimentUser} >
            Save for User
          </Button>}

        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
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
    gap: 5
  },
});