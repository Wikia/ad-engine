import { Targeting } from '@wikia/ad-engine';

export enum TargetingStrategy {
	DEFAULT = 'default',
	SITE_CONTEXT = 'siteContext',
	PAGE_CONTEXT = 'pageContext',
	COMBINED = 'combined',
}

export interface TargetingStrategyInterface {
	execute(): Partial<Targeting>;
}
