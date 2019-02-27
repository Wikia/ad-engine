import { expect } from 'chai';
import { templateService } from '../../../src/ad-engine/services/template-service';
import TemplateFake from '../template-fake';

describe('template-service', () => {
	it('call not existing template', () => {
		expect(() => {
			templateService.init('foo', {});
		}).to.throw('Template foo does not exist.');
	});

	it('call registered template', () => {
		templateService.register(TemplateFake);

		expect('executed').to.equal(templateService.init('fake', {}));
	});
});
