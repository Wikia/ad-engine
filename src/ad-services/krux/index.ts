import { context, Dictionary, localCache, utils } from '@ad-engine/core';

const logGroup = 'krux';

function loadScript(): Promise<Event> {
	const kruxId: string = context.get('services.krux.id');
	const kruxLibraryUrl = `//cdn.krxd.net/controltag?confid=${kruxId}`;

	return utils.scriptLoader.loadScript(kruxLibraryUrl, 'text/javascript', true, 'first', {
		id: 'krux-control-tag',
	});
}

function getKruxData(key: string): string {
	if (localCache.isAvailable()) {
		return window.localStorage[key];
	}
	if (window.navigator.cookieEnabled) {
		const match = document.cookie.match(`${key}=([^;]*)`);

		return (match && decodeURI(match[1])) || '';
	}

	return '';
}

window.Krux =
	window.Krux ||
	((...args: any[]): void => {
		window.Krux.q.push(args);
	});
window.Krux.q = window.Krux.q || [];

class Krux {
	call(): Promise<void> {
		if (!context.get('services.krux.enabled') || !context.get('options.trackingOptIn')) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		utils.logger(logGroup, 'loading');

		return loadScript().then(() => {
			this.exportPageParams();
			this.importUserData();
		});
	}

	fireEvent(eventId: string, parameters: Dictionary = null): void {
		if (!context.get('services.krux.enabled') || !context.get('options.trackingOptIn')) {
			utils.logger(logGroup, 'event not sent, krux disabled');
		}

		const account: string = context.get('services.krux.account');

		window.Krux(account, 'admEvent', eventId, {
			event_type: 'default',
			...parameters,
		});

		utils.logger(logGroup, 'event sent', eventId, parameters);
	}

	exportPageParams(): void {
		Object.keys(context.get('targeting') || {}).forEach((key) => {
			const value = context.get(`targeting.${key}`);

			if (value) {
				window[`kruxDartParam_${key}`] = value;
			}
		});
	}

	importUserData(): void {
		const user = getKruxData('kxuser') || getKruxData('kxwikia_user');
		const segments = getKruxData('kxsegs') || getKruxData('kxwikia_segs');

		context.set('targeting.kuid', user || null);
		context.set('targeting.ksg', segments ? segments.split(',') : []);
		utils.logger(logGroup, 'data set', user, segments);
	}

	getUserId(): string | null {
		return context.get('targeting.kuid') || null;
	}

	getSegments(): string[] {
		return context.get('targeting.ksg') || [];
	}
}

export const krux = new Krux();
