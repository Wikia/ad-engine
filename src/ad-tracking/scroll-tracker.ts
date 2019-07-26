import { context, events, eventService, scrollSpeedCalculator } from '@ad-engine/core';

class ScrollTracker {
	scrollSpeedTrackingStarted: boolean;
	timer: NodeJS.Timer;

	constructor() {
		this.scrollSpeedTrackingStarted = false;
		this.timer = null;
	}

	/**
	 * Init scroll speed tracking when enabled
	 */
	initScrollSpeedTracking(applicationAreaClass: string): void {
		if (!context.get('options.scrollSpeedTracking')) {
			return;
		}

		const applicationArea = document.getElementsByClassName(applicationAreaClass)[0];

		this.scrollSpeedTrackingStarted = false;
		applicationArea.addEventListener('touchstart', () => this.trackScrollSpeedToDW());
	}

	/**
	 * Track scrollY to DW in in three 2s-periods
	 */
	trackScrollSpeedToDW(): void {
		if (this.scrollSpeedTrackingStarted) {
			return;
		}

		const timesToTrack = [0, 2, 4];
		let startScrollY = 0;
		this.scrollSpeedTrackingStarted = true;

		timesToTrack.forEach((time) => {
			this.timer = setTimeout(() => {
				const scrollY = window.scrollY || window.pageYOffset;
				eventService.emit(events.TRACK_SCROLL_Y, time, scrollY);
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

	/**
	 * Remove scroll tracking from the page
	 */
	resetScrollSpeedTracking(applicationAreaClass: string): void {
		const applicationArea = document.getElementsByClassName(applicationAreaClass)[0];
		clearTimeout(this.timer);
		applicationArea.removeEventListener('touchstart', () => this.trackScrollSpeedToDW());
	}
}

export const scrollTracker = new ScrollTracker();
