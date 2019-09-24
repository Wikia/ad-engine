import { context, events, eventService, ScrollSpeedCalculator } from '@ad-engine/core';

export class ScrollTracker {
	private static instance: ScrollTracker;

	static make(): ScrollTracker {
		if (!ScrollTracker.instance) {
			ScrollTracker.instance = new ScrollTracker();
		}

		return ScrollTracker.instance;
	}

	private applicationArea: Element;
	private listener: () => void;
	private timer: NodeJS.Timer;
	private speeds: number[] = [];
	private scrollSpeedCalculator = ScrollSpeedCalculator.make();

	private constructor() {}

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

	private dispatchScrollSpeedEvents(): void {
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
			}, time * 1000) as any;
		});
	}

	resetScrollSpeedTracking(): void {
		if (!this.applicationArea) {
			return;
		}

		clearTimeout(this.timer);
		this.applicationArea.removeEventListener('touchstart', this.listener);
		if (this.speeds.length) {
			this.scrollSpeedCalculator.setAverageSessionScrollSpeed(this.speeds);
		}
	}
}
