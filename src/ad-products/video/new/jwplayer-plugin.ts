import { JWPlayer } from './jwplayer-interfaces/jwplayer';
import { JWPlayerConfig } from './jwplayer-interfaces/jwplayer-config';

export class JWPlayerAdEnginePlugin {
	constructor(private player: JWPlayer, private config: JWPlayerConfig, private div: HTMLElement) {
		this.run();
	}

	private run(): void {}
}
