import { context, Dictionary } from '@wikia/ad-engine';
import { instantConfigLoader } from '@wikia/ad-services/instant-config/instant-config.loader';
import { expect } from 'chai';
import {
	createSandbox,
	SinonFakeXMLHttpRequest,
	SinonFakeXMLHttpRequestStatic,
	SinonStub,
} from 'sinon';

describe('Instant Config Loader', () => {
	const sandbox = createSandbox();
	let callCount: number;
	let xhr: SinonFakeXMLHttpRequestStatic;
	let request: SinonFakeXMLHttpRequest & { setStatus: (status: number) => void };
	let contextGetStub: SinonStub;
	let contextRepo: Dictionary;

	beforeEach(() => {
		contextRepo = {
			'services.instantConfig.endpoint': 'http://endpoint.com',
			'services.instantConfig.fallback': {},
		};
		contextGetStub = sandbox.stub(context, 'get');
		contextGetStub.callsFake((key) => contextRepo[key]);

		callCount = 0;
		xhr = sandbox.useFakeXMLHttpRequest();
		xhr.onCreate = (_xhr) => {
			callCount++;
			request = _xhr as any;
		};
	});

	afterEach(() => {
		instantConfigLoader['configPromise'] = null;
		sandbox.restore();
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
		expect(request.url).to.equal('http://endpoint.com');
		expect(value).to.deep.equal({
			foo: 'bar',
		});
	});

	it('should return fallback if status !== 200', async () => {
		contextRepo['services.instantConfig.fallback'] = { a: 'a' };

		const promise = instantConfigLoader.getConfig();

		request.setStatus(201);
		request.setResponseHeaders({ 'Content-Type': 'application/json' });
		request.setResponseBody(
			JSON.stringify({
				foo: 'bar',
			}),
		);

		const value = await promise;

		expect(value).to.deep.equal({ a: 'a' });
	});

	it('should return fallback if error', async () => {
		contextRepo['services.instantConfig.fallback'] = { a: 'a' };

		const promise = instantConfigLoader.getConfig();

		request.error();

		const value = await promise;

		expect(value).to.deep.equal({ a: 'a' });
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

		expect(contextGetStub.getCalls().length).to.equal(2);
		expect(contextGetStub.firstCall.args[0]).to.equal('services.instantConfig.endpoint');
	});

	it('should get fallback from fallbackInstantConfig', async () => {
		contextRepo['services.instantConfig.fallback'] = { b: 'b' };

		const promise = instantConfigLoader.getConfig();

		request.error();

		const value = await promise;

		expect(value).to.deep.equal({ b: 'b' });
	});
});
