import { context, utils } from '@ad-engine/core';

const logGroup = 'bt-loader';

/**
 * BT service handler
 */
class BTRec {
	/**
	 * Runs BT rec service and injects code
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
	 * Checks if BT rec is enabled
	 */
	isEnabled(): boolean {
		return context.get('options.wad.btRec.enabled') && context.get('options.wad.blocking');
	}

	/**
	 * Injects BT script
	 */
	private loadScript(): Promise<Event> {
		const btLibraryUrl = '//btloader.com/tag?h=wikia-inc-com&upapi=true';

		return utils.scriptLoader.loadScript(
			{ src: btLibraryUrl,
			node: document.head.lastChild as HTMLElement
			}
		);
	}
}

export const btRec = new BTRec();
