import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { BaseServiceSetup, context, TargetingData, targetingService, utils } from '@ad-engine/core';

const logGroup = 'open-web';

export class OpenWeb extends BaseServiceSetup {
	call(): void {
		if (context.get('state.isLogged')) {
			utils.logger(logGroup, 'disabled - user is logged');
			return;
		}

		const config = this.instantConfig.get('icOpenWeb', {
			isActive: false,
			spotId: 'abc',
		});

		if (!config.isActive) {
			utils.logger(logGroup, 'disabled - not activated');
			return;
		}

		const targeting = targetingService.dump<TargetingData>();
		const articleId = targeting.post_id || targeting.artid;
		const siteId = targeting.s1;
		const postUniqueId = `wk_${siteId}_${articleId}`;

		communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, (action: UapLoadStatus) => {
			if (action.isLoaded) {
				utils.logger(logGroup, 'disabled - UAP is loaded');
				return;
			}
			this.buildReactionDivModule(postUniqueId);
			this.buildStandaloneAdUnit();
			this.loadScript(config.spotId, postUniqueId);
		});
	}

	private loadScript(spotId: string, postUniqueId: string): void {
		const libraryUrl = `//launcher.spot.im/spot/${spotId}`;
		utils.logger(logGroup, 'loading', libraryUrl);

		utils.scriptLoader
			.loadScript(
				libraryUrl,
				true,
				null,
				{},
				{
					spotimModule: 'spotim-launcher',
					spotimAutorun: 'false',
					postId: postUniqueId,
				},
			)
			.then(() => {
				utils.logger(logGroup, 'ready');
			});
	}

	private buildReactionDivModule(postUniqueId: string): void {
		const divElement = document.createElement('div');
		divElement.dataset.spotimApp = 'reactions';
		divElement.dataset.postId = postUniqueId;
		divElement.dataset.vertivalView = 'true';

		const selector = context.get('open-web.selector') || '#WikiaAdInContentPlaceHolder';
		const anchor = document.querySelector(selector);

		// anchor.parentNode.appendChild(divElement);
		anchor.prepend(divElement);
	}

	private buildStandaloneAdUnit(): void {
		const divElement = document.createElement('div');
		divElement.dataset.openwebAd = '';
		divElement.dataset.row = '1';
		divElement.dataset.column = '1';
		divElement.classList.add('openwebAdUnit');

		const selector = context.get('open-web.selector') || '#WikiaAdInContentPlaceHolder';
		const anchor = document.querySelector(selector);

		// anchor.parentNode.appendChild(divElement);
		anchor.prepend(divElement);
	}
}
