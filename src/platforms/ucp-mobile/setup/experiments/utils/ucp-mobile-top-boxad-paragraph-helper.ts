import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileTopBoxadParagraphHelper {
	private paragraphSelector = '.mw-parser-output > p';

	public getParagraphSelector() {
		return this.paragraphSelector;
	}

	public getNthParagraphSelector(nthOfType) {
		return `${this.paragraphSelector}:nth-of-type(${nthOfType})`;
	}

	public getParagraphData(
		paragraphs: Element[],
		condition: (element: Element, index: number) => boolean,
	) {
		const index = paragraphs.findIndex(condition);

		return {
			element:
				index >= 0 ? document.querySelector(this.getNthParagraphSelector(index + 1)) : undefined,
			nthOfType: index >= 0 ? index + 1 : undefined,
		};
	}

	public getFirstParagraph(paragraphs: Element[]) {
		return this.getParagraphData(paragraphs, (element) => element.textContent.trim() !== '');
	}

	public getSecondParagraph(paragraphs: Element[], firstOfTypeIndex: number) {
		return this.getParagraphData(
			paragraphs,
			(element, index) => element.textContent.trim() !== '' && index !== firstOfTypeIndex - 1,
		);
	}

	public isLargeParagraph(paragraph: Element) {
		return (
			paragraph.textContent &&
			(paragraph.textContent.length >= 400 || paragraph.clientHeight >= 350)
		);
	}

	public existParagraph(paragraph: { element: any; nthOfType: any }) {
		return paragraph.element && paragraph.nthOfType;
	}
}
