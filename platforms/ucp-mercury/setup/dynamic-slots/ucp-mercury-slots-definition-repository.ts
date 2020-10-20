import {
	context,
	InstantConfigService,
	scrollListener,
	SlotCreatorConfig,
	SlotCreatorWrapperConfig,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

export interface SlotSetupDefinition {
	slotCreatorConfig: SlotCreatorConfig;
	slotCreatorWrapperConfig?: SlotCreatorWrapperConfig;
	activator?: () => void;
}

@Injectable()
export class UcpMercurySlotsDefinitionRepository {
	constructor(protected instantConfig: InstantConfigService) {}

	getTopLeaderboardConfig(): SlotSetupDefinition {
		if (!this.isTopLeaderboardApplicable()) {
			return;
		}

		const slotName = 'top_leaderboard';
		const activator = () => {
			context.push('state.adStack', { id: slotName });
		};
		const slotCreatorWrapperConfig = {
			classList: ['ad-slot-wrapper', 'top-leaderboard'],
		};

		if (!!document.querySelector('.portable-infobox')) {
			return {
				activator,
				slotCreatorWrapperConfig,
				slotCreatorConfig: {
					slotName,
					anchorSelector: '.portable-infobox-wrapper',
					insertMethod: 'after',
					classList: ['hide', 'ad-slot'],
				},
			};
		}

		return {
			activator,
			slotCreatorWrapperConfig,
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.article-content',
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
			},
		};
	}

	private isTopLeaderboardApplicable(): boolean {
		const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');
		const isHome = context.get('custom.pageType') === 'home';
		const isSearch = context.get('custom.pageType') === 'search';
		const hasPageHeader = !!document.querySelector('.wiki-page-header');
		const hasPortableInfobox = !!document.querySelector('.portable-infobox');

		return isSearch || isHome || hasPortableInfobox || (hasPageHeader && !hasFeaturedVideo);
	}

	getTopBoxadConfig(): SlotSetupDefinition {
		if (!this.isInContentApplicable()) {
			return;
		}

		const slotName = 'top_boxad';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.mw-parser-output > h2',
				anchorPosition: 1,
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: {
				classList: ['ad-slot-wrapper', 'top-boxad'],
			},
			activator: () => {
				// TODO wait for UAP and check whether slot should be lazy loaded
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	private isInContentApplicable(): boolean {
		if (context.get('custom.pageType') === 'home') {
			return !!document.querySelector('.curated-content');
		}

		return context.get('custom.pageType') !== 'search';
	}

	getBottomLeaderboardConfig(): SlotSetupDefinition {
		if (!this.isBottomLeaderboardApplicable()) {
			return;
		}

		const slotName = 'bottom_leaderboard';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.article-footer',
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: {
				classList: ['ad-slot-wrapper', 'bottom-leaderboard'],
			},
			activator: () => {
				// TODO wait for UAP and check whether slot should be lazy loaded
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	private isBottomLeaderboardApplicable(): boolean {
		return (
			!!document.querySelector('.wds-global-footer') && context.get('custom.pageType') !== 'search'
		);
	}

	getFloorAdhesionConfig(): SlotSetupDefinition {
		if (!this.isFloorAdhesionApplicable()) {
			return;
		}

		const slotName = 'floor_adhesion';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '#wikiContainer',
				insertMethod: 'after',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				const numberOfViewportsFromTopToPush: number =
					this.instantConfig.get('icFloorAdhesionViewportsToStart') || 0;

				context.set('slots.floor_adhesion.disabled', !this.instantConfig.get('icFloorAdhesion'));
				context.set(
					'slots.floor_adhesion.numberOfViewportsFromTopToPush',
					this.instantConfig.get('icFloorAdhesionViewportsToStart'),
				);
				context.set(
					'slots.floor_adhesion.forceSafeFrame',
					this.instantConfig.get('icFloorAdhesionForceSafeFrame'),
				);
				context.set(
					'templates.floorAdhesion.showCloseButtonAfter',
					this.instantConfig.get('icFloorAdhesionTimeToCloseButton', 0),
				);

				const distance = numberOfViewportsFromTopToPush * utils.getViewportHeight();
				scrollListener.addSlot(slotName, { distanceFromTop: distance });
			},
		};
	}

	private isFloorAdhesionApplicable(): boolean {
		return this.instantConfig.get('icFloorAdhesion') && !context.get('custom.hasFeaturedVideo');
	}

	getInvisibleHighImpactConfig(): SlotSetupDefinition {
		if (!this.isInvisibleHighImpactApplicable()) {
			return;
		}

		const slotName = 'invisible_high_impact_2';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '#wikiContainer',
				insertMethod: 'after',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				context.set(
					'templates.floorAdhesion.showCloseButtonAfter',
					this.instantConfig.get('icInvisibleHighImpact2TimeToCloseButton', 0),
				);

				context.push('state.adStack', { id: slotName });
			},
		};
	}

	private isInvisibleHighImpactApplicable(): boolean {
		return !this.instantConfig.get('icFloorAdhesion') && !context.get('custom.hasFeaturedVideo');
	}
}
