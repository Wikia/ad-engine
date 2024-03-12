import { Dictionary } from '../../../core/models/dictionary';

export class UiComponent {
	constructor(protected props: Dictionary = {}) {}

	render(): HTMLElement | DocumentFragment {
		return document.createDocumentFragment();
	}

	getClassNames(): string[] {
		return this.props.classNames || [];
	}
}
