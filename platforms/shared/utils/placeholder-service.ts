import {
	adSlotEvent,
	communicationService,
	ofType,
	slotService,
	uapLoadStatus,
} from '@wikia/ad-engine';
import { filter, take } from 'rxjs/operators';
import { messageBox } from './message-box';
import { placeholderHelper } from './placeholder-service-helper';

class PlaceholderService {
	isUapLoaded: boolean;

	init(): void {
		this.registerUapChecker();
		this.start();
	}

	private start(): void {
		communicationService.action$
			.pipe(
				ofType(adSlotEvent),
				filter((action) => placeholderHelper.isLoadingOrCollapsed(action)),
			)
			.subscribe((action) => {
				const adSlot = slotService.get(action.adSlotName);
				if (!adSlot) return;

				const placeholder = adSlot.getPlaceholder();
				if (!placeholder) return;

				const adLabelParent = adSlot.getConfigProperty('placeholder')?.adLabelParent;

				if (placeholderHelper.shouldDisplayPlaceholder(action['event'], action['payload'][1])) {
					placeholderHelper.displayPlaceholder(placeholder);
					return;
				}

				placeholderHelper.stopLoading(action['event'], placeholder);

				if (placeholderHelper.statusesToCollapse.includes(action['event'])) {
					if (this.isUapLoaded) {
						placeholderHelper.hidePlaceholder(placeholder);
					} else {
						placeholderHelper.hideAdLabel(adSlot.getAdLabel(adLabelParent));
						if (placeholderHelper.shouldAddMessageBox(action['event'])) {
							messageBox.addMessageBox(placeholder, adSlot);
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

export const placeholderService = new PlaceholderService();
