import { context, DiProcess } from '@wikia/ad-engine';

export class PlatformContextSetup implements DiProcess {
	protected contentSelector = '.mw-parser-output';

	execute(): void {
		const wikiContext = {
			...(window.mw && window.mw.config ? window.mw.config.values : {}),
			...(window.ads ? window.ads.context : {}),
			wordCount: this.getContentWordCountFrom(),
		};

		context.set('wiki', Object.assign(wikiContext, context.get('wiki')));
	}

	private getContentWordCountFrom(): number {
		let wordCount = 0;

		const parserOutput =
			(document.querySelector(this.contentSelector) as HTMLElement)?.innerText || '';
		const replacedMultipleWhitespaces = parserOutput.replace(/\s{2,}/gi, ' ');
		const noEmptyLines = replacedMultipleWhitespaces
			.trim()
			.split('\n')
			.filter((line) => line !== '');

		noEmptyLines.forEach((line) => {
			wordCount += line.split(' ').length;
		});

		return wordCount;
	}
}
