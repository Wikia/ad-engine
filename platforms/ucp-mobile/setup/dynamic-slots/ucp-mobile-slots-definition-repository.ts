import {
	AdSlot,
	communicationService,
	context,
	insertMethodType,
	InstantConfigService,
	ofType,
	scrollListener,
	SlotCreatorConfig,
	SlotCreatorWrapperConfig,
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
		const activator = () => {
			context.push('state.adStack', { id: slotName });
			slotService.on('top_leaderboard', AdSlot.SLOT_RENDERED_EVENT, () => {
				const topLeaderboard = document.querySelector('.top-leaderboard');
				topLeaderboard.classList.remove('is-loading');
			});
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
		const isTBPlaceholderOnBackendEnabled = context.get('wiki.opts.enableTBPlaceholderOnBackend');
		const defaultClasses = ['ad-slot-placeholder', 'top-boxad', 'is-loading'];

		const clsImprovedSlotSetupDefinition: SlotSetupDefinition = {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.top-boxad',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: null,
			activator: () => {
				context.push('state.adStack', { id: slotName });
				slotService.on('top_boxad', AdSlot.SLOT_RENDERED_EVENT, () => {
					const topBoxAd = document.querySelector('.top-boxad');
					topBoxAd.classList.remove('is-loading');
				});
			},
		};

		let slotCreatorConfig: {
			anchorSelector: string;
			insertMethod: insertMethodType;
		} = {
			anchorSelector: '.mw-parser-output > h2',
			insertMethod: 'before',
		};

		if (context.get('wiki.targeting.pageType') === 'home') {
			slotCreatorConfig = {
				anchorSelector: '.mobile-main-page__wiki-description',
				insertMethod: 'after',
			};
		}

		const slotSetupDefinition: SlotSetupDefinition = {
			slotCreatorConfig: {
				slotName,
				...slotCreatorConfig,
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: {
				classList: defaultClasses,
			},
			activator: () => {
				this.pushWaitingSlot(slotName);
				slotService.on('top_boxad', AdSlot.SLOT_RENDERED_EVENT, () => {
					const topBoxad = document.querySelector('.top-boxad');
					topBoxad.classList.remove('is-loading');
				});
			},
		};

		return isTBPlaceholderOnBackendEnabled ? clsImprovedSlotSetupDefinition : slotSetupDefinition;
	}

	private isInContentApplicable(): boolean {
		if (context.get('wiki.opts.pageType') === 'home') {
			return !!document.querySelector('.curated-content');
		}

		return context.get('wiki.opts.pageType') !== 'search';
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
				anchorSelector: '.bottom-leaderboard',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: null,
			activator: () => {
				this.pushWaitingSlot(slotName);

				slotService.on('bottom_leaderboard', AdSlot.SLOT_RENDERED_EVENT, () => {
					const bottomLeaderboard = document.querySelector('.bottom-leaderboard');
					bottomLeaderboard.classList.remove('is-loading');
				});
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
