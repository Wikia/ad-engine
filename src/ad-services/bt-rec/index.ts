import { context, Dictionary, utils } from '@ad-engine/core';

const logGroup = 'bt-loader';
const isDebug = utils.queryString.isUrlParamSet('bt-rec-debug');

interface BTPlacementConfig {
	uid: string;
	style?: Dictionary<string>;
	size: Dictionary<number>;
	lazy?: boolean;
}

/**
 * BT service handler
 */
class BTRec {
	private placementsMap: Dictionary<BTPlacementConfig>;

	/**
	 * Runs BT rec service and injects code
	 */
	async run(): Promise<void> {
		this.placementsMap = context.get('options.wad.btRec.placementsMap') || {};

		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		utils.logger(logGroup, 'loading');

		this.markAdSlots();

		if (!isDebug) {
			await this.loadScript();
		} else {
			utils.logger(logGroup, 'debug mode enabled');
		}
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
			btLibraryUrl,
			'text/javascript',
			true,
			document.head.lastChild as HTMLElement,
		);
	}

	/**
	 * Mark ad slots as ready for rec operations
	 */
	private markAdSlots(): void {
		Object.keys(this.placementsMap).forEach((key) => {
			if (!this.placementsMap[key].lazy) {
				this.duplicateSlot(key);
			}
		});
	}

	/**
	 * Duplicates slots before rec code execution
	 */
	duplicateSlot(slotName: string): HTMLElement | boolean {
		const placementClass = ['gpt-ad', 'bt-ad'];
		const slot = document.getElementById(slotName);

		if (slot) {
			const placement: BTPlacementConfig = this.placementsMap[slotName];
			const node = document.createElement('div');

			node.id = `${slotName}_bt`;
			node.classList.add(...placementClass);

			if (isDebug) {
				node.style.setProperty('width', `${placement.size.width}px`);
				node.style.setProperty('height', `${placement.size.height}px`);
				node.style.setProperty('background', '#00D6D6');
				node.style.setProperty('display', 'inline-block');
			}

			slot.parentNode.insertBefore(node, slot);

			utils.logger(logGroup, slotName, 'injected');

			return node;
		}

		return false;
	}
}

export const btRec = new BTRec();
