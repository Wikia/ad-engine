import { localCache } from './local-cache';

export interface LikhoStorageElement {
	likhoType: string;
	expirationTime: number;
}

export class LikhoService {
	static TIME_TO_EXPIRE = 24 * 3600 * 1000;

	refresh(): void {
		let likhoStorage: LikhoStorageElement[] = this.retrieve();

		likhoStorage = likhoStorage.filter((item) => item.expirationTime > Date.now());

		this.save(likhoStorage);
	}

	update(likhoType: string, timeToExpire = LikhoService.TIME_TO_EXPIRE): void {
		const after24hTime: number = Date.now() + timeToExpire;
		const likhoStorage: LikhoStorageElement[] = this.retrieve();
		const likhoTypeStoredElement: LikhoStorageElement = likhoStorage.find(
			(element: LikhoStorageElement) => element.likhoType === likhoType,
		);

		if (!!likhoTypeStoredElement) {
			likhoTypeStoredElement.expirationTime = after24hTime;
		} else {
			likhoStorage.push({
				likhoType,
				expirationTime: after24hTime,
			});
		}

		this.save(likhoStorage);
	}

	getTypes(): string[] {
		return this.retrieve().map((item: LikhoStorageElement) => item.likhoType);
	}

	private save(likhoStorage: LikhoStorageElement[]): void {
		localCache.set('likho', likhoStorage);
	}

	private retrieve(): LikhoStorageElement[] {
		return localCache.get<LikhoStorageElement[]>('likho') || [];
	}
}

export const likhoService = new LikhoService();
