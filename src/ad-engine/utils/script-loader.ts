class ScriptLoader {
	/**
	 * Creates <script> tag
	 */
	createScript(
		src: string,
		type = 'text/javascript',
		isAsync = true,
		node: HTMLElement | string = null,
		parameters: Partial<HTMLScriptElement> = {},
	): HTMLScriptElement {
		const script: HTMLScriptElement = document.createElement('script');
		const temp: ChildNode =
			node === 'first'
				? document.getElementsByTagName('script')[0]
				: (node as ChildNode) || document.body.lastChild;

		script.async = isAsync;
		script.type = type;
		script.src = src;

		if (parameters.dataset) {
			Object.keys(parameters.dataset).forEach((parameter) => {
				script.setAttribute(`data-${parameter}`, parameters.dataset[parameter]);
			});
		}

		Object.keys(parameters).forEach((parameter) => {
			if (parameter !== 'dataset') {
				script[parameter] = parameters[parameter];
			}
		});

		temp.parentNode.insertBefore(script, temp);

		return script;
	}

	/**
	 * Injects <script> tag
	 */
	loadScript(
		src: string,
		type = 'text/javascript',
		isAsync = true,
		node: HTMLElement | string = null,
		parameters: Partial<HTMLScriptElement> = {},
	): Promise<Event> {
		return new Promise((resolve, reject) => {
			const script: HTMLScriptElement = this.createScript(src, type, isAsync, node, parameters);

			script.onload = resolve;
			script.onerror = reject;
		});
	}
}

export const scriptLoader = new ScriptLoader();
