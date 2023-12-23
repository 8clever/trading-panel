import { v4 as uuid } from 'uuid'
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

	save (obj: Partial<T>) {
		const upd = (obj.id ? { ...this.collection.get(obj.id), ...obj } : { ...obj, id: uuid() }) as T;
		this.collection.set(upd.id, upd);
		this.persist();
	}

	list () {
		return Array.from(this.collection.values())
	}

	findById (id: string) {
		return this.collection.get(id);
	}

}

export const storage = Object.freeze({
	providers: new Storage('providers')
})