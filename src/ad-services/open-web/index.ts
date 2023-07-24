import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { BaseServiceSetup, context, TargetingData, targetingService, utils } from '@ad-engine/core';
import { PlacementsBuilder } from './builder/placements-builder';
import { OpenWebPlacementSearchHandler } from './placement-handler/placement-search';

const logGroup = 'open-web';

export * from './placement-handler';

export class OpenWeb extends BaseServiceSetup {
	placementHandler: OpenWebPlacementSearchHandler;

	setPlacementHandler(handler: OpenWebPlacementSearchHandler) {
		this.placementHandler = handler;
		return this;
	}

	call(): void {
		if (context.get('state.isLogged')) {
			utils.logger(logGroup, 'disabled - user is logged');
			return;
		}

		const config = this.instantConfig.get('icOpenWeb', {
			isActive: false,
			spotId: 'n-a',
		});

		if (!config?.isActive) {
			utils.logger(logGroup, 'disabled - not activated');
			return;
		}

		if (!this.placementHandler) {
			utils.logger(logGroup, 'disabled - no placement handlers');
			return;
		}

		if (this.isControlGroupInOpenWebReactionsExperiment()) {
			utils.logger(logGroup, 'disabled - control group in experiment');
			return;
		}

		const targeting = targetingService.dump<TargetingData>();
		const articleId = targeting.post_id || targeting.artid;
		const siteId = targeting.s1;

		communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, (action: UapLoadStatus) => {
			if (action.isLoaded) {
				utils.logger(logGroup, 'disabled - UAP is loaded');
				return;
			}

			if (this.placementHandler.isPlacementFound()) {
				const postUniqueId = `wk_${siteId}_${articleId}`;
				const postUrl = window.location.href.split('?')[0];
				const articleTitle = targeting.wpage || '';

				const placementBuilder = new PlacementsBuilder();
				const reactionElement = placementBuilder.buildReactionDivModule(postUniqueId);
				const standaloneAdElement = placementBuilder.buildStandaloneAdUnit();
				const anchor = this.placementHandler.getPlacement();
				anchor.prepend(standaloneAdElement);
				anchor.prepend(reactionElement);

				this.loadScript(config.spotId, postUniqueId, postUrl, articleTitle);
			} else {
				utils.logger(logGroup, 'disabled - builder failed');
			}
		});
	}

	private loadScript(spotId: string, postUniqueId: string, postUrl: string, title: string): void {
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
					postUrl,
					articleTags: title,
				},
			)
			.then(() => {
				utils.logger(logGroup, 'ready');
			});
	}

	private isControlGroupInOpenWebReactionsExperiment() {
		const isControllGroup = context.get('templates.openWebReactionsExperiment');
		return isControllGroup;
	}
}
