export interface ScriptLoaderInterface {
	loadScript(src: string): Promise<Event>;
}

export enum ScriptLoadTime {
	async, defer, document_interactive, document_complete
}

const documentCompleteTimeout = 5000; // ICBM variable?

class ScriptLoader implements ScriptLoaderInterface {
	private readonly documentInteractivePromise: Promise<Event | void>;
	private readonly documentCompletePromise: Promise<Event | void>;

	constructor(private readonly window: Window, private readonly document: Document) {
		this.documentInteractivePromise = document.readyState === "loading" ? new Promise((resolve) => {
			this.document.addEventListener('DOMContentLoaded', (event) => {
				resolve(event);
			});
		}) : Promise.resolve();

		this.documentCompletePromise = document.readyState !== "complete" ? new Promise((resolve) => {
			const timeout = setTimeout(resolve, documentCompleteTimeout);
			this.window.addEventListener('load', (event) => {
				clearTimeout(timeout);
				resolve(event);
			});
		}) : Promise.resolve();
	}

	/**
	 * Creates <script> tag
	 */
	private createScript(
		src: string,
		scriptLoadTime: ScriptLoadTime,
		node: HTMLElement | string,
		parameters: Record<string, string>,
		datasets: Partial<DOMStringMap>,
	): HTMLScriptElement {
		const script: HTMLScriptElement = document.createElement('script');

		script.async = scriptLoadTime === ScriptLoadTime.async;
		script.defer = scriptLoadTime === ScriptLoadTime.defer;
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

	private createScriptPromise(
		src: string,
		scriptLoadTime,
		node: HTMLElement | string,
		parameters: Record<string, string>,
		datasets: Partial<DOMStringMap>
	): Promise<Event> {
		return new Promise((resolve, reject) => {
			const script: HTMLScriptElement = this.createScript(
				src,
				scriptLoadTime,
				node,
				parameters,
				datasets,
			);

			script.onload = resolve;
			script.onerror = reject;
		});
	}

	private buildChainPromise(
		waitPromise: Promise<Event | void>,
		src: string,
		scriptLoadTime,
		node: HTMLElement | string,
		parameters: Record<string, string>,
		datasets: Partial<DOMStringMap>
	): Promise<Event> {
		return new Promise((resolve, reject) => waitPromise.then(
			() => this.createScriptPromise(src, scriptLoadTime, node, parameters, datasets)
				.then(resolve).catch(reject)));

	}

	/**
	 * Injects <script> tag
	 */
	loadScript(
		src: string,
		scriptLoadTime : ScriptLoadTime = ScriptLoadTime.defer,
		node: HTMLElement | string = null,
		parameters: Record<string, string> = {},
		datasets: Partial<DOMStringMap> = {},
	): Promise<Event> {
		if (scriptLoadTime === ScriptLoadTime.document_interactive) {
			return this.buildChainPromise(this.documentInteractivePromise, src, scriptLoadTime, node, parameters, datasets);
		} else if (scriptLoadTime === ScriptLoadTime.document_complete) {
			return this.buildChainPromise(this.documentCompletePromise, src, scriptLoadTime, node, parameters, datasets);
		}
		return this.createScriptPromise(src, scriptLoadTime, node, parameters, datasets);
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

export const scriptLoader = new ScriptLoader(window, document);
