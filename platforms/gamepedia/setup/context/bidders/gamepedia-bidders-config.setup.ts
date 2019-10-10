import { BiddersConfigSetup } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';
import { setA9AdapterConfig } from '../../../bidders/a9';

@Injectable()
export class GamepediaBiddersConfigSetup implements BiddersConfigSetup {
	setBiddersConfigContext(): void {
		setA9AdapterConfig();
	}
}
