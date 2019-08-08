import { context, events, eventService, scrollSpeedCalculator } from '@ad-engine/core';

class ScrollTracker {
	applicationArea: Element | null = null;
	listener: () => void | null = null;
	timer: NodeJS.Timer | null = null;
	speeds: number[] = [];

	initScrollSpeedTracking(applicationAreaClass: string): void {
		if (!context.get('options.scrollSpeedTracking')) {
			return;
		}

		this.applicationArea = document.getElementsByClassName(applicationAreaClass)[0];

		if (this.applicationArea) {
			this.listener = () => this.dispatchScrollSpeedEvents();
			this.applicationArea.addEventListener('touchstart', this.listener, { once: true });
		}
	}

	dispatchScrollSpeedEvents(): void {
		const timesToTrack = [0, 2, 4];
		let prevScrollY = 0;

		timesToTrack.forEach((time) => {
			this.timer = setTimeout(() => {
				const scrollY = window.scrollY || window.pageYOffset;

				eventService.emit(events.SCROLL_TRACKING_TIME_CHANGED, time, scrollY);
				if (time === Math.min(...timesToTrack)) {
					this.speeds = [];
				} else {
					this.speeds.push(Math.abs(scrollY - prevScrollY));
				}
				prevScrollY = scrollY;
			}, time * 1000);
		});
	}

	resetScrollSpeedTracking(): void {
		if (!this.applicationArea) {
			return;
		}

		clearTimeout(this.timer);
		this.applicationArea.removeEventListener('touchstart', this.listener);
		if (this.speeds.length) {
			scrollSpeedCalculator.setAverageSessionScrollSpeed(this.speeds);
		}
	}
}

export const scrollTracker = new ScrollTracker();
