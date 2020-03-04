import { Dictionary } from '@ad-engine/core';

export class UiComponent {
	constructor(protected props: Dictionary = {}) {
		if (props.isDarkTheme) {
			const classList = this.getClassNames();
			classList.push('is-dark');
		}
	}

	render(): HTMLElement | DocumentFragment {
		return document.createDocumentFragment();
	}

	getClassNames(): string[] {
		return this.props.classNames || [];
	}
}
