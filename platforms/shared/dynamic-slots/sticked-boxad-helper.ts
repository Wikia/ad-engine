import { Injectable } from '@wikia/dependency-injection';
import {
	AdSlot,
	communicationService,
	context,
	eventsRepository,
	universalAdPackage,
} from '@wikia/ad-engine';

interface StickedBoxadHelperConfiguration {
	slotName: string;
	pusherSlotName: string;
	pageSelector: string;
	railSelector: string;
}

const ADDITIONAL_STICK_TIME = 500;
const PADDING_TOP = 36;

@Injectable()
export class StickedBoxadHelper {
	private configuration: StickedBoxadHelperConfiguration;
	private railElement: HTMLElement;

	initialize(params: StickedBoxadHelperConfiguration): void {
		if (!params.slotName) {
			return;
		}

		this.configuration = params;
		this.railElement = document.querySelectorAll(this.configuration.railSelector)[0] as HTMLElement;

		if (!this.railElement) {
			return;
		}

		if (context.get('options.stickyTbExperiment')) {
			this.enableSticking();
			return;
		}

		communicationService.on(
			eventsRepository.AD_ENGINE_UAP_NTC_LOADED,
			this.enableSticking.bind(this),
		);
	}

	private enableSticking(): void {
		communicationService.onSlotEvent(
			AdSlot.STATUS_SUCCESS,
			() => {
				this.registerPusherListener();
				this.registerViewedListener();
			},
			this.configuration.slotName,
			true,
		);
	}

	private registerPusherListener(): void {
		communicationService.onSlotEvent(
			AdSlot.CUSTOM_EVENT,
			({ payload }) => {
				if (payload.status === universalAdPackage.SLOT_STICKED_STATE) {
					const tlbHeight =
						document.getElementById(this.configuration.pusherSlotName)?.offsetHeight || PADDING_TOP;
					this.railElement.style.top = `${tlbHeight}px`;
				}
			},
			this.configuration.pusherSlotName,
		);
	}

	private registerViewedListener(): void {
		const pageElement = document.querySelector(this.configuration.pageSelector);

		communicationService.onSlotEvent(
			AdSlot.SLOT_VIEWED_EVENT,
			() => {
				setTimeout(() => {
					pageElement.classList.add('companion-viewed');
					pageElement.classList.remove('companion-stick');
				}, ADDITIONAL_STICK_TIME);
			},
			this.configuration.slotName,
			true,
		);

		pageElement.classList.add('companion-stick');
	}
}
