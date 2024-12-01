import * as SecureStore from 'expo-secure-store';


export async function saveStore(key: string, value:string) {
    await SecureStore.setItemAsync(key, value);
  }
  
export async function getValueForStore(key:string) {
    let result = await SecureStore.getItemAsync(key);
    
    return result
  }

export async function removeStore(key: string) {
  await SecureStore.deleteItemAsync(key);
}