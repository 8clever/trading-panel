import { v4 as uuid } from 'uuid'
import { Provider } from './entities';
export class Storage<T extends { id: string }> {

	constructor (private name: string) {
		this.withdraw();
	}

	private collection: Map<string, T> = new Map();

	private persist () {
		const array = Array.from(this.collection.values());
		localStorage.setItem(this.name, JSON.stringify(array))
	}

	private withdraw () {
		const str = localStorage.getItem(this.name);
		if (!str) return;

		for (const i of JSON.parse(str) as T[]) {
			this.collection.set(i.id, i);
		}
	}

	async save (obj: Partial<T>) {
		const upd = (obj.id ? { ...this.collection.get(obj.id), ...obj } : { ...obj, id: uuid() }) as T;
		this.collection.set(upd.id, this.copy(upd));
		this.persist();
	}

	async list (): Promise<T[]> {
		const list = Array.from(this.collection.values());
		return this.copy(list);
	}

	async findById (id: string): Promise<T | null> {
		const i = this.collection.get(id);
		return i ? this.copy(i) : null;
	}

	private copy<T> (obj: T): T {
		const str = JSON.stringify(obj);
		return JSON.parse(str);
	}

}

export const storage = Object.freeze({
	providers: new Storage<Provider>('providers')
})