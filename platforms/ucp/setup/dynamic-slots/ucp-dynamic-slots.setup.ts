import { DynamicSlotsSetup } from '@platforms/shared';
import {
	AdSlot,
	btRec,
	context,
	Dictionary,
	fillerService,
	FmrRotator,
	JWPlayerManager,
	PorvataFiller,
	SlotConfig,
	slotInjector,
	slotService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Communicator, ofType } from '@wikia/post-quecast';
import { take } from 'rxjs/operators';
import { slotsContext } from '../../../shared/slots/slots-context';

@Injectable()
export class UcpDynamicSlotsSetup implements DynamicSlotsSetup {
	configureDynamicSlots(): void {
		this.injectSlots();
		this.setupJWPlayerAds();
		this.configureTopLeaderboard();
	}

	private injectSlots(): void {
		const slots: Dictionary<SlotConfig> = context.get('slots');
		Object.keys(slots).forEach((slotName) => {
			if (slots[slotName].insertBeforeSelector) {
				slotInjector.inject(slotName, true);
			}
		});
		this.appendIncontentBoxad(slots['incontent_boxad_1']);
		this.appendIncontentPlayer();
	}

	private appendIncontentBoxad(slotConfig: SlotConfig): void {
		const icbSlotName = 'incontent_boxad_1';
		const communicator = new Communicator();

		if (context.get('custom.hasFeaturedVideo')) {
			context.set(`slots.${icbSlotName}.defaultSizes`, [300, 250]);
		}

		communicator.actions$
			.pipe(
				ofType('[Rail] Ready'),
				take(1),
			)
			.subscribe(() => {
				this.appendRotatingSlot(
					icbSlotName,
					slotConfig.repeat.slotNamePattern,
					document.querySelector(slotConfig.parentContainerSelector),
				);
			});
	}

	private appendIncontentPlayer(): void {
		const icpSlotName = 'incontent_player';

		context.set(`slots.${icpSlotName}.customFiller`, 'porvata');
		context.set(`slots.${icpSlotName}.customFillerOptions`, {
			enableInContentFloating: true,
		});
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

	private setupJWPlayerAds(): void {
		new JWPlayerManager().manage();
	}

	private configureTopLeaderboard(): void {
		const hiviLBEnabled = context.get('options.hiviLeaderboard');

		if (hiviLBEnabled) {
			context.set('slots.top_leaderboard.firstCall', false);

			slotService.on('hivi_leaderboard', AdSlot.STATUS_SUCCESS, () => {
				slotService.setState('top_leaderboard', false);
			});

			slotService.on('hivi_leaderboard', AdSlot.STATUS_COLLAPSE, () => {
				const adSlot = slotService.get('hivi_leaderboard');

				if (!adSlot.isEmpty) {
					slotService.setState('top_leaderboard', false);
				}
			});
		}

		if (!context.get('custom.hasFeaturedVideo')) {
			slotsContext.addSlotSize(hiviLBEnabled ? 'hivi_leaderboard' : 'top_leaderboard', [3, 3]);
		}
	}
}
