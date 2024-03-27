import { context, targetingService } from '@ad-engine/core';

import { CompilerPartial } from '../trackers/base-tracker';

export const pageTrackingCompiler = ({ data, slot }: CompilerPartial): CompilerPartial => {
	return {
		slot,
		data: {
			...data,
			word_count: targetingService.get('word_count') || -1,
			short_page: context.get('custom.short_page') ?? false,
		},
	};
};
