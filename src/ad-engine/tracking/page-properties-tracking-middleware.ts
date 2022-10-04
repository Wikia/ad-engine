import { AdInfoContext } from '@ad-engine/tracking';
import { FuncPipelineStep } from '../pipeline/imps/func-pipeline';

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

export const pagePropertiesTrackingMiddleware: FuncPipelineStep<AdInfoContext> = (
	{ data, slot },
	next,
) =>
	next({
		slot,
		data: {
			...data,
			word_count: getWordCount(),
		},
	});
