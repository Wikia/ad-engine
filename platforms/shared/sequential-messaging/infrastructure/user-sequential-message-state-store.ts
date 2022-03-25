import Cookies from 'js-cookie';
import { UserSequentialMessageState } from '../domain/data-structures/user-sequential-message-state';
import { UserSequentialMessageStateStoreInterface } from '../domain/interfaces/user-sequential-message-state-store.interface';

export class UserSequentialMessageStateStore implements UserSequentialMessageStateStoreInterface {
	static readonly cookieName = 'sequential_messaging';
	static readonly cookieDomain = 'fandom.com';
	readonly cookieDaysToLive = 7;

	constructor(private cookies: Cookies.CookiesStatic) {}

	set(userState: UserSequentialMessageState): void {
		this.cookies.set(UserSequentialMessageStateStore.cookieName, JSON.stringify(userState), {
			domain: UserSequentialMessageStateStore.cookieDomain,
			expires: this.cookieDaysToLive,
		});
	}

	get(): UserSequentialMessageState {
		const cookieString = this.cookies.get(UserSequentialMessageStateStore.cookieName);
		if (cookieString == null) {
			return;
		}

		return JSON.parse(cookieString);
	}

	delete() {
		this.cookies.remove(UserSequentialMessageStateStore.cookieName, {
			domain: UserSequentialMessageStateStore.cookieDomain,
		});
	}
}
