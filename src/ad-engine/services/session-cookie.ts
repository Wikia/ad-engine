import * as Cookies from 'js-cookie';
import { context } from './context-service';
import { CookieStorageAdapter } from './cookie-storage-adapter';
import { UniversalStorage } from './universal-storage';

export class SessionCookie {
	private static instance: SessionCookie;

	static make(): SessionCookie {
		if (!SessionCookie.instance) {
			SessionCookie.instance = new SessionCookie();
		}

		return SessionCookie.instance;
	}

	private readonly storage = new UniversalStorage(new CookieStorageAdapter());
	private readonly sessionCookieDefault = 'tracking_session_id';
	private prefix = '';

	private constructor() {
		this.prefix = this.readSessionId();
	}

	readSessionId(): string {
		const sessionCookieName: string =
			context.get('options.session.cookieName') || this.sessionCookieDefault;
		const sid: string =
			Cookies.get(sessionCookieName) || context.get('options.session.id') || 'ae3';

		this.setSessionId(sid);

		return sid;
	}

	setSessionId(sid: string): void {
		this.prefix = sid;
		context.set('options.session.id', sid);
	}

	getItem<T>(key: string): T {
		return this.storage.getItem<T>(this.getPrefixedKey(key));
	}

	setItem(key: string, input: {} | string): void {
		this.removeOrphanedItems(key);
		this.storage.setItem(this.getPrefixedKey(key), input);
	}

	removeItem(key: string): void {
		this.storage.removeItem(this.getPrefixedKey(key));
	}

	clear(): void {
		this.storage.clear();
	}

	private getPrefixedKey(key: string, prefix: string = this.prefix): string {
		return `${prefix}_${key}`;
	}

	private removeOrphanedItems(key: string): void {
		Object.keys(this.storage.getItem(''))
			.filter(
				(cookieName) =>
					cookieName !== this.getPrefixedKey(key) &&
					cookieName.includes(this.getPrefixedKey(key, '')),
			)
			.forEach((cookieName) => this.storage.removeItem(cookieName));
	}
}
