import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import {
	BaseServiceSetup,
	context,
	InstantConfigService,
	targetingService,
	utils,
} from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';
import { PlacementsHandler } from './utils/placements-handler';

const logGroup = 'open-web';

interface OpenWebConfig {
	isActive: boolean;
	spotId: string;
}

@Injectable()
export class OpenWeb extends BaseServiceSetup {
	static MOBILE_REPLACE_REPEAT_SLOT_IDX = 2;
	private config: OpenWebConfig;

	constructor(
		protected instantConfig: InstantConfigService,
		private placementsHandler: PlacementsHandler = null,
	) {
		super(instantConfig);
		this.readConfig(instantConfig);
	}

	call(): void {
		if (context.get('state.isLogged')) {
			utils.logger(logGroup, 'disabled - user is logged');
			return;
		}

		if (!this.isActive()) {
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

			const postUniqueId = `wk_${siteId}_${articleId}`;
			this.placementsHandler.build(postUniqueId);

			if (this.placementsHandler.isDone()) {
				const postUrl = window.location.origin + window.location.pathname;
				const articleTitle = targetingService.get('wpage') || '';

				this.loadScript(this.config.spotId, postUniqueId, postUrl, articleTitle);
			} else {
				utils.logger(logGroup, 'disabled - builder failed');
			}
		});
	}

	public isActive(): boolean {
		if (!this.config) {
			this.readConfig(this.instantConfig);
		}

		return this.config?.isActive || false;
	}

	private readConfig(instantConfig: InstantConfigService): void {
		this.config = instantConfig.get('icOpenWeb', {
			isActive: false,
			spotId: 'n-a',
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

				if (!context.get('state.isMobile')) {
					setTimeout(() => this.moveAfterViewability(), 5000);
				}
			});
	}

	private moveAfterViewability(): void {
		const stickyWrapperClassName = 'sticky-modules-wrapper';
		const stickyWrapper = document.querySelector(`.${stickyWrapperClassName}`);
		const wikiaAdInContentPlaceHolder = document.getElementById('WikiaAdInContentPlaceHolder');

		stickyWrapper?.classList.remove(stickyWrapperClassName);
		stickyWrapper?.classList.add('replaced-rail-modules-wrapper');
		wikiaAdInContentPlaceHolder?.classList.add(stickyWrapperClassName);

		utils.logger(logGroup, 'move after viewability');
	}
}
