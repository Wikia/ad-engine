// @ts-strict-ignore
import { Button } from './button';
import { getCrossIcon } from './icons/cross';
import { UiComponent } from './ui-component';

export class CloseButton extends UiComponent {
	render(): HTMLButtonElement {
		const { onClick } = this.props;
		const button = new Button({ onClick, classNames: this.getClassNames() }).render();
		const closeIcon = getCrossIcon();

		button.appendChild(closeIcon);

		return button;
	}

	getClassNames(): string[] {
		return ['button-close', ...super.getClassNames()];
	}
}
