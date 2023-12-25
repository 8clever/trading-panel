import * as ccxt from "ccxt";
import { ipcMain, IpcMainEvent } from "electron";

interface Provider {
	id: string;
	provider: string;
}

export class ExchangeApi {

	private readonly exchangeApiKey = 'exchangeApi'

	constructor () {}

	init () {
		ipcMain.on(this.exchangeApiKey, this.handleExchangeRequest);
	}

	destroy () {
		ipcMain.off(this.exchangeApiKey, this.handleExchangeRequest);
	}

	private readonly exchanges: Map<string, ccxt.Exchange> = new Map();

	private getOrCreateExchange (provider: Provider) {
		if (this.exchanges.has(provider.id))
			return this.exchanges.get(provider.id);

		const ex = new ccxt[provider.provider](provider);
		this.exchanges.set(provider.id, ex);
		return ex;
	}

	private handleExchangeRequest = async (evt: IpcMainEvent, ...args: any[]) => {
		const [ msgid, provider, method, ...params ] = args
		try {
			const ex = this.getOrCreateExchange(provider);
			const result = await ex[method](...params);
			evt.reply(msgid, null, result);
		} catch (e) {
			evt.reply(msgid, e)
		}
	}
}