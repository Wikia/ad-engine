import { context, DiProcess } from '@wikia/ad-engine';

export class GamefaqsTargetingSetup implements DiProcess {
	execute(): Promise<void> | void {
		context.set('targeting', {
			...context.get('targeting'),
			...this.getPageLevelTargeting(),
			...this.getCommonTargetingParams(),
		});
	}

	getPageLevelTargeting() {
		const targetParams = this.getTargetParams();

		if (!targetParams) {
			return;
		}

		return {
			con: targetParams.con,
			franchise: targetParams.franchise,
			game: targetParams.game,
			genre: targetParams.genre,
			env: undefined,
			publisher: targetParams.publisher,
			rdate: targetParams.rdate,
			score: targetParams.score,
		};
	}

	getCommonTargetingParams() {
		const utagData = window.utag_data;

		return {
			ftag: undefined,
			pos: undefined,
			ptype: utagData.pageType,
			pv: undefined,
			session: undefined,
			subses: undefined,
			sl: undefined,
			user: utagData.userType,
			vguid: utagData.pageViewGuid,
		};
	}

	getTargetParams() {
		const dataSettingsElement = document.head
			.querySelector('[id=ad-settings]')
			.getAttribute('data-settings');
		return JSON.parse(dataSettingsElement).target_params;
	}
}
