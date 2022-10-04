export function getMediaWikiVariable(variableName: string): any | null {
	return window.mw && window.mw.config ? window.mw.config.get(variableName) : null;
}
