import { context, SlotCreatorConfig, SlotCreatorWrapperConfig } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

export interface SlotSetupDefinition {
	slotCreatorConfig: SlotCreatorConfig;
	slotCreatorWrapperConfig?: SlotCreatorWrapperConfig;
	activator?: () => void;
}

@Injectable()
export class UcpMercurySlotsDefinitionRepository {
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
				anchorSelector: '.article-body',
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
				anchorSelector: '.article-content > h2',
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
}
