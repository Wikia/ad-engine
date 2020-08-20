import { context } from '@ad-engine/core';

// ToDo: cleanup after full TCFv2 rollout
export function setupTCFv2Context(instantConfig): void {
	if (!context.get('targeting.rollout_tracking')) {
		context.set('targeting.rollout_tracking', []);
	}

	if (instantConfig.get('icTcf2Enabled')) {
		context.set('custom.tcf2Enabled', true);
		context.push('targeting.rollout_tracking', 'tcf');
	}
}
