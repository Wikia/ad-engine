export interface BingebotTheme {
	breakpoint_values: BreakpointValues;
	breakpoint_available_width: BreakpointAvailableWidth;
	breakpoint_available_width_values: BreakpointAvailableWidthValues;
	color: Color;
	color_theme: ColorTheme;
	content_well_margin: string;
	content_well_margin_value: number;
	font_family: string;
	font_size: FontSize;
	font_size_value: FontSizeValue;
	font_weight: FontWeight;
	line_height: LineHeight;
	media: Media;
	style: Style;
	animation: Animation;
}

interface BreakpointValues {
	small: number;
	medium: number;
	large: number;
	xlarge: number;
	xxlarge: number;
}

interface BreakpointAvailableWidth {
	medium: string;
	large: string;
	xlarge: string;
	xxlarge: string;
}

interface BreakpointAvailableWidthValues {
	medium: number;
	large: number;
	xlarge: number;
	xxlarge: number;
}

interface Color {
	appBackground: string;
	primary: string;
	primaryDark: string;
	secondary: string;
	tertiary: string;
	body: string;
	bodyInvert: string;
	offBody: string;
	positive: string;
	negative: string;
}

interface ColorTheme {
	light: Light;
	dark: Dark;
}

interface Light {
	c1: string;
	c2: string;
	c3: string;
	c4: string;
	c6: string;
	c7: string;
	c8: string;
}

interface Dark {
	c1: string;
	c2: string;
	c4: string;
	c5: string;
	c6: string;
	c7: string;
	c8: string;
}

interface FontSize {
	xxs: string;
	xs: string;
	s: string;
	base: string;
	l: string;
	xl: string;
	xxl: string;
	xxxl: string;
	xxxxl: string;
}

interface FontSizeValue {
	xxs: number;
	xs: number;
	s: number;
	base: number;
	l: number;
	xl: number;
	xxl: number;
	xxxl: number;
	xxxxl: number;
}

interface FontWeight {
	light: number;
	normal: number;
	medium: number;
	bold: number;
	black: number;
}

interface LineHeight {
	none: number;
	tight: number;
	normal: number;
	loose: number;
}

interface Media {
	small_up: string;
	medium_up: string;
	large_up: string;
	xlarge_up: string;
	xxlarge_up: string;
	small_down: string;
	medium_down: string;
	large_down: string;
	xlarge_down: string;
	xxlarge_down: string;
	small_only: string;
	medium_only: string;
	large_only: string;
	xlarge_only: string;
	xxlarge_only: string;
}

interface Style {
	fontFamily: string;
	borderRadius: string;
	transitionSpeed: string;
	boxShadow: string;
}

// tslint:disable-next-line:no-empty-interface
interface Animation {}
