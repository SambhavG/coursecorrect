//This function takes the entire course list and filters it via regex
//regex is either a list of strings, or a list of fancy objects for advanced filtering
function courseRegexMatch(allCourses, regex) {
  //If regex is an array, check if it is an array of strings
  if (Array.isArray(regex) && typeof regex[0] === 'string') {
    //Normalize the regex strings
    regex = regex.map((str) => {
      //If they're already regexes, just return them
      if (str[0] === '^' || str[str.length-1] === '$') {
        return str;
      }
      return '^' + str + '$';
    });

    //Make a list of every course which matches any of the regexes
    let coursesMatchingARegex = [];
    regex.forEach((str) => {
      coursesMatchingARegex = [...coursesMatchingARegex, ...allCourses.filter((course) => {
        return course.code.match(str);
      })];
    });

    //Convert to just codes
    coursesMatchingARegex = coursesMatchingARegex.map((course) => {
      return course.code;
    });

    //Remove duplicates
    return [...new Set(coursesMatchingARegex)];
  }

  //Otherwise it's an array of objects
  let allMatchingCourses = [];
  for (let i = 0; i < regex.length; i++) {
    let thisRegexObject = regex[i];
    let thisMatchingCourses = [];
    if (thisRegexObject.method == 'regex') {
      //Get all the courses that match this regex
      thisMatchingCourses = allCourses.filter((course) => {
        return course.code.match(thisRegexObject.string);
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
    return course.code;
  });
}

export default courseRegexMatch;

// function CourseRegexMatch(allCourses, regex) {

//   //If regex is a string, just do a regex match
//   if (typeof regex === 'string') {
//     return allCourses.filter((course) => {
//       return course.code.match(regex);
//     }).map((course) => {
//       return course.code;
//     });
//   }

//   //Otherwise it's an array of objects
//   let allMatchingCourses = [];
//   for (let i = 0; i < regex.length; i++) {
//     let thisRegexObject = regex[i];
//     let thisMatchingCourses = [];
//     if (thisRegexObject.method == 'regex') {
//       //Get all the courses that match this regex
//       thisMatchingCourses = allCourses.filter((course) => {
//         return course.code.match(thisRegexObject.string);
//       });
//     } else if (thisRegexObject.method == 'number') {
//       let number = thisRegexObject.number;
//       let comparator = thisRegexObject.comparator;
//       //Get all the courses which are greater than or less than this number based on the comparator
//       thisMatchingCourses = allCourses.filter((course) => {
//         if (comparator == '>=') {
//           return course.number >= number;
//         } else if (comparator == '<=') {
//           return course.number <= number;
//         } else if (comparator == '>') {
//           return course.number > number;
//         } else if (comparator == '<') {
//           return course.number < number;
//         }
//       });
//     }

//     //If type is add, do a union
//     if (thisRegexObject.type == 'add') {
//       allMatchingCourses = [...allMatchingCourses, ...thisMatchingCourses];
//     }
//     //If type is remove, do a difference
//     else if (thisRegexObject.type == 'remove') {
//       allMatchingCourses = allMatchingCourses.filter((course) => {
//         return !thisMatchingCourses.includes(course);
//       });
//     }
//   }

//   return allMatchingCourses.map((course) => {
//     return course.code;
//   });
// }

// export default CourseRegexMatch;