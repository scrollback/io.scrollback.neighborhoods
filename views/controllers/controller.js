import core from "../../store/core";
import store from "../../store/store";

export default function(Target) {
	class Controller extends Target {
		get store() {
			return store;
		}

		componentDidMount() {
			if (typeof super.componentDidMount === "function") {
				super.componentDidMount();
			}

			this._mounted = true;
		}

		componentWillUnmount() {
			if (typeof super.componentWillUnmount === "function") {
				super.componentWillUnmount();
			}

			this._mounted = false;

			// Clean up handlers
			if (this._handlers && this._handlers.length) {
				for (let i = 0, l = this._handlers.length; i < l; i++) {
					core.off(...this._handlers[i]);
				}
			}
		}

		handle(event, cb, prio = 100, ...rest) {
			if (typeof super.handle === "function") {
				return super.handle(event, cb, prio, ...rest);
			}

			const handler = cb.bind(this);

			// Attach the event handler
			core.on(event, handler, prio);

			// Keep track so we can clean up later
			this._handlers = this._handlers || [];
			this._handlers.push([ event, handler, prio ]);

			// Return the index
			return this._handlers.length - 1;
		}

		emit(type, params = {}, ...rest) {
			if (typeof super.emit === "function") {
				return super.emit(type, params, ...rest);
			}

			return new Promise((resolve, reject) => {
				core.emit(type, params, (err, res) => {
					if (err) {
						reject(err);
					} else {
						resolve(res);
					}
				});
			});
		}

		async query(...args) {
			if (typeof super.query === "function") {
				return super.query(...args);
			}

			const res = await this.emit(...args);

			return res.results;
		}

		async dispatch(name, params = {}, prio = 1, ...rest) {
			if (typeof super.dispatch === "function") {
				return super.dispatch(name, params, prio, ...rest);
			}

			return new Promise(async (resolve, reject) => {
				const down = name + "-dn";

				let id;

				function cleanUp() {

					/* eslint-disable no-use-before-define */
					core.off(down, onSuccess);
					core.off("error-dn", onError);
				}

				function onSuccess(action) {
					if (id === action.id) {
						cleanUp();
						resolve(action);
					}
				}

				function onError(error) {
					if (id === error.id) {
						cleanUp();
						reject(error);
					}
				}

				core.on(down, onSuccess, prio);
				core.on("error-dn", onError, prio);

				try {
					const action = await this.emit(name + "-up", params);

					id = action.id;
				} catch (err) {
					cleanUp();
					reject(err);
				}
			});
		}
	}

	Controller.displayName = Target.name;

	return Controller;
}
