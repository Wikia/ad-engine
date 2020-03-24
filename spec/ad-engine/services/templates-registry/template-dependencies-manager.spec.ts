import { AdSlot, TEMPLATE } from '@wikia/ad-engine';
import { TemplateDependenciesManager } from '@wikia/ad-engine/services/templates-registry/template-dependencies-manager';
import { Container, Inject, Injectable } from '@wikia/dependency-injection';
import { assert, expect } from 'chai';

@Injectable({ autobind: false })
class AdditionalDependency {
	constructor(@Inject(TEMPLATE.NAME) public name: string) {}
}

describe('Template Dependencies Manager', () => {
	let instance: TemplateDependenciesManager;
	let container: Container;
	const templateName = 'foo';
	const templateSlot: AdSlot = { foo: 'bar' } as any;
	const templateParams = { params: 'params' };

	beforeEach(() => {
		container = new Container();
		instance = container.get(TemplateDependenciesManager);
	});

	it('should throw if no provide', () => {
		expect(() => container.get(TEMPLATE.NAME)).to.throw(
			`${TEMPLATE.NAME.toString()} is not bound to anything`,
		);
		expect(() => container.get(TEMPLATE.SLOT)).to.throw(
			`${TEMPLATE.SLOT.toString()} is not bound to anything`,
		);
		expect(() => container.get(TEMPLATE.PARAMS)).to.throw(
			`${TEMPLATE.PARAMS.toString()} is not bound to anything`,
		);
		expect(() => container.get(AdditionalDependency)).to.throw(
			`${AdditionalDependency.toString()} is not bound to anything`,
		);
	});

	it('should provide dependencies', () => {
		instance.provideDependencies(templateName, templateSlot, templateParams, [
			AdditionalDependency,
		]);

		expect(container.get(TEMPLATE.NAME)).to.equal(templateName);
		expect(container.get(TEMPLATE.SLOT)).to.equal(templateSlot);
		expect(container.get(TEMPLATE.PARAMS)).to.equal(templateParams);
		assert(container.get(AdditionalDependency) instanceof AdditionalDependency);
		expect(container.get(AdditionalDependency).name).to.equal(templateName);
	});

	it('should throw after reset', () => {
		instance.provideDependencies(templateName, templateSlot, templateParams, [
			AdditionalDependency,
		]);
		instance.resetDependencies([AdditionalDependency]);

		expect(() => container.get(TEMPLATE.NAME)).to.throw(
			`${TEMPLATE.NAME.toString()} is not bound to anything`,
		);
		expect(() => container.get(TEMPLATE.SLOT)).to.throw(
			`${TEMPLATE.SLOT.toString()} is not bound to anything`,
		);
		expect(() => container.get(TEMPLATE.PARAMS)).to.throw(
			`${TEMPLATE.PARAMS.toString()} is not bound to anything`,
		);
		expect(() => container.get(AdditionalDependency)).to.throw(
			`${AdditionalDependency.toString()} is not bound to anything`,
		);
	});
});
