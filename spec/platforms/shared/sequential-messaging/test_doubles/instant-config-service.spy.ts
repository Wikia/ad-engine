import { InstantConfigServiceInterface } from '@wikia/core';
import { InstantConfigValue } from '@wikia/core/services/instant-config/instant-config.models';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

class InstantConfigServiceSpy implements InstantConfigServiceInterface {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	get<T extends InstantConfigValue>(_key: string, _defaultValue?: T): T {
		return undefined;
	}
}

export function makeInstantConfigServiceSpy(): SinonStubbedInstance<InstantConfigServiceSpy> {
	return createStubInstance(InstantConfigServiceSpy);
}
