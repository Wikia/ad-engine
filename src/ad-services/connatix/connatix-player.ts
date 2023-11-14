export interface ConnatixPlayerInterface {
	get(playerId: string, renderId: string, renderCallback: (error, player) => void): any;
}

export class ConnatixPlayer implements ConnatixPlayerInterface {
	get(playerId: string, renderId: string, renderCallback: (error, player) => void): any {
		return window.cnx.cmd.push(() => {
			window.cnx({ playerId: playerId }).render(renderId, renderCallback);
		});
	}
}
