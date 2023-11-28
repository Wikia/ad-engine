import { context } from '../services';

class DisplayAndVideoAdsSyncContext {
	hasFeaturedVideo(): boolean {
		return !!context.get('custom.hasFeaturedVideo');
	}

	getVideoSyncedWithDisplayLines(): [] {
		return context.get('options.video.uapJWPLineItemIds') || [];
	}

	getVideoVastXml(): string {
		return context.get('options.video.vastXml');
	}

	updateDisplayAndVideoAdsSyncEnablerFlag(value: boolean): void {
		context.set('options.video.displayAndVideoAdsSyncSetupEnabled', value);
	}

	updateVastXmlInAdContext(xml: string): void {
		context.set('options.video.vastXml', xml);
	}

	clearVastXmlInAdContext(): void {
		context.remove('options.video.vastXml');
	}
}

export const displayAndVideoAdsSyncContext = new DisplayAndVideoAdsSyncContext();
