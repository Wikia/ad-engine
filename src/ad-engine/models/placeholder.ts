export interface PlaceholderConfig {
	enabled: boolean;
	selector: string;
	label: boolean;
}

export class Placeholder {
	static DEFAULT_CSS_CLASS = 'ad-slot-placeholder';
	static LABEL_CSS_CLASS = 'ae-translatable-label';

	private placeholderElement: Element | null;
	private labelElement: Element | null;

	constructor(config: PlaceholderConfig) {
		this.placeholderElement = document.querySelector(
			`.${Placeholder.DEFAULT_CSS_CLASS}${config.selector}`,
		);

		if (this.placeholderElement) {
			this.labelElement = this.placeholderElement.querySelector(`.${Placeholder.LABEL_CSS_CLASS}`);
		}
	}

	stopLoading(): void {
		this.placeholderElement.classList.remove('is-loading');
	}

	removeLabel(): void {
		this.labelElement.classList.add('hide');
	}
}
