import { context } from '../services';

class TaglessRequestContext {
	hasFeaturedVideo(): boolean {
		return !!context.get('custom.hasFeaturedVideo');
	}

	getVideoSyncedWithDisplayLines(): [] {
		return context.get('options.video.uapJWPLineItemIds') || [];
	}

	getVideoVastXml(): string {
		return context.get('options.video.vastXml');
	}

	updateVastXmlInAdContext(xml: string): void {
		context.set('options.video.vastXml', xml);
	}

	clearVastXmlInAdContext(): void {
		context.remove('options.video.vastXml');
	}
}

export const taglessRequestContext = new TaglessRequestContext();
