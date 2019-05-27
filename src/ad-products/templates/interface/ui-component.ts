import { Dictionary } from '@wikia/ad-engine';

export default class UiComponent {
	get classNames(): string[] {
		return this.props.classNames || [];
	}

	constructor(protected props: Dictionary = {}) {}

	render(): HTMLElement | DocumentFragment {
		return document.createDocumentFragment();
	}
}
