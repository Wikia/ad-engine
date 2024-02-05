import {
	AdSlotEventPayload,
	communicationService,
	eventsRepository,
	slotService,
	UapLoadStatus,
} from '@wikia/ad-engine';
import { MessageBoxService } from './collapsed-messages/message-box-service';
import { PlaceholderServiceHelper } from './placeholder-service-helper';

export class PlaceholderService {
	private isUapLoaded: boolean;
	private placeholderHelper: PlaceholderServiceHelper;

	constructor(private messageBoxService: MessageBoxService = null) {
		this.placeholderHelper = new PlaceholderServiceHelper();
	}

	init(): void {
		this.registerUapChecker();
		this.start();
	}

	private start(): void {
		communicationService.on(eventsRepository.AD_ENGINE_SLOT_EVENT, (action: AdSlotEventPayload) => {
			if (this.placeholderHelper.isLoadingOrCollapsed(action)) {
				const adSlot = slotService.get(action.adSlotName);
				if (!adSlot) return;

				const placeholder = adSlot.getPlaceholder();
				if (!placeholder) return;

				const adLabelParent = adSlot.getConfigProperty('placeholder')?.adLabelParent;

				this.placeholderHelper.stopLoading(action.event, placeholder);

				if (this.placeholderHelper.shouldKeepPlaceholder(action.event, action.payload?.adType)) {
					this.placeholderHelper.displayPlaceholder(placeholder);
					return;
				}

				if (this.placeholderHelper.statusToHide === action.payload?.adType) {
					adSlot.disable();
					this.placeholderHelper.hidePlaceholder(placeholder);
				} else if (this.placeholderHelper.statusesToCollapse.includes(action.event)) {
					if (this.isUapLoaded) {
						this.placeholderHelper.hidePlaceholder(placeholder);
					} else {
						const adLabel = adSlot.getAdLabel(adLabelParent);

						if (adLabel) {
							this.placeholderHelper.hideAdLabel(adLabel);
						}

						if (
							this.messageBoxService &&
							this.messageBoxService.shouldAddMessageBox(action.event, placeholder)
						) {
							this.messageBoxService.addMessageBox(adSlot);
						}
					}
				}
			}
		});
	}

	private registerUapChecker(): void {
		communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, (action: UapLoadStatus) => {
			this.isUapLoaded = action.isLoaded;
		});
	}
}
