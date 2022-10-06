export function getContentWordCount(contentSelector: string): number {
	let wordCount = 0;

	const parserOutput = (document.querySelector(contentSelector) as HTMLElement)?.innerText || '';
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
