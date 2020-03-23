import { FOOTER } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable()
export class ScrollCorrector {
	constructor(@Inject(FOOTER) private footer: HTMLElement) {}

	/**
	 * corrects scroll position based a on scrollY value
	 */
	useScrollCorrection(): () => void {
		const startValue = window.scrollY;

		return () => window.scrollBy(0, startValue - window.scrollY);
	}

	/**
	 * corrects scroll position based on a distance from the element of reference
	 */
	usePositionCorrection(elementOfReference: HTMLElement = this.footer): () => void {
		const startValue = elementOfReference.getBoundingClientRect().top;

		return () => window.scrollBy(0, elementOfReference.getBoundingClientRect().top - startValue);
	}
}
