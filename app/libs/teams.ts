import axios from 'axios';
import { getValueForStore } from './secureStore';
import { baseUrl } from './config';

export const createTeam = async (name: string) => {
    const user_token = await getValueForStore('user_token'); // Certifique-se de que o método retorna uma Promise
    if (!user_token) {
        alert("User must be signed in!");
        return;
    }
    try {
        const response = await axios({
            method: 'post',
            url: baseUrl + '/create-team',
            headers: {
                Authorization: `Bearer ${user_token}` // Adiciona o token no cabeçalho
            },
            data: {
                name
            },
        });
        return response.status;
    } catch (error: any) {
        return error.response?.status || 500; // Retorna 500 como fallback se `response` não existir
    }
};

export const getTeams = async () => {
    const user_token = await getValueForStore('user_token'); 
    if (!user_token) {
        alert("User must be signed in!");
        return [[],0];
    }
    try {
        const response = await axios({
            method:'post',
            url: baseUrl + '/get-teams-user',
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

export const getUsers = async (teamId:string) => {
    const user_token = await getValueForStore('user_token'); 
    if (!user_token) {
        alert("User must be signed in!");
        return [[],0];
    }
    try {
        const response = await axios({
            method:'post',
            url: baseUrl + '/get-users-team',
            headers: {
                Authorization: `Bearer ${user_token}` // Adiciona o token no cabeçalho
            },
            data: {
                teamId
            },
        })
        return [response.data,response.status]
    }
    catch (error: any) {
        return [error,error.response?.status || 500]; // Retorna 500 como fallback se `response` não existir
    }
}


export const getInvites = async () => {
    const user_token = await getValueForStore('user_token'); 
    if (!user_token) {
        alert("User must be signed in!");
        return [[],0];
    }
    try {
        const response = await axios({
            method:'post',
            url: baseUrl + '/get-user-invites',
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

export const sendInvite = async (email:string,role:string,teamId:string) => {
    const user_token = await getValueForStore('user_token'); 
    if (!user_token) {
        alert("User must be signed in!");
        return [[],0];
    }
    try {
        const response = await axios({
            method:'post',
            url: baseUrl + '/send-team-invite',
            headers: {
                Authorization: `Bearer ${user_token}` // Adiciona o token no cabeçalho
            },
            data:{
                email,
                teamId,
                role
            },
        })
        return [response.data,response.status]
    }
    catch (error: any) {
        if(error.response?.data?.message == "User not found")
            alert("User not found!")
        
        return [error,error.response?.status || 500]; // Retorna 500 como fallback se `response` não existir
    }
}

export const acceptInvite = async (inviteId: string) => {
    const user_token = await getValueForStore('user_token'); 
    if (!user_token) {
        alert("User must be signed in!");
        return [[],0];
    }

    try {
        const response = await axios({
            method:'post',
            url: baseUrl + '/sign-up-team',
            headers: {
                Authorization: `Bearer ${user_token}` // Adiciona o token no cabeçalho
            },
            data:{
                inviteId
            },
        })
        return [response.data,response.status]
    }
    catch (error: any) {
        return [error,error.response?.status || 500]; // Retorna 500 como fallback se `response` não existir
    }
}