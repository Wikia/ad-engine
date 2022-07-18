export class PrebidNativeHelper {
	static triggerPixel(url: string, done: () => any, timeout: number): void {
		const img = new Image();
		if (done && PrebidNativeHelper.isFunction(done)) {
			PrebidNativeHelper.waitForElementToLoad(img, timeout).then(done);
		}
		img.src = url;
		document.body.appendChild(img);
	}

	private static isFunction(object) {
		return toString.call(object) === "[object 'Function']";
	}

	private static waitForElementToLoad(element: HTMLElement, timeout: number): Promise<boolean> {
		let timer = null;
		return new Promise((resolve) => {
			const onLoad = () => {
				element.removeEventListener('load', onLoad);
				element.removeEventListener('error', onLoad);
				if (timer != null) {
					window.clearTimeout(timer);
				}
				resolve();
			};
			element.addEventListener('load', onLoad);
			element.addEventListener('error', onLoad);
			if (timeout != null) {
				timer = window.setTimeout(onLoad, timeout);
			}
		});
	}
}
