import { context, utils } from '@ad-engine/core';

const logGroup = 'bt-force-loader';

/**
 * BT service handler
 */
class BTForce {
	/**
	 * Runs BT force service and injects code
	 */
	async run(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		utils.logger(logGroup, 'loading');
		await this.loadScript().then(() => {
			utils.logger(logGroup, 'ready');
		});
	}

	/**
	 * Checks if BT force is enabled
	 */
	isEnabled(): boolean {
		return context.get('options.wad.btForce');
	}

	/**
	 * Injects BT script
	 */
	private loadScript(): Promise<Event> {
		const btLibraryUrl = 'https://btloader.com/tag?o=5199505043488768&upapi=true';
		return utils.scriptLoader.loadScript(btLibraryUrl, true, 'first');
	}
}

export const btForce = new BTForce();
