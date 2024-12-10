import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import { BleManager, Device, BleError, Characteristic } from "react-native-ble-plx";
import { Base64 } from "js-base64";
import { TextInput } from "react-native-paper";

export const bleManager = new BleManager();
let showDevicesWithoutName = false;
const DATA_SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"; // * Get from the device manufacturer - 9800 for the BLE iOs Tester App "MyBLESim"
const CHARACTERISTIC_UUID = "6d68efe5-04b6-4a85-abc4-c2670b7bf7fd"; // * Get from the device manufacturer - 9801-9805 for the BLE iOs Tester App "MyBLESim"
const CHARACTERISTIC_UUID_Param = "f27b53ad-c63d-49a0-8c0f-9f297e6cc520"; // * Get from the device manufacturer - 9801-9805 for the BLE iOs Tester App "MyBLESim"

export default function Potentiostat() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [dataReceived, setDataReceived] = useState<string>("...waiting.");
  const [messageToSend, setMessageToSend] = useState<string>("");

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

    // * IMPORTANT: The BLE iOs App "MyBLESim" is taking the input value, converting into asc2, and sending the base64 encoded value
    // * So, to get 4, I should insert 52 in the app, and it will send the base64 encoded value of 4
    // * To get 7, I should insert 55 in the app, and it will send the base64 encoded value of 7
    // * and so on...

    const dataInput = Base64.decode(characteristic.value);
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
        const encodedMessage = Base64.encode(messageToSend);
        await connectedDevice.writeCharacteristicWithResponseForService(
          DATA_SERVICE_UUID,
          CHARACTERISTIC_UUID_Param,
          encodedMessage
        );
        console.log("Message sent:", messageToSend);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    } else {
      console.warn("No device connected!");
    }
  }

  return (
    <>
      <View>
        <Text style={styles.textTitle}>Central Mode</Text>
        <Text style={styles.textTitle}>Listing Devices</Text>
        <View style={styles.containerButtons}>
          <Button title="Start" onPress={scanForPeripherals} />
          {/* TODO: Implement this button
        <Button
          title="Stop"
          onPress={() => {
            console.log("Stop Scanning");
            bleManager.stopDeviceScan;
          }}
        /> */}
          <Button title="Clear" onPress={() => setAllDevices([])}></Button>
          <Button
            title={showDevicesWithoutName ? "Hide Nameless" : "Show Nameless"}
            onPress={() => {
              showDevicesWithoutName = !showDevicesWithoutName;
              setAllDevices([...allDevices]);
              // !DEBUG: console.warn("Showing Devices Nameless: ", showDevicesWithoutName);
            }}></Button>
        </View>
        
          {allDevices.map((device) => {
            if(device.name)
              return <><Text>{device.name}</Text><Button
            key={`button${device.id}`}
            title="Connect"
            onPress={() => connectToDevice(device)}
          /></>
            
            return null
          })}
        
      </View>
      {connectedDevice && (
        <>
        <View style={styles.containerConnectedDevice}>
          <Text style={styles.textTitle}>Connected to Device: </Text>
          <View style={styles.containerDevices}>
            <Text>ID: {connectedDevice.id}</Text>
            <Text>Name: {connectedDevice.name}</Text>
            <Text>Data Received: {dataReceived} </Text>
          </View>
        </View>
        <TextInput
        style={styles.textInput}
        placeholder="Type a message"
        value={messageToSend}
        onChangeText={setMessageToSend}
      />
      <Button title="Send Message" onPress={sendMessageToDevice} />
      </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
});