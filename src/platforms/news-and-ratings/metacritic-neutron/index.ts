import { withSentry } from '@platforms/shared';
import { Container } from '@wikia/dependency-injection';
import { MetacriticNeutronPlatform } from './metacritic-neutron-platform';
import './styles.scss';

withSentry((container: Container) => {
	const platform = container.get(MetacriticNeutronPlatform);

	platform.execute(container);
});
