// import { writable } from 'svelte/store';
// import data from './data/courseDataFile.csv';

// const years = writable(['Frosh', 'Sophomore', 'Junior', 'Senior']);
// const quarters = writable(['Fall', 'Winter', 'Spring']);

// function addCourse(year, quarter, course) {
// 	_courses.update((coursesObj) => {
// 		// Find the correct course to update and push the new course
// 		const updatedCoursesObj = coursesObj.map((yearObj) => {
// 			if (yearObj.id === year) {
// 				const updatedQuarters = yearObj.quarters.map((quarterObj) => {
// 					if (quarterObj.id === year + ' ' + quarter) {
// 						return {
// 							...quarterObj,
// 							courses: [...quarterObj.courses, course]
// 						};
// 					}
// 					return quarterObj;
// 				});
// 				return { ...yearObj, quarters: updatedQuarters };
// 			}
// 			return yearObj;
// 		});
// 		return updatedCoursesObj;
// 	});
// }

// function createCourses() {
// 	let coursesObj = [];

// 	for (let i = 0; i < years.length; i++) {
// 		coursesObj.push({ id: years[i], quarters: [] });
// 		for (let j = 0; j < quarters.length; j++) {
// 			coursesObj[i].quarters.push({ id: years[i] + ' ' + quarters[j], courses: [] });
// 			for (let k = 0; k < 3; k++) {
// 				// let randomCourse = data[Math.floor(Math.random() * data.length)];
// 				// coursesObj[i].quarters[j].courses.push({
// 				// 	id: years[i] + ' ' + quarters[j] + ' ' + k,
// 				// 	courseData: randomCourse
// 				// });
// 				coursesObj[i].quarters[j].courses.push({
// 					id: years[i] + ' ' + quarters[j] + ' ' + k,
// 					courseData: {
// 						'Course Name': 'Course ' + k,
// 						'Course Number': 'CSE ' + k
// 					}
// 				});
// 			}
// 		}
// 	}
// 	console.log(coursesObj);

// 	const { subscribe, set, update } = writable(coursesObj);

// 	return {
// 		subscribe,
// 		addCourse,
// 		update,
// 		reset: () => set([])
// 	};
// }

// export { years, quarters };
// export const _courses = createCourses();

import { writable } from 'svelte/store';

export const years = writable(['Frosh', 'Sophomore', 'Junior', 'Senior']);
export const quarters = writable(['Fall', 'Winter', 'Spring']);
export const allCourses = writable([]);
export const courseTable = writable([]);
export const searchResults = writable([]);

//For course objects, always show the course number, hours, units
//Optional: exploreCourses link, carta link, WAYS, description (shows popup on hover),
//eval, % completed
export const prefs = writable({
	courseTableData: {
		showCartaLink: true,
		showExploreCoursesLink: true,
		showWAYS: true,
		showDescription: true,
		showAverageEval: true,
		showPercentCompleted: true
	}
});
