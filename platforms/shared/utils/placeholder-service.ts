import {
	adSlotEvent,
	communicationService,
	ofType,
	slotService,
	uapLoadStatus,
} from '@wikia/ad-engine';
import { filter, take } from 'rxjs/operators';
import { MessageBoxService } from './collapsed-messages/message-box-service';
import { PlaceholderServiceHelper } from './placeholder-service-helper';

export class PlaceholderService {
	private isUapLoaded: boolean;

	constructor(
		private placeholderHelper: PlaceholderServiceHelper,
		private messageBoxService: MessageBoxService,
	) {}

	init(): void {
		this.registerUapChecker();
		this.start();
	}

	private start(): void {
		communicationService.action$
			.pipe(
				ofType(adSlotEvent),
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
						if (this.messageBoxService.shouldAddMessageBox(action['event'], placeholder)) {
							this.messageBoxService.addMessageBox(placeholder, adSlot);
						}
					}
				}
			});
	}

	private registerUapChecker(): void {
		communicationService.action$.pipe(ofType(uapLoadStatus), take(1)).subscribe((action) => {
			this.isUapLoaded = action.isLoaded;
		});
	}
}
