import { context } from '@ad-engine/core';

import { CompilerPartial } from '../base-tracker';

export const pageTrackingCompiler = ({ data, slot }: CompilerPartial): CompilerPartial => {
	return {
		slot,
		data: {
			...data,
			word_count: context.get('wiki.wordCount'),
		},
	};
};
