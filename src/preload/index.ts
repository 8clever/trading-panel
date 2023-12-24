import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { v4 } from 'uuid';
import { exchanges } from 'ccxt';

function exchangeApi (...args: object[]) {
  const msgid = v4();
  return new Promise((res, rej) => {
    ipcRenderer.once(msgid, (_e, ...response) => {
      const [ err, result ] = response
      
      if (err)
        return rej(err)

      res(result)
    });
    ipcRenderer.send('exchangeApi', msgid, ...args)
  })
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('exchanges', exchanges)
    contextBridge.exposeInMainWorld('exchangeApi', exchangeApi)
  } catch (error) {
    console.error(error)
  }
}
