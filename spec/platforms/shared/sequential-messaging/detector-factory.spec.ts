import { expect } from 'chai';
import { DetectorFactory } from '../../../../platforms/shared/sequential-messaging/detector-factory';
import { SequenceDetector } from '../../../../platforms/shared/sequential-messaging/domain/sequence-detector';

// class InstantConfigServiceSpy implements InstantConfigServiceInterface {
// 	get<T extends InstantConfigValue>(key: string, defaultValue?: T): T {
// 		return undefined;
// 	}
// }
//
// export function makeInstantConfigServiceSpy(): SinonStubbedInstance<InstantConfigServiceSpy> {
// 	return createStubInstance(InstantConfigServiceSpy);
// }

describe('Detector Factory', () => {
	it('Produce Sequence Detector - proper params', () => {
		const icSequentialMessaging = {
			5854346762: {
				length: 4,
			},
		};

		const df = new DetectorFactory(icSequentialMessaging);
		const sd = df.makeSequenceDetector();

		expect(sd).to.be.instanceof(SequenceDetector);
		expect(sd.isAdSequential('5854346762')).to.be.true;
		expect(sd.isAdSequential('0')).to.be.false;
	});

	it('Produce Sequence Detector - undefined input', () => {
		const icSequentialMessaging = {
			5854346762: {
				length: 4,
			},
		};

		const df = new DetectorFactory(icSequentialMessaging);
		const sd = df.makeSequenceDetector();

		expect(sd).to.be.instanceof(SequenceDetector);
		expect(sd.isAdSequential('0')).to.be.false;
	});
});
