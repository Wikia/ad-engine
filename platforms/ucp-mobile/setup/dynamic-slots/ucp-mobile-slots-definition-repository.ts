import {
	communicationService,
	context,
	insertMethodType,
	InstantConfigService,
	Nativo,
	nativo,
	ofType,
	RepeatableSlotPlaceholderConfig,
	scrollListener,
	SlotCreatorConfig,
	SlotCreatorWrapperConfig,
	slotPlaceholderInjector,
	uapLoadStatus,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';
import { mobileFanFeedNativeAdListener } from './mobile-fan-feed-native-ad-listener';

export interface SlotSetupDefinition {
	slotCreatorConfig: SlotCreatorConfig;
	slotCreatorWrapperConfig?: SlotCreatorWrapperConfig;
	activator?: () => void;
}

interface SlotCreatorInsertionParamsType {
	anchorSelector: string;
	insertMethod: insertMethodType;
}

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
		const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');
		const isHome = context.get('wiki.opts.pageType') === 'home';
		const isSearch = context.get('wiki.opts.pageType') === 'search';
		const allAdsAllowed = context.get('wiki.opts.pageType') === 'all_ads';
		const hasPageHeader = !!document.querySelector('.wiki-page-header');
		const hasPortableInfobox = !!document.querySelector('.portable-infobox');

		return (
			isSearch ||
			isHome ||
			hasPortableInfobox ||
			(hasPageHeader && !hasFeaturedVideo) ||
			allAdsAllowed
		);
	}

	getTopBoxadConfig(): SlotSetupDefinition {
		if (!this.isInContentApplicable()) {
			return;
		}

		const slotName = 'top_boxad';
		const wrapperClassList = ['ad-slot-placeholder', 'top-boxad', 'is-loading'];
		const placeholderConfig = context.get(`slots.${slotName}.placeholder`);

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig,
				...this.slotCreatorInsertionParams(),
				classList: ['hide', 'ad-slot'],
				avoidConflictWith: ['.ntv-ad'],
			},
			slotCreatorWrapperConfig: {
				classList: wrapperClassList,
			},
			activator: () => {
				this.pushWaitingSlot(slotName);
			},
		};
	}

	getNativoIncontentAdConfig(): SlotSetupDefinition {
		if (!nativo.isEnabled()) {
			return;
		}

		return {
			slotCreatorConfig: {
				slotName: Nativo.INCONTENT_AD_SLOT_NAME,
				anchorSelector: '.mw-parser-output > h2:nth-of-type(4n)',
				insertMethod: 'before',
				classList: Nativo.SLOT_CLASS_LIST,
			},
			activator: () => {
				communicationService.action$.pipe(ofType(uapLoadStatus), take(1)).subscribe((action) => {
					nativo.requestAd(document.getElementById(Nativo.INCONTENT_AD_SLOT_NAME), action);
				});
			},
		};
	}

	getNativoFeedAdConfig(): SlotSetupDefinition {
		if (!nativo.isEnabled()) {
			return;
		}

		return {
			slotCreatorConfig: {
				slotName: Nativo.FEED_AD_SLOT_NAME,
				anchorSelector: '.recirculation-prefooter',
				insertMethod: 'before',
				classList: [...Nativo.SLOT_CLASS_LIST, 'hide'],
			},
			activator: () => {
				mobileFanFeedNativeAdListener();
			},
		};
	}

	private slotCreatorInsertionParams(): SlotCreatorInsertionParamsType {
		let params: SlotCreatorInsertionParamsType = {
			anchorSelector: '.mw-parser-output > h2',
			insertMethod: 'before',
		};

		if (context.get('wiki.targeting.pageType') === 'home') {
			params = {
				anchorSelector: '.mobile-main-page__wiki-description',
				insertMethod: 'after',
			};
		}

		return params;
	}

	getIncontentBoxadConfig(): SlotSetupDefinition {
		if (!this.isInContentApplicable()) {
			return;
		}

		const slotName = 'incontent_boxad_1';
		const wrapperClassList = ['ad-slot-placeholder', 'incontent-boxad', 'is-loading'];
		const placeholderConfig = context.get(`slots.${slotName}.placeholder`);

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig,
				anchorSelector: '.mw-parser-output > h2',
				avoidConflictWith: [
					'.ad-slot-placeholder',
					'.ad-slot',
					'.incontent-boxad',
					'#incontent_player',
				],
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
				repeat: {
					index: 1,
					limit: 20,
					slotNamePattern: 'incontent_boxad_{slotConfig.repeat.index}',
					updateProperties: {
						adProduct: '{slotConfig.slotName}',
						'targeting.rv': '{slotConfig.repeat.index}',
						'targeting.pos': ['incontent_boxad'],
					},
					insertBelowScrollPosition: true,
				},
			},
			slotCreatorWrapperConfig: {
				classList: wrapperClassList,
			},
			activator: () => {
				communicationService.action$.pipe(ofType(uapLoadStatus), take(1)).subscribe((action) => {
					context.push('events.pushOnScroll.ids', slotName);
					if (!action.isLoaded) {
						this.injectIncontentAdsPlaceholders();
					}
				});
				// We need to reset it here, because otherwise ucp-targeting-setup throws an error in line:
				// https://github.com/Wikia/ad-engine/blob/dev/platforms/shared/context/targeting/ucp-targeting.setup.ts#L101
				context.set('slots.incontent_player.insertBeforeSelector', '');
			},
		};
	}

	private isInContentApplicable(): boolean {
		if (context.get('wiki.opts.pageType') === 'home') {
			return !!document.querySelector('.curated-content');
		}

		return context.get('wiki.opts.pageType') !== 'search';
	}

	private injectIncontentAdsPlaceholders(): void {
		const adSlotCategory = 'incontent';
		const icbPlaceholderConfig: RepeatableSlotPlaceholderConfig = {
			classList: ['ad-slot-placeholder', 'incontent-boxad', 'is-loading'],
			anchorSelector: '.mw-parser-output > h2',
			insertMethod: 'before',
			avoidConflictWith: ['.ad-slot', '.ad-slot-placeholder', 'incontent-boxad'],
			repeatStart: 1,
			repeatLimit: 20,
		};

		communicationService.action$.pipe(ofType(uapLoadStatus), take(1)).subscribe((action) => {
			if (!action.isLoaded) {
				slotPlaceholderInjector.injectAndRepeat(icbPlaceholderConfig, adSlotCategory);
			}
		});
	}

	getMobilePrefooterConfig(): SlotSetupDefinition {
		if (!this.isMobilePrefooterApplicable()) {
			return;
		}

		const slotName = 'mobile_prefooter';
		const placeholderConfig = context.get(`slots.${slotName}.placeholder`);

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig,
				anchorSelector: '.wds-global-footer',
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: {
				classList: ['ad-slot-placeholder', 'mobile-prefooter', 'is-loading', 'hide'],
			},
			activator: () => {
				communicationService.action$.pipe(ofType(uapLoadStatus), take(1)).subscribe((action) => {
					if (action.isLoaded) {
						this.pushWaitingSlot(slotName);

						const mobilePrefooter = document.querySelector('.mobile-prefooter');
						mobilePrefooter.classList.remove('hide');
					}
				});
			},
		};
	}

	private isMobilePrefooterApplicable(): boolean {
		const MIN_NUMBER_OF_SECTIONS = 4;

		if (context.get('wiki.opts.pageType') === 'home') {
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
		const placeholderConfig = context.get(`slots.${slotName}.placeholder`);

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig,
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
			!!document.querySelector('.wds-global-footer') &&
			context.get('wiki.opts.pageType') !== 'search'
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
				anchorSelector: '#floor_adhesion_anchor',
				insertMethod: 'append',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				context.set('slots.floor_adhesion.disabled', !this.instantConfig.get('icFloorAdhesion'));
				context.set(
					'templates.floorAdhesion.showCloseButtonAfter',
					this.instantConfig.get('icFloorAdhesionTimeToCloseButton', 0),
				);

				const numberOfViewportsFromTopToPush: number =
					this.instantConfig.get('icFloorAdhesionViewportsToStart') || 0;

				if (numberOfViewportsFromTopToPush === -1) {
					this.pushWaitingSlot(slotName);
				} else {
					const distance = numberOfViewportsFromTopToPush * utils.getViewportHeight();
					scrollListener.addSlot(slotName, { distanceFromTop: distance });
				}
			},
		};
	}

	private isFloorAdhesionApplicable(): boolean {
		return this.instantConfig.get('icFloorAdhesion') && !context.get('custom.hasFeaturedVideo');
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
				context.set('slots.interstitial.disabled', false);
				this.pushWaitingSlot(slotName);
			},
		};
	}

	private isInterstitialApplicable(): boolean {
		return this.instantConfig.get('icInterstitial');
	}

	getInvisibleHighImpactConfig(): SlotSetupDefinition {
		if (!this.isInvisibleHighImpactApplicable()) {
			return;
		}

		const slotName = 'invisible_high_impact_2';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '#fandom-mobile-wrapper',
				insertMethod: 'after',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	private isInvisibleHighImpactApplicable(): boolean {
		return !this.instantConfig.get('icFloorAdhesion') && !context.get('custom.hasFeaturedVideo');
	}

	private pushWaitingSlot(slotName: string): void {
		communicationService.action$.pipe(ofType(uapLoadStatus), take(1)).subscribe((action) => {
			if (action.isLoaded) {
				context.push('events.pushOnScroll.ids', slotName);
			} else {
				context.push('state.adStack', { id: slotName });
			}
		});
	}
}
