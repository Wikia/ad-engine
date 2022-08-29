import { Service, ServiceStage } from '@wikia/ad-engine';
import { expect } from 'chai';

@Service({
	stage: ServiceStage.baseSetup,
})
class ExampleClass {
	call() {
		return true;
	}
}

describe('PipelineServiceDecorator', () => {
	it('should extend existing class', async () => {
		const example: any = new ExampleClass();

		expect(example.initialized).to.not.be.undefined;
		expect(example.options.stage).to.be.eq(ServiceStage.baseSetup);
	});
});
