import { context, DiProcess } from '@wikia/ad-engine';

export class PlayerOneSlotsSetup implements DiProcess {
	execute(): void {
		let activeSlots;
		const site = context.get('custom.site');

		switch (site) {
			case 'metacritic':
				activeSlots = ['leader_plus_top', 'mpu_plus_top'];
				break;
			case 'gamefaqs':
				activeSlots = ['leader_plus_top', 'mpu_top'];
				break;
		}

		// TODO: move below to some kind of a dynamic slots setup
		activeSlots.map((slotName) => {
			// create slot div
			const slotDiv = document.createElement('div');
			slotDiv.id = slotName;

			document.querySelector(`.ad.ad_${slotName}`).appendChild(slotDiv);

			// add slot to the ad stack = request GPT for an ad
			context.push('state.adStack', { id: slotName });
		});
	}
}
