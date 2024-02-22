import {
	activateFloorAdhesionOnUAP,
	bidBeforeRunIfNecessary,
	SlotSetupDefinition,
} from '@platforms/shared';
import {
	AdSlot,
	communicationService,
	context,
	CookieStorageAdapter,
	eventsRepository,
	InstantConfigService,
	OpenWeb,
	RepeatableSlotPlaceholderConfig,
	scrollListener,
	SlotPlaceholderConfig,
	slotPlaceholderInjector,
	UapLoadStatus,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpMobileTopBoxadExperiment } from '../experiments/ucp-mobile-top-boxad-experiment';

@Injectable()
export class UcpMobileSlotsDefinitionRepository {
	constructor(
		protected instantConfig: InstantConfigService,
		private openWeb: OpenWeb,
		private ucpMobileTopBoxadExperiment: UcpMobileTopBoxadExperiment,
	) {}

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
				classList: [AdSlot.HIDDEN_AD_CLASS, 'ad-slot'],
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

	getGalleryLeaderboardConfig(): SlotSetupDefinition {
		const slotName = 'gallery_leaderboard';
		const placeholderConfig = context.get(`slots.${slotName}.placeholder`);

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig,
				anchorSelector: '.gallery-leaderboard',
				insertMethod: 'prepend',
				classList: ['ad-slot'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	getTopBoxadConfig(): SlotSetupDefinition {
		if (!this.isInContentApplicable()) {
			return;
		}

		const slotName = 'top_boxad';

		const config = this.ucpMobileTopBoxadExperiment.getConfig();

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig: {
					createLabel: true,
				},
				anchorSelector: config.anchorSelector,
				insertMethod: config.insertMethod,
				classList: [AdSlot.HIDDEN_AD_CLASS, 'ad-slot'],
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
				avoidConflictWith: ['.ad-slot'],
				insertMethod: 'append',
				classList: [AdSlot.HIDDEN_AD_CLASS, 'ad-slot'],
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
			avoidConflictWith: ['.ad-slot', '.ad-slot-placeholder', '.incontent-boxad', '.openweb-slot'],
			repeatStart: 1,
			repeatLimit: count,
			repeatExceptions: [this.buildOpenWebReplacement()],
		};

		slotPlaceholderInjector.injectAndRepeat(icbPlaceholderConfig, adSlotCategory);
	}

	private buildOpenWebReplacement(): (repeat: number) => SlotPlaceholderConfig | null {
		const newConfigOverride: SlotPlaceholderConfig = <SlotPlaceholderConfig>{
			classList: ['openweb-slot'],
			anchorSelector: context.get('templates.incontentAnchorSelector'),
			insertMethod: 'before',
			noLabel: true,
		};

		return (repeat) => {
			return repeat === OpenWeb.MOBILE_REPLACE_REPEAT_SLOT_IDX && this.openWeb.isActive()
				? newConfigOverride
				: null;
		};
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
				classList: [AdSlot.HIDDEN_AD_CLASS, 'ad-slot'],
			},
			slotCreatorWrapperConfig: {
				classList: [
					'ad-slot-placeholder',
					'mobile-prefooter',
					'is-loading',
					AdSlot.HIDDEN_AD_CLASS,
				],
			},
			activator: () => {
				communicationService.on(
					eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
					(action: UapLoadStatus) => {
						if (action.isLoaded) {
							this.pushWaitingSlot(slotName);

							const mobilePrefooter = document.querySelector('.mobile-prefooter');
							mobilePrefooter.classList.remove(AdSlot.HIDDEN_AD_CLASS);
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
				classList: [AdSlot.HIDDEN_AD_CLASS, 'ad-slot'],
			},
			slotCreatorWrapperConfig: null,
			activator: () => {
				context.push('events.pushOnScroll.ids', slotName);
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
		const controlledSectionId = document
			.querySelector('.mw-parser-output > h2:first-of-type')
			?.getAttribute('aria-controls');

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: `#${controlledSectionId}`,
				anchorPosition: 'firstViable',
				insertMethod: 'prepend',
				avoidConflictWith: [],
			},
			activator: () => {
				context.push('events.pushOnScroll.ids', slotName);
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
				bidBeforeRunIfNecessary(slotName, () => {
					context.push('state.adStack', { id: slotName });
				});
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
				classList: [AdSlot.HIDDEN_AD_CLASS, 'ad-slot'],
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
				classList: [AdSlot.HIDDEN_AD_CLASS, 'ad-slot'],
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
				bidBeforeRunIfNecessary(slotName, () => context.push('state.adStack', { id: slotName }));
			}
		});
	}
}
