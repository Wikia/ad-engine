import { expect } from 'chai';
import sinon from 'sinon';
import { context } from '../../../src/ad-engine/index';
import { billTheLizard, BillTheLizard } from '../../../src/ad-services/bill-the-lizard';

describe('Bill the Lizard service', () => {
	let requests = [];

	beforeEach(() => {
		requests = [];
		window.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
		window.XMLHttpRequest.onCreate = (req) => {
			requests.push(req);
		};
		context.set('services.billTheLizard', {
			enabled: true,
			host: 'http://service.com',
			endpoint: 'predict',
			projects: {
				queen_of_hearts: [
					{
						name: 'ctp_desktop:1.0.0',
						countries: ['XX'],
						on_0: ['logResult'],
						on_1: ['logResult'],
					},
					{
						name: 'queen_of_hearts:0.0.1',
						countries: ['XX'],
						on_1: ['logResult'],
						dfp_targeting: true,
					},
					{
						name: 'queen_of_hearts',
						countries: ['XX'],
						on_1: ['logResult'],
					},
				],
				cheshirecat: [
					{
						name: 'cheshirecat:1.0.0',
						countries: ['XX'],
						dfp_targeting: true,
					},
				],
			},
			parameters: {
				queen_of_hearts: {
					foo: 1,
					bar: 'test',
					echo: ['one', 'two'],
				},
				cheshirecat: {
					foo: 1,
					bar: 'test',
					echo: ['one', 'two'],
				},
			},
			timeout: 2000,
		});
	});

	afterEach(() => {
		window.XMLHttpRequest.restore();
	});

	describe('buildPredictions', () => {
		it('build predictions for supplied models', () => {
			const models = [{ name: 'a' }, { name: 'b' }];
			const callId = 'foo';
			const modelToResultMap = { a: 5 };

			const result = billTheLizard.buildPredictions(models, modelToResultMap, callId);

			expect(result.length).to.equal(1);
			expect(result[0]).to.deep.equal({ callId, modelName: 'a', result: 5 });
		});
	});

	describe('getModelToResultMap', () => {
		it('should return empty object if response is empty', () => {
			expect(billTheLizard.getModelToResultMap({})).to.deep.equal({});
		});

		it('should return model to result map', () => {
			const response = {
				a: { result: 1 },
				b: { result: 0 },
			};

			expect(billTheLizard.getModelToResultMap(response)).to.deep.equal({ a: 1, b: 0 });
		});

		it('should skip entries without result', () => {
			const response = {
				a: { result: 1 },
				b: {},
			};

			expect(billTheLizard.getModelToResultMap(response)).to.deep.equal({ a: 1 });
		});
	});

	describe('setTargeting', () => {
		before(() => {
			sinon.stub(billTheLizard, 'getTargeting').callsFake(() => ({ a: 5 }));
		});

		after(() => {
			billTheLizard.getTargeting.restore();
		});

		it('should set the value of targeting in context (key: "targeting.btl")', () => {
			const key = 'targeting.btl';

			expect(context.get(key)).to.be.undefined;

			billTheLizard.setTargeting();
			expect(context.get(key)).to.deep.equal(['a_5']);
		});
	});

	describe('getTargeting', () => {
		before(() => {
			billTheLizard.predictions = [
				{ modelName: 'a', callId: 1, result: 1 },
				{ modelName: 'a', callId: 2, result: 2 },
				{ modelName: 'b', callId: 2, result: 3 },
				{ modelName: 'c', callId: 3, result: 4 },
				{ modelName: 'a', callId: 4, result: 5 },
				{ modelName: 'c', callId: 4, result: 6 },
			];
			billTheLizard.targetedModelNames = new Set(['a', 'b']);
		});

		after(() => {
			billTheLizard.predictions = [];
			billTheLizard.targetedModelNames = new Set();
		});

		it('should get latest predictions', () => {
			expect(billTheLizard.getTargeting()).to.deep.equal({ a: 5, b: 3 });
		});
	});

	describe('getPrediction', () => {
		before(() => {
			billTheLizard.predictions = [
				{ modelName: 'a', callId: 1, result: 1 },
				{ modelName: 'a:0.0.1', callId: 2, result: 2 },
				{ modelName: 'b', callId: 2, result: 3 },
			];
		});

		after(() => {
			billTheLizard.predictions = [];
		});

		it('should return the first prediction matching model name ignoring version', () => {
			expect(billTheLizard.getPrediction('a', 1)).to.deep.equal(billTheLizard.predictions[0]);
		});

		it('should return undefined if no prediction is matching', () => {
			expect(billTheLizard.getPrediction('a', 3)).to.be.undefined;
			expect(billTheLizard.getPrediction('x', 1)).to.be.undefined;
		});
	});

	describe('getPredictions', () => {
		before(() => {
			billTheLizard.predictions = [
				{ modelName: 'a', callId: 1, result: 1 },
				{ modelName: 'a:0.0.1', callId: 2, result: 2 },
				{ modelName: 'b', callId: 2, result: 3 },
			];
		});

		after(() => {
			billTheLizard.predictions = [];
		});

		it('should return the all predictions matching model name ignoring version', () => {
			expect(billTheLizard.getPredictions('a')).to.deep.equal([
				billTheLizard.predictions[0],
				billTheLizard.predictions[1],
			]);
		});
	});

	describe('getResponseStatus', () => {
		before(() => {
			billTheLizard.statuses = {
				1: BillTheLizard.ON_TIME,
				2: BillTheLizard.FAILURE,
				3: BillTheLizard.TOO_LATE,
				foo: BillTheLizard.TOO_LATE,
			};
			billTheLizard.callCounter = 3;
		});

		after(() => {
			billTheLizard.statuses = {};
			billTheLizard.callCounter = 0;
		});

		it('should return status for the supplied callId', () => {
			expect(billTheLizard.getResponseStatus('foo')).to.equal(BillTheLizard.TOO_LATE);
			expect(billTheLizard.getResponseStatus('bar')).to.be.undefined;

			expect(billTheLizard.getResponseStatus('2')).to.equal(BillTheLizard.FAILURE);
			expect(billTheLizard.getResponseStatus(2)).to.equal(BillTheLizard.FAILURE);
		});

		it('should return the status for last anonymous call if callId is not supplied', () => {
			expect(billTheLizard.getResponseStatus()).to.equal(BillTheLizard.TOO_LATE);
		});
	});

	describe('serialize', () => {
		before(() => {
			billTheLizard.predictions = [
				{ modelName: 'a', callId: 0, result: 1 },
				{ modelName: 'a:0.0.1', callId: 1, result: 2 },
				{ modelName: 'b', callId: 'foo', result: 3 },
			];
		});

		after(() => {
			billTheLizard.predictions = [];
		});

		it('should serialize all predictions if no callId is supplied', () => {
			expect(billTheLizard.serialize()).to.equal('a|0=1,a:0.0.1|1=2,b|foo=3');
		});

		it('should serialize only predictions with callId matching the supplied one', () => {
			expect(billTheLizard.serialize(0)).to.equal('a|0=1');
		});
	});

	describe('getPreviousPrediction', () => {
		const callIdBuilder = (cId) => `foo_${cId}`;
		const modelName = 'bar';

		beforeEach(() => {
			billTheLizard.predictions = [
				{ modelName, callId: 'foo_1', result: 1 },
				{ modelName, callId: 'foo_2', result: 2 },
				{ modelName, callId: 'foo_3', result: 3 },
			];
			billTheLizard.statuses = {
				foo_1: BillTheLizard.ON_TIME,
				foo_2: BillTheLizard.TOO_LATE,
				foo_3: BillTheLizard.TOO_LATE,
			};
		});

		it('should return undefined if startId is smaller than 2', () => {
			expect(billTheLizard.getPreviousPrediction(-1, callIdBuilder, modelName)).to.be.undefined;
			expect(billTheLizard.getPreviousPrediction(0, callIdBuilder, modelName)).to.be.undefined;
			expect(billTheLizard.getPreviousPrediction(1, callIdBuilder, modelName)).to.be.undefined;
		});

		it('should return first prediction if startId is equal to or greater than 2', () => {
			expect(billTheLizard.getPreviousPrediction(2, callIdBuilder, modelName).result).to.equal(1);
		});

		it('should return undefined if no previous prediction has status on_time or too_late', () => {
			billTheLizard.statuses = {
				foo_1: BillTheLizard.NOT_USED,
				foo_2: BillTheLizard.NOT_USED,
				foo_3: BillTheLizard.NOT_USED,
			};

			const response = billTheLizard.getPreviousPrediction(4, callIdBuilder, modelName);

			expect(response).to.be.undefined;
		});

		it('should return prediction with status on_time', () => {
			billTheLizard.statuses = {
				foo_1: BillTheLizard.NOT_USED,
				foo_2: BillTheLizard.ON_TIME,
				foo_3: BillTheLizard.NOT_USED,
			};

			const response = billTheLizard.getPreviousPrediction(4, callIdBuilder, modelName);

			expect(response.result).to.equal(2);
		});

		it('should return prediction with status too_late', () => {
			billTheLizard.statuses = {
				foo_1: BillTheLizard.NOT_USED,
				foo_2: BillTheLizard.TOO_LATE,
				foo_3: BillTheLizard.NOT_USED,
			};

			const response = billTheLizard.getPreviousPrediction(4, callIdBuilder, modelName);

			expect(response.result).to.equal(2);
		});
	});

	it('should not call service if it is disabled in context', () => {
		context.set('services.billTheLizard.enabled', false);

		billTheLizard.call([]).then(() => {}, () => {});

		expect(requests.length).to.equal(0);
	});

	it('should not call service if there are no models in context', () => {
		context.set('services.billTheLizard.models', []);

		billTheLizard.call([]).then(() => {}, () => {});

		expect(requests.length).to.equal(0);
	});

	it('should call service with built url', () => {
		billTheLizard.projectsHandler.enable('queen_of_hearts');
		billTheLizard.call(['queen_of_hearts']);

		const { url } = requests[0];

		expect(url.match(/http:\/\/service.com\/predict/)).to.be.ok;
		expect(url.match(/models=ctp_desktop/)).to.be.ok;
		expect(url.match(/&h=\d{1,2}&/)).to.be.ok;
		expect(url.match(/&dow=\d&/)).to.be.ok;
		expect(url.match(/foo=1&bar=test&echo=one,two/)).to.be.ok;
	});
});
