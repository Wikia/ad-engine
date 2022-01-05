import {
	communicationService,
	eventsRepository,
	ofType,
	slotService,
	UapLoadStatus,
} from '@wikia/ad-engine';
import { filter } from 'rxjs/operators';
import { MessageBoxService } from './collapsed-messages/message-box-service';
import { PlaceholderServiceHelper } from './placeholder-service-helper';

export class PlaceholderService {
	private isUapLoaded: boolean;

	constructor(
		private placeholderHelper: PlaceholderServiceHelper,
		private messageBoxService: MessageBoxService = null,
	) {}

	init(): void {
		this.registerUapChecker();
		this.start();
	}

	private start(): void {
		communicationService.action$
			.pipe(
				ofType(communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)),
				filter((action) => this.placeholderHelper.isLoadingOrCollapsed(action)),
			)
			.subscribe((action) => {
				const adSlot = slotService.get(action.adSlotName);
				if (!adSlot) return;

				const placeholder = adSlot.getPlaceholder();
				if (!placeholder) return;

				const adLabelParent = adSlot.getConfigProperty('placeholder')?.adLabelParent;

				if (
					this.placeholderHelper.shouldDisplayPlaceholder(action['event'], action['payload'][1])
				) {
					this.placeholderHelper.displayPlaceholder(placeholder);
					return;
				}

				this.placeholderHelper.stopLoading(action['event'], placeholder);

				if (this.placeholderHelper.statusesToCollapse.includes(action['event'])) {
					if (this.isUapLoaded) {
						this.placeholderHelper.hidePlaceholder(placeholder);
					} else {
						this.placeholderHelper.hideAdLabel(adSlot.getAdLabel(adLabelParent));
						if (
							this.messageBoxService &&
							this.messageBoxService.shouldAddMessageBox(action['event'], placeholder)
						) {
							this.messageBoxService.addMessageBox(placeholder, adSlot);
						}
					}
				}
			});
	}

	private registerUapChecker(): void {
		communicationService.listen(
			eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
			(action: UapLoadStatus) => {
				this.isUapLoaded = action.isLoaded;
			},
		);
	}
}
