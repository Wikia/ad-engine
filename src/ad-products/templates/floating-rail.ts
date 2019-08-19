import { context, scrollListener, utils } from '@ad-engine/core';

const adsInRail = 2;
const biggestAdSize = 600;

let availableSpace = null;

interface FloatingRailConfig {
	railSelector: string;
	startOffset: number;
	wrapperSelector: string;
}

interface FloatingRailParams {
	offset?: number;
}

export class FloatingRail {
	static getName() {
		return 'floatingRail';
	}

	static getDefaultConfig() {
		return {
			enabled: true,
			railSelector: '#rail',
			wrapperSelector: '#rail-wrapper',
			startOffset: 0,
		};
	}

	static isEnabled() {
		return context.get('templates.floatingRail.enabled') && context.get('state.isMobile') === false;
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

	init(params) {
		this.params = params;

		const offset = this.params.offset || 0;

		if (!this.railWrapper || !FloatingRail.isEnabled() || this.getAvailableSpace() === 0) {
			return;
		}

		const floatingSpace = Math.min(offset, this.getAvailableSpace());

		scrollListener.addCallback(() => {
			const start = this.config.startOffset + utils.getTopOffset(this.railWrapper);
			const end = start + floatingSpace;
			const scrollPosition =
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

	getAvailableSpace() {
		if (availableSpace === null) {
			const children = this.railWrapper.lastElementChild as HTMLElement;
			const childrenHeight = children.offsetTop + children.offsetHeight;
			const space = this.railWrapper.offsetHeight;

			availableSpace = Math.max(0, space - childrenHeight - adsInRail * biggestAdSize);
		}

		return availableSpace;
	}
}
