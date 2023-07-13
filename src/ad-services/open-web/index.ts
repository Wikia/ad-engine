import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { BaseServiceSetup, context, TargetingData, targetingService, utils } from '@ad-engine/core';
import { OpenWebPlacementBuilder } from './builder/types';

const logGroup = 'open-web';

export class OpenWeb extends BaseServiceSetup {
	builder: OpenWebPlacementBuilder;

	setPlacementBuilder(builder: OpenWebPlacementBuilder) {
		this.builder = builder;
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

		if (!this.builder) {
			utils.logger(logGroup, 'disabled - no builders');
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

			if (this.builder.buildPlacement(postUniqueId)) {
				this.loadScript(config.spotId, postUniqueId);
			} else {
				utils.logger(logGroup, 'disabled - builder failed');
			}
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
}
