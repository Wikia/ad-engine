import { TargetingStrategy } from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/interfaces/targeting-strategy';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

class DefaultStrategySpy implements TargetingStrategy {
	execute() {}
}

export function makeDefaultStrategySpy(): SinonStubbedInstance<DefaultStrategySpy> {
	return createStubInstance(DefaultStrategySpy);
}
