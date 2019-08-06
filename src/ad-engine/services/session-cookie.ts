import * as Cookies from 'js-cookie';
import { context } from './context-service';
import { StorageProvider } from './universal-storage';

interface WikiaCookieAttributes extends Cookies.CookieAttributes {
	overwrite: boolean;
	maxAge: number;
}

class SessionCookie implements StorageProvider {
	private readonly cacheMaxAge = 30 * 60 * 1000;
	private readonly sessionCookieDefault = 'tracking_session_id';
	private keysSeen = [];
	private prefix = '';

	constructor() {
		this.prefix = this.readSessionId();
	}

	private getCookieDomain(): string | undefined {
		const domain: string[] = window.location.hostname.split('.');

		return domain.length > 1
			? `.${domain[domain.length - 2]}.${domain[domain.length - 1]}`
			: undefined;
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

	getItem(key: string): string {
		return Cookies.get(`${this.prefix}_${key}`);
	}

	setItem(key: string, input: string): void {
		const cookieAttributes: WikiaCookieAttributes = {
			expires: new Date(new Date().getTime() + this.cacheMaxAge),
			path: '/',
			domain: this.getCookieDomain(),
			overwrite: true,
			maxAge: this.cacheMaxAge,
		};

		if (!this.keysSeen.includes(key)) {
			this.keysSeen.push(key);
		}

		Cookies.set(`${this.prefix}_${key}`, input, cookieAttributes);
	}

	removeItem(key: string): void {
		Cookies.remove(`${this.prefix}_${key}`, {
			path: '/',
			domain: this.getCookieDomain(),
		});
	}

	clear(): void {
		this.keysSeen.forEach((key) => {
			this.removeItem(key);
		});
	}
}

export const sessionCookie = new SessionCookie();
