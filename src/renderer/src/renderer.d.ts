import type { Exchange } from 'ccxt'
import { Provider } from './components/entities'

type exchangeApi<Method = keyof Exchange, FN = Exchange[Method]> = (provider: Provider, method: Method, ...args: Parameters<FN>) => ReturnType<FN>;

declare global {
  interface Window {
    exchangeApi: exchangeApi;
    exchanges: string[]
  }
}