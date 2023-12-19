//Take a raw degree and a list of all the courses that exist. Convert all the lookuptables to lists of actual courses
//Return the compiled degree
import CourseRegexMatch from './CourseRegexMatch.js';

function compileDegree(degree, allCourses) {
  let compiledDegree = JSON.parse(JSON.stringify(degree)); //Deep copy

  Object.keys(degree.lookuptables).forEach((key) => {
    compiledDegree.lookuptables[key] = CourseRegexMatch(allCourses, degree.lookuptables[key]);
  });
  
  return compiledDegree;
}

export default compileDegree;