import { SessionCookie } from './session-cookie';

export class ScrollSpeedCalculator {
	private static instance: ScrollSpeedCalculator;

	static make(): ScrollSpeedCalculator {
		if (!ScrollSpeedCalculator.instance) {
			ScrollSpeedCalculator.instance = new ScrollSpeedCalculator();
		}

		return ScrollSpeedCalculator.instance;
	}

	private sessionCookie = SessionCookie.make();

	private constructor() {}

	/**
	 * Takes average scroll speed from session, default: 0
	 */
	getAverageSessionScrollSpeed(): number {
		const sessionScrollSpeed = this.sessionCookie.getItem<string>('averageScrollSpeed') || '0';
		return parseInt(sessionScrollSpeed, 10);
	}

	/**
	 * Takes number of pageviews where it was possible to count scroll speed
	 * @private
	 */
	getScrollSpeedRecordsNumber(): number {
		const scrollRecords = this.sessionCookie.getItem<string>('scrollSpeedRecordsNumber') || '0';
		return parseInt(scrollRecords, 10);
	}

	/**
	 * Set calculate average scroll speed during session
	 */
	setAverageSessionScrollSpeed(pageSpeeds: number[]): void {
		const newSpeedRecord = pageSpeeds.reduce((a, b) => a + b, 0) / pageSpeeds.length;
		const scrollSpeed = this.getAverageSessionScrollSpeed();
		const scrollRecords = this.getScrollSpeedRecordsNumber();
		const newScrollSpeed = (scrollSpeed * scrollRecords + newSpeedRecord) / (scrollRecords + 1);

		this.sessionCookie.setItem('averageScrollSpeed', Math.round(newScrollSpeed).toString());
		this.sessionCookie.setItem('scrollSpeedRecordsNumber', (scrollRecords + 1).toString());
	}
}
