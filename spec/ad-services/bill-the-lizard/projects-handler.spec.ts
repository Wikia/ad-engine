import { expect } from 'chai';
import { context } from '../../../src/ad-engine/index';
import { ProjectsHandler } from '../../../src/ad-services/bill-the-lizard/projects-handler';

describe('Bill the Lizard projects handler', () => {
	let projects;

	beforeEach(() => {
		projects = new ProjectsHandler();

		context.set('services.billTheLizard.projects', {
			foo: [
				{
					name: 'bar:1.0.0',
					countries: ['ZZ'],
				},
				{
					name: 'bar:0.0.1',
					countries: ['XX'],
				},
			],
			second: [
				{
					name: 'buzz:1.0.0',
					countries: ['XX'],
				},
				{
					name: 'buzz:0.0.1',
					countries: ['XX'],
				},
			],
		});

		context.set('services.billTheLizard.parameters', {
			foo: {
				one: '111',
				two: '222',
			},
			second: {
				three: '333',
				four: '444',
			},
		});
	});

	it('projects are disabled by default', () => {
		expect(projects.isEnabled('foo')).to.equal(false);
		expect(projects.isEnabled('bar')).to.equal(false);
	});

	it('project can be enabled', () => {
		expect(projects.isEnabled('foo')).to.equal(false);
		expect(projects.isEnabled('bar')).to.equal(false);

		projects.enable('foo');

		expect(projects.isEnabled('foo')).to.equal(true);
		expect(projects.isEnabled('bar')).to.equal(false);
	});

	it('enabled models list is empty by default', () => {
		expect(projects.getEnabledModelsWithParams([]).models.length).to.equal(0);
		expect(Object.keys(projects.getEnabledModelsWithParams([]).parameters).length).to.equal(0);
	});

	it('enabled models list contains enabled models by geo from enabled project and only one is executable', () => {
		projects.enable('foo');

		expect(projects.getEnabledModelsWithParams(['foo']).models.length).to.equal(1);
		expect(Object.keys(projects.getEnabledModelsWithParams(['foo']).parameters).length).to.equal(2);

		expect(context.get('services.billTheLizard.projects.foo.0.executable')).to.equal(false);
		expect(context.get('services.billTheLizard.projects.foo.1.executable')).to.equal(true);
	});

	it('enabled models list contains enabled models by geo from enabled projects and only three are executable', () => {
		projects.enable('foo');
		projects.enable('second');

		expect(projects.getEnabledModelsWithParams(['foo', 'second']).models.length).to.equal(3);
		expect(
			Object.keys(projects.getEnabledModelsWithParams(['foo', 'second']).parameters).length,
		).to.equal(4);

		expect(context.get('services.billTheLizard.projects.second.0.executable')).to.equal(true);
		expect(context.get('services.billTheLizard.projects.second.1.executable')).to.equal(false);
	});

	it('enabled models list contains enabled models by geo from enabled projects and only one is requested', () => {
		projects.enable('foo');
		projects.enable('second');

		expect(projects.getEnabledModelsWithParams(['second']).models.length).to.equal(2);
		expect(Object.keys(projects.getEnabledModelsWithParams(['second']).parameters).length).to.equal(
			2,
		);

		expect(context.get('services.billTheLizard.projects.second.0.executable')).to.equal(true);
		expect(context.get('services.billTheLizard.projects.second.1.executable')).to.equal(false);
	});
});
