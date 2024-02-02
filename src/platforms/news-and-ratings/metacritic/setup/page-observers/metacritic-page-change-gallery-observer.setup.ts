import { communicationService, eventsRepository } from '@ad-engine/communication';
import { AdSlot, AdSlotEvent, context, slotService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MetacriticPageChangeGalleryObserver implements DiProcess {
	protected elementToObserveMutationSelector =
		'div.gallery2 div.slidex_wrapper div.slidex.slide_layout';
	protected slotsNamesToHandle = ['mpu_plus_top', 'mpu_bottom'];

	private currentUrl = '';

	execute(): void {
		const config = { childList: true, subtree: false };
		this.currentUrl = location.href;

		const elementToObserveMutation = document.querySelector(this.elementToObserveMutationSelector);

		if (!elementToObserveMutation) {
			return;
		}

		const observer = new MutationObserver(() => this.handleMutation());

		observer.observe(elementToObserveMutation, config);
	}

	private handleMutation(): void {
		if (this.currentUrl === location.href) {
			return;
		}

		this.currentUrl = location.href;

		this.slotsNamesToHandle.forEach((slotNameToHandle) => {
			slotService.remove(slotService.get(slotNameToHandle));

			communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
				communicationService.onSlotEvent(
					AdSlotEvent.DESTROYED_EVENT,
					this.handleSlotDestroyed.bind(this),
					slotNameToHandle,
					true,
				);
			});
		});
	}

	private handleSlotDestroyed(eventData): void {
		const slot: AdSlot = eventData.slot;
		context.push('state.adStack', { id: slot.getSlotName() });
		communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
	}
}
