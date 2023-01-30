import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MetacriticNeutronSlotsContextSetup implements DiProcess {
	// TODO: Refactor - wait for decision on ADEN-12650
	execute(): void {
		const slots = {
			'omni-skybox-leader-nav': {
				defaultSizes: [
					[6, 6],
					[5, 5],
					[970, 66],
					[728, 90],
				],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'nav',
				},
			},
			'omni-skybox-leaderboard-nav': {
				defaultSizes: [
					[6, 6],
					[728, 90],
					[5, 5],
				],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'nav',
				},
			},
			'incontent-leader-plus-bottom': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 250],
					[5, 5],
				],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'incontent-leaderboard-bottom': {
				defaultSizes: [
					[728, 90],
					[5, 5],
				],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'mpu-plus-top': {
				defaultSizes: [
					[300, 250],
					[320, 600],
				],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'top',
				},
			},
			'mpu-top': {
				defaultSizes: [[300, 250]],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'top',
				},
			},
			'mpu-middle': {
				defaultSizes: [[300, 250]],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'middle',
				},
			},
			'mpu-bottom': {
				defaultSizes: [[300, 250]],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'mobile-omni-skybox-plus-nav': {
				defaultSizes: [
					[6, 6],
					[5, 5],
					[320, 50],
				],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'nav',
				},
			},
			'mobile-banner-plus': {
				defaultSizes: [
					[320, 50],
					[300, 250],
				],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'increment',
				},
			},
			'mobile-incontent-plus': {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'increment',
				},
			},
			'mobile-incontent-plus-bottom': {
				defaultSizes: [
					[320, 50],
					[300, 250],
					[5, 5],
				],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'leaderboard-middle': {
				defaultSizes: [[728, 90]],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'middle',
				},
			},
			'incontent-leader-plus-top': {
				defaultSizes: [
					[970, 66],
					[970, 250],
					[728, 90],
					[5, 5],
				],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'top',
				},
			},
			'incontent-leaderboard-top': {
				defaultSizes: [
					[728, 90],
					[5, 5],
				],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos_nr: 'top',
				},
			},
			'incontent-all-top': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 250],
					[5, 5],
					[8, 8],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			'nav-ad-plus-leader': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos_nr: 'nav',
				},
			},
			'incontent-ad-plus-billboard-middle': {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos_nr: 'middle',
				},
			},
			'incontent-leaderboard-middle': {
				defaultSizes: [
					[728, 90],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos_nr: 'middle',
				},
			},
			'incontent-narrow-all-top': {
				defaultSizes: [
					[728, 90],
					[5, 5],
					[8, 8],
				],
				incremental: true,
				targeting: {
					pos_nr: 'top',
				},
			},
			'mobile-nav-ad-plus-banner': {
				defaultSizes: [
					[5, 5],
					[320, 50],
				],
				incremental: false,
				targeting: {
					pos_nr: 'nav',
				},
			},
			'skybox-leaderboard-nav': {
				defaultSizes: [
					[5, 5],
					[728, 90],
				],
				targeting: {
					pos_nr: 'nav',
				},
			},
			'mobile-incontent-mpu-plus': {
				defaultSizes: [
					[300, 250],
					[5, 5],
					[320, 480],
				],
				incremental: true,
				targeting: {
					pos_nr: 'increment',
				},
			},
			'mobile-incontent-all': {
				defaultSizes: [
					[300, 250],
					[5, 5],
					[320, 480],
					[8, 8],
				],
				incremental: true,
				targeting: {
					pos_nr: 'increment',
				},
			},
			'mobile-incontent-ad-plus': {
				defaultSizes: [
					[300, 250],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos_nr: 'increment',
				},
			},
		};

		context.set('slots', slots);
	}
}
