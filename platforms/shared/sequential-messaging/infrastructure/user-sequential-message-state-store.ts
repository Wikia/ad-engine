import Cookies from 'js-cookie';
import {
	SequenceState,
	UserSequentialMessageState,
} from '../domain/data-structures/user-sequential-message-state';
import { UserSequentialMessageStateStoreInterface } from '../domain/interfaces/user-sequential-message-state-store.interface';

export class UserSequentialMessageStateStore implements UserSequentialMessageStateStoreInterface {
	static readonly cookieName = 'sequential_messaging';
	static readonly cookieDomain = 'fandom.com';
	readonly cookieDaysToLive = 7;

	constructor(private cookies: Cookies.CookiesStatic) {}

	set(userState: UserSequentialMessageState): void {
		const cookie = {};
		for (const sequenceId of Object.keys(userState)) {
			cookie[sequenceId] = {
				stepNo: userState[sequenceId].stepNo,
				width: userState[sequenceId].width,
				height: userState[sequenceId].height,
			};
		}

		this.cookies.set(UserSequentialMessageStateStore.cookieName, JSON.stringify(cookie), {
			domain: UserSequentialMessageStateStore.cookieDomain,
			expires: this.cookieDaysToLive,
		});
	}

	get(): UserSequentialMessageState {
		const cookieString = this.cookies.get(UserSequentialMessageStateStore.cookieName);
		if (cookieString == null) {
			return;
		}

		const cookie = JSON.parse(cookieString);
		const userState: UserSequentialMessageState = {};

		for (const sequenceId of Object.keys(cookie)) {
			userState[sequenceId] = new SequenceState(
				cookie[sequenceId].stepNo,
				cookie[sequenceId].width,
				cookie[sequenceId].height,
			);
		}

		return userState;
	}

	delete() {
		this.cookies.remove(UserSequentialMessageStateStore.cookieName, {
			domain: UserSequentialMessageStateStore.cookieDomain,
		});
	}
}
