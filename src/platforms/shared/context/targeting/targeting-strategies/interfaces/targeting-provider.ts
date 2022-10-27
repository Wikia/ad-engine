import { Targeting } from '@wikia/ad-engine';

export interface TargetingProvider {
	get(): Partial<Targeting>;
}
