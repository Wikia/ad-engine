import { addAdvertisementLabel, stopLoadingSlot } from '@platforms/shared';
import {
	AdSlot,
	communicationService,
	context,
	insertMethodType,
	InstantConfigService,
	ofType,
	RepeatableSlotPlaceholderConfig,
	scrollListener,
	SlotCreatorConfig,
	SlotCreatorWrapperConfig,
	slotPlaceholderInjector,
	slotService,
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
		const activator = () => {
			context.push('state.adStack', { id: slotName });
			stopLoadingSlot(slotName);
		};

		return {
			activator,
			slotCreatorWrapperConfig: null,
			slotCreatorConfig: {
				slotName,
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

		return {
			slotCreatorConfig: {
				slotName,
				...this.slotCreatorInsertionParams(),
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: {
				classList: wrapperClassList,
			},
			activator: () => {
				this.pushWaitingSlot(slotName);
				addAdvertisementLabel('.top-boxad');
				stopLoadingSlot(slotName);
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
		if (!this.isInContentApplicable() || !context.get('wiki.opts.enableICLazyRequesting')) {
			return;
		}

		const slotName = 'incontent_boxad_1';
		const wrapperClassList = [
			'ad-slot-wrapper',
			'incontent-boxad',
			'ic-ad-slot-placeholder',
			'is-loading',
		];

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.mw-parser-output > h2',
				avoidConflictWith: [
					'.ad-slot-wrapper',
					'.ic-ad-slot-placeholder',
					'.ad-slot',
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
				communicationService.action$.pipe(ofType(uapLoadStatus), take(1)).subscribe(() => {
					context.push('events.pushOnScroll.ids', slotName);
				});
				this.injectIncontentAdsPlaceholders();
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
			classList: ['ic-ad-slot-placeholder', 'is-loading'],
			anchorSelector: '.mw-parser-output > h2',
			insertMethod: 'before',
			avoidConflictWith: ['.ad-slot', '.ic-ad-slot-placeholder', '.ad-slot-wrapper'],
			repeatStart: 1,
			repeatLimit: 20,
		};

		communicationService.action$.pipe(ofType(uapLoadStatus), take(1)).subscribe((action) => {
			if (!action.isLoaded) {
				slotPlaceholderInjector.injectAndRepeat(icbPlaceholderConfig, adSlotCategory);
				addAdvertisementLabel('.ic-ad-slot-placeholder');

				context.set('slots.incontent_boxad_1.insertBeforeSelector', '');
				context.set('slots.incontent_boxad_1.parentContainerSelector', '.ic-ad-slot-placeholder');

				context.set('slots.incontent_player.insertBeforeSelector', '');
				context.set('slots.incontent_player.parentContainerSelector', '.ic-ad-slot-placeholder');

				context.set('slots.affiliate_slot.insertBeforeSelector', '.ic-ad-slot-placeholder');
			}
		});
	}

	getMobilePrefooterConfig(): SlotSetupDefinition {
		if (!this.isMobilePrefooterApplicable()) {
			return;
		}

		const slotName = 'mobile_prefooter';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.wds-global-footer',
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: {
				classList: [
					'ad-slot-wrapper',
					'ad-slot-placeholder',
					'mobile-prefooter',
					'is-loading',
					'hide',
				],
			},
			activator: () => {
				this.pushWaitingSlot(slotName);
				addAdvertisementLabel('.mobile-prefooter');
				slotService.on('mobile_prefooter', AdSlot.SLOT_REQUESTED_EVENT, () => {
					const mobilePrefooter = document.querySelector('.mobile-prefooter');
					mobilePrefooter.classList.remove('hide');
				});
				stopLoadingSlot(slotName);
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

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.bottom-leaderboard',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: null,
			activator: () => {
				this.pushWaitingSlot(slotName);
				addAdvertisementLabel('.bottom-leaderboard');
				stopLoadingSlot(slotName);
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
