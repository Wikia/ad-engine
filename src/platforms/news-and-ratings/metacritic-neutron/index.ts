import '@abraham/reflection';
import { container } from 'tsyringe';
import { MetacriticNeutronPlatform } from './metacritic-neutron-platform';
import './styles.scss';

const platform = container.resolve(MetacriticNeutronPlatform);

platform.execute();
platform.setupPageChangeWatcher();
