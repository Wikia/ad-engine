import * as Cookies from 'js-cookie';
import { StorageProvider } from './universal-storage';

interface WikiaCookieAttributes extends Cookies.CookieAttributes {
	overwrite: boolean;
	maxAge: number;
}

export class CookieStorageAdapter implements StorageProvider {
	private readonly cacheMaxAge = 30 * 60 * 1000;
	private keysSeen = new Set<string>();

	getItem(key: string): string {
		return Cookies.get(key);
	}

	setItem(key: string, input: string): void {
		const cookieAttributes: WikiaCookieAttributes = {
			expires: new Date(new Date().getTime() + this.cacheMaxAge),
			path: '/',
			domain: this.getCookieDomain(),
			overwrite: true,
			maxAge: this.cacheMaxAge,
		};

		this.keysSeen.add(key);
		Cookies.set(key, input, cookieAttributes);
	}

	removeItem(key: string): void {
		this.keysSeen.delete(key);
		Cookies.remove(key, {
			path: '/',
			domain: this.getCookieDomain(),
		});
	}

	clear(): void {
		this.keysSeen.forEach((key) => {
			this.removeItem(key);
		});
	}

	private getCookieDomain(): string | undefined {
		const domain: string[] = window.location.hostname.split('.');

		return domain.length > 1
			? `.${domain[domain.length - 2]}.${domain[domain.length - 1]}`
			: undefined;
	}
}
