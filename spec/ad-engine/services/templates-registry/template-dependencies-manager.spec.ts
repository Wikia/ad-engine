import { AdSlot, TEMPLATE } from '@wikia/ad-engine';
import { TemplateDependenciesManager } from '@wikia/ad-engine/services/templates-registry/template-dependencies-manager';
import { Container } from '@wikia/dependency-injection';
import { expect } from 'chai';

describe('Template Dependencies Manager', () => {
	let instance: TemplateDependenciesManager;
	let container: Container;
	const templateName = 'foo';
	const templateSlot: AdSlot = { foo: 'bar' } as any;
	const templateParams = { params: 'params' };
	const templateContext = {};

	beforeEach(() => {
		container = new Container();
		instance = container.get(TemplateDependenciesManager);
	});

	it('should be empty if no provide', () => {
		expect(() => container.get(TEMPLATE.NAME)).to.throw(TypeError);
		expect(() => container.get(TEMPLATE.SLOT)).to.throw(TypeError);
		expect(() => container.get(TEMPLATE.PARAMS)).to.throw(TypeError);
		expect(() => container.get(TEMPLATE.CONTEXT)).to.throw(TypeError);
	});

	it('should provide dependencies', () => {
		instance.provideDependencies(templateName, templateSlot, templateParams, templateContext);

		expect(container.get(TEMPLATE.NAME)).to.equal(templateName);
		expect(container.get(TEMPLATE.SLOT)).to.equal(templateSlot);
		expect(container.get(TEMPLATE.PARAMS)).to.equal(templateParams);
		expect(container.get(TEMPLATE.CONTEXT)).to.equal(templateContext);
	});

	it('should throw after reset', () => {
		instance.resetDependencies();

		expect(() => container.get(TEMPLATE.NAME)).to.throw(
			`${TEMPLATE.NAME.toString()} can only be injected in template handler constructor`,
		);
		expect(() => container.get(TEMPLATE.SLOT)).to.throw(
			`${TEMPLATE.SLOT.toString()} can only be injected in template handler constructor`,
		);
		expect(() => container.get(TEMPLATE.PARAMS)).to.throw(
			`${TEMPLATE.PARAMS.toString()} can only be injected in template handler constructor`,
		);
		expect(() => container.get(TEMPLATE.CONTEXT)).to.throw(
			`${TEMPLATE.CONTEXT.toString()} can only be injected in template handler constructor`,
		);
	});
});
