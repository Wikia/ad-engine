class NavbarPage {
	get element() {
		return $(this.selector);
	}

	get selector() {
		return '.navigation';
	}

	get position() {
		return this.element.getLocation('y');
	}

	get height() {
		return this.element.getSize('height');
	}

	expectedPosition(aspectRatio) {
		return browser.getWindowSize().width / aspectRatio;
	}
}

export const navbarPage = new NavbarPage();
