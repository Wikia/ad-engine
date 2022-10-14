import { Targeting } from '@wikia/ad-engine';

export enum TargetingStrategy {
	SITE_CONTEXT = 'siteContext',
	PAGE_CONTEXT = 'pageContext',
	COMBINED = 'combined',
}

export interface TargetingProvider {
	get(): Partial<Targeting>;
}
