import { UiComponent } from './ui-component';

export class Button extends UiComponent {
	render(): HTMLButtonElement {
		const buttonElement = document.createElement('button');

		this.getClassNames().forEach((className) => buttonElement.classList.add(className));
		buttonElement.addEventListener('click', (event) => this.onClick(event));

		return buttonElement;
	}

	getClassNames(): string[] {
		return ['button-control', ...super.getClassNames()];
	}

	onClick(event): void {
		const { onClick } = this.props;

		if (typeof onClick === 'function') {
			onClick(event);
		}
	}
}
