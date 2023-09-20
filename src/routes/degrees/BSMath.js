//Two functions 
//The first just returns a lookup table, which will be set on load of the page
import CourseRegexMatch from './CourseRegexMatch.js';

function BSMathLUT() {


  //The lookup table is as follows:
  //If it's just a string, then it's a plain course or regex match
  //If it's an object, then it's of the following form:


  //Process for core:
  //Match all math.
  //Remove math above 63CM/DM
  //Remove 193, 198
  //Add math 51M, stats 116, phil 151, phil 152

  //Object looks like this:
  /*
  {
    'matchArray': [
      {
        type: 'add',
        method: 'regex',
        string: 'MATH*'
      },
      {
        type: 'remove',
        method: 'number',
        string: '<=63'
      },
      {
        type: 'remove',
        method: 'regex',
        string: '19[38]*'
      },
      {
        type: 'add',
        method: 'regex',
        string: 'MATH 51M|STATS 116|PHIL 15[12]'
      }
    ]
  }
  */

  return {
			'Core above 63, counts towards 57 req': [
        {
          type: 'add',
          method: 'regex',
          string: '^MATH'
        },
        {
          type: 'remove',
          method: 'number',
          comparator: '<=',
          number: 63
        },
        {
          type: 'remove',
          method: 'regex',
          string: '^MATH (19[389]|193X)$'
        },
        {
          type: 'add',
          method: 'regex',
          string: '^(MATH 56|STATS 116|PHIL 15[12])$'
        }
      ],
      'All Math, counts towards 57 req': [
        {
          type: 'add',
          method: 'regex',
          string: '^MATH'
        },
        {
          type: 'remove',
          method: 'regex',
          string: '^MATH (19[389]|193X|51M)$'
        },
        {
          type: 'add',
          method: 'regex',
          string: '^(STATS 116|PHIL 15[12])$'
        }
      ],
      'Graduate Math': [
        {
          type: 'add',
          method: 'regex',
          string: '^MATH'
        },
        {
          type: 'remove',
          method: 'number',
          comparator: '<',
          number: 200
        },
      ],
      'Electives': [
        {
          type: 'add',
          method: 'regex',
          string: '^MATH'
        },
        {
          type: 'remove',
          method: 'number',
          comparator: '<',
          number: 101
        },
        {
          type: 'remove',
          method: 'regex',
          string: '^MATH (51M|19[38])$'
        },
        {
          type: 'add',
          method: 'regex',
          string: '^(AA 100|AA 218|BIO 141|BIOE 101|CHEM 15[13]|CHEM 17[135]|CLASSICS 136|CS 10[39]|CS 121|CS 148|CS 154|CS 154N|CS 157|CS 16[1678]|CS 205L|CS 22[189]|CS 229A|CS 229T|CS 229M|CS 23[0345]|CS 25[01456]]|CS 259Q|CS 26[1578]|CS 269Q|CS 35[45]|CME 108|ECON 50|ECON 51|ECON 52|ECON 102A|ECON 102B|ECON 102C|ECON 103|ECON 111|ECON 136|ECON 137|ECON 140|ECON 160|ECCON 162|ECON 18[012]|ECON 20[234]|ECON 284|EE 1[45]|EE 30|EE 6[02]|EE 263|EE 274|EE 276A|EE 364[AB]|EE 376A|EE 387|ENGR 1[45]|ENGR 30|ENGR 6[02]|ESS 246A|MS&E 11[12]|MS&E 121|MS&E 211|MS&E 220|MS&E 232H|MS&E 245A|MS&E 245B|MS&E 310|MUSIC 320|MUSIC 423|MUSIC 424|PHIL 15[01249]|PHIL 162|PHIL 25[04]|PHYSICS 14N|PHYSICS 45|PHYSICS 6[35]|PHYSICS 70|PHYSICS 10[0478]|PHYSICS 11[023]|PHYSICS 12[01]|PHYSICS 13[014]|PHYSICS 16[01]|PHYSICS 17[012]|PHYSICS 21[026]|PHYSICS 22[03]|PHYSICS 23[014]|PHYSICS 24[01]|PHYSICS 252|PHYSICS 26[01269]|STATS 110|STATS 116|STATS 141|STATS 160|STATS 191|STATS 20[03567]|STATS 21[378]|STATS 229|STATS 231|STATS 240|STATS 27[01]|STATS 305A|STATS 315B|STATS 318|STATS 376A)$'
        }
      ],
      'Core above 63, counts towards 57 req but not elective': [
        {
          type: 'add',
          method: 'regex',
          string: '^MATH'
        },
        {
          type: 'remove',
          method: 'number',
          comparator: '<=',
          number: 63
        },
        {
          type: 'remove',
          method: 'number',
          comparator: '>=',
          number: 101
        },
        {
          type: 'add',
          method: 'regex',
          string: '^MATH 56$'
        }
      ],
			'WIM': '^MATH (101|109|110|120|171)$'
		};
}


//The second takes the following arguments:
//A grid of courses
//A list of courses (same data as the grid)
//Transfer course data in some form

function BSMath(allCourses, grid, list, transfer) {
  //Step 1: initialize lookup tables
  let lut = BSMathLUT();
  let mathCoursesLut = CourseRegexMatch(allCourses, lut['All Math, counts towards 57 req']);
  let coreCoursesLut = CourseRegexMatch(allCourses, lut['Core above 63, counts towards 57 req']);
  let electiveCoursesLut = CourseRegexMatch(allCourses, lut['Electives']);
  let coreButNotElectiveCoursesLut = CourseRegexMatch(allCourses, lut['Core above 63, counts towards 57 req but not elective']);
  let wimCoursesLut = CourseRegexMatch(allCourses, lut['WIM']);
  let graduateCoursesLut = CourseRegexMatch(allCourses, lut['Graduate Math']);

  //Step 2: make a copy of the list so we can modify it
  let listCopy = JSON.parse(JSON.stringify(list));
  //Also filter out ms courses so we don't have to do it later
  listCopy = listCopy.filter((course) => {
    return !course.ms;
  });


  //Step 3: Compute the total number of units taken
  let totalUnits = 0;
  listCopy.forEach((course) => {
    totalUnits += parseInt(course.unitsTaking);
  });
  totalUnits+=transfer.totalUnits;

  //Step 4: Compute total math units
  //Any graduate course decreases the totalOutOf by 1
  let totalMathUnits = 0;
  let totalOutOf = 57;
  let allMathCoursesTaken = listCopy.filter((course) => {
    return mathCoursesLut.includes(course.Class);
  });
  allMathCoursesTaken.forEach((course) => {
    totalMathUnits += parseInt(course.unitsTaking);
    if (graduateCoursesLut.includes(course.Class)) {
      totalOutOf--;
    }
  });
  //Add transfer units
  totalMathUnits += transfer?.APCalc ? transfer.APCalc : 0;
  totalMathUnits += transfer?.additionalMath ? transfer.additionalMath : 0;

  //Step 5: Compute WIM
  let wim = listCopy.filter((course) => {
    return wimCoursesLut.includes(course.Class);
  });
  if (wim.length > 0) {
    wim = { value: wim[0].Class };
  } else {
    wim = { value: 'ㅤ' };
  }

  //Step 6: Compute the 8 core courses requirement.
  //6.1: Find all core and non-elective courses - we apply these first to the 8 course requirement
  let eightCoreCourses = [];
  //Compare only by course number
  let coreNonElectiveCourses = listCopy.filter((course) => {
    return coreButNotElectiveCoursesLut.includes(course.Class);
  });
  //Shorten it to be at most 8 long
  coreNonElectiveCourses = coreNonElectiveCourses.slice(0, 8);
  //Remove these courses from the list
  listCopy = listCopy.filter((course) => {
    return !coreNonElectiveCourses.includes(course);
  });
  //Apply them to the 8 course requirement
  eightCoreCourses = eightCoreCourses.concat(coreNonElectiveCourses);
  //6.2: Apply the rest of the core courses
  let coreCoursesLeft = 8 - eightCoreCourses.length;
  let coreCourses = listCopy.filter((course) => {
    return coreCoursesLut.includes(course.Class);
  });
  //Shorten it to be at most remaining length long
  coreCourses = coreCourses.slice(0, coreCoursesLeft);
  //Remove these courses from the list
  listCopy = listCopy.filter((course) => {
    return !coreCourses.includes(course);
  });
  //Apply them to the 8 course requirement
  eightCoreCourses = eightCoreCourses.concat(coreCourses);
  //6.3: Convert to a format for the table
  eightCoreCourses = eightCoreCourses.map((course) => {
    return { value: course.Class };
  });
  //Extend to be 8 long
  while (eightCoreCourses.length < 8) {
    eightCoreCourses.push({ value: 'ㅤ' });
  }

  //Step 7: Compute the 4 math elective requirement
  //7.1: Find all math elective courses which haven't been used for the core
  let mathElectives = listCopy.filter((course) => {
    return electiveCoursesLut.includes(course.Class);
  });
  //Shorten it to be at most 4 long
  mathElectives = mathElectives.slice(0, 4);
  //Remove these courses from the list
  listCopy = listCopy.filter((course) => {
    return !mathElectives.includes(course);
  });
  //7.2: Convert to a format for the table
  mathElectives = mathElectives.map((course) => {
    return { value: course.Class };
  });
  //Extend to be 4 long
  while (mathElectives.length < 4) {
    mathElectives.push({ value: 'ㅤ' });
  }

  return {
    rows: [
      {
        cells: [
          {
            value: 'B.S. in Mathematics',
            isTitle: true,
            noBorder: true,
            info: 'At most one Physics S/NC course can be counted as an elective.'
          }
        ]
      },
      {
        cells: [
          { value: 'Total Units', noBorder: true },
          { value: totalUnits + '/180', progress: totalUnits/180 }
        ]
      },
      {
        cells: [
          { value: 'Math Units', noBorder: true },
          { value: totalMathUnits + '/' + totalOutOf, progress: totalMathUnits/totalOutOf }
        ]
      },
      { cells: [{ value: 'WIM', noBorder: true }, wim] },
      {
        cells: [
          {
            value: '8 Math Courses Above MATH 63CM/DM',
            noBorder: true,
            info: 'Math 56 counts'
          }
        ]
      },
      {
        cells: [
          eightCoreCourses[0],
          eightCoreCourses[1],
          eightCoreCourses[2],
          eightCoreCourses[3],
        ]
      },
      {
        cells: [
          eightCoreCourses[4],
          eightCoreCourses[5],
          eightCoreCourses[6],
          eightCoreCourses[7],
        ]
      },
      { cells: [{ value: '4 Math Electives', noBorder: true, info: 'Only 1 may be non-letter grade, so only one mandatory S/NC class like PHYSICS 41,43,61 may be counted. May be additional exceptions for particular pairs of courses.' }] },
      {
        cells: [
          mathElectives[0],
          mathElectives[1],
          mathElectives[2],
          mathElectives[3],
        ]
      }
    ]
  };
}

export { BSMathLUT, BSMath}