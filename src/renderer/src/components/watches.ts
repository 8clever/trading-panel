
export class Watch {

	private watch = true;

	private delay = 100;

	cb = () => Promise.resolve();

	start = async () => {
		while (this.watch) {
			await this.cb();
			await new Promise(res => setTimeout(res, this.delay));
		}
	}

	off = () => {
		this.watch = false;
	}
}