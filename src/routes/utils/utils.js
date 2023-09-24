function mulberry32(a) {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function courseColor(course) {
  if (!course) return;
  if (!course.code) return;
  let dept = course.dept;
  let deptInt = 0;
  for (let i = 0; i < dept.length; i++) {
    deptInt += dept.charCodeAt(i) * Math.pow(10, i);
  }
  deptInt += 10;
  let rand = mulberry32(deptInt) * 360;
  if (!course?.ms) {
    return (
      'background: linear-gradient(to right, hsl(' + rand + ', 100%, 35%), hsla(' + rand + ', 100%, 35%, .5))'
      //'background: hsl(' + rand + ', 50%, 35%)'
    );
  }
  return (
    'background: repeating-linear-gradient(45deg, hsl(' +
    rand +
    ', 50%, 35%), hsl(' +
    rand +
    ', 50%, 35%) 1em, hsl(' +
    rand +
    ', 50%, 30%) 1em, hsl(' +
    rand +
    ', 50%, 30%) 2em)'
  );
}

function listOfCourseObjsIncludesCode(list, course) {
  if (list.map((c) => c.code).includes(course.code)) {
    return true;
  }
  return false;
}

function listOfCourseCodesIncludesCode(list, course) {
  if (list.includes(course.code)) {
    return true;
  }
  return false;
}

function filterCourseObjsByLut(list, lut) {
  return list.filter((course) => {
    return lut.includes(course.code);
  });
}

function getTransferUnits(transfer, key) {
  return transfer.filter((obj) => {
    return obj.name === key;
  })[0]?.value;
}

function calculateTotalUnits(courses, transfer) {
  let totalUnits = 0;
  courses.forEach((course) => {
    totalUnits += course.units_taking;
  });
  totalUnits+=getTransferUnits(transfer, 'Total');
  return totalUnits;
}

function extractAndCreateCells(courseList, lut, numExtract) {
  //Find all courses in courseList which are in lut
  let courses = courseList.filter((course) => {
    return lut.includes(course.code);
  });
  //Check if anything was found
  let wasFound = courses.length > 0;
  let numFound = courses.length;
  //Shorten it to be at most numExtract
  courses = courses.slice(0, numExtract);
  //Remove these courses from the list
  courseList = courseList.filter((course) => {
    return !courses.includes(course);
  });
  //Convert to cells
  courses = courses.map((course) => {
    return { value: course.code };
  });
  //Extend to be numExtract long
  while (courses.length < numExtract) {
    courses.push({ value: 'ㅤ' });
  }
  return { courseList, courses, wasFound, numFound };
}

export { courseColor, listOfCourseObjsIncludesCode, listOfCourseCodesIncludesCode, filterCourseObjsByLut, getTransferUnits, calculateTotalUnits, extractAndCreateCells}