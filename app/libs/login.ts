import axios from 'axios';
import {baseUrl} from './config'

import { getValueForStore, saveStore } from './secureStore';

export const login = async (email:string,password:string) => {
    try{
      const response = await axios({
      method: "post",
      url: baseUrl+"/login",
      data: {
        email,
        password
      }
    });
    if(response.status == 201)
    {
        await saveStore('user_token',response.data.token)
        await saveStore('user_id',response.data.id)
    }

    return response.status 
    }
  catch(error : any)
  {
    return error.response?.status || 500; // Retorna 500 como fallback se `response` não existir
  }
}

export const register = async (email:string,password:string,name:string) => {
  try{
    const response = await axios({
    method: "post",
    url: baseUrl+"/register",
    data: {
      email,
      password,
      name
    }
  });

  return response.status 
  }
catch(error : any)
{
  return error.response?.status || 500; // Retorna 500 como fallback se `response` não existir
}
}

export const isUserLogged = async () => {
  return await getValueForStore('user_token');
}

export const profile = async () => {
  const user_token = await getValueForStore('user_token'); 
  if (!user_token) {
      alert("User must be signed in!");
      return [[],0];
  }

  try {
      const response = await axios({
          method:'get',
          url: baseUrl + '/me',
          headers: {
              Authorization: `Bearer ${user_token}` // Adiciona o token no cabeçalho
          }
      })
      console.log(response.data.user)
      return [response.data.user,response.status]
  }
  catch (error: any) {
      console.log(error)
      return [error,error.response?.status || 500]; // Retorna 500 como fallback se `response` não existir
  }
}