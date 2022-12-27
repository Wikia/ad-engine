// blockadblock doesn't export anything meaningful
import { communicationService, eventsRepository } from '@ad-engine/communication';
// it sets blockAdBlock and BlockAdBlock properties on window
import 'blockadblock';
import { utils } from '../';
import { context } from '../services';

const logGroup = 'bab-detection';

let bab: BlockAdBlock;
let isBabInitialised = false;

class BabDetection {
	getName(): string {
		return logGroup;
	}

	isEnabled(): boolean {
		return context.get('options.wad.enabled');
	}

	isBlocking(): boolean {
		return context.get('options.wad.blocking');
	}

	async run(): Promise<boolean> {
		const isBabDetected: boolean = await this.checkBlocking();

		utils.logger(logGroup, 'BAB detection, AB detected:', isBabDetected);

		this.setBodyClass(isBabDetected);
		this.setRuntimeParams(isBabDetected);
		this.updateSrcParameter(isBabDetected);
		this.dispatchDetectionEvents(isBabDetected);

		return isBabDetected;
	}

	private checkBlocking(
		enabled = () => {
			// feel free to overwrite
		},
		disabled = () => {
			// feel free to overwrite
		},
	): Promise<boolean> {
		return new Promise((resolve) => {
			if (!isBabInitialised) {
				if (typeof BlockAdBlock === 'undefined') {
					resolve(true);

					return;
				}
				this.setupBab();
			}

			bab.onDetected(() => resolve(true));
			bab.onNotDetected(() => resolve(false));

			bab.check(true);
		}).then((detected: boolean): boolean => {
			if (detected) {
				enabled();
			} else {
				disabled();
			}

			return detected;
		});
	}

	private setupBab(): void {
		bab = new BlockAdBlock({
			checkOnLoad: false,
			resetOnEnd: true,
			loopCheckTime: 50,
			loopMaxNumber: 5,
			debug: !!utils.queryString.get('bt_rec_debug') || false,
		});
		isBabInitialised = true;
	}

	private setRuntimeParams(isBabDetected: boolean): void {
		window.ads.runtime = window.ads.runtime || ({} as Runtime);
		window.ads.runtime.bab = window.ads.runtime.bab || {};
		window.ads.runtime.bab.blocking = isBabDetected;

		context.set('options.wad.blocking', isBabDetected);
	}

	private updateSrcParameter(isBabDetected: boolean): void {
		const newSrcValue = context.get('options.wad.blockingSrc');

		if (isBabDetected && newSrcValue) {
			context.set('src', newSrcValue);
		}
	}

	private dispatchDetectionEvents(isBabDetected: boolean): void {
		const event = document.createEvent('Event');
		const name = isBabDetected ? 'bab.blocking' : 'bab.not_blocking';

		// Legacy
		event.initEvent(name, true, false);
		document.dispatchEvent(event);

		// Post-QueCast
		communicationService.emit(eventsRepository.AD_ENGINE_BAB_DETECTION, {
			detected: isBabDetected,
		});
	}

	private setBodyClass(isBabDetected: boolean): void {
		if (isBabDetected) {
			document.body.classList.add('bab-detected');
		}
	}
}

export const babDetection = new BabDetection();
