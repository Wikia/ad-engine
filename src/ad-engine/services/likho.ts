interface LikhoStorageElement {
	likhoType: string;
	expirationTime: number;
}

export class LikhoExpirationService {
	static TIME_TO_EXPIRE = 24 * 3600 * 1000;

	update(likhoType: string, timeToExpire = LikhoExpirationService.TIME_TO_EXPIRE): void {
		const after24hTime = Date.now() + timeToExpire;
		const likhoStorage = (JSON.parse(localStorage.getItem('likho')) || []) as LikhoStorageElement[];
		const likhoTypeStoredElement = likhoStorage.find((x) => x.likhoType === likhoType);

		if (likhoTypeStoredElement) {
			likhoTypeStoredElement.expirationTime = after24hTime;
		} else {
			likhoStorage.push({
				likhoType,
				expirationTime: after24hTime,
			} as LikhoStorageElement);
		}
		localStorage.setItem('likho', JSON.stringify(likhoStorage));
	}
}

export const likhoExpirationService = new LikhoExpirationService();
