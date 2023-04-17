import { utils } from '@wikia/ad-engine';
import { MetricReporterSenderSlotData } from '../metric-reporter';

export function clickDetector(sendCallback: (data: MetricReporterSenderSlotData) => void) {
	let prevTriggeredId;
	const eventHandler = () => {
		const elem = document.activeElement;
		if (!elem) {
			return;
		}

		const placeholderId: null | string =
			elem.closest('div[id][data-slot-loaded=true]:not([id*="/"])')?.id ?? null;
		if (!placeholderId || placeholderId === prevTriggeredId) {
			return;
		}

		utils.logger(
			'metering-reporter-click-detector',
			`Click! on slot='${placeholderId}' is detected.`,
		);
		sendCallback({
			slotName: placeholderId,
			state: 'click',
		});

		setTimeout(() => {
			(document.activeElement as HTMLBodyElement).blur();
		}, 100);
	};

	window.addEventListener('blur', eventHandler);
}
