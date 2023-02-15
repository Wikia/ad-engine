import {
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	TrackingParametersSetup,
	TrackingSetup,
} from '@platforms/shared';
import { context, ProcessPipeline, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import {
	NewsAndRatingsAdsMode,
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsDynamicSlotsSetup,
	NewsAndRatingsTargetingSetup,
	NewsAndRatingsWadSetup,
} from '../shared';
import { basicContext } from './ad-context';
import { GamespotA9ConfigSetup } from './setup/context/a9/gamespot-a9-config.setup';
import { GamespotPrebidConfigSetup } from './setup/context/prebid/gamespot-prebid-config.setup';
import { GamespotSlotsContextSetup } from './setup/context/slots/gamespot-slots-context.setup';
import { GamespotTargetingSetup } from './setup/context/targeting/gamespot-targeting.setup';
import { GamespotTemplatesSetup } from './templates/gamespot-templates.setup';

@Injectable()
export class GameSpotPlatform {
	private currentUrl = '';
	private seamlessContentLoaded = {};
	private seamlessAdsAdded = {};

	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('state.isMobile', !utils.client.isDesktop()),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			TrackingParametersSetup,
			NewsAndRatingsBaseContextSetup,
			NewsAndRatingsWadSetup,
			NewsAndRatingsTargetingSetup,
			GamespotTargetingSetup,
			GamespotSlotsContextSetup,
			NewsAndRatingsDynamicSlotsSetup,
			GamespotPrebidConfigSetup,
			GamespotA9ConfigSetup,
			BiddersStateSetup,
			GamespotTemplatesSetup,
			NewsAndRatingsAdsMode,
			TrackingSetup,
			() => this.setupPageChangeWatcher(),
		);

		this.pipeline.execute();
	}

	setupPageChangeWatcher() {
		const config = { subtree: true, childList: true };
		// register first page after load
		this.currentUrl = location.href;
		this.seamlessContentLoaded[location.pathname] = true;

		const observer = new MutationObserver(() => {
			utils.logger(
				'pageChangeWatcher',
				'observer init',
				this.currentUrl,
				location.pathname,
				this.seamlessContentLoaded,
			);

			if (!this.currentUrl) {
				this.currentUrl = location.href;
				return;
			}

			if (this.currentUrl !== location.href) {
				utils.logger('pageChangeWatcher', 'url changed', location.href);
				this.currentUrl = location.href;

				if (this.seamlessContentLoaded[location.pathname]) {
					utils.logger(
						'pageChangeWatcher',
						'ads already loaded for this content',
						location.href,
						this.seamlessContentLoaded,
					);
					return;
				}

				this.seamlessContentLoaded[location.pathname] = true;

				// TODO: we should do below on "page loaded" event for the lazy-loaded seamless content
				const adSlotsToFill = document.querySelectorAll('.mapped-ad > .ad-wrap:not(.gpt-ad)');
				utils.logger('pageChangeWatcher', 'adSlotsToFill: ', adSlotsToFill);
				adSlotsToFill.forEach((adWrapper: Element) => {
					const placeholder = adWrapper.parentElement;
					const baseSlotName = placeholder?.getAttribute('data-ad-type');
					const slotName = this.calculateSeamlessSlotName(placeholder);
					utils.logger('pageChangeWatcher', 'slot to copy: ', baseSlotName, slotName);

					placeholder.id = slotName;

					this.updateSlotContext(baseSlotName, slotName);
					context.push('state.adStack', { id: slotName });
				});
			}
		});

		observer.observe(document.querySelector('title'), config);
	}

	private calculateSeamlessSlotName(placeholder) {
		const baseSlotName = placeholder?.getAttribute('data-ad-type');
		this.seamlessAdsAdded[baseSlotName] = !this.seamlessAdsAdded[baseSlotName]
			? 1
			: this.seamlessAdsAdded[baseSlotName] + 1;

		return `${baseSlotName}-${this.seamlessAdsAdded[baseSlotName]}`;
	}

	private updateSlotContext(baseSlotName: string, slotName: string) {
		context.set(`slots.${slotName}`, { ...context.get(`slots.${baseSlotName}`) });
		context.set(`slots.${slotName}.slotName`, slotName);
		context.set(`slots.${slotName}.targeting.pos`, slotName);
		utils.logger('pageChangeWatcher', 'new slot config: ', context.get(`slots.${slotName}`));
	}
}
