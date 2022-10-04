import { CompilerPartial } from '../base-tracker';

function getWordCount() {
	let wordCount = 0;

	const parserOutput = document.querySelector('.mw-parser-output')?.innerHTML || '';
	const strippedHtmlText = parserOutput.replace(/(<([^>]+)>)/gi, '');
	const noEmptyLines = strippedHtmlText.split('\n').filter((line) => line !== '');

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
			word_count: getWordCount(),
		},
	};
};
