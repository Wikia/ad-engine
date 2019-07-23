import { AdSlot, context, utils } from '@ad-engine/core';

const CSS_TIMING_EASE_IN_CUBIC = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';
const SLIDE_OUT_TIME = 600;
const FADE_IN_TIME = 400;
const SLOT_HIDE_TIME = 1000;

type ElementEdge = 'top' | 'bottom' | 'left' | 'right';

export interface HideOnViewabilityTemplateConfig {
	additionalHideTime: number;
	timeoutHideTime: number;
	slideOutEdge: ElementEdge;
	hideAnimation: (adSlot: AdSlot, config: HideOnViewabilityTemplateConfig) => void;
}

export class HideOnViewability {
	static getName(): string {
		return 'hideOnViewability';
	}

	static getDefaultConfig(): HideOnViewabilityTemplateConfig {
		return {
			additionalHideTime: 0,
			timeoutHideTime: 0,
			slideOutEdge: 'bottom',
			hideAnimation: (adSlot: AdSlot, config: HideOnViewabilityTemplateConfig): void => {
				const height: number = adSlot.getElement().offsetHeight;
				const edge: ElementEdge = config.slideOutEdge;
				const hideStyles = {
					transition:
						`${edge} ${SLIDE_OUT_TIME}ms ${CSS_TIMING_EASE_IN_CUBIC}, ` +
						`opacity ${FADE_IN_TIME}ms ${CSS_TIMING_EASE_IN_CUBIC}`,
					opacity: '0',
					[edge]: `-${height}px`,
				};

				Object.assign(adSlot.getElement().style, hideStyles);
			},
		};
	}

	config: HideOnViewabilityTemplateConfig;

	constructor(public adSlot: AdSlot) {
		this.config = context.get('templates.hideOnViewability') || {};
	}

	init(): void {
		utils.logger(HideOnViewability.getName(), 'init');

		if (!this.config || !this.config.hideAnimation) {
			return;
		}

		const promises = [this.getViewabilityPromise(this.adSlot)];

		if (this.config.timeoutHideTime) {
			promises.push(this.getTimeoutHidePromise());
		}

		Promise.race(promises).then(() => {
			this.hideSlot(this.adSlot);
		});
	}

	private getViewabilityPromise(adSlot: AdSlot): Promise<void> {
		return new Promise((resolve) => {
			adSlot.viewed.then(() => {
				setTimeout(() => {
					utils.logger(HideOnViewability.getName(), 'viewability Promise resolved');
					resolve();
				}, this.config.additionalHideTime || 0);
			});
		});
	}

	private getTimeoutHidePromise(): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(() => {
				utils.logger(HideOnViewability.getName(), 'timeout Promise resolved');
				resolve();
			}, this.config.timeoutHideTime);
		});
	}

	private hideSlot(adSlot: AdSlot): void {
		utils.logger(HideOnViewability.getName(), 'hiding slot');

		this.config.hideAnimation(adSlot, this.config);

		setTimeout(() => {
			adSlot.hide();
		}, SLOT_HIDE_TIME);
	}
}
