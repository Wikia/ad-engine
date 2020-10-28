import { context, utils } from '@ad-engine/core';
import { JWPlayer } from '../external-types/jwplayer';

const logGroup = 'watching-that';
const pluginUrl = 'https://cdn.watchingthat.net/wtat.plugin-jw.min.js';

class WatchingThatPlugin {
	private scriptPromise: Promise<Event>;

	load(player: JWPlayer): void {
		const apiKey: string | undefined = context.get('options.video.watchingThat.apiKey');

		if (!this.isEnabled() || !apiKey) {
			utils.logger(logGroup, 'WatchingThat plugin is disabled');
			return;
		}

		this.loadScriptOnce().then(() => {
			utils.logger(logGroup, 'WatchingThat plugin loaded');

			try {
				window.wtAdTracer({ apiKey }, player.getContainer().id);
			} catch (e) {
				utils.warner(logGroup, 'Failed to initialize WatchingThat plugin', e);
			}
		});
	}

	isEnabled(): boolean {
		return (
			!!context.get('options.video.watchingThat.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	private loadScriptOnce(): Promise<Event> {
		if (!this.scriptPromise) {
			this.scriptPromise = utils.scriptLoader.loadScript(pluginUrl);
		}

		return this.scriptPromise;
	}
}

export const watchingThatPlugin = new WatchingThatPlugin();
