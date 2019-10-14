import { context, Dictionary, utils } from '@ad-engine/core';

const logGroup = 'bt-loader';
const isDebug = utils.queryString.isUrlParamSet('bt-rec-debug');

interface BTPlacementConfig {
	uid: string;
	style?: Dictionary<string>;
	size: Dictionary<number>;
	lazy?: boolean;
}

interface BTLoader {
	clearThrough: () => void;
}

/**
 * BT service handler
 */
class BTRec {
	private bt: BTLoader;
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

			this.bt = (window as any).BT;

			this.triggerScript();
		}
	}

	/**
	 * Checks if BT rec is enabled
	 */
	isEnabled() {
		return context.get('options.wad.btRec.enabled') && context.get('options.wad.blocking');
	}

	/**
	 * Get slot BT placement uid
	 */
	getPlacementId(slotName) {
		return this.placementsMap[slotName].uid || '';
	}

	/**
	 * Duplicates slots before rec code execution
	 */
	duplicateSlot(slotName: string): Node | boolean {
		const placementClass = 'bt-uid-tg';
		const slot = document.getElementById(slotName);

		if (slot) {
			const placement: BTPlacementConfig = this.placementsMap[slotName];
			const node = document.createElement('span');

			node.classList.add(placementClass);
			node.dataset['uid'] = this.getPlacementId(slotName);
			node.dataset['style'] = '';

			if (placement.style) {
				const customStyle = {};

				Object.keys(placement.style).forEach((key) => {
					node.dataset['style'] += `${key}: ${placement.style[key]};`;
					customStyle[key] = placement.style[key];
				});

				if (isDebug) {
					Object.assign(node.style, customStyle);
				}
			}

			if (isDebug) {
				node.style.width = `${placement.size.width}px`;
				node.style.height = `${placement.size.height}px`;
				node.style.background = '#00D6D6';
				node.style.display = 'inline-block';
			} else {
				node.style.display = 'none';
			}

			slot.parentNode.insertBefore(node, slot.previousSibling);

			return node;
		}

		return false;
	}

	/**
	 * Force trigger of BT code
	 */
	triggerScript(): void {
		if (!isDebug && this.bt && this.bt.clearThrough) {
			this.bt.clearThrough();
		}
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
	 * Injects BT script
	 */
	private loadScript(): Promise<Event> {
		const scriptDomain = 'wikia-inc-com.videoplayerhub.com';
		const btLibraryUrl = `//${scriptDomain}/galleryloader.js`;

		return utils.scriptLoader.loadScript(btLibraryUrl, 'text/javascript', false, document.head
			.lastChild as HTMLElement);
	}
}

export const btRec = new BTRec();
