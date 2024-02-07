import { Experiment } from '../types';

import defineExperiment from './defineExperiment';
import getExperiment from './getExperiment';

jest.mock('@fandom/context', () => ({
	__esModule: true,
	getWikiaBeaconId: jest.fn().mockReturnValue('A'),
}));

jest.mock('../utils/getForcedBucket', () => ({
	__esModule: true,
	default: jest.fn().mockReturnValueOnce(null).mockReturnValueOnce('Z'),
}));

const EXPERIMENTS: Array<Experiment> = [
	defineExperiment({
		name: 'test-experiment-0-correct',
		buckets: ['A', 'B', 'C'],
	}),
	defineExperiment({
		name: 'test-experiment-1-no-buckets',
		buckets: [],
	}),
	defineExperiment({
		name: 'test-experiment-2-disabled-manually',
		buckets: ['D', 'E', 'F'],
		disabled: true,
	}),
	defineExperiment({
		name: 'test-experiment-3-invalid-buckets',
		buckets: ['a'],
		disabled: false,
	}),
	defineExperiment({
		name: 'test-experiment-4-correct-bucket',
		buckets: ['Z'],
		disabled: false,
	}),
	defineExperiment({
		name: 'test-experiment-5-overlapping-bucket-A',
		buckets: ['Y'],
		disabled: false,
	}),
	defineExperiment({
		name: 'test-experiment-6-overlapping-bucket-B',
		buckets: ['Y'],
		disabled: false,
	}),
];

describe('defineExperiment works correctly', () => {
	test('defining a correct experiment works as expected', () => {
		expect(EXPERIMENTS[0]).toMatchObject({
			name: EXPERIMENTS[0].name,
			buckets: ['A', 'B', 'C'],
			disabled: false,
		});
	});

	test('defining an experiment with no buckets is disabled by default', () => {
		expect(EXPERIMENTS[1].disabled).toBe(true);
	});

	test('disabling a correct experiment work as expected', () => {
		expect(EXPERIMENTS[2].disabled).toBe(true);
	});

	test('defining an experiment with control bucket is disabled as expected', () => {
		expect(EXPERIMENTS[3].disabled).toBe(true);
	});

	test('disabled experiments are filtered correctly', () => {
		const filteredExperiments = EXPERIMENTS.filter((experiment) => !experiment.disabled);
		expect(filteredExperiments.length).toBe(4);
	});
});

describe('getExperiment works correctly', () => {
	test('given all defined experiments gets the one that coincides with the current bucket', () => {
		// gets the experiment with bucket A
		const experiment = getExperiment(EXPERIMENTS);
		expect(experiment).toStrictEqual(EXPERIMENTS[0]);
	});

	test('given all defined experiments gets the one that coincides with the forced bucket', () => {
		// mock returns experiment with bucket 'A'
		const experimentWithoutForcedBucket = getExperiment(EXPERIMENTS);

		// mock changes the the forced bucket to 'Z', so there would be a different experiment
		const experimentWithForcedBucket = getExperiment(EXPERIMENTS);

		expect(experimentWithoutForcedBucket).not.toEqual(experimentWithForcedBucket);
	});
});
