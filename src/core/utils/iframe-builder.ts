export class IframeBuilder {
	create(element: HTMLElement, htmlContent?: string): HTMLIFrameElement {
		const iframe = this.createEmptyIframe();

		element.appendChild(iframe);

		if (htmlContent) {
			iframe.contentWindow.document.open();
			iframe.contentWindow.document.write(htmlContent);
			iframe.contentWindow.document.close();
		}

		return iframe;
	}

	/**
	 * Inspired by `createInvisibleIframe` method from Prebid.js
	 */
	private createEmptyIframe(): HTMLIFrameElement {
		const iframe: HTMLIFrameElement = document.createElement('iframe');

		iframe.height = '0';
		iframe.width = '0';
		(iframe as any).border = '0px';
		(iframe as any).hspace = '0';
		(iframe as any).vspace = '0';
		iframe.marginWidth = '0';
		iframe.marginHeight = '0';
		iframe.style.border = '0';
		iframe.scrolling = 'no';
		iframe.frameBorder = '0';
		iframe.src = 'about:blank';
		iframe.style.display = 'inline';
		iframe.style.overflow = 'hidden';

		return iframe;
	}
}
