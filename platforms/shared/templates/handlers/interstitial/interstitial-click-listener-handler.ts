import {
	AdSlot,
	CookieStorageAdapter,
	events,
	eventService,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class InterstitialClickListenerHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'display'>): Promise<void> {
		const callback = (event) => {
			const link = this.findUrl(event.target);

			if (!link) {
				return;
			}

			event.preventDefault();

			document.removeEventListener('click', callback, false);
			this.adSlot.element.setAttribute('redirect-url', link);

			transition('display');
		};

		document.addEventListener('click', callback, false);
	}

	async onLeave(): Promise<void> {
		eventService.emit(events.INTERSTITIAL_DISPLAYED);
		this.adSlot.show();

		window.location.hash = 'interstitial';

		const cookieAdapter = new CookieStorageAdapter();
		cookieAdapter.setItem('interstitial-impression', '1');
	}

	private findUrl(element): string | null {
		if (element.tagName === 'A' && element.href) {
			return element.href;
		}

		if (element.parentElement) {
			return this.findUrl(element.parentElement);
		}

		return null;
	}
}
