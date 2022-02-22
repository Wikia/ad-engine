import { TargetingManagerInterface } from '../domain/interfaces/targeting-manager.interface';
import { ContextInterface } from '@wikia/ad-engine';

export class TargetingManager implements TargetingManagerInterface {
	constructor(private context: ContextInterface) {}

	setTargeting(adTargeting: Record<string, any>): void {
		// TODO SM this is hardcoded targeting for dev purposes. REMOVE BEFORE PR!!!
		adTargeting = {
			loc: 'top',
			uap: '5928558921',
			size: '11x11',
		};

		for (const [key, val] of Object.entries(adTargeting)) {
			this.context.set('targeting.' + key, val);
		}
	}
}
