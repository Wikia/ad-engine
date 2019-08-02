import { LocalStorage } from './local-storage';
import { sessionCookie } from './session-cookie';

class ScrollSpeedCalculator {
	private storage = new LocalStorage(sessionCookie);

	/**
	 * Takes average scroll speed from session, default: 0
	 */
	getAverageSessionScrollSpeed(): number {
		const sessionScrollSpeed = this.storage.getItem<string>('averageScrollSpeed') || '0';
		return parseInt(sessionScrollSpeed, 10);
	}

	/**
	 * Takes number of pageviews where it was possible to count scroll speed
	 */
	getScrollSpeedRecordsNumber(): number {
		const scrollRecords = this.storage.getItem<string>('scrollSpeedRecordsNumber') || '0';
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

		this.storage.setItem('averageScrollSpeed', Math.round(newScrollSpeed).toString());
		this.storage.setItem('scrollSpeedRecordsNumber', (scrollRecords + 1).toString());
	}
}

export const scrollSpeedCalculator = new ScrollSpeedCalculator();
