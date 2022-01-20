import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { SequentialMessagingConfig } from '../../../../../platforms/shared/sequential-messaging/domain/data-structures/sequential-messaging-config';
import { SequentialMessagingConfigStoreInterface } from '../../../../../platforms/shared/sequential-messaging/domain/interfaces/sequential-messaging-config-store.interface';

class SequentialMessagingConfigStoreSpy implements SequentialMessagingConfigStoreInterface {
	get(): SequentialMessagingConfig {
		return undefined;
	}
}

export function makeSequentialMessagingConfigStoreSpy(): SinonStubbedInstance<
	SequentialMessagingConfigStoreSpy
> {
	return createStubInstance(SequentialMessagingConfigStoreSpy);
}
