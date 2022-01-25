import { TargetingManagerInterface } from '../domain/interfaces/targeting-manager-interface';

export class TargetingManager implements TargetingManagerInterface {
	constructor(private context) {}

	setTargeting(adTargeting: Record<string, any>): void {
		for (const [key, val] of Object.entries(adTargeting)) {
			this.context.set('targeting.' + key, val);
		}
	}
}
