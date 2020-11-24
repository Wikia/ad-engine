import { slotsContext } from '@platforms/shared';
import {
	AdSlot,
	btRec,
	communicationService,
	context,
	Dictionary,
	DiProcess,
	fillerService,
	FmrRotator,
	globalAction,
	ofType,
	PorvataFiller,
	PorvataGamParams,
	SlotConfig,
	slotInjector,
	slotService,
	TemplateRegistry,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';

const railReady = globalAction('[Rail] Ready');

@Injectable()
export class UcpDynamicSlotsSetup implements DiProcess {
	constructor(private templateRegistry: TemplateRegistry) {}

	execute(): void {
		this.injectSlots();
		this.injectIncontentPlayer();
		this.injectAffiliateDisclaimer();
		this.configureTopLeaderboard();
		this.configureIncontentPlayerFiller();
	}

	private injectSlots(): void {
		const slots: Dictionary<SlotConfig> = context.get('slots');
		Object.keys(slots).forEach((slotName) => {
			if (slots[slotName].insertBeforeSelector) {
				slotInjector.inject(slotName, true);
			}
		});
		this.appendIncontentBoxad(slots['incontent_boxad_1']);
	}

	private appendIncontentBoxad(slotConfig: SlotConfig): void {
		const icbSlotName = 'incontent_boxad_1';

		if (context.get('custom.hasFeaturedVideo')) {
			context.set(`slots.${icbSlotName}.defaultSizes`, [300, 250]);
		}

		communicationService.action$.pipe(ofType(railReady), take(1)).subscribe(() => {
			const parent = document.querySelector<HTMLDivElement>(slotConfig.parentContainerSelector);

			if (parent) {
				this.appendRotatingSlot(icbSlotName, slotConfig.repeat.slotNamePattern, parent);
			}
		});
	}

	private injectIncontentPlayer(): void {
		if (context.get('custom.hasIncontentPlayer')) {
			if (context.get('services.distroScale.enabled')) {
				context.push('state.adStack', { id: 'incontent_player' });
			} else {
				context.push('events.pushOnScroll.ids', 'incontent_player');
			}
		}
	}

	private configureIncontentPlayerFiller(): void {
		const icpSlotName = 'incontent_player';
		const fillerOptions: Partial<PorvataGamParams> = {
			enableInContentFloating: true,
		};

		context.set(`slots.${icpSlotName}.customFiller`, 'porvata');
		context.set(`slots.${icpSlotName}.customFillerOptions`, fillerOptions);

		fillerService.register(new PorvataFiller());
	}

	private appendRotatingSlot(
		slotName: string,
		slotNamePattern: string,
		parentContainer: HTMLElement,
	): void {
		const container = document.createElement('div');
		const prefix = slotNamePattern.replace(slotNamePattern.match(/({.*})/g)[0], '');
		const rotator = new FmrRotator(slotName, prefix, btRec);

		container.id = slotName;
		parentContainer.appendChild(container);
		rotator.rotateSlot();
	}

	private configureTopLeaderboard(): void {
		const hiviLBEnabled = context.get('options.hiviLeaderboard');

		if (hiviLBEnabled) {
			context.set('slots.top_leaderboard.firstCall', false);
			context.push('state.adStack', { id: 'hivi_leaderboard' });

			slotService.on('hivi_leaderboard', AdSlot.STATUS_SUCCESS, () => {
				slotService.setState('top_leaderboard', false);
				context.push('state.adStack', { id: 'top_leaderboard' });
			});

			slotService.on('hivi_leaderboard', AdSlot.STATUS_COLLAPSE, () => {
				const adSlot = slotService.get('hivi_leaderboard');

				if (!adSlot.isEmpty) {
					slotService.setState('top_leaderboard', false);
				}

				context.push('state.adStack', { id: 'top_leaderboard' });
			});
		} else {
			context.push('state.adStack', { id: 'top_leaderboard' });
		}

		if (
			!context.get('custom.hasFeaturedVideo') &&
			context.get('wiki.targeting.pageType') !== 'special'
		) {
			slotsContext.addSlotSize(hiviLBEnabled ? 'hivi_leaderboard' : 'top_leaderboard', [3, 3]);

			if (context.get('templates.stickyTlb.lineItemIds')) {
				context.set('templates.stickyTlb.enabled', true);
				context.push(
					`slots.${hiviLBEnabled ? 'hivi_leaderboard' : 'top_leaderboard'}.defaultTemplates`,
					'stickyTlb',
				);
			}
		}
	}

	private injectAffiliateDisclaimer(): void {
		slotService.on('affiliate_slot', AdSlot.STATUS_SUCCESS, () => {
			this.templateRegistry.init('affiliateDisclaimer', slotService.get('affiliate_slot'));
		});
	}
}
