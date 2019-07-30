import { context, events, eventService, scrollSpeedCalculator } from '@ad-engine/core';

class ScrollTracker {
	applicationArea: Element | null = null;
	timer: NodeJS.Timer | null = null;

	initScrollSpeedTracking(applicationAreaClass: string): void {
		if (!context.get('options.scrollSpeedTracking')) {
			return;
		}

		this.applicationArea = document.getElementsByClassName(applicationAreaClass)[0];

		if (this.applicationArea) {
			this.applicationArea.addEventListener('touchstart', () => this.dispatchScrollSpeedEvents(), {
				once: true,
			});
		}
	}

	dispatchScrollSpeedEvents(): void {
		const timesToTrack = [0, 2, 4];
		let startScrollY = 0;

		timesToTrack.forEach((time) => {
			this.timer = setTimeout(() => {
				const scrollY = window.scrollY || window.pageYOffset;
				eventService.emit(events.SCROLL_TRACKING_TIME_CHANGED, time, scrollY);
				if (time === Math.min(...timesToTrack)) {
					startScrollY = scrollY;
				}
				if (time === Math.max(...timesToTrack)) {
					const newSpeedRecord = scrollY - startScrollY;
					scrollSpeedCalculator.setAverageSessionScrollSpeed(newSpeedRecord);
				}
			}, time * 1000);
		});
	}

	resetScrollSpeedTracking(): void {
		if (!this.applicationArea) {
			return;
		}

		clearTimeout(this.timer);
		this.applicationArea.removeEventListener('touchstart', this.dispatchScrollSpeedEvents);
	}
}

export const scrollTracker = new ScrollTracker();
