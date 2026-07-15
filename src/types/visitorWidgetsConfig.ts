export type GreetingPeriodIcon = "night" | "morning" | "afternoon" | "evening";

export type GreetingPeriod = {
	startHour: number;
	endHour: number;
	texts: string[];
	interval?: number;
	icon: GreetingPeriodIcon;
};

export type FestivalRule = {
	name: string;
	calendar: "gregorian" | "chinese";
	month: number;
	day: number;
};

export type VisitorWidgetsConfig = {
	welcomeToast: {
		enabled: boolean;
		homepageOnly: boolean;
		locationApi: string;
		fallbackMessage: string;
		subtitle: string;
		visibleDuration: number;
		fadeDuration: number;
	};
	copyToast: {
		message: string;
		visibleDuration: number;
		fadeDuration: number;
	};
	timeGreeting: {
		periods: GreetingPeriod[];
		image: {
			src: string;
			alt: string;
			position?: string;
		};
	};
	weather: {
		locationApi: string;
		forecastApi: string;
		weatherCacheDuration: number;
		locationCacheDuration: number;
		fallbackLocation: {
			name: string;
			latitude: number;
			longitude: number;
		};
	};
	dailyQuote: {
		api: string;
		fallbackText: string;
		fallbackAuthor: string;
	};
	festivalCountdown: {
		festivals: FestivalRule[];
	};
};
