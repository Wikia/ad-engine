import { AdEngine, btfBlockerService } from '@wikia/ad-engine';
import context from '../../context';

new AdEngine(context).init();

document.getElementById('finishAtfQueue').addEventListener('click', () => {
	btfBlockerService.finishFirstCall();
});
