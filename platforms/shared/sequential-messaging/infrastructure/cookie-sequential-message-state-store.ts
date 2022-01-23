import { SequentialMessageState, SequentialMessageStateStore } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import Cookies from 'js-cookie';

const COOKIE_NAME = 'seqMsg';

@Injectable()
export class CookieSequentialMessageStateStore implements SequentialMessageStateStore {
	get(): SequentialMessageState {
		const cookie = Cookies.get(COOKIE_NAME);
		return cookie ? JSON.parse(atob(cookie)) : undefined;
	}

	save(state: SequentialMessageState): void {
		Cookies.set(COOKIE_NAME, btoa(JSON.stringify(state)));
	}
}
