export class IframeBuilder {
	create(adSlot) {
		const doc = adSlot.getElement();

		return doc.appendChild(this.createEmptyIframe());
	}

	/**
	 * @private
	 * Inspired by `createInvisibleIframe` method from Prebid.js
	 */
	createEmptyIframe() {
		const iframe = document.createElement('iframe');

		iframe.height = 0;
		iframe.width = 0;
		iframe.border = '0px';
		iframe.hspace = '0';
		iframe.vspace = '0';
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
