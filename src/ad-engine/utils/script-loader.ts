export interface ScriptLoaderInterface {
	createScript(url: string, options?: ScriptTagOptions): HTMLScriptElement;
	loadScript(url: string, options?: ScriptTagOptions): Promise<Event>;
	loadAsset(url: string, responseType: XMLHttpRequestResponseType): Promise<string | null>;
}

export interface ScriptTagOptions {
	type?: 'text/javascript';
	isAsync?: boolean;
	node?: HTMLElement | string;
	parameters?: Record<string, string>;
	datasets?: Partial<DOMStringMap>;
}

class ScriptLoader implements ScriptLoaderInterface {
	/**
	 * Creates <script> tag
	 */
	createScript(
		src,
		{
			type ='text/javascript',
			isAsync = true,
			node = null,
			parameters = {},
			datasets = {}
		}: ScriptTagOptions
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
			const temp: ChildNode = document.getElementsByTagName('script')[0];

			temp.parentNode.insertBefore(script, temp);
		} else {
			const temp: ChildNode = node || document.body;

			temp.appendChild(script);
		}

		return script;
	}

	/**
	 * Injects <script> tag
	 */
	loadScript(src, options?: ScriptTagOptions): Promise<Event> {
		return new Promise((resolve, reject) => {
			const script: HTMLScriptElement = this.createScript(src, options);

			script.onload = resolve;
			script.onerror = reject;
		});
	}

	loadAsset(
		url: string,
		responseType: XMLHttpRequestResponseType = 'json',
	): Promise<string | null> {
		const request = new XMLHttpRequest();

		request.open('GET', url, true);
		request.responseType = responseType;

		return new Promise((resolve) => {
			request.addEventListener('timeout', () => {
				resolve(null);
			});
			request.addEventListener('error', () => {
				resolve(null);
			});
			request.onreadystatechange = function (): void {
				if (this.readyState === this.DONE) {
					if (this.status === 200) {
						resolve(this.response);
					} else {
						resolve(null);
					}
				}
			};
			request.send();
		});
	}
}

export const scriptLoader = new ScriptLoader();
