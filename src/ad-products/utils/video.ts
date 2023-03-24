import { context, targetingService } from '@ad-engine/core';

export function setupVideoContext(): void {
	const isVideo = !!targetingService.get('ptype')?.includes('video_');
	context.set('custom.hasFeaturedVideo', isVideo);
}
