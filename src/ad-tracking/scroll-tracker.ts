import { context, events, eventService, scrollSpeedCalculator, utils } from '@ad-engine/core';

interface SpeedMeasurement {
	time: number;
	distance: number;
}

export class ScrollTracker {
	private applicationArea: Element;
	private listener: () => void;
	private timers: utils.PromisedTimeout<SpeedMeasurement>[];
	private measurements: SpeedMeasurement[] = [];
	private prevScrollY = 0;

	get scrollY(): number {
		return window.scrollY || window.pageYOffset;
	}

	get distance(): number {
		return Math.abs(this.scrollY - this.prevScrollY);
	}

	/**
	 *
	 * @param timesToTrack Time points (in ms) at which speed is recorder
	 * @param applicationAreaClass Class name of area upon which touchstart event triggers tracking
	 */
	constructor(private timesToTrack: number[], private applicationAreaClass: string) {}

	initScrollSpeedTracking(): void {
		this.applicationArea = document.getElementsByClassName(this.applicationAreaClass)[0];

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

	private addTouchStartListener(): void {
		this.listener = () => this.dispatchScrollSpeedEvents();
		this.applicationArea.addEventListener('touchstart', this.listener, { once: true });
	}

	private removeTouchStartListener(): void {
		this.applicationArea.removeEventListener('touchstart', this.listener);
	}

	private dispatchScrollSpeedEvents(): void {
		this.timers = this.timesToTrack.map(utils.buildPromisedTimeout).map((timer) => ({
			...timer,
			promise: timer.promise.then((time) => {
				const measurement: SpeedMeasurement = {
					time,
					distance: this.distance,
				};

				this.measurements.push(measurement);
				eventService.emit(events.SCROLL_TRACKING_TIME_CHANGED, time, this.scrollY);
				this.prevScrollY = this.scrollY;

				return measurement;
			}),
		}));

		Promise.all(this.timers.map((timer) => timer.promise))
			.then(() => this.finishScrollSpeedTracking())
			.then(() =>
				scrollSpeedCalculator.setAverageSessionScrollSpeed(
					this.measurements
						.filter((measurement) => measurement.time > 0)
						.map((measurement) => measurement.distance),
				),
			);
	}

	private finishScrollSpeedTracking(): void {
		this.timers.forEach((timer) => timer.cancel());
		this.removeTouchStartListener();
	}
}
