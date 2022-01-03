import { templateService } from '@wikia/ad-engine';
import { expect } from 'chai';
import { TemplateFake } from '../template-fake';

describe('template-service', () => {
	it('call not existing template', () => {
		expect(() => {
			templateService.init('foo', {} as any);
		}).to.throw('Template foo does not exist.');
	});

	it('call registered template', () => {
		templateService.register(TemplateFake);

		expect('executed').to.equal(templateService.init('fake', {} as any));
	});
});
