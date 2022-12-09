import { context, DiProcess, SlotCreator } from '@wikia/ad-engine';

export class CcnDynamicSlotsSetup implements DiProcess {
	execute(): void {
		this.injectTopLeaderboard();
		this.injectSlots();
	}

	private injectTopLeaderboard(): void {
		// TODO: discuss usage of SlotCreator and decide on solution:
		// 1) should we leave it here but pass as argument to the CcnDynamicSlotsSetup?
		// 2) should we create ccn-slot-definition-repository and create the slot like in ucp-desktop etc.?
		// 3) should we ask NnR team to inject an empty div on the backend and we'll fill it as the rest in injectSlots?
		const slotName = 'div-gpt-ad-headerad';
		const slotCreator = new SlotCreator();

		slotCreator.createSlot({
			slotName,
			placeholderConfig: null,
			anchorSelector: '#content',
			insertMethod: 'prepend',
			classList: [],
		});

		context.push('state.adStack', { id: slotName });
	}

	private injectSlots(): void {
		const definedSlots = context.get('slots');

		if (!definedSlots) {
			console.warn('No slots defined');
			return;
		}

		Object.keys(definedSlots).forEach((slotElementId) => {
			const slotPlaceholder = document.getElementById(slotElementId);

			if (!slotPlaceholder) {
				return;
			}

			context.push('state.adStack', { id: slotElementId });
		});
	}
}
