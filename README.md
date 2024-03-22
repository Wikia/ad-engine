//testing pull request creation 4
# AdEngine

[![codecov](https://codecov.io/gh/Wikia/ad-engine/branch/dev/graph/badge.svg?token=q8UGmNhjhW)](https://codecov.io/gh/Wikia/ad-engine)

## Installation

```bash
npm install github:Wikia/ad-engine
```

## Platforms

- `npm run dev:platforms` - to serve ad-engine platforms code (UCP, N&R, Muthead) on port 9000 (you can use it on the page with `?adengine_version=local`)
- `npm run build:platforms` - to create production build of platforms ad-engine code

## Available packages

Import everything from `@wikia/ad-engine`. Dead code should be eliminated during webpack compilation.

After running `npm run buid:platforms` a set of packages for each platform will be available in `dist/platforms/`.

## Context

Context is the ad-engine's store of custom global configuration. To get to know how to set and use it see `src/ad-engine/services/context-service.ts`.

## Usage

### Load GPT library

Follow [Google Publisher Tag instructions](https://support.google.com/admanager/answer/1638622?hl=en).

### Prepare configuration

Create context.js module with local config:

```javascript
export default customContext = {
	adUnitId: '/5441/name/_{custom.namespace}/{slotName}',
	events: {
		pushOnScroll: {
			ids: ['bottom_leaderboard'],
			threshold: 100,
		},
	},
	listeners: {
		porvata: [],
	},
	options: {
		maxDelayTimeout: 2000,
		porvata: {
			audio: {
				exposeToSlot: true,
				segment: '-audio',
				key: 'audio',
			},
		},
		video: {},
		customAdLoader: {
			globalMethodName: 'loadCustomAd',
		},
	},
	slots: {
		top_leaderboard: {
			firstCall: true,
			sizes: [
				{
					viewportSize: [970, 200],
					sizes: [
						[728, 90],
						[970, 250],
					],
				},
				{
					viewportSize: [728, 200],
					sizes: [[728, 90]],
				},
				{
					viewportSize: [0, 0],
					sizes: [[300, 250]],
				},
			],
			defaultSizes: [
				[728, 90],
				[970, 250],
			],
			targeting: {
				loc: 'top',
			},
		},
		incontent_boxad_1: {
			defaultSizes: [[300, 250]],
			repeat: {
				additionalClasses: 'hidead',
				index: 1,
				insertBeforeSelector: '.main p',
				limit: 5,
				slotNamePattern: 'incontent_boxad_{slotConfig.repeat.index}',
				updateProperties: {
					'targeting.rv': '{slotConfig.repeat.index}',
				},
			},
			sizes: [
				{
					viewportSize: [768, 0],
					sizes: [
						[300, 250],
						[300, 600],
					],
				},
			],
			targeting: {
				loc: 'hivi',
				pos: 'incontent_boxad',
				rv: 1,
			},
		},
		bottom_leaderboard: {
			disabled: true,
			sizes: [
				{
					viewportSize: [728, 100],
					sizes: [[728, 90]],
				},
				{
					viewportSize: [320, 200],
					sizes: [[320, 480]],
				},
			],
			defaultSizes: [],
			targeting: {
				loc: 'bottom',
			},
			viewportConflicts: ['top_leaderboard'],
		},
	},
};
```

### Run AdEngine module

Setup custom page level targeting and initialize AdEngine.

```javascript
import { AdEngine, context, templateService } from '@wikia/ad-engine';
import { FloatingRail } from '@wikia/ad-engine/dist/ad-products';
import customContext from './context';

context.extend(customContext);

templateService.register(FloatingRail, {
	startOffset: -15,
});

// ...

window.adsQueue = window.adsQueue || [];

// Setup adStack so slots can be pushed to window.* from DOM/other JS scripts
context.set('state.adStack', window.adsQueue);

// Setup screen size
context.set('state.isMobile', true);

// Setup custom variables so they can be used in adUnitId configuration
context.set('custom.namespace', 'article');

// Setup GPT targeting
targetingService.set('post_id', 123);

new AdEngine().init();
```

### Request ad slot

Request immediately:

```html
<div id="top_leaderboard">
	<script>
		window.adsQueue.push({
			id: 'top_leaderboard',
		});
	</script>
</div>
```

or prepare on scroll container (check above context configuration):

```html
<div id="bottom_leaderboard"></div>
```

### Call template from DFP creative

```html
<script>
	top.loadCustomAd &&
		top.loadCustomAd({
			type: 'floatingRail',
			// ...
		});
</script>
```

## Example templates

### Big Fancy Ad Above

Name: **bfaa**

#### Default config:

```json
{
    desktopNavbarWrapperSelector: '.wds-global-navigation-wrapper',
    mobileNavbarWrapperSelector: '.global-navigation-mobile-wrapper',
    mainContainer: document.body,
    handleNavbar: false,
    autoPlayAllowed: true,
    defaultStateAllowed: true,
    stickinessAllowed: true,
    slotSibling: '.topic-header',
    slotsToEnable: ['bottom_leaderboard', 'incontent_boxad', 'top_boxad'],
    onInit: () => {},
    onBeforeStickBfaaCallback: () => {},
    onAfterStickBfaaCallback: () => {},
    onBeforeUnstickBfaaCallback: () => {},
    onAfterUnstickBfaaCallback() {},
    onResolvedStateSetCallback: () => {},
    onResolvedStateResetCallback: () => {},
    moveNavbar() {},
}
```

##### Description:

- desktopNavbarWrapperSelector - desktop navbar DOM selector
- mobileNavbarWrapperSelector - mobile navbar DOM selector
- mainContainer - main container DOM selector (default: `document.body`)
- handleNavbar - decides whether template should adjust navbar
- autoPlayAllowed - decides whether video can be autoplayed
- defaultStateAllowed - decides whether BFAA impact state is allowed
- stickinessAllowed - decides whether the slot can be sticky
- slotSibling - DOM sibling element next to BFAA slot
- slotsToEnable - decides which slots should be enabled on Fan Takeover load

##### Template parameters

    adContainer: HTMLElement;
    adProduct: string;
    aspectRatio: number;
    autoPlay: boolean;
    clickThroughURL: string;
    config: UapConfig;
    container: HTMLElement;
    creativeId: string;
    image1: UapImage;
    image2?: UapImage;
    isDarkTheme: boolean;
    isMobile: boolean;
    lineItemId: string;
    slotName: string;
    src: string;
    thumbnail: HTMLElement;

### Big Fancy Ad Below

Name: **bfab**

### Default config:

```json
{
  autoPlayAllowed: true,
  defaultStateAllowed: true,
  stickinessAllowed: false,
  bfaaSlotName: 'top_leaderboard',
  unstickInstantlyBelowPosition: 500,
  topThreshold: 55,
  onInit: () => {},
}
```

##### Description:

- autoPlayAllowed - decides whether video can be autoplayed
- defaultStateAllowed - decides whether BFAA impact state is allowed
- stickinessAllowed - decides whether the slot can be sticky
- bfaaSlotName - name of BFAA slot - if BFAA is sticky, BFAB can't stick
- unstickInstantlyBelowPosition - below given offset BFAB is always unsticked
- topThreshold - number of pixels from the top edge of BFAA slot when it's sticky to the top edge of its nearest positioned ancestor

##### Template parameters

See: BFAA Template parameters.

### Porvata

#### Default config:inViewportOffsetBottom

```json
{
  isFloatingEnabled: true,
  inViewportOffsetTop: 0,
  inViewportOffsetBottom: 0,
  onInit: () => {},
}
```

##### Description:

- isFloatingEnabled - decides whether Porvata slot can float
- inViewportOffsetTop, inViewportOffsetBottom - below given thresholds Porvata slot is not considered being within a viewport

##### Template parameters

    vpaidMode: google.ima.ImaSdkSettings.VpaidMode;
    viewportHookElement?: HTMLElement;
    container: HTMLElement;
    enableInContentFloating: boolean;
    slotName: string;
    viewportOffsetTop?: number;
    viewportOffsetBottom?: number;
    adProduct: string;
    src: string;
    autoPlay: boolean;
    vastTargeting: Targeting;
    startInViewportOnly: boolean;
    onReady: (player: PorvataPlayer) => void;

### Debug mode

Add `adengine_debug=1` to see all logged events in console.
In order to get logs from specified groups use `?adengine_debug=<group_name_1>,<group_name_2>,...`.

## Run tests

```bash
npm run test
```

## Lint all files

```bash
npm run lint
```

## Bundle analyzer

To check webpack bundle analyzer run

```bash
npm run bundle-analyzer
```

It will open new browser tab with results from bundle analyzer.

## Dependency graph

To check dependency graph run

```bash
npm run graph
```

Behind the scenes it uses madge, which requires graphviz to be installed. You can install it using brew:

```bash
brew install graphviz
```

Look for `graph.svg` file in the root directory.

## Code Coverage

To check code coverage run

```bash
npm run code-coverage
```

This will return a text table in the command line as well as generate detailed coverage information in an HTML page in `/spec/build/index.html`
