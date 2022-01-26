import Cookies from 'js-cookie';
import { UserSequentialMessageState } from '../domain/data-structures/user-sequential-message-state';
import { UserSequentialMessageStateStoreInterface } from '../domain/interfaces/user-sequential-message-state-store.interface';

export class UserSequentialMessageStateStore implements UserSequentialMessageStateStoreInterface {
	cookieName = 'sequential_messaging';

	constructor(private cookies: Cookies.CookiesStatic) {}

	set(userState: UserSequentialMessageState): void {
		this.cookies.set(this.cookieName, userState);
	}
}
