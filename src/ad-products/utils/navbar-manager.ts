import { CSS_CLASSNAME_BFAA_PINNED } from '../templates/uap/constants';

export class NavbarManager {
	setup(config, container): void {
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
}

export const navbarManager = new NavbarManager();

export function setNavbarPin(navbar: HTMLElement, pin: boolean): void {
	if (pin) {
		navbar.classList.add(CSS_CLASSNAME_BFAA_PINNED);
	} else {
		navbar.classList.remove(CSS_CLASSNAME_BFAA_PINNED);
	}
}

export function getNavbarHeight(navbar?: HTMLElement): number {
	return navbar ? navbar.clientHeight : 0;
}
