export class NavbarManager {
	setup(config, container) {
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
