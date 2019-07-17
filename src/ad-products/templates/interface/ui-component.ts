import { Dictionary } from '@ad-engine/core';

export class UiComponent {
	constructor(protected props: Dictionary = {}) {}

	render(): HTMLElement | DocumentFragment {
		return document.createDocumentFragment();
	}

	getClassNames(): string[] {
		return this.props.classNames || [];
	}
}
