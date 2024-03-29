// @ts-strict-ignore
import {
	DiPipelineStep,
	FuncPipelineStep,
	UniversalPipeline,
	UniversalPipelineStep,
} from '@wikia/core';
import { PipelineNext } from '@wikia/core/pipeline/pipeline-types';
import { Container } from '@wikia/dependency-injection';
import { PipelineTestSuite } from './pipeline-test-suite';

describe('UniversalPipeline', () => {
	let pipelineTestSuite: PipelineTestSuite<UniversalPipelineStep<number>>;

	beforeEach(() => {
		const spies = PipelineTestSuite.generateSpies(global.sandbox);
		class FirstStep implements DiPipelineStep<number> {
			execute(payload: number, next?: PipelineNext<number>): Promise<number> {
				spies.firstBefore(payload);
				return next(payload + 1).then((result) => {
					spies.firstAfter(result);
					return result;
				});
			}
		}

		const secondStep: FuncPipelineStep<any> = async (payload, next) => {
			spies.secondBefore(payload);
			const result = await next(payload + 1);
			spies.secondAfter(result);
			return result;
		};

		class FinalStep implements DiPipelineStep<number> {
			async execute(payload: number): Promise<number> {
				spies.final(payload);
				return payload + 1;
			}
		}
		const container = new Container();

		pipelineTestSuite = new PipelineTestSuite<UniversalPipelineStep<number>>(
			global.sandbox,
			spies,
			container.get<UniversalPipeline<number>>(UniversalPipeline),
			{ first: FirstStep, second: secondStep, final: FinalStep },
		);
	});

	it('should execute without final', async () => {
		await pipelineTestSuite.executeWithoutFinal();
	});

	it('should execute with final', async () => {
		await pipelineTestSuite.executeWithFinal();
	});

	it('should execute with cutoff', async () => {
		await pipelineTestSuite.executeWithCutoff();
	});
});
