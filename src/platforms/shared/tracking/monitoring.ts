import { AdSlot, communicationService, context, eventsRepository, utils } from '@wikia/ad-engine';

interface EndpointInfo {
	baseUrl: string;
	service: string;
	appName?: string;
}

export class Monitoring {
	private readonly isActive: boolean;

	constructor() {
		this.isActive = utils.outboundTrafficRestrict.isOutboundTrafficAllowed('monitoring');
	}

	execute() {
		if (!this.isActive) {
			return;
		}

		this.trackGamSlotRequest();
		this.trackGamSlotRendered();
		this.trackSlotClicked();
		this.clickHookOnIframe = this.clickHookOnIframe.bind(this);
		this.clickHookOnIframe();
		this.trackLibInitialization();
	}

	public trackLibInitialization(): void {
		this.sendTimeDataToMeteringSystem('init', Math.round(utils.getTimeDelta()));
	}

	private trackGamSlotRequest(): void {
		communicationService.onSlotEvent(AdSlot.SLOT_REQUESTED_EVENT, ({ slot }) => {
			this.sendSlotStateToMeteringSystem(slot.getSlotName(), 'request');
		});
	}

	private trackGamSlotRendered(): void {
		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
			this.sendSlotStateToMeteringSystem(slot.getSlotName(), 'render');
		});
	}

	private trackSlotClicked(): void {
		communicationService.on(eventsRepository.AD_ENGINE_AD_CLICKED, (data) => {
			this.sendSlotStateToMeteringSystem(data.slotName, 'click');
		});
	}

	private sendSlotStateToMeteringSystem(slotName: string, state: string): void {
		const endpointInfo = this.getEndpointInfoFromContext();
		const endpointUrl = this.getEndpointUrlFor('slot', endpointInfo);

		fetch(`${endpointUrl}?app=${endpointInfo.appName}&slot=${slotName}&state=${state}`);
	}

	private sendTimeDataToMeteringSystem(action: string, duration: number): void {
		const endpointInfo = this.getEndpointInfoFromContext();
		const endpointUrl = this.getEndpointUrlFor('time', endpointInfo);

		fetch(`${endpointUrl}?app=${endpointInfo.appName}&action=${action}&duration=${duration}`);
	}

	private getEndpointInfoFromContext(): EndpointInfo {
		return {
			baseUrl: context.get('services.monitoring.endpoint'),
			service: context.get('services.monitoring.service'),
			appName: context.get('services.instantConfig.appName'),
		};
	}

	private getEndpointUrlFor(endpointSpecific: string, { baseUrl, service }): string {
		return [baseUrl, service, 'api', 'adengine', 'meter', endpointSpecific]
			.filter((element) => !!element)
			.join('/');
	}

	private clickHookOnIframe(prevTriggeredId: null | string = null): void {
		const monitor = setInterval(() => {
			const elem = document.activeElement;
			if (!elem || elem.tagName !== 'IFRAME') {
				return;
			}

			const id: null | string = this.extractSlotId(elem);
			if (!id || id === prevTriggeredId) {
				return;
			}
			communicationService.emit(eventsRepository.AD_ENGINE_AD_CLICKED, { slotName: id });

			clearInterval(monitor);
			this.clickHookOnIframe(id);
		}, 250);
	}

	private extractSlotId(element): null | string {
		let i = 1;
		let currentElement = element;
		while (i <= 3) {
			i++;
			currentElement = currentElement.parentElement;
			if (currentElement && currentElement.id && currentElement.id.split('/').length > 1) {
				continue;
			}
			return currentElement.id;
		}
		return null;
	}
}
