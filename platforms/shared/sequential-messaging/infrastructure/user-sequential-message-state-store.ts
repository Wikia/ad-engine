import Cookies from 'js-cookie';
import { UserSequentialMessageState } from '../domain/data-structures/user-sequential-message-state';
import { UserSequentialMessageStateStoreInterface } from '../domain/interfaces/user-sequential-message-state-store.interface';

export class UserSequentialMessageStateStore implements UserSequentialMessageStateStoreInterface {
	cookieName = 'sequential_messaging';

	constructor(private cookies: Cookies.CookiesStatic) {}

	set(userState: UserSequentialMessageState): void {
		this.cookies.set(this.cookieName, userState);
	}

	get(): UserSequentialMessageState {
		const cookieString = this.cookies.get(this.cookieName);
		if (cookieString == null) {
			return;
		}

		console.log(cookieString);
		console.log(typeof cookieString);
		console.log(JSON.parse(cookieString));
		console.log(typeof JSON.parse(cookieString));

		return JSON.parse(cookieString);
	}

	delete() {
		this.cookies.remove(this.cookieName);
	}
}
