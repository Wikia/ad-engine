// blockadblock doesn't export anything meaningful
// it sets blockAdBlock and BlockAdBlock properties on window
import { Communicator } from '@wikia/post-quecast';
import 'blockadblock';
import { action, props } from 'ts-action';
import { utils } from '../';
import { context } from '../services';

const babDetectedEvent = action(
	'[Ad Engine] BAB detection finished',
	props<{ detected: boolean }>(),
);

const logGroup = 'bab-detection';

let bab: BlockAdBlock;
let isBabInitialised = false;

class BabDetection {
	private communicator = new Communicator();

	getName(): string {
		return logGroup;
	}

	isEnabled(): boolean {
		return context.get('options.wad.enabled');
	}

	async run(): Promise<boolean> {
		const isBabDetected: boolean = await this.checkBlocking();

		utils.logger(logGroup, 'BAB detection, AB detected:', isBabDetected);

		this.setRuntimeParams(isBabDetected);
		this.updateSrcParameter(isBabDetected);
		this.dispatchDetectionEvents(isBabDetected);

		return isBabDetected;
	}

	private checkBlocking(enabled = () => {}, disabled = () => {}): Promise<boolean> {
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
		});
		isBabInitialised = true;
	}

	private setRuntimeParams(isBabDetected: boolean): void {
		window.ads.runtime = window.ads.runtime || ({} as any);
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
		this.communicator.dispatch(babDetectedEvent({ detected: isBabDetected }));
	}
}

export const babDetection = new BabDetection();
