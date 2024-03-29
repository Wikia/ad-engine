// @ts-strict-ignore
import { Injectable } from '@wikia/dependency-injection';
import { ElementManipulator } from './element-manipulator';

@Injectable({ autobind: false })
export class DomManipulator {
	private elements = new Map<HTMLElement, ElementManipulator>();

	element(element: HTMLElement): ElementManipulator {
		if (!this.elements.has(element)) {
			this.elements.set(element, new ElementManipulator(element));
		}

		return this.elements.get(element);
	}

	restore(): void {
		this.elements.forEach((element) => element.restore());
		this.elements.clear();
	}
}
