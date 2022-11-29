export interface ScriptLoaderInterface {
	loadScript(src: string): Promise<Event>;
}

class ScriptLoader implements ScriptLoaderInterface {
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

	loadSync(url: string): string | boolean {
		try {
			const request = new XMLHttpRequest();
			request.open('GET', url, false);
			request.send(null);

			if (request.status !== 200) {
				return false;
			}

			if (request.responseText.length === 0) {
				return false;
			}

			return request.responseText;
		} catch (e) {
			return false;
		}
	}
}

export const scriptLoader = new ScriptLoader();
