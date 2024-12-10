import axios from "axios";
import { baseUrl } from "./config";
import { getValueForStore } from "./secureStore";

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