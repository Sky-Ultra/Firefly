export type GreetingPeriodIcon = "night" | "morning" | "afternoon" | "evening";

export type GreetingPeriod = {
	startHour: number;
	endHour: number;
	texts: string[];
	textsEn: string[];
	interval?: number;
	icon: GreetingPeriodIcon;
};

export type FestivalRule = {
	name: string;
	nameEn: string;
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
		fallbackMessageEn: string;
		subtitle: string;
		subtitleEn: string;
		visibleDuration: number;
		fadeDuration: number;
	};
	copyToast: {
		message: string;
		messageEn: string;
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
		birthday: {
			month: number;
			day: number;
		};
		festivals: FestivalRule[];
	};
};
