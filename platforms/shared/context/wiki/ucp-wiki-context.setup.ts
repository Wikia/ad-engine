import { Injectable } from '@wikia/dependency-injection';
import { WikiContextSetup } from '../../setup/wiki-context.setup';

@Injectable()
export class UcpWikiContextSetup extends WikiContextSetup {
	execute(): void {
		super.execute();
	}
}
