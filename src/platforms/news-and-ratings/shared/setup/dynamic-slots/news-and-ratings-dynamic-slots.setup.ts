import { insertSlots } from '@platforms/shared';
import {
	btfBlockerService,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NewsAndRatingsSlotsDefinitionRepository } from './news-and-ratings-slots-definition-repository';

@Injectable()
export class NewsAndRatingsDynamicSlotsSetup implements DiProcess {
	constructor(private slotsDefinitionRepository: NewsAndRatingsSlotsDefinitionRepository) {}

	execute(): void {
		this.injectSlots();

		insertSlots([
			this.slotsDefinitionRepository.getInterstitialConfig(),
			this.slotsDefinitionRepository.getFloorAdhesionConfig(),
		]);
	}

	public injectSlots(selector = '.mapped-ad,.ad', skyboxPatterns = ['skybox']): void {
		const adPlaceholders = document.querySelectorAll(selector);
		let tlbExists = false;

		if (!adPlaceholders || adPlaceholders.length === 0) {
			console.warn('AdEngine did not find any ad placeholders');
			return;
		}

		adPlaceholders.forEach((placeholder: Element) => {
			let adSlotName = placeholder.id;
			let adWrapper = placeholder;

			if (!adSlotName) {
				adSlotName = placeholder.getAttribute('data-ad-type');
				adWrapper = utils.Document.getFirstElementChild(placeholder);
			}

			if (!adSlotName || !adWrapper || adSlotName === 'interstitial') {
				return;
			}

			if (skyboxPatterns.some((name) => adSlotName.includes(name))) {
				context.set('slots.top_leaderboard.bidderAlias', adSlotName);
				context.set('slots.top_leaderboard.targeting.pos', ['top_leaderboard', adSlotName]);

				adSlotName = 'top_leaderboard';
				tlbExists = true;
			}

			adWrapper.id = adSlotName;

			context.push('state.adStack', { id: adSlotName });
		});

		context.set('state.topLeaderboardExists', tlbExists);

		if (!tlbExists) {
			communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
				btfBlockerService.finishFirstCall();
				communicationService.emit(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, {
					isLoaded: universalAdPackage.isFanTakeoverLoaded(),
					adProduct: universalAdPackage.getType(),
				});
			});
		}
	}
}
