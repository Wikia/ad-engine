import { context, globalContextService, targetingService } from '../services';

class DisplayAndVideoAdsSyncContext {
	private vastRequestedBeforePlayer = false;

	hasFeaturedVideo(): boolean {
		return !!context.get('custom.hasFeaturedVideo');
	}

	getVideoSyncedWithDisplayLines(): [string] {
		return context.get('options.video.uapJWPLineItemIds') || [];
	}

	getSyncTimeout(): number | undefined {
		return context.get('options.jwpMaxDelayTimeout');
	}

	isTaglessRequestEnabled() {
		return context.get('options.video.displayAndVideoAdsSyncEnabled');
	}

	wasVastRequestedBeforePlayer(): boolean {
		return this.vastRequestedBeforePlayer;
	}

	clearVideoSyncStatus(): void {
		this.vastRequestedBeforePlayer = false;
	}

	setVastRequestedBeforePlayer() {
		this.vastRequestedBeforePlayer = true;
	}

	isSyncEnabled() {
		return (
			this.hasFeaturedVideo() &&
			this.getSyncTimeout() &&
			this.getVideoSyncedWithDisplayLines().length > 0 &&
			this.isEnabledByConfig()
		);
	}

	private isEnabledByConfig() {
		const flag = context.get('options.video.syncWithDisplay');

		if (typeof flag === 'string') {
			return DisplayAndVideoAdsSyncContext.hasBundleOrTag(flag);
		} else if (Array.isArray(flag)) {
			return flag.some((v) => DisplayAndVideoAdsSyncContext.hasBundleOrTag(v));
		}
		return !!flag;
	}

	private static hasBundleOrTag(tagOrBundle: string): boolean {
		const tag = tagOrBundle.split('=');

		if (tag.length == 2) {
			const value = targetingService.get(tag[0]);

			return Array.isArray(value) ? value.includes(tag[1]) : value === tag[1];
		}
		return globalContextService.hasBundle(tagOrBundle);
	}
}

export const displayAndVideoAdsSyncContext = new DisplayAndVideoAdsSyncContext();
