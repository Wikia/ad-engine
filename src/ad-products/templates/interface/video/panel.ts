export class Panel {
	private panelContainer: HTMLDivElement;

	constructor(private className, private uiElements) {
		this.panelContainer = null;
	}

	add(video, container, params): void {
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

export default Panel;
