class AdLabel {
	createLabel(): HTMLElement {
		const div = document.createElement('div');
		div.className = 'ae-translatable-label';
		div.innerText = 'Advertisement';
		return div;
	}

	addLabel(slotParent: HTMLElement): void {
		slotParent.appendChild(this.createLabel());
	}
}

export const adLabel = new AdLabel();
