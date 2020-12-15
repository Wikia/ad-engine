import { context, DiProcess } from '@wikia/ad-engine';

export class WikiContextSetup implements DiProcess {
	execute(): void {
		const wikiContext = {
			beaconId: this.getMediaWikiVariable('beaconId') || window.beaconId || window.beacon_id,
			pvNumber: this.getMediaWikiVariable('pvNumber') || window.pvNumber,
			pvNumberGlobal: this.getMediaWikiVariable('pvNumberGlobal') || window.pvNumberGlobal,
			pvUID: this.getMediaWikiVariable('pvUID') || window.pvUID,
			sessionId: this.getMediaWikiVariable('sessionId') || window.sessionId || window.session_id,

			...(window.mw && window.mw.config ? window.mw.config.values : {}),
			...(window.ads ? window.ads.context : {}),
		};

		context.set('wiki', wikiContext);
	}

	private getMediaWikiVariable(variableName: string): any | null {
		return window.mw && window.mw.config ? window.mw.config.get(variableName) : null;
	}
}
