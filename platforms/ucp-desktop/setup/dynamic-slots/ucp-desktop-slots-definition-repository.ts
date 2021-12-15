import { fanFeedNativeAdListener } from '@platforms/shared';
import {
	communicationService,
	context,
	InstantConfigService,
	Nativo,
	nativo,
	ofType,
	scrollListener,
	SlotCreatorConfig,
	SlotCreatorWrapperConfig,
	uapLoadStatus,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';

export interface SlotSetupDefinition {
	slotCreatorConfig?: SlotCreatorConfig;
	slotCreatorWrapperConfig?: SlotCreatorWrapperConfig;
	activator?: () => void;
}

@Injectable()
export class UcpDesktopSlotsDefinitionRepository {
	constructor(protected instantConfig: InstantConfigService) {}

	getTopLeaderboardConfig(): SlotSetupDefinition {
		const slotName = 'top_leaderboard';
		const placeholderConfig = context.get(`slots.${slotName}.placeholder`);

		return {
			slotCreatorConfig: {
				slotName,
				placeholderConfig,
				anchorSelector: '.top-leaderboard',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: null,
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	getTopBoxadConfig(): SlotSetupDefinition {
		if (!this.isRightRailApplicable()) {
			return;
		}

		const slotName = 'top_boxad';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.main-page-tag-rcs, #rail-boxad-wrapper',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
			},
			slotCreatorWrapperConfig: null,
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	private isRightRailApplicable(): boolean {
		return utils.getViewportWidth() >= 1024;
	}

	getBottomLeaderboardConfig(): SlotSetupDefinition {
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
				context.push('events.pushOnScroll.ids', slotName);
			},
		};
	}

	getFloorAdhesionConfig(): SlotSetupDefinition {
		if (!this.isFloorAdhesionApplicable()) {
			return;
		}

		const slotName = 'floor_adhesion';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.page',
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				// ToDo: dlaczego na requestly nie dziala?
				context.set(`slots.${slotName}.disabled`, false);

				const numberOfViewportsFromTopToPush: number =
					this.instantConfig.get('icFloorAdhesionViewportsToStart') || 0;

				if (numberOfViewportsFromTopToPush === -1) {
					context.push('state.adStack', { id: slotName });
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

	getInvisibleHighImpactConfig(): SlotSetupDefinition {
		if (!this.isInvisibleHighImpactApplicable()) {
			return;
		}

		const slotName = 'invisible_high_impact_2';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.page',
				insertMethod: 'before',
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

	getNativoIncontentAdConfig(): SlotSetupDefinition {
		if (!nativo.isEnabled()) {
			return;
		}

		return {
			slotCreatorConfig: {
				slotName: Nativo.INCONTENT_AD_SLOT_NAME,
				anchorSelector: '.mw-parser-output > h2:nth-of-type(2)',
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
			activator: () => {
				fanFeedNativeAdListener((uapLoadStatusAction: any = {}) =>
					nativo.requestAd(document.getElementById(Nativo.FEED_AD_SLOT_NAME), uapLoadStatusAction),
				);
			},
		};
	}
}
