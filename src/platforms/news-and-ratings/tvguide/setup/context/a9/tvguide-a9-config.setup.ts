import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TvGuideA9ConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.a9.slots', this.getA9Context());
	}

	private getA9Context(): object {
		return {
			//todo
		};
	}
}
