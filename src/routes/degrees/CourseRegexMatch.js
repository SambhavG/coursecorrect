function CourseRegexMatch(allCourses, regex) {

  //If regex is a string, just do a regex match
  if (typeof regex === 'string') {
    return allCourses.filter((course) => {
      return course.Class.match(regex);
    }).map((course) => {
      return course.Class;
    });
  }

  //Otherwise it's an array of objects
  let allMatchingCourses = [];
  for (let i = 0; i < regex.length; i++) {
    let thisRegexObject = regex[i];
    let thisMatchingCourses = [];
    if (thisRegexObject.method == 'regex') {
      //Get all the courses that match this regex
      thisMatchingCourses = allCourses.filter((course) => {
        return course.Class.match(thisRegexObject.string);
      });
    } else if (thisRegexObject.method == 'number') {
      let number = thisRegexObject.number;
      let comparator = thisRegexObject.comparator;
      //Get all the courses which are greater than or less than this number based on the comparator
      thisMatchingCourses = allCourses.filter((course) => {
        if (comparator == '>=') {
          return course.number >= number;
        } else if (comparator == '<=') {
          return course.number <= number;
        } else if (comparator == '>') {
          return course.number > number;
        } else if (comparator == '<') {
          return course.number < number;
        }
      });
    }

    //If type is add, do a union
    if (thisRegexObject.type == 'add') {
      allMatchingCourses = [...allMatchingCourses, ...thisMatchingCourses];
    }
    //If type is remove, do a difference
    else if (thisRegexObject.type == 'remove') {
      allMatchingCourses = allMatchingCourses.filter((course) => {
        return !thisMatchingCourses.includes(course);
      });
    }
  }

  return allMatchingCourses.map((course) => {
    return course.Class;
  });
}

export default CourseRegexMatch;