/**
 * Check if element is an Iframe.
 */
export function isIframe(input: HTMLIFrameElement | HTMLElement): input is HTMLIFrameElement {
	return input.tagName === 'IFRAME';
}

export function pageInIframe(): boolean {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}
