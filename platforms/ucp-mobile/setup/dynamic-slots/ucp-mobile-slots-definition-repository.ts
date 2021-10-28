import {
	communicationService,
	context,
	insertMethodType,
	InstantConfigService,
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
		const slotHasLabel = context.get(`slots.${slotName}.label`);
		const activator = () => {
			context.push('state.adStack', { id: slotName });
		};

		return {
			activator,
			slotCreatorWrapperConfig: null,
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.top-leaderboard',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
				label: slotHasLabel,
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
		const slotHasLabel = context.get(`slots.${slotName}.label`);

		return {
			slotCreatorConfig: {
				slotName,
				...this.slotCreatorInsertionParams(),
				classList: ['hide', 'ad-slot'],
				avoidConflictWith: ['.ntv-ad'],
				label: slotHasLabel,
			},
			slotCreatorWrapperConfig: {
				classList: wrapperClassList,
			},
			activator: () => {
				this.pushWaitingSlot(slotName);
			},
		};
	}

	getNativeAdsConfig(): SlotSetupDefinition {
		if (!this.isNativeAdApplicable()) {
			return;
		}

		const slotName = 'ntv-ad';
		const wrapperClassList = ['ntv-ad'];

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.mw-parser-output > p:last-of-type',
				insertMethod: 'before',
				classList: ['ntv-ad', 'ad-slot'],
			},
			slotCreatorWrapperConfig: {
				classList: wrapperClassList,
			},
			activator: () => {
				communicationService.action$.pipe(ofType(uapLoadStatus), take(1)).subscribe((action) => {
					if (!action.isLoaded) {
						nativo.start();
					}
				});
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
		const slotHasLabel = context.get(`slots.${slotName}.label`);

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.mw-parser-output > h2',
				avoidConflictWith: [
					'.ad-slot-placeholder',
					'.ad-slot',
					'.incontent-boxad',
					'#incontent_player',
				],
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
				label: slotHasLabel,
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
				context.push('events.pushOnScroll.ids', slotName);
				communicationService.action$.pipe(ofType(uapLoadStatus), take(1)).subscribe((action) => {
					if (!action.isLoaded) {
						this.injectIncontentAdsPlaceholders();
					}
				});
				context.set('slots.incontent_boxad_1.insertBeforeSelector', '');
				context.set('slots.incontent_boxad_1.parentContainerSelector', '.incontent-boxad');

				context.set('slots.incontent_player.insertBeforeSelector', '');
				context.set('slots.incontent_player.parentContainerSelector', '.incontent-boxad');

				context.set('slots.affiliate_slot.insertBeforeSelector', '.incontent-boxad');
			},
		};
	}

	private isInContentApplicable(): boolean {
		if (context.get('wiki.opts.pageType') === 'home') {
			return !!document.querySelector('.curated-content');
		}

		return context.get('wiki.opts.pageType') !== 'search';
	}

	private isNativeAdApplicable(): boolean {
		return context.get('services.nativo.enabled') && context.get('wiki.opts.enableNativeAds');
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
		const slotHasLabel = context.get(`slots.${slotName}.label`);

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.wds-global-footer',
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
				label: slotHasLabel,
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
		const slotHasLabel = context.get(`slots.${slotName}.label`);

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.bottom-leaderboard',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
				label: slotHasLabel,
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
		const slotHasLabel = context.get(`slots.${slotName}.label`);

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '#floor_adhesion_anchor',
				insertMethod: 'append',
				classList: ['hide', 'ad-slot'],
				label: slotHasLabel,
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
		const slotHasLabel = context.get(`slots.${slotName}.label`);

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '#fandom-mobile-wrapper',
				insertMethod: 'after',
				classList: ['hide', 'ad-slot'],
				label: slotHasLabel,
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
		const slotHasLabel = context.get(`slots.${slotName}.label`);

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '#fandom-mobile-wrapper',
				insertMethod: 'after',
				classList: ['hide', 'ad-slot'],
				label: slotHasLabel,
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
