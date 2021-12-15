import { fanFeedNativeAdListener } from '@platforms/shared';
import {
	btRec,
	communicationService,
	context,
	events,
	FmrRotator,
	globalAction,
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

const railReady = globalAction('[Rail] Ready');

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
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	getIncontentBoxadConfig(): SlotSetupDefinition {
		if (!this.isRightRailApplicable()) {
			return;
		}

		const slotName = 'incontent_boxad_1';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '#WikiaAdInContentPlaceHolder',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
				// todo repeat config?
			},
			activator: () => {
				communicationService.action$.pipe(ofType(railReady), take(1)).subscribe(() => {
					const slotNamePattern = context.get(`slots.${slotName}.repeat.slotNamePattern`);
					const prefix = slotNamePattern.replace(slotNamePattern.match(/({.*})/g)[0], '');
					const rotator = new FmrRotator(slotName, prefix, btRec);

					utils.listener(events.AD_STACK_START, () => {
						rotator.rotateSlot();
					});
				});
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
			activator: () => {
				context.push('events.pushOnScroll.ids', slotName);
			},
		};
	}

	getIncontentPlayerConfig(): SlotSetupDefinition {
		if (!this.isIncontentPlayerApplicable()) {
			return;
		}
		const slotName = 'incontent_player';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: context.get(`slots.${slotName}.positionSelector`),
				anchorPosition: 'belowFirstViewport',
				insertMethod: 'before',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				if (context.get('services.distroScale.enabled')) {
					context.push('state.adStack', { id: slotName });
				} else {
					// ToDo: dlaczego na requestly nie dziala?
					context.set(`slots.${slotName}.disabled`, false);
					context.push('events.pushOnScroll.ids', slotName);
				}
			},
		};
	}

	private isIncontentPlayerApplicable(): boolean {
		return context.get('custom.hasIncontentPlayer');
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
