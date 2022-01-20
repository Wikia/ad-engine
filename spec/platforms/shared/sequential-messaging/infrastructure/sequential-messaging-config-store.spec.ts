import { expect } from 'chai';
import { SequentialMessagingConfigStore } from '../../../../../platforms/shared/sequential-messaging/infrastructure/sequential-messaging-config-store';
import { makeInstantConfigServiceSpy } from '../test_doubles/instant-config-service.spy';

describe('Sequence Messaging Config Store', () => {
	it('Handle a proper Sequence', () => {
		it('Handle invalid config', () => {
			const smConfigStore_invalidValueType = makeInstantConfigServiceSpy();
			smConfigStore_invalidValueType.get.returns([]);
			const smConfigStore_emptyObject = makeInstantConfigServiceSpy();
			smConfigStore_emptyObject.get.returns({});
			const smConfigStore_invalidLineItemValue = makeInstantConfigServiceSpy();
			smConfigStore_invalidLineItemValue.get.returns({
				1234567890: 'invalid value',
			});
			const smConfigStore_invalidLengthValue = makeInstantConfigServiceSpy();
			smConfigStore_invalidLengthValue.get.returns({ 1234567890: { length: [4] } });

			const smcs1 = new SequentialMessagingConfigStore(smConfigStore_invalidValueType);
			const smcs2 = new SequentialMessagingConfigStore(smConfigStore_emptyObject);
			const smcs3 = new SequentialMessagingConfigStore(smConfigStore_invalidLineItemValue);
			const smcs4 = new SequentialMessagingConfigStore(smConfigStore_invalidLengthValue);

			expect(smcs1.get()).to.be.null;
			expect(smcs2.get()).to.be.null;
			expect(smcs3.get()).to.be.null;
			expect(smcs4.get()).to.be.null;
		});
	});
});
