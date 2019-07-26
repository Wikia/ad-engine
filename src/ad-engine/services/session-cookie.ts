import * as Cookies from 'js-cookie';
import { context } from './';

interface WikiaCookieAttributes extends Cookies.CookieAttributes {
	overwrite: boolean;
	maxAge: number;
}

const cacheMaxAge = 30 * 60 * 1000;
const keysSeen = [];
const sessionCookieDefault = 'tracking_session_id';

function getCookieDomain(): string | undefined {
	const domain: string[] = window.location.hostname.split('.');

	return domain.length > 1
		? `.${domain[domain.length - 2]}.${domain[domain.length - 1]}`
		: undefined;
}

function readSessionId(): string {
	const sessionCookieName: string =
		context.get('options.session.cookieName') || sessionCookieDefault;
	const sid: string = Cookies.get(sessionCookieName) || context.get('options.session.id') || 'ae3';

	context.set('options.session.id', sid);

	return sid;
}

class SessionCookie {
	private readonly prefix: string = '';

	constructor() {
		this.prefix = readSessionId();
	}

	getItem(key: string): string {
		return Cookies.get(`${this.prefix}_${key}`);
	}

	setItem(key: string, input: {} | string): boolean {
		const cookieAttributes: WikiaCookieAttributes = {
			expires: new Date(new Date().getTime() + cacheMaxAge),
			path: '/',
			domain: getCookieDomain(),
			overwrite: true,
			maxAge: cacheMaxAge,
		};

		if (!keysSeen.includes(key)) {
			keysSeen.push(key);
		}

		Cookies.set(`${this.prefix}_${key}`, input, cookieAttributes);

		return true;
	}

	removeItem(key: string): void {
		Cookies.remove(`${this.prefix}_${key}`, {
			path: '/',
			domain: getCookieDomain(),
		});
	}

	clear(): void {
		keysSeen.forEach((key) => {
			this.removeItem(key);
		});
	}
}

export const sessionCookie = new SessionCookie();
