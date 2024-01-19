
import CourseRegexMatch from './CourseRegexMatch.js';
import {calculateTotalUnits, extractAndCreateCells, getTransferUnits } from '../utils/utils.js';
function BSCSSystemsLUT() {
  return {
			'Math 19': "^MATH 19$",
			'Math 20': "^MATH 20$",
			'Math 21': "^MATH 21$",
      'CS 103': "^CS 103$",
      'CS 109': "^CS 109$",
      'Math electives': "^(MATH 5[123]|MATH 10[4789]|MATH 11[03]|CS 157|CS 205L|PHIL 151|CME 10[024]|ENGR 108)$",
      'Mechanics': "^PHYSICS [246]1$",
      'E&M': "^PHYSICS ([246]3|81)$",
      'Science elective': "^(BIO (30|8[123456]|4(567)|150)|CEE (6[34]|70)|CHEM 31[ABM]|CHEM 33| CHEM 12[13]|EARTHSYS 1[01]|PHYSICS [24][123456]|PHYSICS 41E|PHYSICS [678]1L?|PHYSICS 89L|PSYCH 30)$",
      'TIS': "^(AA 252|ANTHRO 132C|CSRE 132C|ARCHLGY 151|CLASSICS 151|BIOE 131|BIOE 177|DESIGN 259|CEE 102A|CEE 145E|CEE 177[XS]|ENGR 177[AB]|CLASSICS 168|ARCHLGY 186|COMM 120W|COMM 166|CS 125|CS 152|CS 18[12]W?|CS 256|CS 278|DATASCI 154|EARTHSYS 125|ENGR 117|ENGR 145|ENGR [12]48|HUMBIO 174|MS&E 193|ME 267|POLISCI 114S|PUBPOL 134|STS 1)$",
      'CS 106B': "^CS 106B$",
      'ENGR 40M/76': "^(ENGR (40M|76))$",
      'CS 107': "^CS 107E?$",
      'CS 111': "^CS 111$",
      'CS 161': "^CS 161$",
      'A': "^CS (112|140E)$",
      'B': "^(CS 143|EE 180)$",
      'C': "^(CS (144|145|149|155|190|217|240|240LX|242|243|244|245))|(EE (271|282))$",
      'Track electives': "^(CS (241|295|340R|343D|349D|349H|448I))|(EE (108|382A|382C|384S))$",
      'General CS electives': "^(CS (108|112|123|124|131|140E|142|143|144|145|147|147L|148|149|151|154|155|157|163|166|168|173A|177|190|195|197|197C|205L|206|210A|212|217|221|223A|224N|224R|224S|224U|224V|224W|225A|227B|228|229|229M|230|231A|231N|232|233|234|235|237A|237B|238|240|240LX|242|243|244|244B|245|246|247[A-Z]*|248[A-Z]*|CS249I|250|251|252|253|254|254B|255|256|257|259Q|261|263|265|269I|269O|269Q|270|271|272|273B|273C|274|275|276|278|279|281|330|333|336|342|348[A-Z]*|351|368|398|448B)|PHIL 151|CME 138|EE (180|267|282|364A|374)|MS&E 234)$",
      'Senior Project': "^CS (191|191W|194|194H|194W|210B|294)$",
			'WIM': '^CS (181W|182W|191W|194W|210B)$'
		};
}

function BSCSSystems(allCourses, grid, list, transfer) {
  //Step 1: initialize lookup tables
  let lut = BSCSSystemsLUT();
  let math19Lut = CourseRegexMatch(allCourses, lut['Math 19']);
  let math20Lut = CourseRegexMatch(allCourses, lut['Math 20']);
  let math21Lut = CourseRegexMatch(allCourses, lut['Math 21']);
  let cs103Lut = CourseRegexMatch(allCourses, lut['CS 103']);
  let cs109Lut = CourseRegexMatch(allCourses, lut['CS 109']);
  let mathElectivesLut = CourseRegexMatch(allCourses, lut['Math electives']);
  let mechanicsLut = CourseRegexMatch(allCourses, lut['Mechanics']);
  let emLut = CourseRegexMatch(allCourses, lut['E&M']);
  let scienceElectiveLut = CourseRegexMatch(allCourses, lut['Science elective']);
  let tisLut = CourseRegexMatch(allCourses, lut['TIS']);
  let cs106bLut = CourseRegexMatch(allCourses, lut['CS 106B']);
  let engr40m76Lut = CourseRegexMatch(allCourses, lut['ENGR 40M/76']);
  let cs107Lut = CourseRegexMatch(allCourses, lut['CS 107']);
  let cs111Lut = CourseRegexMatch(allCourses, lut['CS 111']);
  let cs161Lut = CourseRegexMatch(allCourses, lut['CS 161']);
  let aLut = CourseRegexMatch(allCourses, lut['A']);
  let bLut = CourseRegexMatch(allCourses, lut['B']);
  let cLut = CourseRegexMatch(allCourses, lut['C']);
  let trackElectivesLut = CourseRegexMatch(allCourses, lut['Track electives']);
  let generalCSElectivesLut = CourseRegexMatch(allCourses, lut['General CS electives']);
  let seniorProjectLut = CourseRegexMatch(allCourses, lut['Senior Project']);
  let wimLut = CourseRegexMatch(allCourses, lut['WIM']);


  //Step 2: make a copy of the list so we can modify it
  let listCopy = JSON.parse(JSON.stringify(list));
  //Also filter out ms courses so we don't have to do it later
  listCopy = listCopy.filter((course) => {
    return !course.ms;
  });

  //Step 3: Compute the total number of units taken
  let totalUnits = calculateTotalUnits(listCopy, transfer);

  // Step 5: Compute WIM
  let wim = extractAndCreateCells(listCopy, wimLut, 1).courses[0];

  // Compute TiS
  let tis = extractAndCreateCells(listCopy, tisLut, 1).courses[0];

  // Compute math 19,20,21 series
  let mathAP = getTransferUnits(transfer, 'Math AP');
  let ret = extractAndCreateCells(listCopy, math19Lut, 1);
  let math19 = ret.courses[0];
  if (mathAP >= 6) {
    math19 = {value: 'AP'};
  }
  listCopy = ret.courseList;
  ret = extractAndCreateCells(listCopy, math20Lut, 1);
  let math20 = ret.courses[0];
  if (mathAP >= 6) {
    math20 = {value: 'AP'};
  }
  listCopy = ret.courseList;
  ret = extractAndCreateCells(listCopy, math21Lut, 1);
  let math21 = ret.courses[0];
  if (mathAP >= 10) {
    math21 = {value: 'AP'};
  }
  listCopy = ret.courseList;

  //Compute CS 103, 109
  ret = extractAndCreateCells(listCopy, cs103Lut, 1);
  let cs103 = ret.courses[0];
  listCopy = ret.courseList;
  ret = extractAndCreateCells(listCopy, cs109Lut, 1);
  let cs109 = ret.courses[0];
  listCopy = ret.courseList;

  //Compute math electives
  ret = extractAndCreateCells(listCopy, mathElectivesLut, 2);
  let mathElectives = ret.courses;
  listCopy = ret.courseList;

  //Compute mechanics, E&M, science elective
  let physicsAP = getTransferUnits(transfer, 'Physics AP');
  let mechanics;
  if (physicsAP >= 5) {
    mechanics = {value: 'AP'};
  } else {
    ret = extractAndCreateCells(listCopy, mechanicsLut, 1);
    mechanics = ret.courses[0];
    listCopy = ret.courseList;
  }

  let em;
  if (physicsAP >= 10) {
    em = {value: 'AP'};
  } else {
    ret = extractAndCreateCells(listCopy, emLut, 1);
    em = ret.courses[0];
    listCopy = ret.courseList;
  }

  let scienceElective;
  let chemistryAP = getTransferUnits(transfer, 'Chemistry AP');
  if (chemistryAP >= 5) {
    scienceElective = {value: 'AP'};
  } else {
    ret = extractAndCreateCells(listCopy, scienceElectiveLut, 1);
    scienceElective = ret.courses[0];
    listCopy = ret.courseList;
  }

  //Compute CS 106B, ENGR 40M/76
  ret = extractAndCreateCells(listCopy, cs106bLut, 1);
  let cs106b = ret.courses[0];
  listCopy = ret.courseList;
  ret = extractAndCreateCells(listCopy, engr40m76Lut, 1);
  let engr40m76 = ret.courses[0];
  listCopy = ret.courseList;

  //Compute CS 107, 111, 161
  ret = extractAndCreateCells(listCopy, cs107Lut, 1);
  let cs107 = ret.courses[0];
  listCopy = ret.courseList;
  ret = extractAndCreateCells(listCopy, cs111Lut, 1);
  let cs111 = ret.courses[0];
  listCopy = ret.courseList;
  ret = extractAndCreateCells(listCopy, cs161Lut, 1);
  let cs161 = ret.courses[0];
  listCopy = ret.courseList;

  //Compute A
  ret = extractAndCreateCells(listCopy, aLut, 1);
  let aCourse = ret.courses[0];
  listCopy = ret.courseList;

  //Compute B
  ret = extractAndCreateCells(listCopy, bLut, 1);
  let bCourse = ret.courses[0];
  listCopy = ret.courseList;

  //Compute C
  let cLuts = bLut.concat([cLut]);
  let c = [];
  cLuts.forEach((lut) => {
    if (c.length < 2) {
      ret = extractAndCreateCells(listCopy, lut, 1);
      if (ret.wasFound) {
        c.push(ret.courses[0]);
        listCopy = ret.courseList;
      }
    }
  });
  while (c.length < 2) {
    c.push({value: 'ㅤ'});
  }

  //Compute electives - add 4
  let trackElectivesLuts = cLuts.concat([trackElectivesLut, generalCSElectivesLut]);
  let trackElectives = [];
  trackElectivesLuts.forEach((lut) => {
    if (trackElectives.length < 4) {
      ret = extractAndCreateCells(listCopy, lut, 4-trackElectives.length);
      for (let i = 0; i < ret.numFound; i++) {
        trackElectives.push(ret.courses[i]);
      }
      listCopy = ret.courseList;
    }
  });
  while (trackElectives.length < 4) {
    trackElectives.push({value: 'ㅤ'});
  }

  let seniorProject = extractAndCreateCells(listCopy, seniorProjectLut, 1).courses[0];


  return {
    rows: [
      {
        cells: [
          {
            value: 'B.S. in Computer Science (Systems Track)',
            isTitle: true,
            noBorder: true
          }
        ]
      },
      {
        cells: [
          { value: 'Total Units', noBorder: true },
          { value: totalUnits + '/180', progress: totalUnits/180 , weight: 3}
        ]
      },
      {
        cells: [
          { value: 'Calculus', noBorder: true },
          math19,
          math20,
          math21,
        ]
      },
      {
        cells: [
          { value: '103 & 109', noBorder: true },
          cs103,
          cs109,
          { value: 'ㅤ', noBorder: true },
        ]
      },
      {
        cells: [
          { value: 'Math elective', noBorder: true},
          mathElectives[0],
          mathElectives[1],
          { value: 'ㅤ', noBorder: true },
        ]
      },
      {
        cells: [
          { value: 'Physics', noBorder: true },
          mechanics,
          em,
          { value: 'ㅤ', noBorder: true },
        ]
      },
      {
        cells: [
          {value: 'Science elective', noBorder: true},
          scienceElective,
          {value: 'WIM', noBorder: true},
          wim,
        ]
      },
      {
        cells: [
          { value: '106B & ENGR 40M/76', noBorder: true },
          cs106b,
          engr40m76,
          { value: 'ㅤ', noBorder: true },
        ]
      },
      {
        cells: [
          { value: '107, 111, 161', noBorder: true },
          cs107,
          cs111,
          cs161,
        ]
      },
      {
        cells: [
          {value: 'A (112/140E)', noBorder: true},
          aCourse,
          {value: 'B (143/EE180)', noBorder: true},
          bCourse
        ]
      },
      {
        cells: [
          {value: 'C', noBorder: true},
          c[0],
          c[1],
          { value: 'ㅤ', noBorder: true },
        ]
      },
      {
        cells: [
          { value: 'Track electives', noBorder: true },
          trackElectives[0],
          trackElectives[1],
          trackElectives[2],
        ]
      },
      {
        cells: [
          { value: 'TIS', noBorder: true },
          tis,
          {value: 'Senior Project', noBorder: true},
          seniorProject,
        ]
      }
      
    ]
  };
}

export { BSCSSystemsLUT, BSCSSystems}