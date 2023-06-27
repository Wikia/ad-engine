import { activateFloorAdhesionOnUAP, SlotSetupDefinition } from '@platforms/shared';
import {
	communicationService,
	context,
	CookieStorageAdapter,
	eventsRepository,
	InstantConfigService,
	RepeatableSlotPlaceholderConfig,
	scrollListener,
	slotPlaceholderInjector,
	UapLoadStatus,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileSlotsDefinitionRepository {
	constructor(protected instantConfig: InstantConfigService) {}

	getTopLeaderboardConfig(): SlotSetupDefinition {
		if (!this.isTopLeaderboardApplicable()) {
			return;
		}

		const slotName = 'top_leaderboard';
		const placeholderConfig = context.get(`slots.${slotName}.placeholder`);
		const activator = () => {
			context.push('state.adStack', { id: slotName });
		};

		return {
			activator,
			slotCreatorWrapperConfig: null,
			slotCreatorConfig: {
				slotName,
				placeholderConfig,
				anchorSelector: '.top-leaderboard',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
			},
		};
	}

	private isTopLeaderboardApplicable(): boolean {
		const pageType = context.get('wiki.targeting.pageType');
		const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');
		const hasPageHeader = !!document.querySelector('.wiki-page-header');
		const hasPortableInfobox = !!document.querySelector('.portable-infobox');

		return pageType !== 'special' || hasPortableInfobox || (hasPageHeader && !hasFeaturedVideo);
	}

	getTopBoxadConfig(): SlotSetupDefinition {
		if (!this.isInContentApplicable()) {
			return;
		}

		const slotName = 'top_boxad';
		const isHome = context.get('wiki.targeting.pageType') === 'home';

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig: {
					createLabel: true,
				},
				anchorSelector: isHome
					? '.mobile-main-page__wiki-description'
					: context.get('templates.incontentAnchorSelector'),
				insertMethod: isHome ? 'after' : 'before',
				classList: ['hide', 'ad-slot'],
				avoidConflictWith: ['.ntv-ad'],
			},
			slotCreatorWrapperConfig: {
				classList: ['ad-slot-placeholder', 'top-boxad', 'is-loading'],
			},
			activator: () => {
				this.pushWaitingSlot(slotName);
				communicationService.on(
					eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
					(action: UapLoadStatus) => {
						if (action.isLoaded) {
							this.injectIncontentAdsPlaceholders(1);
							return;
						}

						this.injectIncontentAdsPlaceholders(this.isIncontentPlayerApplicable() ? 21 : 20);
					},
				);
			},
		};
	}

	getIncontentBoxadConfig(): SlotSetupDefinition {
		if (!this.isInContentApplicable()) {
			return;
		}

		const slotNamePrefix = 'incontent_boxad_';
		const slotName = `${slotNamePrefix}1`;

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.incontent-boxad',
				avoidConflictWith: ['.ad-slot', '#incontent_player'],
				insertMethod: 'append',
				classList: ['hide', 'ad-slot'],
				repeat: {
					index: 1,
					limit: 20,
					slotNamePattern: `${slotNamePrefix}{slotConfig.repeat.index}`,
					updateProperties: {
						adProduct: '{slotConfig.slotName}',
						'targeting.rv': '{slotConfig.repeat.index}',
						'targeting.pos': ['incontent_boxad'],
					},
					updateCreator: {
						anchorPosition: 'belowScrollPosition',
					},
				},
			},
			activator: () => {
				context.push('events.pushOnScroll.ids', slotName);
			},
		};
	}

	private isInContentApplicable(): boolean {
		const pageType = context.get('wiki.targeting.pageType');

		if (pageType === 'home') {
			return !!document.querySelector('.curated-content');
		}

		return pageType !== 'search';
	}

	private injectIncontentAdsPlaceholders(count: number): void {
		const adSlotCategory = 'incontent';

		const icbPlaceholderConfig: RepeatableSlotPlaceholderConfig = {
			classList: ['ad-slot-placeholder', 'incontent-boxad', 'is-loading'],
			anchorSelector: context.get('templates.incontentAnchorSelector'),
			insertMethod: 'before',
			avoidConflictWith: ['.ad-slot', '.ad-slot-placeholder', '.incontent-boxad'],
			repeatStart: 1,
			repeatLimit: count,
		};

		slotPlaceholderInjector.injectAndRepeat(icbPlaceholderConfig, adSlotCategory);
	}

	getMobilePrefooterConfig(): SlotSetupDefinition {
		if (!this.isMobilePrefooterApplicable()) {
			return;
		}

		const slotName = 'mobile_prefooter';

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig: {
					createLabel: true,
				},
				anchorSelector: '.global-footer',
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: {
				classList: ['ad-slot-placeholder', 'mobile-prefooter', 'is-loading', 'hide'],
			},
			activator: () => {
				communicationService.on(
					eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
					(action: UapLoadStatus) => {
						if (action.isLoaded) {
							this.pushWaitingSlot(slotName);

							const mobilePrefooter = document.querySelector('.mobile-prefooter');
							mobilePrefooter.classList.remove('hide');
						}
					},
				);
			},
		};
	}

	private isMobilePrefooterApplicable(): boolean {
		const MIN_NUMBER_OF_SECTIONS = 4;

		if (context.get('wiki.targeting.pageType') === 'home') {
			return !!document.querySelector('.trending-articles');
		}

		const numberOfSections = document.querySelectorAll('.mw-parser-output > h2').length;
		const hasArticleFooter = !!document.querySelector('.article-footer');

		return (
			(hasArticleFooter && !this.isInContentApplicable()) ||
			numberOfSections > MIN_NUMBER_OF_SECTIONS
		);
	}

	getBottomLeaderboardConfig(): SlotSetupDefinition {
		if (!this.isBottomLeaderboardApplicable()) {
			return;
		}

		const slotName = 'bottom_leaderboard';

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig: {
					createLabel: true,
				},
				anchorSelector: '.bottom-leaderboard',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: null,
			activator: () => {
				this.pushWaitingSlot(slotName);
			},
		};
	}

	private isBottomLeaderboardApplicable(): boolean {
		return (
			!!document.querySelector('.global-footer') &&
			context.get('wiki.targeting.pageType') !== 'search'
		);
	}

	getIncontentPlayerConfig(): SlotSetupDefinition {
		if (!this.isIncontentPlayerApplicable()) {
			return;
		}

		const slotName = 'incontent_player';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.incontent-boxad',
				anchorPosition: 'belowScrollPosition',
				insertMethod: 'prepend',
				avoidConflictWith: ['.ad-slot', '#incontent_boxad_1'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	private isIncontentPlayerApplicable(): boolean {
		return (
			context.get('custom.hasIncontentPlayer') && context.get('wiki.targeting.pageType') !== 'home'
		);
	}

	getFloorAdhesionConfig(): SlotSetupDefinition {
		let slotPushed = false;
		const slotName = 'floor_adhesion';
		const activateFloorAdhesion = () => {
			if (slotPushed) {
				return;
			}

			const numberOfViewportsFromTopToPush: number =
				this.instantConfig.get('icFloorAdhesionViewportsToStart') || 0;

			if (numberOfViewportsFromTopToPush === -1) {
				context.push('state.adStack', { id: slotName });
			} else {
				const distance = numberOfViewportsFromTopToPush * utils.getViewportHeight();
				scrollListener.addSlot(slotName, { distanceFromTop: distance });
			}

			slotPushed = true;
		};

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '#floor_adhesion_anchor',
				insertMethod: 'append',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => activateFloorAdhesionOnUAP(activateFloorAdhesion, false),
		};
	}

	getInterstitialConfig(): SlotSetupDefinition {
		if (!this.isInterstitialApplicable()) {
			return;
		}

		const slotName = 'interstitial';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '#fandom-mobile-wrapper',
				insertMethod: 'after',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				this.pushWaitingSlot(slotName);
			},
		};
	}

	private isInterstitialApplicable(): boolean {
		const cookieAdapter = new CookieStorageAdapter();

		return this.instantConfig.get('icInterstitial') && !cookieAdapter.getItem('_ae_intrsttl_imp');
	}

	private pushWaitingSlot(slotName: string): void {
		communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, (action: UapLoadStatus) => {
			if (action.isLoaded) {
				context.push('events.pushOnScroll.ids', slotName);
			} else {
				context.push('state.adStack', { id: slotName });
			}
		});
	}
}
