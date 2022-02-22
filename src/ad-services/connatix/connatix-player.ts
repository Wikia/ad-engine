export interface ConnatixPlayerInterface {
	get(playerId: string, renderId: string): any;
}

export class ConnatixPlayer implements ConnatixPlayerInterface {
	get(playerId: string, renderId: string): any {
		return window.cnx.cmd.push(() => {
			window.cnx({ playerId: playerId }).render(renderId);
		});
	}
}
