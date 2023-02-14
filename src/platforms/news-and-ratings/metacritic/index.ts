import 'reflect-metadata';
import { container } from 'tsyringe';
import { MetacriticPlatform } from './metacritic-platform';
import './styles.scss';

const platform = container.resolve(MetacriticPlatform);

platform.execute();
