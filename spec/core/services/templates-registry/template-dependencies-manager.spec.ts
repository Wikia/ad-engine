import { AdSlot, TEMPLATE } from '@wikia/core';
import { TemplateDependenciesManager } from '@wikia/core/services/templates-registry/template-dependencies-manager';
import { assert, expect } from 'chai';
import { container as diContainer, DependencyContainer, inject, injectable } from 'tsyringe';

@injectable()
class AdditionalDependency {
	constructor(@inject(TEMPLATE.NAME) public name: string) {}
}

describe('Template Dependencies Manager', () => {
	let instance: TemplateDependenciesManager;
	let container: DependencyContainer;
	const templateName = 'foo';
	const templateSlot: AdSlot = { foo: 'bar' } as any;
	const templateParams = { params: 'params' };

	beforeEach(() => {
		instance = diContainer.resolve(TemplateDependenciesManager);
		container = instance.getContainer();
	});

	afterEach(() => {
		container.reset();
	});

	it('should throw if no provide', () => {
		expect(() => container.resolve(TEMPLATE.NAME)).to.throw(
			`Attempted to resolve unregistered dependency token: "${TEMPLATE.NAME.toString()}"`,
		);
		expect(() => container.resolve(TEMPLATE.SLOT)).to.throw(
			`Attempted to resolve unregistered dependency token: "${TEMPLATE.SLOT.toString()}"`,
		);
		expect(() => container.resolve(TEMPLATE.PARAMS)).to.throw(
			`Attempted to resolve unregistered dependency token: "${TEMPLATE.PARAMS.toString()}"`,
		);
		expect(() => container.resolve(AdditionalDependency)).to.throw(
			`Cannot inject the dependency at position #0 of "${AdditionalDependency.name}" constructor`,
		);
	});

	it('should provide dependencies', () => {
		instance.provideDependencies(templateName, templateSlot, templateParams, [
			AdditionalDependency,
		]);

		expect(container.resolve(TEMPLATE.NAME)).to.equal(templateName);
		expect(container.resolve(TEMPLATE.SLOT)).to.equal(templateSlot);
		expect(container.resolve(TEMPLATE.PARAMS)).to.equal(templateParams);
		assert(container.resolve(AdditionalDependency) instanceof AdditionalDependency);
		expect(container.resolve(AdditionalDependency).name).to.equal(templateName);
	});

	it('should throw after reset', () => {
		instance.provideDependencies(templateName, templateSlot, templateParams, [
			AdditionalDependency,
		]);
		instance.resetDependencies();

		expect(() => container.resolve(TEMPLATE.NAME)).to.throw(
			`Attempted to resolve unregistered dependency token: "${TEMPLATE.NAME.toString()}"`,
		);
		expect(() => container.resolve(TEMPLATE.SLOT)).to.throw(
			`Attempted to resolve unregistered dependency token: "${TEMPLATE.SLOT.toString()}"`,
		);
		expect(() => container.resolve(TEMPLATE.PARAMS)).to.throw(
			`Attempted to resolve unregistered dependency token: "${TEMPLATE.PARAMS.toString()}"`,
		);
		expect(() => container.resolve(AdditionalDependency)).to.throw(
			`Cannot inject the dependency at position #0 of "${AdditionalDependency.name}" constructor`,
		);
	});
});
