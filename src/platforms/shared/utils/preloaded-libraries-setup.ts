import {
	Audigent,
	context,
	DiProcess,
	InstantConfigService,
	InstantConfigServiceInterface,
	intentIQ,
	pbjsFactory,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const prebidLibraryUrlLocation = '//static.wikia.nocookie.net/fandom-ae-assets/prebid.js/';
const prebidLibraryUrlPattern = new RegExp(
	`^(${prebidLibraryUrlLocation.replaceAll('.', '\\.')})?[^/]+/[^/]+$`,
);

@Injectable()
export class PreloadedLibrariesSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	async execute(): Promise<void> {
		this.preloadLibraries();
	}

	private preloadLibraries() {
		if (this.instantConfig.get('icPrebid')) {
			context.set('bidders.prebid.libraryUrl', this.getPrebidLibraryUrl(this.instantConfig));

			pbjsFactory.init().then(() => {
				if (this.instantConfig.get('icPrebidIntentIQ')) {
					return intentIQ.preloadScript();
				}
			});
		}

		if (this.instantConfig.get('icAudigent')) {
			Audigent.loadSegmentLibrary();
		}
	}

	private getPrebidLibraryUrl(instantConfig: InstantConfigServiceInterface): string {
		let url: string = instantConfig.get('icPrebidVersion', 'latest/min.js');

		if (!prebidLibraryUrlPattern.test(url)) {
			url = 'latest/min.js';
		}
		if (!url.startsWith(prebidLibraryUrlLocation)) {
			url = prebidLibraryUrlLocation + url;
		}
		return url.replaceAll('..', '');
	}
}
