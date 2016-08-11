'use strict';

import AdEngine from 'ad-engine/ad-engine';
import Context from '../../context';

Context.set('state.adStack', window.adsQueue);
Context.set('targeting.s1', '_project43');
Context.set('targeting.artid', '167');

new AdEngine().init();
