import { context, events, eventService, ScrollSpeedCalculator, utils } from '@ad-engine/core';

interface SpeedMeasurement {
	time: number;
	distance: number;
}

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
	private timers: utils.PromisedTimeout<SpeedMeasurement>[];
	private timesToTrack = [0, 2, 4];
	private scrollSpeedCalculator = ScrollSpeedCalculator.make();
	private prevScrollY = 0;

	get scrollY(): number {
		return window.scrollY || window.pageYOffset;
	}

	get distance(): number {
		return Math.abs(this.scrollY - this.prevScrollY);
	}

	private constructor() {}

	/**
	 * @param applicationAreaClass Class name of area upon which touchstart event triggers tracking
	 */
	initScrollSpeedTracking(applicationAreaClass: string): void {
		this.applicationArea = document.getElementsByClassName(applicationAreaClass)[0];

		if (this.isEnabled()) {
			this.addTouchStartListener();

			eventService.on(events.BEFORE_PAGE_CHANGE_EVENT, () => {
				this.finishScrollSpeedTracking();
			});
		}
	}

	private isEnabled(): boolean {
		return !!context.get('options.scrollSpeedTracking') && !!this.applicationArea;
	}

	private async dispatchScrollSpeedEvents(): Promise<void> {
		this.timers = this.timesToTrack
			.map((time) => utils.buildPromisedTimeout(time))
			.map(({ cancel, promise }) => ({
				cancel,
				promise: promise.then((time) => {
					const measurement: SpeedMeasurement = {
						time,
						distance: this.distance,
					};

					eventService.emit(events.SCROLL_TRACKING_TIME_CHANGED, time, this.scrollY);
					this.prevScrollY = this.scrollY;

					return measurement;
				}),
			}));

		const measurements: SpeedMeasurement[] = await Promise.all(
			this.timers.map((timer) => timer.promise),
		);

		this.finishScrollSpeedTracking();

		this.scrollSpeedCalculator.setAverageSessionScrollSpeed(
			measurements
				.filter((measurement) => measurement.time > 0)
				.map((measurement) => measurement.distance),
		);
	}

	private finishScrollSpeedTracking(): void {
		this.timers.forEach((timer) => timer.cancel());
		this.removeTouchStartListener();
	}

	private addTouchStartListener(): void {
		this.listener = () => this.dispatchScrollSpeedEvents();
		this.applicationArea.addEventListener('touchstart', this.listener, { once: true });
	}

	private removeTouchStartListener(): void {
		this.applicationArea.removeEventListener('touchstart', this.listener);
	}
}
