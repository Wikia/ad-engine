class ScriptLoader {
	/**
	 * Creates <script> tag
	 * @param {string} src
	 * @param {string} type
	 * @param {boolean} isAsync
	 * @param {HTMLElement|string|null} node
	 * @param {Object} parameters
	 * @returns {HTMLScriptElement}
	 */
	createScript(src, type = 'text/javascript', isAsync = true, node = null, parameters = {}) {
		const script = document.createElement('script');

		node =
			node === 'first'
				? document.getElementsByTagName('script')[0]
				: node || document.body.lastChild;
		script.async = isAsync;
		script.type = type;
		script.src = src;

		Object.keys(parameters).forEach((parameter) => {
			script[parameter] = parameters[parameter];
		});

		node.parentNode.insertBefore(script, node);

		return script;
	}

	/**
	 * Injects <script> tag
	 * @param {string} src
	 * @param {string} type
	 * @param {boolean} isAsync
	 * @param {HTMLElement|string|null} node
	 * @param {Object} parameters
	 * @returns {Promise<any>}
	 */
	loadScript(src, type = 'text/javascript', isAsync = true, node = null, parameters = {}) {
		return new Promise((resolve, reject) => {
			const script = this.createScript(src, type, isAsync, node, parameters);

			script.onload = resolve;
			script.onerror = reject;
		});
	}
}

export const scriptLoader = new ScriptLoader();
