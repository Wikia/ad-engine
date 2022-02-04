class ScriptLoader {
	/**
	 * Creates <script> tag
	 */
	createScript(
		src: string,
		type = 'text/javascript',
		isAsync = true,
		node: HTMLElement | string = null,
		parameters: Record<string, string> = {},
		datasets: Partial<DOMStringMap> = {},
	): HTMLScriptElement {
		const script: HTMLScriptElement = document.createElement('script');

		script.async = isAsync;
		script.type = type;
		script.src = src;

		Object.keys(parameters).forEach((parameter) => {
			script.setAttribute(parameter, parameters[parameter]);
		});

		Object.keys(datasets).forEach((dataset) => {
			script.dataset[dataset] = datasets[dataset];
		});

		if (typeof node === 'string') {
			const temp: ChildNode =
				node === 'first'
					? document.getElementsByTagName('script')[0]
					: ((node as unknown) as ChildNode) || document.body.lastChild;

			temp.parentNode.insertBefore(script, temp);
		} else {
			node.appendChild(script);
		}

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
		parameters: Record<string, string> = {},
		datasets: Partial<DOMStringMap> = {},
	): Promise<Event> {
		return new Promise((resolve, reject) => {
			const script: HTMLScriptElement = this.createScript(
				src,
				type,
				isAsync,
				node,
				parameters,
				datasets,
			);

			script.onload = resolve;
			script.onerror = reject;
		});
	}
}

export const scriptLoader = new ScriptLoader();
