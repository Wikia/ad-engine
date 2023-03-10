import { context, scrollListener, utils } from '@ad-engine/core';

const adsInRail = 2;
const biggestAdSize = 600;

let availableSpace = null;

interface FloatingRailConfig {
	enabled: boolean;
	railSelector: string;
	startOffset: number;
	wrapperSelector: string;
}

interface FloatingRailParams {
	offset?: number;
}

export class FloatingRail {
	static getName(): string {
		return 'floatingRail';
	}

	static getDefaultConfig(): FloatingRailConfig {
		return {
			enabled: true,
			railSelector: '#rail',
			wrapperSelector: '#rail-wrapper',
			startOffset: 0,
		};
	}

	static isEnabled(): boolean {
		return (
			!!context.get('templates.floatingRail.enabled') && context.get('state.isMobile') === false
		);
	}

	config: FloatingRailConfig;
	params: FloatingRailParams;
	rail: HTMLElement;
	railWrapper: HTMLElement;

	constructor() {
		this.config = context.get('templates.floatingRail') || {};
		this.rail = document.querySelector(this.config.railSelector);
		this.railWrapper = document.querySelector(this.config.wrapperSelector);
	}

	init(params): void {
		this.params = params;

		const offset: number = this.params.offset || 0;

		if (!this.railWrapper || !FloatingRail.isEnabled() || this.getAvailableSpace() === 0) {
			return;
		}

		const floatingSpace: number = Math.min(offset, this.getAvailableSpace());

		scrollListener.addCallback(() => {
			const start: number = this.config.startOffset + utils.getTopOffset(this.railWrapper);
			const end: number = start + floatingSpace;
			const scrollPosition: number =
				window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

			if (scrollPosition <= start) {
				this.rail.style.paddingTop = '';
				this.rail.classList.add('rail-static');
				this.rail.classList.remove('rail-fixed');
			} else if (scrollPosition >= end) {
				this.rail.style.paddingTop = `${floatingSpace}px`;
				this.rail.classList.remove('rail-static');
				this.rail.classList.remove('rail-fixed');
			} else {
				this.rail.style.paddingTop = '';
				this.rail.classList.remove('rail-static');
				this.rail.classList.add('rail-fixed');
			}
		});
	}

	getAvailableSpace(): number {
		if (availableSpace === null) {
			const children = this.railWrapper.lastElementChild as HTMLElement;
			const childrenHeight = children.offsetTop + children.offsetHeight;
			const space: number = this.railWrapper.offsetHeight;

			availableSpace = Math.max(0, space - childrenHeight - adsInRail * biggestAdSize);
		}

		return availableSpace;
	}
}
