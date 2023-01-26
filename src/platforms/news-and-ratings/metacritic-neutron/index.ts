import { Container } from '@wikia/dependency-injection';
import { MetacriticNeutronPlatform } from './metacritic-neutron-platform';
import './styles.scss';

const container = new Container();
const platform = container.get(MetacriticNeutronPlatform);

platform.execute();
