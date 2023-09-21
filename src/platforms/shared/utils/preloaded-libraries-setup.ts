import {
	A9Provider,
	Audigent,
	context,
	DiProcess,
	InstantConfigService,
	intentIQ,
	pbjsFactory,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { GptSetup } from '../setup/gpt.setup';

const prebidLibraryUrlLocation = '//static.wikia.nocookie.net/fandom-ae-assets/prebid.js/';
const prebidLibraryUrlPattern = new RegExp(
	`^(${prebidLibraryUrlLocation.replaceAll('.', '\\.')})?[^/]+/[^/]+$`,
);

@Injectable()
export class PreloadedLibrariesSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService, private gptSetup: GptSetup) {}

	async execute(): Promise<void> {
		this.preloadLibraries();
		return this.gptSetup.call();
	}

	private preloadLibraries() {
		if (this.instantConfig.get('icPrebid')) {
			context.set('bidders.prebid.libraryUrl', this.getPrebidLibraryUrl());

			pbjsFactory.init().then(() => {
				if (this.instantConfig.get('icPrebidIntentIQ')) {
					return intentIQ.preloadScript();
				}
			});
		}

		if (this.instantConfig.get('icA9Bidder')) {
			A9Provider.initApstag();
		}

		if (this.instantConfig.get('icAudigent')) {
			Audigent.loadSegmentLibrary();
		}
	}

	pu;

	private getPrebidLibraryUrl(): string {
		let url: string = this.instantConfig.get('icPrebidVersion', 'latest/min.js');

		if (!prebidLibraryUrlPattern.test(url)) {
			url = 'latest/min.js';
		}
		if (!url.startsWith(prebidLibraryUrlLocation)) {
			url = prebidLibraryUrlLocation + url;
		}
		return url.replaceAll('..', '');
	}
}
