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
	getCurrentValidScrollSpeedPageViews(): number {
		const pageViews = this.storage.getItem<string>('validScrollSpeedPageViews') || '0';
		return parseInt(pageViews, 10);
	}

	/**
	 * Set calculate average scroll speed during session
	 */
	setAverageSessionScrollSpeed(newSpeedRecord: number): void {
		const scrollSpeed = this.getAverageSessionScrollSpeed();
		const pageViews = this.getCurrentValidScrollSpeedPageViews();
		const newScrollSpeed = (scrollSpeed * pageViews + newSpeedRecord) / (pageViews + 1);

		this.storage.setItem('averageScrollSpeed', Math.round(newScrollSpeed).toString());
		this.storage.setItem('validScrollSpeedPageViews', (pageViews + 1).toString());
	}
}

export const scrollSpeedCalculator = new ScrollSpeedCalculator();
