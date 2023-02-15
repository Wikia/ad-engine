import { context, Dictionary } from '@wikia/core';
import { instantConfigLoader } from '@wikia/core/services/instant-config/instant-config.loader';
import { wait } from '@wikia/core/utils';
import { expect } from 'chai';
import { SinonFakeXMLHttpRequest, SinonFakeXMLHttpRequestStatic, SinonStub } from 'sinon';

describe('Instant Config Loader', () => {
	let callCount: number;
	let xhr: SinonFakeXMLHttpRequestStatic;
	let request: SinonFakeXMLHttpRequest & { setStatus: (status: number) => void };
	let contextGetStub: SinonStub;
	let contextRepo: Dictionary;

	beforeEach(() => {
		contextRepo = {
			'services.instantConfig.endpoint': 'http://endpoint.com',
			'services.instantConfig.appName': 'testApp',
		};
		contextGetStub = global.sandbox.stub(context, 'get');
		contextGetStub.callsFake((key) => contextRepo[key]);

		callCount = 0;
		xhr = global.sandbox.useFakeXMLHttpRequest();
		xhr.onCreate = (_xhr) => {
			callCount++;
			request = _xhr as any;
		};
	});

	afterEach(() => {
		instantConfigLoader['configPromise'] = null;
	});

	it('should get config', async () => {
		const promise = instantConfigLoader.getConfig();

		request.setStatus(200);
		request.setResponseHeaders({ 'Content-Type': 'application/json' });
		request.setResponseBody(
			JSON.stringify({
				foo: 'bar',
			}),
		);

		const value = await promise;

		expect(request.async).to.equal(true);
		expect(request.status).to.equal(200);
		expect(request.method).to.equal('GET');
		expect(request.url).to.equal('http://endpoint.com/icbm/api/config?app=testApp');
		expect(value).to.deep.equal({
			foo: 'bar',
		});
	});

	it('should return {} if current and fallback config fetch fails', async () => {
		const promise = instantConfigLoader.getConfig();

		request.error();
		await wait(100);
		request.error();

		const value = await promise;

		expect(value).to.deep.equal({});
	});

	it('should return fallback if current config fetch fails', async () => {
		const promise = instantConfigLoader.getConfig();

		request.error();
		await wait(100);

		request.setStatus(200);
		request.setResponseHeaders({ 'Content-Type': 'application/json' });
		request.setResponseBody(
			JSON.stringify({
				foo: 'bar',
			}),
		);

		const value = await promise;

		expect(value).to.deep.equal({
			foo: 'bar',
		});
	});

	it('should be called once', async () => {
		const promise1 = instantConfigLoader.getConfig();
		const promise2 = instantConfigLoader.getConfig();

		request.setStatus(200);
		request.setResponseHeaders({ 'Content-Type': 'application/json' });
		request.setResponseBody(
			JSON.stringify({
				foo: 'bar',
			}),
		);

		await promise1;
		await promise2;

		expect(callCount).to.equal(1);
	});

	it('should get endpoint from context', async () => {
		instantConfigLoader.getConfig();

		expect(contextGetStub.getCalls().length).to.equal(3);
		expect(contextGetStub.firstCall.args[0]).to.equal('services.instantConfig.endpoint');
		expect(contextGetStub.secondCall.args[0]).to.equal('wiki.services_instantConfig_variant');
		expect(contextGetStub.thirdCall.args[0]).to.equal('services.instantConfig.appName');
		expect(request.url).to.equal('http://endpoint.com/icbm/api/config?app=testApp');
	});

	it('should use variant path', async () => {
		contextRepo['wiki.services_instantConfig_variant'] = 'test-variant';

		instantConfigLoader.getConfig();

		expect(contextGetStub.getCalls().length).to.equal(3);
		expect(request.url).to.equal('http://endpoint.com/test-variant/api/config?app=testApp');

		contextRepo['wiki.services_instantConfig_variant'] = undefined;
	});
});
