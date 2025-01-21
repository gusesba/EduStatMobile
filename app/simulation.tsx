import { CartesianChart, Scatter, useChartTransformState } from "victory-native";
import DropDownPicker from 'react-native-dropdown-picker'
import { Image, StyleSheet, View, Animated, Easing } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  ButtonText,

} from "@/components/ui/button"
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { useFont } from "@shopify/react-native-skia";
import data1 from '../assets/cyclic_voltammetry_measures/teste_antes.json';
import data2 from '../assets/cyclic_voltammetry_measures/teste_depois.json';
import Antes_caracterizacao_SPEAu_polido_H2SO4_1M from '../assets/cyclic_voltammetry_measures/Antes_caracterizacao_SPEAu_polido_H2SO4_1M.json';
import Antes_caracterizacao_SPEAu_puro_H2SO4_1M from '../assets/cyclic_voltammetry_measures/Antes_caracterizacao_SPEAu_puro_H2SO4_1M.json';
import Antes_caracterizacao_SPEAu_puro_HNO3_1M from '../assets/cyclic_voltammetry_measures/Antes_caracterizacao_SPEAu_puro_HNO3_1M.json';
import Antes_caracterizacao_SPEAu_puro_NaOH_1M from '../assets/cyclic_voltammetry_measures/Antes_caracterizacao_SPEAu_puro_NaOH_1M.json';
import Antes_caracterizacao_SPEC_PPi_H2SO4_1M from '../assets/cyclic_voltammetry_measures/Antes_caracterizacao_SPEC_PPi_H2SO4_1M.json';
import Antes_caracterizacao_SPEC_PPi_HNO3_1M from '../assets/cyclic_voltammetry_measures/Antes_caracterizacao_SPEC_PPi_HNO3_1M.json';
import Antes_caracterizacao_SPEC_PPi_NaOH_1M from '../assets/cyclic_voltammetry_measures/Antes_caracterizacao_SPEC_PPi_NaOH_1M.json';
import Depois_caracterizacao_SPEAu_polido_H2SO4_1M from '../assets/cyclic_voltammetry_measures/Depois_caracterizacao_SPEAu_polido_H2SO4_1M.json';
import Depois_caracterizacao_SPEAu_puro_H2SO4_1M from '../assets/cyclic_voltammetry_measures/Depois_caracterizacao_SPEAu_puro_H2SO4_1M.json';
import Depois_caracterizacao_SPEAu_puro_HNO3_1M from '../assets/cyclic_voltammetry_measures/Depois_caracterizacao_SPEAu_puro_HNO3_1M.json';
import Depois_caracterizacao_SPEAu_puro_NaOH_1M from '../assets/cyclic_voltammetry_measures/Depois_caracterizacao_SPEAu_puro_NaOH_1M.json';
import Depois_caracterizacao_SPEC_PPi_H2SO4_1M from '../assets/cyclic_voltammetry_measures/Depois_caracterizacao_SPEC_PPi_H2SO4_1M.json';
import Depois_caracterizacao_SPEC_PPi_HNO3_1M from '../assets/cyclic_voltammetry_measures/Depois_caracterizacao_SPEC_PPi_HNO3_1M.json';
import Depois_caracterizacao_SPEC_PPi_NaOH_1M from '../assets/cyclic_voltammetry_measures/Depois_caracterizacao_SPEC_PPi_NaOH_1M.json';


const electrodes_data = [
  {
    label: 'Gold SPE Electrode',
    value: '1',
    icon: () => <Image source={require('../assets/images/gold_spe.png')} style={styles.iconStyle} />
  },
  {
    label: 'Carbon SPE Electrode',
    value: '2',
    icon: () => <Image source={require('../assets/images/carbon_spe.jpg')} style={styles.iconStyle} />
  },
  // {
  //   label: 'Graphite Electrode',
  //   value: '3',
  //   icon: () => <Image source={require('../assets/images/graphite_electrode.jpg')} style={styles.iconStyle} />
  // },
];
const cleaning_methods_spec = [
  {
    label: '1M H₂SO₄ + Pyrrole',
    value: '1',
  },
  {
    label: '1M HNO₃ + Pyrrole',
    value: '2',
  },
  {
    label: '1M NaOH + Pyrrole',
    value: '3',
  },
];
const cleaning_methods_speau = [
  {
    label: '1M H₂SO₄',
    value: '4',
  },
  {
    label: '1M H₂SO₄ Polished',
    value: '5',
  },
  {
    label: '1M HNO₃',
    value: '6',
  },
  {
    label: '1M NaOH',
    value: '7',
  },
];

type Data = {
  voltage: number;
  current: number;
};

type Data2 = {
  voltage: number;
  current: number;
  current2: number | null;
};


const inter = require('../assets/fonts/SpaceMono-Regular.ttf');
if (!inter) {
  throw new Error("Font not found");
} else {
  console.log("Font found");
}

export default function Simulation() {

  const font = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), 12);

  const [electrodesOpen, setElectrodesOpen] = useState(false);
  const [electrodesValue, setElectrodesValue] = useState("1");
  const [electrodesItems, setElectrodesItems] = useState(electrodes_data);

  const [cleaningMethodsOpen, setCleaningMethodsOpen] = useState(false);
  const [cleaningMethodsValue, setCleaningMethodsValue] = useState(null);
  const [cleaningMethodsItems, setCleaningMethodsItems] = useState(cleaning_methods_spec);

  const [cleaningState, setCleaningState] = useState(0);
  const [visibleFirstData, setVisibleFirstData] = useState<Data[]>([{ voltage: 0, current: 0 }]);
  const [visibleSecondData, setVisibleSecondData] = useState<Data2[]>([{ voltage: 0, current: 0, current2: 0 }]);
  const [electrodes, setElectrodes] = useState("");
  const [loading, setLoading] = useState(0);

  const [DATA, setData] = useState<Data[]>([]);
  const [DATA2, setData2] = useState<Data[]>([]);
  const transformState = useChartTransformState();
  const [finished, setFinished] = useState(false);


  const translateY = useRef(new Animated.Value(0)).current;

  const cleaningValuesToData = () => {
    const cleaningMethodsValueCorrect = cleaningMethodsValue || '1';
    const cleaningDataMap = {
      '1': Antes_caracterizacao_SPEC_PPi_H2SO4_1M,
      '2': Antes_caracterizacao_SPEC_PPi_HNO3_1M,
      '3': Antes_caracterizacao_SPEC_PPi_NaOH_1M,
      '4': Antes_caracterizacao_SPEAu_puro_H2SO4_1M,
      '5': Antes_caracterizacao_SPEAu_polido_H2SO4_1M,
      '6': Antes_caracterizacao_SPEAu_puro_HNO3_1M,
      '7': Antes_caracterizacao_SPEAu_puro_NaOH_1M,
    };

    const depoisDataMap = {
      '1': Depois_caracterizacao_SPEC_PPi_H2SO4_1M,
      '2': Depois_caracterizacao_SPEC_PPi_HNO3_1M,
      '3': Depois_caracterizacao_SPEC_PPi_NaOH_1M,
      '4': Depois_caracterizacao_SPEAu_puro_H2SO4_1M,
      '5': Depois_caracterizacao_SPEAu_polido_H2SO4_1M,
      '6': Depois_caracterizacao_SPEAu_puro_HNO3_1M,
      '7': Depois_caracterizacao_SPEAu_puro_NaOH_1M,
    };

    const antesData = cleaningDataMap[cleaningMethodsValueCorrect];
    const depoisData = depoisDataMap[cleaningMethodsValueCorrect];

    if (antesData && depoisData) {
      const convertedData = antesData.map(item => ({
        voltage: parseFloat(item.voltage),
        current: parseFloat(item.current),
      }));
      setData(convertedData);

      const convertedData2 = depoisData.map(item => ({
        voltage: parseFloat(item.voltage),
        current: parseFloat(item.current),
      }));
      setData2(convertedData2);
    } else {
      console.error('Error converting cleaning values to data');
    }
  };

  useEffect(() => {
    if (cleaningState === 2) {
      translateY.setValue(0); // Reseta a animação

      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: 10,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -10,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [cleaningState]);



  //A cada o.5 segundos, atualiza o gráfico com um valor a mais de DATA
  useEffect(() => {
    if (cleaningState !== 1) return;
    const interval = setInterval(() => {
      setVisibleFirstData([...DATA.slice(0, visibleFirstData.length + 10)]);
    }, 10);
    return () => clearInterval(interval);
  }, [visibleFirstData, cleaningState]);

  useEffect(() => {
    if (cleaningState !== 3) return;

    // Inicializa com os campos `voltage`, `current`, e `current2` como null
    if (visibleSecondData.length === 1) {
      setVisibleSecondData(DATA.map((item) => ({ voltage: item.voltage, current: item.current, current2: null })));
    }

    const interval = setInterval(() => {
      // Encontra os índices dos primeiros 10 itens que têm `current2` como null
      const nextIndices = visibleSecondData
        .map((item, index) => (item.current2 === null ? index : -1))
        .filter((index) => index !== -1)
        .slice(0, 10); // Pega os 10 primeiros índices

      if (nextIndices.length > 0) {
        setVisibleSecondData((prev) => {
          const updated = [...prev];
          nextIndices.forEach((index) => {
            updated[index].current2 = DATA2[index].current;
          });
          return updated;
        });
      } else {
        setFinished(true);
        clearInterval(interval); // Para o intervalo quando todos os valores forem preenchidos
      }
    }, 1);

    return () => clearInterval(interval); // Limpa o intervalo ao desmont
  }
    , [visibleSecondData, DATA, cleaningState]);




  useEffect(() => {
    if (cleaningState === 2) {
      const timeout = setTimeout(() => {
        // Após o tempo de espera, muda o estado para 4
        setLoading(loading + 4);
      }, 100); // Espera 5 segundos (5000 milissegundos)
      if (loading >= 100) {
        setCleaningState(3);
      }
      return () => clearTimeout(timeout); // Limpa o timeout se o componente for desmontado ou o estado mudar
    }
  }, [cleaningState, loading]); // Dependência no cleaningState para monitorar mudanças
  useEffect(() => {
    if (electrodesValue === '1') {
      setCleaningMethodsItems(cleaning_methods_speau);
      setElectrodes("Gold SPE Electrode");
    } else if (electrodesValue === '2') {
      setCleaningMethodsItems(cleaning_methods_spec);
      setElectrodes("Carbon SPE Electrode");
    }
  }, [electrodesValue]);
  function Restart() {
    setCleaningState(0);
    setVisibleFirstData([{ voltage: 0, current: 0 }]);
    setVisibleSecondData([{ voltage: 0, current: 0, current2: 0 }]);
    setElectrodesValue("1");
    setCleaningMethodsValue(null);
    setElectrodesOpen(false);
    setCleaningMethodsOpen(false);
    setLoading(0);
    setFinished(false);
  }
  if (cleaningState === 0) {
    return (
      <View className="items-center flex-1 justify-center gap-10 ml-8 mr-8 mb-16">
        <Heading size="2xl" >Cleaning Simulator Screen</Heading>
        <Text size="lg" >On this screen, you can perform cyclic voltammetry using the selected (dirty) electrode. Afterward, choose a cleaning method, apply it, and observe how the measurements improve.</Text>
        <View className="z-20">
          <DropDownPicker
            placeholder='Select a type of electrode'
            open={electrodesOpen}
            value={electrodesValue}
            items={electrodes_data}
            setOpen={setElectrodesOpen}
            setValue={setElectrodesValue}
            setItems={setElectrodesItems}
            style={styles.dropdown}
            dropDownContainerStyle={styles.containerStyle}
            listItemContainerStyle={styles.containerListStyle}
          />
        </View>
        <View className="z-10">
          <DropDownPicker
            placeholder='Select a cleaning method'
            open={cleaningMethodsOpen}
            value={cleaningMethodsValue}
            items={cleaningMethodsItems}
            setOpen={setCleaningMethodsOpen}
            setValue={setCleaningMethodsValue}
            setItems={setCleaningMethodsItems}
            style={styles.dropdown}
            dropDownContainerStyle={styles.containerStyle}
            listItemContainerStyle={styles.containerListStyle}
          />
        </View>
        <Button size="lg" variant="outline" action="primary" onPress={() => {
          if (cleaningMethodsValue === null) {
            alert("Please select a cleaning method");
          } else {
            cleaningValuesToData();
            setCleaningState(1)
          }
        }
        } className="z-0 mb-20">
          <ButtonText>First Measure</ButtonText>
        </Button>
      </View>



    );
  }
  if (cleaningState === 1) {
    return (
      <View className="ml-6 mr-6">

        <View className="flex-1 justify-center mb-10 mt-10 items-center">
          {DATA.length !== visibleFirstData.length && (
            <Heading size="2xl">Measuring Cyclic Voltammetry</Heading>
          )}

          {DATA.length === visibleFirstData.length && (
            <Heading size="2xl">Cyclic Voltammetry Completed</Heading>
          )}
        </View>
        {DATA.length !== visibleFirstData.length && (
          <View className="h-2/3 justify-center mb-10">
            <Text size="lg" className="text-center ml-10">Current (A) x Potential Applied (V)</Text>
            <CartesianChart data={visibleFirstData} xKey="voltage" yKeys={["current"]}  >
              {/* 👇 render function exposes various data, such as points. */}
              {({ points }) => (
                <>
                  {/* Linha para highTmp */}
                  <Scatter points={points.current} color="black" radius={1} />
                </>
              )}
            </CartesianChart>
          </View>
        )}
        {DATA.length === visibleFirstData.length && (
          <View className="h-2/3 justify-center mb-10 relative">
            <Text className="absolute top-0 left-0 text-lg font-bold">Current (A)</Text>

            <CartesianChart data={visibleFirstData} xKey="voltage" yKeys={["current"]} axisOptions={{ font }} transformState={transformState.state}>
              {/* <CartesianChart data={visibleFirstData} xKey="voltage" yKeys={["current"]} transformState={transformState.state}> */}

              {/* 👇 render function exposes various data, such as points. */}
              {({ points }) => (
                <>
                  {/* Linha para highTmp */}
                  <Scatter points={points.current} color="black" radius={1} />
                </>
              )}
            </CartesianChart>
            <Text className="absolute bottom-0 right-0 text-lg font-bold">U (V)</Text>

          </View>
        )
        }

        {
          DATA.length === visibleFirstData.length && (
            <View className="flex-1 justify-center items-center">

              <Button size="lg" variant="outline" action="primary" className="items-center w-2/3 justify-center" onPress={() => setCleaningState(2)}>
                <ButtonText>Clean Electrodes</ButtonText>
              </Button>
            </View>
          )
        }
      </View >
    );
  } else if (cleaningState === 2) {
    return (
      <View className="flex-1 justify-center mb-10 mt-10 items-center gap-20 mr-6 ml-6">
        <Animated.Image
          source={require('../assets/images/celula_eletroquimica.png')}
          style={{ width: 120, height: 100, transform: [{ translateY }] }}
        />
        <Heading size="lg">Cleaning the {electrodes}</Heading>
        <Text size="lg">Please wait... </Text>
        <Progress value={loading} className="w-80 h-1">
          <ProgressFilledTrack className="h-1" />
        </Progress>
        <Animated.Image
          source={require('../assets/images/app_experiments.png')}
          style={{ width: 75, height: 150, transform: [{ translateY }] }}
        />
      </View>
    );
  } else if (cleaningState === 3) {
    return (
      <View className="ml-6 mr-6">
        <View className="flex-1 justify-center mb-10 mt-10 items-center gap-20">
          <Heading size="2xl">Compare After Cleaning</Heading>
        </View>
        {/* <Text size="lg" className="text-center ml-10">Current (A) x Potential Applied (V)</Text> */}
        {finished && (
          <View className="h-2/3 justify-center mb-10 relative">
            <Text className="absolute top-0 left-0 text-lg font-bold">Current (A)</Text>
            <CartesianChart data={visibleSecondData} xKey="voltage" yKeys={["current", "current2"]} axisOptions={{ font }} transformState={transformState.state}>
              {/* <CartesianChart data={visibleSecondData} xKey="voltage" yKeys={["current", "current2"]} transformState={transformState.state}> */}

              {/* 👇 render function exposes various data, such as points. */}
              {({ points }) => (
                <>
                  {/* Linha para highTmp */}
                  <Scatter points={points.current} color="gray" radius={1} />
                  {/* Linha para lowTmp */}
                  <Scatter points={points.current2} color="black" radius={1} />
                </>
              )}
            </CartesianChart>
            <Text className="absolute bottom-0 right-0 text-lg font-bold">U (V)</Text>
          </View>
        )}
        {!finished && (
          <View className="h-2/3 justify-center mb-10">
            <Text size="lg" className="text-center ml-10">Current (A) x Potential Applied (V)</Text>

            <CartesianChart data={visibleSecondData} xKey="voltage" yKeys={["current", "current2"]} >
              {/* 👇 render function exposes various data, such as points. */}
              {({ points }) => (
                <>
                  {/* Linha para highTmp */}
                  <Scatter points={points.current} color="gray" radius={1} />
                  {/* Linha para lowTmp */}
                  <Scatter points={points.current2} color="black" radius={1} />
                </>
              )}
            </CartesianChart>
          </View>
        )}
        <View className="flex-1 justify-center items-center">

          <Button size="lg" variant="outline" action="primary" className="items-center w-2/3 justify-center" onPress={Restart}>
            <ButtonText>Restart Cleaning</ButtonText>
          </Button>
        </View>
      </View >
    );

  }
}
const styles = StyleSheet.create({

  dropdown: {
    height: 80,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,

  },
  containerStyle: {
    height: 200,
  },
  containerListStyle: {
    height: 80,
  },

  iconStyle: {
    width: 60,
    height: 60,
  },

});