# AdEngine

## Installation

```bash
npm install github:Wikia/ad-engine
```

## Platforms

### Gamepedia

* `npm run dev:gp` - to serve gamepedia on port 9000
* `npm run build:gp` - to create production build of gamepedia
* `npm run test:gp` - to run unit tests of gamepedia

## Available packages

Import everything from `@wikia/ad-engine`. Dead code should be eliminated during webpack compilation.

It is the one in `dist/index.es5.js`. It is compiled to es5 without polyfills and lodash plugin.
To compile it in your desired application import `getAdEngineLoader` from `configs/webpack-app.config.js` and add to your webpack loaders array.

## Context description

| Key | Description | Type | Required |
|-----|-------------|:----:|:--------:|
|`adUnitId`|Ad unit id used for DFP requests|string|✔|
|`bidders`|Bidders definitions|object|✘|
|`bidders.a9.amazonId`|A9 ID|string|✔|
|`bidders.a9.dealsEnabled`|Decides whether A9 deals will be enabled|boolean|✘|
|`bidders.a9.enabled`|Decides whether A9 will be enabled|boolean|✔|
|`bidders.a9.slots`|List of slots with their sizes/video type|object|✔|
|`bidders.a9.slots.{slot_name}.slotId`|Slot id|array|✘|
|`bidders.a9.slots.{slot_name}.sizes`|List of creative sizes to bid|array|✔|
|`bidders.a9.slots.{slot_name}.type`|`video` type decides of "video" mediaType bid|string|✘|
|`bidders.a9.videoEnabled`|Decides whether A9 video will be enabled|boolean|✘|
|`bidders.a9.bidsRefreshing.enabled`|Decides whether A9 should refresh bids|boolean|✘|
|`bidders.a9.bidsRefreshing.slots`|Decides which slots should be refreshed by A9|string[]|✘|
|`bidders.prebid.enabled`|Decides whether Prebid.js will be enabled|boolean|✔|
|`bidders.prebid.{bidder_name}`|Single bidder definitions|object|✔|
|`bidders.prebid.{bidder_name}.enabled`|Decides whether given bidder will be requested on page|boolean|✔|
|`bidders.prebid.{bidder_name}.slots`|Slots definitions (specific for each bidder)|object|✔|
|`bidders.prebid.bidsRefreshing.enabled`|Decides whether Prebid should refresh bids|boolean|✘|
|`bidders.prebid.bidsRefreshing.slots`|Decides which slots should be refreshed by Prebid|string[]|✘|
|`custom.isCMPEnabled`|Enables or disables GDPR data in Prebid and A9 requests|boolean|✘|
|`events`|Configuration for ad engine events|object|✘|
|`events.pushOnScroll`|Creates defined slots on scroll|object|✘|
|`events.pushOnScroll.ids`|List of ad slot names|array|✘|
|`events.pushOnScroll.threshold`|Top margin (in px) when slot is going to be requested (once user reach given position)|integer|✘|
|`events.pushAfterCreated`|Creates defined slots once another slot is created|object|✘|
|`events.pushAfterCreated.{slot_name}`|List of ad slot names to create once {slot_name} is created|array|✘|
|`events.pushAfterRendered`|Creates defined slots once another slot is rendered and lazy-loads them|object|✘|
|`events.pushAfterRendered.{slot_name}`|List of ad slot names to create once {slot_name} is rendered|array|✘|
|`listeners`|List of listeners registered in the ad-engine|object|✘|
|`listeners.porvata`|Porvata listeners objects (available methods: `isEnabled`, `onEvent`)|array|✘|
|`networkId`|DFP network ID that can be used in ad units|string|✘|
|`options`|General configuration of ad-engine services|object|✔|
|`options.customAdLoader.globalMethodName`|`top.{method_name}` will execute defined creative templates|string|✔|
|`options.video.moatTracking.enabled`|Decides whether MOAT video tracking is enabled|boolean|✘|
|`options.video.moatTracking.partnerCode`|MOAT identifier|string|✔|
|`options.video.moatTracking.sampling`|Sampling for MOAT tracking|string|✔|
|`options.video.porvata.audio.exposeToSlot`|Decides whether Porvata stores `audio` flag in slot object|boolean|✔|
|`services.krux.enabled`|Decides whether Krux is loaded (after calling `krux.call()`)|boolean|✘|
|`services.krux.id`|Krux ID|string|✔|
|`slots`|Ad slots definition|object|✔|
|`slots.{slot_name}`|Single slot definition|object|✔|
|`slots.{slot_name}.{anything}`|Ad slot definition may contain different properties and they will be available in `AdSlot.config` property|string|✘|
|`slots.{slot_name}.avoidConflictWith`|CSS selector that is going to be checked to prevent loading ad slot in the same viewport|string|✘|
|`slots.{slot_name}.bidderAlias`|Ad slot name alias for getting bids that are assigned for different ad slot|string|✘|
|`slots.{slot_name}.forceSafeFrame`|Forces safe frame for slot|boolean|✘|
|`slots.{slot_name}.insertBelowScrollPosition`|Switch: insert ad slot below scroll|boolean|✘|
|`slots.{slot_name}.insertBeforeSelector`|CSS selector where to put ad slot when it is going to be created once another slot is created (`events.pushAfterRendered` or `events.pushAfterCreated` is required)|string|✘|
|`slots.{slot_name}.repeat`|Configuration for repeating ad slot|object|✘|
|`slots.{slot_name}.repeat.additionalClasses`|CSS classes list for newly created slots|string|✘|
|`slots.{slot_name}.repeat.index`|Index of repeated slot (should be set to 1)|integer|✔|
|`slots.{slot_name}.repeat.limit`|Decides how many times slot should be repeated (unlimited if it is not set)|integer|✘|
|`slots.{slot_name}.repeat.slotNamePattern`|Pattern for creating another ad slot (e.g. `incontent_boxad_{slotConfig.repeat.index}`|string|✔|
|`slots.{slot_name}.repeat.updateProperties`|Definition of ad slot properties to update once it is created|string|✘|
|`slots.{slot_name}.repeat.updateProperties.{key}`|Value of slot property to update|any|✘|
|`slots.{slot_name}.sizes`|Ad slots sizes definition for certain viewports|array|✘|
|`slots.{slot_name}.sizes.0.sizes`|List of sizes for given viewport (e.g. `[[300, 50], [320, 50], [300, 250], [300, 600]]`)|array|✔|
|`slots.{slot_name}.sizes.0.viewport`|Minimum viewport width and height for defined sizes (e.g. `[1280, 700]`)|array|✔|
|`slots.{slot_name}.defaultSizes`|List of default sizes (if the smallest viewport is not matching)|array|✔|
|`slots.{slot_name}.targeting`|List of DFP slot level key-values|object|✘|
|`state.adStack`|Main queue where ad slots are pushed|array|✔|
|`state.provider`|Which provider should be used ('gpt', 'prebidium')|string|✔|
|`targeting`|List of DFP page level key-values|object|✔|
|`vast.adUnitId`|Ad unit id for video ads|string|✔|

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

// Setup gpt targeting
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

## Available templates

### Big Fancy Ad Above

Name: **bfaa**

#### Default config:

```json
{
	"desktopNavbarWrapperSelector": ".wds-global-navigation-wrapper",
	"handleNavbar": false,
	"mobileNavbarWrapperSelector": ".global-navigation-mobile-wrapper",
	"slotSibling": ".topic-header",
	"slotsToEnable": [
		"bottom_leaderboard",
		"incontent_boxad"
	]
}
```

Description:

* desktopNavbarWrapperSelector - desktop navbar DOM selector
* handleNavbar - decides whether template should adjust navbar
* mobileNavbarWrapperSelector - mobile navbar DOM selector
* slotSibling - DOM sibling element next to BFAA slot
* slotsToEnable - decides which slots should be enabled on Fan Takeover load

#### Template parameters:

* player
* slotName
* src
* uap
* lineItemId
* creativeId
* backgroundColor
* autoPlay
* resolvedStateAutoplay
* videoTriggers
* videoPlaceholderElement
* splitLayoutVideoPosition
* image1
* image2
* aspectRatio
* resolvedStateAspectRatio
* videoAspectRatio
* loadMedrecFromBTF
* moatTracking

### Big Fancy Ad Below

Name: **bfab**

#### Template parameters:

Check Big Fancy Ad Above.

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

Description:

* enabled - decides whether template is usable
* railSelector - element which is going to have `position: fixed`
* wrapperSelector - rail wrapper
* startOffset - decides when rail starts floating

#### Template parameters:

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

In one session run ad-engine and in other run tests.

```bash
npm run serve
```

```bash
npm run wdio-all
```

Run single suite:

```bash
npm run wdio -- --suite bidders
```

Run single test file:

```bash
npm run wdio -- --spec specs/bidders/reusable-prebid.desktop.test.js
```

### Generate Allure report

```bash
npm run allure
```

## Allure extensions

### Severity and Categories

#### Severity

Add these lines to test files

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

In order to add custom names for categories you need to create the 'categories.json' file in 'allure-results' folder.
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
To do that, simply add the 'environment.xml' file in allure-results folder.
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
