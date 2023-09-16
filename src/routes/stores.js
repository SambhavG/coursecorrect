import { writable } from 'svelte/store';

export const years = writable(['Frosh', 'Sophomore', 'Junior', 'Senior']);
export const quarters = writable(['Fall', 'Winter', 'Spring']);
export const allCourses = writable([]);
export const courseTable = writable([]);
export const searchResults = writable({
	exactMatchResults: [],
	sameDepartmentResults: [],
	titleResults: [],
	descriptionResults: []
});
export const courseTableList = writable([]);
export const WAYSTables = writable([]);
export const selectedCourse = writable({});
export const searchFilters = writable({
	WAYS: {
		'AII': false,
		'SI': false,
		'SMA': false,
		'CE': false,
		'AQR': false,
		'EDP': false,
		'ER': false,
		'FR': false,
	},
	Units: {
		'1': false,
		'2': false,
		'3': false,
		'4': false,
		'5': false,
		'6+': false,
	},
	Hours: {
		'min': 0,
		'max': 24
	},
	Eval: {
		'min': 0,
		'max': 5
	},
	PercentCompleted: {
		'min': 0,
		'max': 100
	},
	QuartersOffered: {
		'Fall': false,
		'Winter': false,
		'Spring': false,
		'Summer': false
	},
	DegreeSpecific: {
		'BS in Mathematics': {
			'20 Series': [],
			'50/60 Series': [],
			'Core': [],
			'Electives': [],
			'WIM': []
		}
	}
});

export const courseWidth = writable(15);


//For course objects, always show the course number, hours, units
//Optional: exploreCourses link, carta link, WAYS, description (shows popup on hover),
//eval, % completed
export const prefs = writable({
	courseTableData: {
		showLinks: true,
		showWAYS: true,
		showPercent: true,
		showCheckboxes: true,
		yearsCollapsed: {
			'Frosh': false,
			'Sophomore': false,
			'Junior': false,
			'Senior': false
		}
	}
});
