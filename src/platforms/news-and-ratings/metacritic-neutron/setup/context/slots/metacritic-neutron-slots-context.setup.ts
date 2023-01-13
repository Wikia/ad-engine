import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MetacriticNeutronSlotsContextSetup implements DiProcess {
	// TODO: Refactor
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
					pos: 'nav',
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
					pos: 'nav',
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
					pos: 'bottom',
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
					pos: 'bottom',
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
					pos: 'top',
				},
			},
			'mpu-top': {
				defaultSizes: [[300, 250]],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos: 'top',
				},
			},
			'mpu-middle': {
				defaultSizes: [[300, 250]],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos: 'middle',
				},
			},
			'mpu-bottom': {
				defaultSizes: [[300, 250]],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos: 'bottom',
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
					pos: 'nav',
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
					pos: 'increment',
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
					pos: 'increment',
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
					pos: 'bottom',
				},
			},
			'leaderboard-middle': {
				defaultSizes: [[728, 90]],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos: 'middle',
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
					pos: 'top',
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
					pos: 'top',
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
					pos: 'top',
				},
			},
			'nav-ad-plus-leader': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos: 'nav',
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
					pos: 'middle',
				},
			},
			'incontent-leaderboard-middle': {
				defaultSizes: [
					[728, 90],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'middle',
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
					pos: 'top',
				},
			},
			'mobile-nav-ad-plus-banner': {
				defaultSizes: [
					[5, 5],
					[320, 50],
				],
				incremental: false,
				targeting: {
					pos: 'nav',
				},
			},
			'skybox-leaderboard-nav': {
				defaultSizes: [
					[5, 5],
					[728, 90],
				],
				targeting: {
					pos: 'nav',
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
					pos: 'increment',
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
					pos: 'increment',
				},
			},
			'mobile-incontent-ad-plus': {
				defaultSizes: [
					[300, 250],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'increment',
				},
			},
		};

		context.set('slots', slots);
	}
}
