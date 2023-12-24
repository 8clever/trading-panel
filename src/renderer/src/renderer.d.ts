import type { Exchange } from 'ccxt'
import { Provider } from './components/entities'

declare global {
  interface Window {
    exchangeApi: (provider: Provider, method: keyof Exchange, ...args: Parameters<Exchange[keyof Exchange]>) => ReturnType<Exchange[keyof Exchange]> 
    exchanges: string[]
  }
}