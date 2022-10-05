import { CompilerPartial } from '../base-tracker';

function getWordCountFromParserOutput() {
	let wordCount = 0;

	//@ts-ignore innerText exists in the HTMLElement
	const parserOutput = document.querySelector('.mw-parser-output')?.innerText || '';
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

export const pageTrackingCompiler = ({ data, slot }: CompilerPartial): CompilerPartial => {
	return {
		slot,
		data: {
			...data,
			word_count: getWordCountFromParserOutput(),
		},
	};
};
