import { writable } from 'svelte/store';

export const years = writable(['Frosh', 'Sophomore', 'Junior', 'Senior']);
export const quarters = writable(['Fall', 'Winter', 'Spring']);
export const allCourses = writable([]);
export const courseTable = writable([]);
export const courseTableList = writable([]);
export const WAYSTables = writable([]);
export const selectedCourse = writable({});
export const selectedCoursePinned = writable(false);
export const searchFilters = writable({
	meta: {
		'filterGridCourses': false,
	},
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
	units: {
		'1': false,
		'2': false,
		'3': false,
		'4': false,
		'5': false,
		'6+': false,
	},
	hours: {
		'min': 0,
		'max': 24
	},
	averageEval: {
		'min': 0,
		'max': 5
	},
	percentCompleted: {
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

export const resultCategories = writable([
	{
		type: 'exactMatchResults',
		results: [],
		title: 'Exact Match',
		hide: false,
		numResults: 100,
		defaultNumResults: 100,
		numResultsShowing: 0,
		numResultsFound: 0
	},
	{
		type: 'sameDepartmentResults',
		results: [],
		title: 'Same Department',
		hide: false,
		numResults: 9999,
		defaultNumResults: 9999,
		numResultsShowing: 0,
		numResultsFound: 0
	},
	{
		type: 'titleResults',
		results: [],
		title: 'Title Match',
		hide: false,
		numResults: 100,
		defaultNumResults: 100,
		numResultsShowing: 0,
		numResultsFound: 0
	},
	{
		type: 'descriptionResults',
		results: [],
		title: 'Description Match',
		hide: false,
		numResults: 100,
		defaultNumResults: 100,
		numResultsShowing: 0,
		numResultsFound: 0
	}
]);

export const courseWidth = writable(15);
export const isDragging = writable(false);

//For course objects, always show the course number, hours, units
//Optional: exploreCourses link, carta link, WAYS, description (shows popup on hover),
//eval, % completed
export const prefs = writable({
	courseTableData: {
		showLinks: false,
		showWAYS: false,
		showPercent: false,
		showCheckboxes: false,
		yearsCollapsed: {
			'Frosh': false,
			'Sophomore': false,
			'Junior': false,
			'Senior': false
		},
	},
	courseDataPanelCollapsed: false,
	searchCollapsed: false,
});
