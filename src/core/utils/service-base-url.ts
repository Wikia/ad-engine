export function getServicesBaseURL() {
	return document.currentScript && 'src' in document.currentScript
		? new URL(document.currentScript.src).origin + '/'
		: 'https://services.fandom.com/';
}
