import { context, DiProcess } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
export class SportsSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			'cdm-zone-01': {
				defaultSizes: [
					[728, 90],
					[970, 150],
					[970, 250],
				],
				firstCall: true,
				bidderAlias: '01_LB',
				group: '01_LB',
				sizes: [
					{
						viewportSize: [1024, 300],
						sizes: [
							[728, 90],
							[970, 150],
							[970, 250],
							[980, 150],
							[980, 250],
						],
					},
					{
						viewportSize: [970, 200],
						sizes: [
							[728, 90],
							[970, 150],
							[970, 250],
						],
					},
					{
						viewportSize: [840, 200],
						sizes: [[728, 90]],
					},
					{
						viewportSize: [0, 0],
						sizes: [
							[320, 50],
							[320, 100],
						],
					},
				],
				targeting: {
					loc: 'top',
					zne: '01',
				},
			},
			'cdm-zone-02': {
				autoplay: true,
				audio: false,
				defaultSizes: [
					[300, 250],
					[300, 600],
				],
				bidderAlias: '02_MR',
				group: '02_MR',
				targeting: {
					loc: 'top',
					zne: '02',
				},
			},
			'cdm-zone-03': {
				defaultSizes: [[300, 250]],
				group: '03_PF',
				bidderAlias: '03_PF',
				targeting: {
					loc: 'footer',
					zne: '03',
				},
			},
			'cdm-zone-04': {
				defaultSizes: [[728, 90]],
				group: '04_BLB',
				bidderAlias: '04_BLB',
				sizes: [
					{
						viewportSize: [970, 200],
						sizes: [
							[728, 90],
							[970, 150],
							[970, 250],
						],
					},
					{
						viewportSize: [840, 200],
						sizes: [[728, 90]],
					},
					{
						viewportSize: [0, 0],
						sizes: [
							[320, 50],
							[320, 100],
						],
					},
				],
				targeting: {
					loc: 'middle',
					zne: '04',
				},
			},
			'cdm-zone-06': {
				defaultSizes: [[300, 250]],
				group: '06_FMR',
				bidderAlias: '06_FMR',
				targeting: {
					loc: 'footer',
					zne: '06',
				},
			},
		};

		context.set('slots', slots);
	}
}
