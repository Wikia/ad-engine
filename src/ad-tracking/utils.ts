/**
 * Takes average scroll speed from session, default: 0
 */
export function getAverageSessionScrollSpeed() {
	const sessionScrollSpeed = window.sessionStorage.getItem('averageScrollSpeed') || '0';
	return parseInt(sessionScrollSpeed, 10);
}

/**
 * Takes number of pageviews where it was possible to count scroll speed
 */
function getCurrentValidScrollSpeedPageViews() {
	const pageViews = window.sessionStorage.getItem('validScrollSpeedPageViews') || '0';
	return parseInt(pageViews, 10);
}

/**
 * Set calculate average scroll speed during session
 */
export function setAverageSessionScrollSpeed(newSpeedRecord) {
	const scrollSpeed = getAverageSessionScrollSpeed();
	const pageViews = getCurrentValidScrollSpeedPageViews();
	const newScrollSpeed = (scrollSpeed * pageViews + newSpeedRecord) / (pageViews + 1);

	window.sessionStorage.setItem('averageScrollSpeed', Math.round(newScrollSpeed).toString());
	window.sessionStorage.setItem('validScrollSpeedPageViews', (pageViews + 1).toString());
}
