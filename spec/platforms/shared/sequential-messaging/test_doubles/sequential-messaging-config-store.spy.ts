import { SequentialMessagingConfigStoreInterface } from '@wikia/ad-services';
import { InstantConfigValue } from '@wikia/ad-services/instant-config/instant-config.models';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

class SequentialMessagingConfigStoreSpy implements SequentialMessagingConfigStoreInterface {
	get<T extends InstantConfigValue>(key: string, defaultValue?: T): T {
		return undefined;
	}
}

export function makeSequentialMessagingConfigStoreSpy(): SinonStubbedInstance<
	SequentialMessagingConfigStoreSpy
> {
	return createStubInstance(SequentialMessagingConfigStoreSpy);
}
