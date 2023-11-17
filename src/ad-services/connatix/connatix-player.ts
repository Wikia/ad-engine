export interface ConnatixPlayerInterface {
	get(playerId: string, renderId: string, renderCallback: (error, player) => void): any;
}

export enum ConnatixPlayerType {
	OutStream = 0,
	InStream = 1,
}

export interface ConnatixPlayerApi {
	destroy: () => void;
	disableAdvertising: () => void;
	disableFloatingMode: () => void;
	enableAdvertising: () => void;
	enableFloatingMode: () => void;
	getPlayerType: () => ConnatixPlayerType;
	on: (eventName: string, callback: (eventData: unknown) => void) => void;
}

export class ConnatixPlayer implements ConnatixPlayerInterface {
	get(playerId: string, renderId: string, renderCallback: (error, player) => void): any {
		return window.cnx.cmd.push(() => {
			window.cnx({ playerId: playerId }).render(renderId, renderCallback);
		});
	}
}
