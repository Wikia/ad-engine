import {
	AdSlot,
	communicationService,
	context,
	InstantConfigService,
	ofType,
	scrollListener,
	SlotCreatorConfig,
	SlotCreatorWrapperConfig,
	SlotPlaceholderConfig,
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

@Injectable()
export class UcpMobileSlotsDefinitionRepository {
	constructor(protected instantConfig: InstantConfigService) {}

	getTopLeaderboardConfig(): SlotSetupDefinition {
		if (!this.isTopLeaderboardApplicable()) {
			return;
		}

		const slotName = 'top_leaderboard';
		const isTLBPlaceholderEnabled = context.get('wiki.opts.enableTLBPlaceholder');
		const activator = () => {
			context.push('state.adStack', { id: slotName });
			if (isTLBPlaceholderEnabled) {
				slotService.on('top_leaderboard', AdSlot.SLOT_RENDERED_EVENT, () => {
					const topLeaderboard = document.querySelector('.top-leaderboard');
					topLeaderboard.classList.remove('is-loading');
				});
			}
		};
		const slotCreatorWrapperConfig = {
			classList: ['ad-slot-wrapper', 'top-leaderboard'],
		};

		if (!!document.querySelector('.portable-infobox')) {
			return {
				activator,
				slotCreatorWrapperConfig: isTLBPlaceholderEnabled ? null : slotCreatorWrapperConfig,
				slotCreatorConfig: {
					slotName,
					anchorSelector: isTLBPlaceholderEnabled
						? '.top-leaderboard'
						: '.portable-infobox-wrapper',
					insertMethod: isTLBPlaceholderEnabled ? 'prepend' : 'after',
					classList: ['hide', 'ad-slot'],
				},
			};
		}

		return {
			activator,
			slotCreatorWrapperConfig: isTLBPlaceholderEnabled ? null : slotCreatorWrapperConfig,
			slotCreatorConfig: {
				slotName,
				anchorSelector: isTLBPlaceholderEnabled ? '.top-leaderboard' : '.article-content',
				insertMethod: isTLBPlaceholderEnabled ? 'prepend' : 'before',
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
		const isTBPlaceholderEnabled = context.get('wiki.opts.enableTBPlaceholder');
		const defaultClasses = ['ad-slot-wrapper', 'top-boxad'];
		const classList = isTBPlaceholderEnabled
			? [...defaultClasses, 'ic-ad-slot-placeholder', 'loading']
			: defaultClasses;

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.mw-parser-output > h2',
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: {
				classList,
			},
			activator: () => {
				this.pushWaitingSlot(slotName);
				if (isTBPlaceholderEnabled) {
					slotService.on('top_boxad', AdSlot.SLOT_RENDERED_EVENT, () => {
						const topBoxad = document.querySelector('.top-boxad');
						topBoxad.classList.remove('loading');
					});
				}
			},
		};
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
			'loading',
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
				this.pushWaitingSlot(slotName);
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
		const slotName = 'incontent ad';
		const icbPlaceholderConfig: SlotPlaceholderConfig = {
			classList: ['ic-ad-slot-placeholder', 'loading'],
			anchorSelector: '.mw-parser-output > h2',
			insertMethod: 'before',
			avoidConflictWith: ['.ad-slot', '.ic-ad-slot-placeholder', '.ad-slot-wrapper'],
			repeat: 19,
		};

		communicationService.action$.pipe(ofType(uapLoadStatus), take(1)).subscribe((action) => {
			if (!action.isLoaded) {
				slotPlaceholderInjector.inject(icbPlaceholderConfig, slotName);

				context.set('slots.incontent_boxad_1.insertBeforeSelector', '');
				context.set('slots.incontent_boxad_1.parentContainerSelector', '.ic-ad-slot-placeholder');

				context.set('slots.incontent_player.insertBeforeSelector', '');
				context.set('slots.incontent_player.parentContainerSelector', '.ic-ad-slot-placeholder');
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
				classList: ['ad-slot-wrapper', 'mobile-prefooter'],
			},
			activator: () => this.pushWaitingSlot(slotName),
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
				anchorSelector: '.article-footer',
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: {
				classList: ['ad-slot-wrapper', 'bottom-leaderboard'],
			},
			activator: () => this.pushWaitingSlot(slotName),
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
				anchorSelector: '#fandom-mobile-wrapper',
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
