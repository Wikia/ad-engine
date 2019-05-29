import { Dictionary } from '@wikia/ad-engine';

export class UiComponent {
	constructor(protected props: Dictionary = {}) {}

	render(): HTMLElement | DocumentFragment {
		return document.createDocumentFragment();
	}

	getClassNames(): string[] {
		return this.props.classNames || [];
	}
}
