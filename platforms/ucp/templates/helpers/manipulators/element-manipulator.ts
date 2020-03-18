import { forIn } from 'lodash';

export class ElementManipulator {
	private stylesBackup: Partial<CSSStyleDeclaration> = {};
	private classesBackup?: string;

	constructor(private element: HTMLElement) {}

	setProperty<T extends keyof CSSStyleDeclaration>(name: T, value: CSSStyleDeclaration[T]): this {
		this.saveProperty(name);
		this.element.style[name] = value;

		return this;
	}

	private saveProperty<T extends keyof CSSStyleDeclaration>(name: T): void {
		if (this.stylesBackup[name] !== undefined) {
			return;
		}

		this.stylesBackup[name] = this.element.style[name];
	}

	addClass(...tokens: string[]): this {
		this.saveClasses();
		this.element.classList.add(...tokens);

		return this;
	}

	removeClass(...tokens: string[]): this {
		this.saveClasses();
		this.element.classList.remove(...tokens);

		return this;
	}

	private saveClasses(): void {
		if (this.classesBackup) {
			return;
		}

		this.classesBackup = this.element.classList.value;
	}

	restore(): void {
		forIn(this.stylesBackup, (value, key) => {
			this.element.style[key] = value;
		});

		if (this.classesBackup) {
			this.element.classList.value = this.classesBackup;
		}

		this.stylesBackup = {};
		this.classesBackup = undefined;
	}
}
