//Take a raw degree and a list of all the courses that exist. Convert all the lookuptables to lists of actual courses
//Return the compiled degree
import CourseRegexMatch from './CourseRegexMatch.js';

function compileDegree(degree, allCourses) {
  let compiledDegree = JSON.parse(JSON.stringify(degree)); //Deep copy

  Object.keys(degree.lookuptables).forEach((key) => {
    compiledDegree.lookuptables[key] = extendLutToCrosslisted(allCourses, CourseRegexMatch(allCourses, degree.lookuptables[key]));
  });
  
  return compiledDegree;
}

function extendLutToCrosslisted(allCourses, lut) {
  let newLut = [];
  lut.forEach((course) => {
    //Find course in allCourses
    let foundCourse = allCourses.filter((c) => {
      return c.code === course;
    })[0];

    //Extend newLut by foundLut.codes
    newLut = newLut.concat(foundCourse.codes);
  });
  //Remove duplicates
  newLut = [...new Set(newLut)];
  return newLut;
}

export default compileDegree;