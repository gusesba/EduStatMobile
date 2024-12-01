import axios from 'axios';
import {baseUrl} from './config'

import { saveStore } from './secureStore';

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
        await saveStore('user_token',response.data.token)

    return response.status 
    }
  catch(error : any)
  {
    return error.response?.status || 500; // Retorna 500 como fallback se `response` não existir
  }
  }