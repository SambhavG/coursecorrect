//Two functions 
//The first just returns a lookup table, which will be set on load of the page
import CourseRegexMatch from './CourseRegexMatch.js';
import { filterCourseObjsByLut, calculateTotalUnits, extractAndCreateCells, getTransferUnits } from '../utils/utils.js';
function BSMathLUT() {
  return {
			'Core above 63, satisfies 57 and 8': [
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
      'All Math, satisfies 57': [
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
          string: '^MATH 19[38]$'
        },
        {
          type: 'add',
          method: 'regex',
          string: '^(AA 100|AA 218|BIO 141|BIOE 101|CHEM 15[13]|CHEM 17[135]|CLASSICS 136|CS 10[39]|CS 121|CS 148|CS 154|CS 154N|CS 157|CS 16[1678]|CS 205L|CS 22[189]|CS 229A|CS 229T|CS 229M|CS 23[0345]|CS 25[01456]]|CS 259Q|CS 26[1578]|CS 269Q|CS 35[45]|CME 108|ECON 50|ECON 51|ECON 52|ECON 102A|ECON 102B|ECON 102C|ECON 103|ECON 111|ECON 136|ECON 137|ECON 140|ECON 160|ECCON 162|ECON 18[012]|ECON 20[234]|ECON 284|EE 1[45]|EE 30|EE 6[02]|EE 263|EE 274|EE 276A|EE 364[AB]|EE 376A|EE 387|ENGR 1[45]|ENGR 30|ENGR 6[02]|ESS 246A|MS&E 11[12]|MS&E 121|MS&E 211|MS&E 220|MS&E 232H|MS&E 245A|MS&E 245B|MS&E 310|MUSIC 320|MUSIC 423|MUSIC 424|PHIL 15[01249]|PHIL 162|PHIL 25[04]|PHYSICS 14N|PHYSICS 45|PHYSICS 6[35]|PHYSICS 70|PHYSICS 10[0478]|PHYSICS 11[023]|PHYSICS 12[01]|PHYSICS 13[014]|PHYSICS 16[01]|PHYSICS 17[012]|PHYSICS 21[026]|PHYSICS 22[03]|PHYSICS 23[014]|PHYSICS 24[01]|PHYSICS 252|PHYSICS 26[01269]|STATS 110|STATS 116|STATS 141|STATS 160|STATS 191|STATS 20[03567]|STATS 21[378]|STATS 229|STATS 231|STATS 240|STATS 27[01]|STATS 305A|STATS 315B|STATS 318|STATS 376A)$'
        }
      ],
			'WIM': '^MATH (101|109|110|120|171)$'
		};
}

function BSMath(allCourses, grid, list, transfer) {
  //Step 1: initialize lookup tables
  let lut = BSMathLUT();
  let mathCoursesLut = CourseRegexMatch(allCourses, lut['All Math, counts towards 57 req']);
  let coreCoursesLut = CourseRegexMatch(allCourses, lut['Core above 63, counts towards 57 req']);
  let electiveCoursesLut = CourseRegexMatch(allCourses, lut['Electives']);
  let wimCoursesLut = CourseRegexMatch(allCourses, lut['WIM']);
  let graduateCoursesLut = CourseRegexMatch(allCourses, lut['Graduate Math']);

  //Step 2: make a copy of the list so we can modify it
  let listCopy = JSON.parse(JSON.stringify(list));
  //Also filter out ms courses so we don't have to do it later
  listCopy = listCopy.filter((course) => {
    return !course.ms;
  });

  //Step 3: Compute the total number of units taken
 let totalUnits = calculateTotalUnits(listCopy, transfer);

  //Step 4: Compute total math units
  //Any graduate course decreases the totalOutOf by 1
  let totalMathUnits = 0;
  let totalOutOf = 57;
  let allMathCoursesTaken = filterCourseObjsByLut(listCopy, mathCoursesLut);
  allMathCoursesTaken.forEach((course) => {
    totalMathUnits += course.units_taking;
    if (graduateCoursesLut.includes(course.code)) {
      totalOutOf--;
    }
  });
  //Add transfer units
  totalMathUnits += getTransferUnits(transfer, 'Math AP');
  totalMathUnits += getTransferUnits(transfer, 'Other math');

  // Step 5: Compute WIM without removing courses
  let ret = extractAndCreateCells(listCopy, wimCoursesLut, 1);
  let wim = ret.courses[0];

  // Step 6: Compute the 8 core courses requirement.
  ret = extractAndCreateCells(listCopy, coreCoursesLut, 8);
  listCopy = ret.courseList;
  let coreCourses = ret.courses;

  //Step 7: Compute the 4 math elective requirement
  ret = extractAndCreateCells(listCopy, electiveCoursesLut, 4);
  let mathElectives = ret.courses;

  return {
    rows: [
      {
        cells: [
          {
            value: 'B.S. in Mathematics',
            isTitle: true,
            noBorder: true
          }
        ]
      },
      {
        cells: [
          { value: 'ㅤ', noBorder: true, weight: 2 },
          { value: 'Total Units', noBorder: true, weight: 1 },
          { value: totalUnits + '/180', progress: totalUnits/180, weight: 2 },
          
        ]
      },
      {
        cells: [
          { value: 'WIM', noBorder: true }, 
          wim,
          { value: 'Math Units', noBorder: true },
          { value: totalMathUnits + '/' + totalOutOf, progress: totalMathUnits/totalOutOf, weight: 2 },
        ]
      },
      {
        cells: [
          {
            value: 'Core 8',
            noBorder: true,
          },
          coreCourses[0],
          coreCourses[1],
          coreCourses[2],
          coreCourses[3],
        ]
      },
      {
        cells: [
          {
            value: '',
            noBorder: true,
          },
          coreCourses[4],
          coreCourses[5],
          coreCourses[6],
          coreCourses[7],
        ]
      },
      { cells: [{ value: 'Electives', noBorder: true },
          mathElectives[0],
          mathElectives[1],
          mathElectives[2],
          mathElectives[3],
        ]
      },
    ]
  };
}

export { BSMathLUT, BSMath}