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

function checkIfListOfCoursesIncludesCourseByCode(list, course) {
  if (list.map((c) => c.Class).includes(course.code)) {
    return true;
  }
  return false;
}



export { courseColor, checkIfListOfCoursesIncludesCourseByCode }