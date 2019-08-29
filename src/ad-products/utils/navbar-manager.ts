import { Dictionary } from '@ad-engine/core';
import { CSS_CLASSNAME_BFAA_PINNED } from '../templates/uap/constants';

// CHANGE-CANDIDATE: this method looks like it does not belong in ad-engine
export function setupNavbar(config, container: HTMLElement): void {
	if (!config.handleNavbar) {
		return;
	}

	const desktopNavbarWrapper = document.querySelector(config.desktopNavbarWrapperSelector);
	const mobileNavbarWrapper = document.querySelector(config.mobileNavbarWrapperSelector);
	const slotParent = container.parentNode;
	const sibling = document.querySelector(config.slotSibling) || container.nextElementSibling;

	if (mobileNavbarWrapper) {
		slotParent.insertBefore(mobileNavbarWrapper, sibling);
	}

	if (desktopNavbarWrapper) {
		slotParent.insertBefore(desktopNavbarWrapper, sibling);
	}
}

export class NavbarManager {
	constructor(private navbar: HTMLElement) {}

	applyStyles(styles: Dictionary<string>): void {
		Object.assign(this.navbar.style, styles);
	}

	getHeight(): number {
		return this.navbar ? this.navbar.clientHeight : 0;
	}

	moveNavbar(offset: number): void {
		if (this.navbar) {
			this.navbar.style.top = offset ? `${offset}px` : '';
		}
	}

	setPinned(pinned: boolean): void {
		if (pinned) {
			this.navbar.classList.add(CSS_CLASSNAME_BFAA_PINNED);
		} else {
			this.navbar.classList.remove(CSS_CLASSNAME_BFAA_PINNED);
		}
	}
}
