import store from "./store";
import core from "./core";

const LOADING = "loading";

class Store {
	constructor() {
		this._providers = {};
	}

	get _state() {
		return store.get();
	}

	provide(name: string, provider: Object) {
		if (typeof provider.get !== "function") {
			throw new TypeError("Invalid 'get' function");
		}

		if (typeof provider.notify !== "function") {
			throw new TypeError("Invalid 'notify' function");
		}

		if ("query" in provider && typeof this.query !== "function") {
			throw new TypeError("Invalid 'query' function");
		}

		this._providers[name] = provider;
	}

	get(provider: string, options: ?Object) {
		return this._providers[provider].get(options);
	}

	subscribe(provider: string, options: Object, callback: Function) {
		const handler = changes => {
			if (this._providers[provider].notify(options, changes)) {
				callback(null, this.get(provider, options));
			}
		};

		core.on("statechange", handler);

		const data = this.get(provider, options);

		if (this.query && data === LOADING || data.length === 1 && data[0] === LOADING) {
			this.query(provider, options);
		}

		callback(data);

		return {
			remove() {
				core.off("statechange", handler);
			}
		};
	}

	query(provider: string, options: Object) {
		return this._providers[provider].query(options);
	}

	setstate(changes) {
		core.emit("setstate", changes);
	}
}

const $store = new Store();

global.sb = core;
global.store = $store;

export default $store;
