class ScriptLoader {
	/**
	 * Creates <script> tag
	 */
	createScript(
		src: string,
		type = 'text/javascript',
		isAsync = true,
		node: HTMLElement | string = null,
		parameters: {} = {},
	): HTMLScriptElement {
		const script: HTMLScriptElement = document.createElement('script');
		const temp: ChildNode =
			node === 'first'
				? document.getElementsByTagName('script')[0]
				: (node as ChildNode) || document.body.lastChild;

		script.async = isAsync;
		script.type = type;
		script.src = src;

		Object.keys(parameters).forEach((parameter) => {
			(script as any)[parameter] = (parameters as any)[parameter];
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
		parameters: {} = {},
	): Promise<Event> {
		return new Promise((resolve, reject) => {
			const script: HTMLScriptElement = this.createScript(src, type, isAsync, node, parameters);

			script.onload = resolve;
			script.onerror = reject;
		});
	}
}

export const scriptLoader = new ScriptLoader();
