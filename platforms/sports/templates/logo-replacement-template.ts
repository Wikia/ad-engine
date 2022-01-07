import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { selectApplication } from '../utils/application-helper';
import { LogoReplacementFutheadHandler } from './handlers/logo-replacement/logo-replacement-futhead-handler';
import { LogoReplacementMutheadHandler } from './handlers/logo-replacement/logo-replacement-muthead-handler';

export function registerLogoReplacementTemplate(
	registry: TemplateRegistry,
): Observable<TemplateAction> {
	return registry.register(
		'logoReplacement',
		{
			initial: selectApplication([LogoReplacementFutheadHandler], [LogoReplacementMutheadHandler]),
		},
		'initial',
	);
}
