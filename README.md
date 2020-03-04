# AdEngine

## Installation.

```bash
npm install github:Wikia/ad-engine
```

## Platforms.

* `npm run dev:platforms` - to serve ad-engine platforms code (UCP, Gamepedia, Futhead, Muthead) on port 9000
* `npm run build:platforms` - to create production build of platforms ad-engine code

## Available packages

Import everything from `@wikia/ad-engine`. Dead code should be eliminated during webpack compilation.

It is the one in `dist/index.es5.js`. It is compiled to es5 without polyfills and lodash plugin.
To compile it in your desired application import `getAdEngineLoader` from `configs/webpack-app.config.js` and add to your webpack loaders array.

## Context

Context is the ad-engine's store of custom global configuration. To get to know how to set and use it see `src/ad-engine/services/context-service.ts`.

## Usage

### Load GPT library

Follow [DoubleClick for Publishers instructions](https://support.google.com/dfp_premium/answer/1638622?hl=en).

### Prepare configuration

Create context.js module with local config:

```javascript
export default customContext = {
	adUnitId: '/5441/name/_{custom.namespace}/{slotName}',
	events: {
		pushOnScroll: {
			ids: [
				'bottom_leaderboard'
			],
			threshold: 100
		}
	},
	listeners: {
		porvata: []
	},
	options: {
		maxDelayTimeout: 2000,
		porvata: {
			audio: {
				exposeToSlot: true,
				segment: '-audio',
				key: 'audio'
			}
		},
		video: {
			moatTracking: {
				enabled: false,
				partnerCode: 'foo',
				sampling: 1
			}
		},
		customAdLoader: {
			globalMethodName: 'loadCustomAd'
		}
	},
	slots: {
		top_leaderboard: {
			aboveTheFold: true,
			firstCall: true,
			sizes: [
				{
					viewportSize: [970, 200],
					sizes: [[728, 90], [970, 250]]
				},
				{
					viewportSize: [728, 200],
					sizes: [[728, 90]]
				},
				{
					viewportSize: [0, 0],
					sizes: [[300, 250]]
				}
			],
			defaultSizes: [[728, 90], [970, 250]],
			targeting: {
				loc: 'top'
			}
		},
		incontent_boxad_1: {
			defaultSizes: [[300, 250]],
			repeat: {
				additionalClasses: 'hide',
				index: 1,
				insertBeforeSelector: '.main p',
				limit: null,
				slotNamePattern: 'incontent_boxad_{slotConfig.repeat.index}',
				updateProperties: {
					'targeting.rv': '{slotConfig.repeat.index}'
				}
			},
			sizes: [
				{
					viewportSize: [768, 0],
					sizes: [[300, 250], [300, 600]]
				}
			],
			targeting: {
				loc: 'hivi',
				pos: 'incontent_boxad',
				rv: 1
			}
		},
		bottom_leaderboard: {
			disabled: true,
			sizes: [
				{
					viewportSize: [728, 100],
					sizes: [[728, 90]]
				},
				{
					viewportSize: [320, 200],
					sizes: [[320, 480]]
				}
			],
			defaultSizes: [],
			targeting: {
				loc: 'bottom'
			},
			viewportConflicts: [
				'top_leaderboard'
			]
		}
	}
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
	startOffset: -15
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
context.set('targeting.post_id', 123);

new AdEngine().init();
```

### Request ad slot

Request immediately:

```html
<div id="top_leaderboard">
	<script>
		window.adsQueue.push({
			id: 'top_leaderboard'
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
top.loadCustomAd && top.loadCustomAd({
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
    fullscreenAllowed: true,
    stickinessAllowed: true,
    stickyUntilSlotViewed: true,
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

* desktopNavbarWrapperSelector - desktop navbar DOM selector
* mobileNavbarWrapperSelector - mobile navbar DOM selector
* mainContainer - main container DOM selector (default: `document.body`)
* handleNavbar - decides whether template should adjust navbar
* autoPlayAllowed - decides whether video can be autoplayed
* defaultStateAllowed - decides whether BFAA impact state is allowed
* fullscreenAllowed - decides whether video can be displayed on full screen
* stickinessAllowed - decides whether the slot can be sticky
* stickyUntilSlotViewed - decides whether the slot should be sticky untill viewability is counted
* slotSibling - DOM sibling element next to BFAA slot
* slotsToEnable - decides which slots should be enabled on Fan Takeover load

##### Template parameters

	adContainer: HTMLElement;
	adProduct: string;
	aspectRatio: number;
	autoPlay: boolean;
	backgroundColor: string;
	blockOutOfViewportPausing: boolean;
	clickThroughURL: string;
	config: UapConfig;
	container: HTMLElement;
	creativeId: string;
	fullscreenable: boolean;
	fullscreenAllowed: boolean;
	image1: UapImage;
	image2?: UapImage;
	isDarkTheme: boolean;
	isMobile: boolean;
	isSticky: boolean;
	lineItemId: string;
	loadMedrecFromBTF: boolean;
	moatTracking: boolean;
	player: HTMLElement;
	resolvedStateAspectRatio: number;
	resolvedStateAutoPlay: boolean;
	resolvedStateForced?: boolean;
	restartOnUnmute: boolean;
	slotName: string;
	splitLayoutVideoPosition: string;
	src: string;
	stickyAdditionalTime: number;
	stickyUntilVideoViewed: boolean;
	theme: string;
	thumbnail: HTMLElement;
	uap: string;
	videoAspectRatio: number;
	videoPlaceholderElement: HTMLElement;
	videoTriggers: any[];

### Big Fancy Ad Below

Name: **bfab**

### Default config:

```json
{
  autoPlayAllowed: true,
  defaultStateAllowed: true,
  fullscreenAllowed: true,
  stickinessAllowed: false,
  stickyUntilSlotViewed: true,
  bfaaSlotName: 'top_leaderboard',
  unstickInstantlyBelowPosition: 500,
  topThreshold: 58,
  onInit: () => {},
}
```

##### Description:

* autoPlayAllowed - decides whether video can be autoplayed
* defaultStateAllowed - decides whether BFAA impact state is allowed
* fullscreenAllowed - decides whether video can be displayed on full screen
* stickinessAllowed - decides whether the slot can be sticky
* stickyUntilSlotViewed - decides whether the slot should be sticky untill viewability is counted
* bfaaSlotName - name of BFAA slot - if BFAA is sticky, BFAB can't stick
* unstickInstantlyBelowPosition - below given offset BFAB is always unsticked
* topThreshold - number of pixels from the top edge of BFAA slot when it's sticky to the top edge of its nearest positioned ancestor

##### Template parameters

See BFAA Template parameters.

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

* isFloatingEnabled - decides whether Porvata slot can float
* inViewportOffsetTop, inViewportOffsetBottom - below given thresholds Porvata slot is not considered being within a viewport

##### Template parameters

	vpaidMode: google.ima.ImaSdkSettings.VpaidMode;
	viewportHookElement?: HTMLElement;
	container: HTMLElement;
	originalContainer: HTMLElement;
	enableInContentFloating: boolean;
	slotName: string;
	viewportOffsetTop?: number;
	viewportOffsetBottom?: number;
	adProduct: string;
	src: string;
	autoPlay: boolean;
	vastTargeting: Targeting;
	blockOutOfViewportPausing: boolean;
	startInViewportOnly: boolean;
	onReady: (player: PorvataPlayer) => void;

### Floating rail

Name: **floatingRail**

#### Default config:

```json
{
	"enabled": true,
	"railSelector": "#rail",
	"wrapperSelector": "#rail-wrapper",
	"startOffset": 0
}
```

##### Description:

* enabled - decides whether template is usable or not
* railSelector - selector of element which is going to have `position: fixed`
* wrapperSelector - rail wrapper DOM element selector
* startOffset - decides when rail starts floating

##### Template parameters:

* offset - how long (in px) rail is going to be fixed

#### Creative usage:

```html
<script>
top.loadCustomAd && top.loadCustomAd({
	type: 'floatingRail',
	offset: 500
});
</script>
```

## Run build

To build entire lib just use `npm run build` - it will create all three versions:
* tree shakeable with single entry point
  * can be built with `npm run build:rollup`
  * can be watched with `npm run watch:rollup`
* legacy with 4 different exports
  * can be built with `npm run build:webpack`
  * can be watched with `npm run build:webpack`
* `global.bundle.js` to include everything to window.
  * can be build with `npm run build:webpack`
  * cannot be watched

## Run example pages

```bash
npm run serve
```

Navigate to <http://localhost:8080/> (you may have different port).
Upon using the command, the page should automatically open in your default browser.

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

## WebdriverIO tests

### Run tests

Run all suites one by one by using e.g.:

```bash
npm run wdio-desktop -- --suite bidders
```

Wdio doesn't use `npm run serve` anymore - it does use example pages so be sure to rebuild them first with:

```bash
npm run build:examples
```

Suites are listed in `wdio.*platform*.config.js`.

Run single test file:
```bash
npm run wdio-desktop -- --spec reusable-prebid
```

### Generate Allure report

```bash
npm run allure
```

## Allure extensions

### Severity and Categories

#### Severity

Add these lines to test files:

```js
import reporter from 'wdio-allure-reporter';
```

```js
reporter.severity('severity');
```

Available severity levels:
* blocker
* critical
* normal (default)
* minor
* trivial

Note that adding `reporter.severity()` to `beforeEach()` sets a fixed value for all the test cases in the file.
This can't be overridden by putting different severity in test cases, as the one in `beforeEach()` is a parent value.
If you want to set different severity for some cases, put it right under `it` instead.

#### Categories

In order to add custom names for categories you need to create the `categories.json` file in `allure-results` folder.
The structure of that file looks like that:

```json
[
  {
    "name": "Passed tests",
    "matchedStatuses": ["passed"]
  },
  {
    "name": "Skipped tests",
    "matchedStatuses": ["skipped"]
  },
  {
    "name": "Broken tests",
    "matchedStatuses": ["failed"]
  },
  {
    "name": "Failed tests",
    "matchedStatuses": ["broken"]
  }
]
```

Description:
* name - the name we want for our category
* matchedStatuses - statuses to get that name

The reason why we switched "Broken tests" with "Failed tests" was to keep it consistent with Jenkins.
Allure does not allow changing categories' colors, unless we fork our own release of it.

#### Environment

Similar to categories, you can also add more information about the environment.
To do that, simply add the `environment.xml` file in allure-results folder.
The structure of that file looks like that:

```xml
<environment>
    <parameter>
        <key>Ad Engine version</key>
        <value>Ad Engine 3.0</value>
    </parameter>
</environment>
```

Description:
* key - element of our environment
* value - details about this element (version, filename, path  etc.)

Do note, that instead of changing the information about the environment, you add more details.
By default, Allure only provides information about the browser and spec files (with test cases).
