export default class Panel {
	constructor(className, uiElements) {
		this.uiElements = uiElements;
		this.className = className;
		this.panelContainer = null;
	}

	add(video, container, params) {
		this.panelContainer = document.createElement('div');
		this.panelContainer.className = this.className;
		this.uiElements.forEach((uiElement) => {
			if (uiElement) {
				uiElement.add(video, this.panelContainer, params);
			}
		});
		container.appendChild(this.panelContainer);
	}
}
