import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import {
	BaseServiceSetup,
	context,
	InstantConfigService,
	targetingService,
	utils,
} from '@ad-engine/core';
import { PlacementHandler } from './utils/placement-handler';

const logGroup = 'open-web';

export * from './utils/placement-handler';

export class OpenWeb extends BaseServiceSetup {
	protected placementHandler: PlacementHandler;

	constructor(protected instantConfig: InstantConfigService = null) {
		super(instantConfig);

		this.placementHandler = new PlacementHandler();
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

		const articleId = targetingService.get('post_id') || targetingService.get('artid');
		const siteId = targetingService.get('s1');

		communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, (action: UapLoadStatus) => {
			if (action.isLoaded) {
				utils.logger(logGroup, 'disabled - UAP is loaded');
				return;
			}

			this.placementHandler.init();
			if (this.placementHandler.isReady()) {
				const postUniqueId = `wk_${siteId}_${articleId}`;
				const postUrl = window.location.origin + window.location.pathname;
				const articleTitle = targetingService.get('wpage') || '';

				this.placementHandler.buildPlacements(postUniqueId);
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
}
