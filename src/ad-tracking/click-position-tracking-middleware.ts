import { utils } from '@ad-engine/core';
import { ClickPositionContext } from './click-position-tracker';

export const clickPositionTrackingMiddleware: utils.Middleware<ClickPositionContext> = (
	{ data },
	next,
) => {
	return next({ data });
};
