import { Button } from './button';
import { createIcon, icons } from './icons';
import { UiComponent } from './ui-component';

export class CloseButton extends UiComponent {
	render(): HTMLButtonElement {
		const { onClick } = this.props;
		const button = new Button({ onClick, classNames: this.getClassNames() }).render();
		const closeIcon = createIcon(icons.CROSS, ['icon']);

		button.appendChild(closeIcon);

		return button;
	}

	getClassNames(): string[] {
		return ['button-close', ...super.getClassNames()];
	}
}
