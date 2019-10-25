import { utils } from '@wikia/ad-engine';

export function iocDefaultWarning(className: string): void {
	utils.warner('##### IOC - you are not implementing:', className);
}
