import {
	A9Provider,
	context,
	DiProcess,
	InstantConfigService,
	intentIQ,
	pbjsFactory,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { GptSetup } from './gpt.setup';

const prebidLibraryUrlLocation = '//static.wikia.nocookie.net/fandom-ae-assets/prebid.js/';
const prebidLibraryUrlPattern = new RegExp(
	`^(${prebidLibraryUrlLocation.replaceAll('.', '\\.')})?[^/]+/[^/]+$`,
);

export interface PreloadOptions {
	gpt?: boolean;
	prebid?: boolean;
	apstag?: boolean;
	intentIq?: boolean;
}

@Injectable()
export class PreloadedLibrariesSetup implements DiProcess {
	private readonly options: PreloadOptions | undefined;

	constructor(private instantConfig: InstantConfigService, private gptSetup: GptSetup) {
		this.options = context.get('options.preload');
	}

	async execute(): Promise<void> {
		context.set('bidders.prebid.libraryUrl', this.getPrebidLibraryUrl());
		this.preloadLibraries();
		return this.options?.gpt ? this.gptSetup.call() : Promise.resolve();
	}

	private preloadLibraries() {
		if (this.options?.prebid && this.instantConfig.get('icPrebid')) {
			pbjsFactory.init().then(() => {
				if (this.options?.intentIq && this.instantConfig.get('icPrebidIntentIQ')) {
					return intentIQ.preloadScript();
				}
			});
		}

		if (this.options?.apstag && this.instantConfig.get('icA9Bidder')) {
			A9Provider.initApstag();
		}
	}

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
