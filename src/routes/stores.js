import { writable } from 'svelte/store';

export const years = writable(['Frosh', 'Sophomore', 'Junior', 'Senior', 'Coterm']);
export const quarters = writable(['Summer', 'Fall', 'Winter', 'Spring']);
export const allCourses = writable([]);
export const reviewData = writable(undefined);
export const courseTable = writable([]);
export const courseTableList = writable([]);
export const WAYSTables = writable([]);
export const selectedCourse = writable({});
export const selectedCoursePinned = writable(false);
export const searchFilters = writable({
	meta: {
		'filterGridCourses': false,
		'filterNotOffered': false,
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
		'max': 100
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
		'Autumn': false,
		'Winter': false,
		'Spring': false,
		'Summer': false
	},
	sortBy: "alphabetical",
	sortOrder: "ascending",
});

export const resultCategories = writable([
	{
		type: 'exactMatchResults',
		results: [],
		title: 'Exact Match',
		hide: false,
		numResults: 10,
		defaultNumResults: 10,
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
		numResults: 10,
		defaultNumResults: 10,
		numResultsShowing: 0,
		numResultsFound: 0
	},
	{
		type: 'descriptionResults',
		results: [],
		title: 'Description Match',
		hide: false,
		numResults: 10,
		defaultNumResults: 10,
		numResultsShowing: 0,
		numResultsFound: 0
	}
]);

export const isDragging = writable(false);

//For course objects, always show the course number, hours, units
//Optional: exploreCourses link, carta link, WAYS, description (shows popup on hover),
//eval, % completed
export const prefs = writable({
	courseTableData: {
		'Links': true,
		'WAYS': true,
		'Percent completed & eval': true,
		'Checkboxes': false,
		'Bump button': false,
	},
	transferUnits: [
		{'name': 'Total',
		'value': 0},
		{'name': 'Math AP',
		'value': 0},
		{'name': 'Chemistry AP',
		'value': 0},
		{'name': 'Mechanics AP',
		'value': 0},
		{'name': 'E&M AP',
		'value': 0},
		{'name': 'CS AP',
		'value': 0},
		{'name': 'Language AP',
		'value': 0},
	]
});

//Set by LoadInAllDegrees
export const bachelorsDegreeChoices = writable([]);
export const mastersDegreeChoices = writable([]);

//This is refreshed only when bachelorsDegreeChoice changes
export const compiledDegree = writable({});

//These contain the uniqueID of the degree selected
export const bachelorsDegreeChoice = writable('BLANK'); //PERSISTENT
export const mastersDegreeChoice = writable('BLANK'); //PERSISTENT

//Random prefs
export const showWelcomeModalOnLoad = writable(false); //PERSISTENT
export const showWelcomeModal = writable(false);

export const panelCollapsed = writable({ //PERSISTENT
	courseData: false,
	search: false,
	ways: false,
	bsTracker: false,
	msTracker: false,
	config: false,
	summer: true,
	years: {
		'Frosh': false,
		'Sophomore': false,
		'Junior': false,
		'Senior': false,
		'Coterm': false
	},
});

//Compressed data (for db)
export const compressedTable = writable([]);