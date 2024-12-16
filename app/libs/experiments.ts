import axios from "axios";
import { baseUrl } from "./config";
import { getValueForStore } from "./secureStore";
import * as FileSystem from 'expo-file-system';
import { TExperiment } from "../experiments";

export const getUserExperiments = async () => {
    const user_token = await getValueForStore('user_token'); 
    if (!user_token) {
        alert("User must be signed in!");
        return [[],0];
    }

    try {
        const response = await axios({
            method:'post',
            url: baseUrl + '/get-user-experiment',
            headers: {
                Authorization: `Bearer ${user_token}` // Adiciona o token no cabeçalho
            },
        })
        return [response.data,response.status]
    }
    catch (error: any) {
        return [error,error.response?.status || 500]; // Retorna 500 como fallback se `response` não existir
    }
}

export const getTeamExperiments = async (teamId:string) => {
    const user_token = await getValueForStore('user_token'); 
    if (!user_token) {
        alert("User must be signed in!");
        return [[],0];
    }

    try {
        const response = await axios({
            method:'post',
            url: baseUrl + '/get-team-experiment',
            headers: {
                Authorization: `Bearer ${user_token}` // Adiciona o token no cabeçalho
            },
            data:{
                teamId
            }
        })
        return [response.data,response.status]
    }
    catch (error: any) {
        return [error,error.response?.status || 500]; // Retorna 500 como fallback se `response` não existir
    }
}

export const deleteUserExperiment = async (experimentId:string) => {
  const user_token = await getValueForStore('user_token'); 
  if (!user_token) {
      alert("User must be signed in!");
      return [[],0];
  }

  try {
      const response = await axios({
          method:'post',
          url: baseUrl + '/delete-user-experiment',
          headers: {
              Authorization: `Bearer ${user_token}` // Adiciona o token no cabeçalho
          },
          data:{
              experimentId
          }
      })
      return [response.data,response.status]
  }
  catch (error: any) {
      return [error,error.response?.status || 500]; // Retorna 500 como fallback se `response` não existir
  }
}

export const readJsonFromFile = async (filename:string) => {
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    console.log('Reading file from:', fileUri);
    try {
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const jsonData = JSON.parse(fileContent);
      return jsonData;
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

export const saveJsonToFile = async (filename:string, jsonData:object) => {
    const fileUri = `${FileSystem.documentDirectory}eds${filename}`;
    try {
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(jsonData));
      console.log('File saved to:', fileUri);
      return fileUri;
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };


  // Function to list all files starting with "eds" in the directory
  export const listEdsFilesInDirectory = async () => {
    const directory = `${FileSystem.documentDirectory}`
    try {
      const files = await FileSystem.readDirectoryAsync(directory);
      // Filter files that start with "eds"
      const edsFiles = files.filter(file => file.startsWith('eds'));
      return edsFiles;
    } catch (error) {
      console.error('Error reading directory:', error);
      return []
    }
  };
  
  // Function to read JSON files starting with "eds"
  export const readEdsJsonFiles = async () => {
    try {
      const edsFiles = await listEdsFilesInDirectory();
  
      // Read each file and parse JSON
      const jsonFiles = [];
      for (const file of edsFiles) {
        const fileUri = `${FileSystem.documentDirectory}${file}`;
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        const jsonData = JSON.parse(fileContent);
        jsonFiles.push(jsonData);
      }
      return jsonFiles;
    } catch (error) {
      console.error('Error reading JSON files:', error);
      return []
    }
  };
  

  export const deleteJsonFile = async (filename:string) => {
    const fileUri = `${FileSystem.documentDirectory}eds${filename}`;
    try {
      await FileSystem.deleteAsync(fileUri);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  export const createUserExperiment = async(name:string)=> {
    const user_token = await getValueForStore('user_token'); 
    if (!user_token) {
        alert("User must be signed in!");
        return [[],0];
    }

    try {
        const response = await axios({
            method:'post',
            url: baseUrl + '/create-user-experiment',
            headers: {
                Authorization: `Bearer ${user_token}` // Adiciona o token no cabeçalho
            },
            data:{
                name
            }
        })
        return [response.data,response.status]
    }
    catch (error: any) {
        return [error,error.response?.status || 500]; // Retorna 500 como fallback se `response` não existir
    }
  }

  export const saveUserExperiment = async (experiment:TExperiment) => {
    console.log(experiment)
    const user_token = await getValueForStore('user_token'); 
    if (!user_token) {
        alert("User must be signed in!");
        return [[],0];
    }

    try {
        const response = await axios({
            method:'post',
            url: baseUrl + '/save-user-experiment',
            headers: {
                Authorization: `Bearer ${user_token}` // Adiciona o token no cabeçalho
            },
            data:{
                experimentId:experiment.id,
                graphData:experiment.graphData,
                parameters:experiment.parameters
            }
        })
        return [response.data,response.status]
    }
    catch (error: any) {
        return [error,error.response?.status || 500]; // Retorna 500 como fallback se `response` não existir
    }
  }