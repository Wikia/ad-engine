import { DynamicSlotsSetup } from '@platforms/shared';
import { btRec, context, Dictionary, FmrRotator, SlotConfig } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Communicator, ofType } from '@wikia/post-quecast';
import { take } from 'rxjs/operators';

@Injectable()
export class UcpDynamicSlotsSetup implements DynamicSlotsSetup {
	configureDynamicSlots(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const slots: Dictionary<SlotConfig> = context.get('slots');
		Object.keys(slots).forEach((slotName) => {
			if (slots[slotName].nextSiblingSelector) {
				this.insertSlot(
					slotName,
					document.querySelector(slots[slotName].nextSiblingSelector),
					true,
				);
			}
		});
		this.appendIncontentBoxad(slots['incontent_boxad_1']);
	}

	private appendIncontentBoxad(slotConfig: SlotConfig): void {
		const communicator = new Communicator();

		communicator.actions$
			.pipe(
				ofType('[Rail] Ready'),
				take(1),
			)
			.subscribe(() => {
				this.appendRotatingSlot(
					'incontent_boxad_1',
					slotConfig.repeat.slotNamePattern,
					document.querySelector(slotConfig.parentContainerSelector),
				);
			});
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

	private insertSlot(
		slotName: string,
		nextSibling: HTMLElement,
		disablePushOnScroll: boolean,
	): HTMLElement {
		const container = document.createElement('div');

		container.id = slotName;

		nextSibling.parentNode.insertBefore(container, nextSibling);

		if (!disablePushOnScroll) {
			context.push('events.pushOnScroll.ids', slotName);
		}

		return container;
	}
}
