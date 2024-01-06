function checkRequirement(compiledDegree, allCourses, grid, originalList, list, transfer, requirement) {
  // console.log("Checking requirement")
  // console.log(requirement)

  //requirement has the following information
  //type: consume (default), observe, transfer, and, or
    //warning: AND/OR subrequirements can not have a progress bar
    //Assume OR requirements don't have nested AND requirements
  //name: name of the requirement; use lut if not provided
  //lut: a thing to convert to a list of course codes via courseRegexMatch
  //lutList: a list of luts to convert to a list of course codes via courseRegexMatch
  //amount: the amount of courses to consume or observe
  //minUnits: the number of units needed to fulfill
  //csnc: number of c/nc or s/nc courses allowed to be used
  //bundle: only for "and" requirements; bundle courses together in final display into one line

  //If type is and or or:
    //content: all requirements to fulfill, each must be fulfilled if "and", at least one must be fulfilled if "or"
      //Note: we can have a lutList instead of content. Can use at most 1 course from each lut
    //Note: "amount" and "minUnits" still work. The minUnits remaining is applied to the last requirement if "and"
    
  //If type is tranfer:
    //id: the id of the transfer requirement
    //cutoff: the number of units needed to fulfill

  //Here's what this function returns:
  //An object with the following properties:
    //fulfilled: true/false
    //numericFulfilled: if this is a numeric requirement, {name: s, numNeeded: x, numHas: y}
    //cellValues: the strings to go in each cell
    //cellValuesArray: an array of cellValues (for and requirements)
    //coursesExtracted: the courses extracted from the list in full object form
    //numUnits: the number of units taken within these courses
    //list: the new list of courses after fulfilling this requirement

  //Deep copy requirement
  requirement = JSON.parse(JSON.stringify(requirement));
  //If type is nothing, this is a "consume" requirement
  let type = requirement?.type || 'consume';
  let name = requirement?.name || requirement?.lut || requirement?.id || "unnamed requirement";
  let lut = requirement?.lut;
  let lutList = requirement?.lutList;
  let amount = requirement?.amount ?? 1;
  let minUnits = requirement?.minUnits || 0;
  let csnc = requirement?.csnc || 0;
  //and/or req vars
  let content = requirement?.content;
  let bundle = requirement?.bundle || false;
  let bundleName = requirement?.bundleName ?? name;
  //transfer req vars
  let id = requirement?.id;
  let cutoff = requirement?.cutoff || 0;
  //Modifiers, like countGradAsFour
  let modifiers = requirement?.modifiers || [];

  //Check if there are any unrecognized keys in requirement
  let validKeys = ['type', 'name', 'lut', 'lutList', 'amount', 'minUnits', 'csnc', 'content', 'bundle', 'bundleName', 'id', 'cutoff', 'modifiers'];
  Object.keys(requirement).forEach((key) => {
    if (!validKeys.includes(key)) {
      console.log("Unrecognized key in requirement: " + key);
    }
  });

  //Make list a deep copy
  list = JSON.parse(JSON.stringify(list));

  if (type === 'consume' || type === 'observe') {
    //Get all the courses we're allowed to take
    let coursesAllowed = [];
    if (lut) {
      coursesAllowed = compiledDegree.lookuptables[lut];
    } else if (lutList) {
      lutList.forEach((lut) => {
        coursesAllowed = [...coursesAllowed, ...compiledDegree.lookuptables[lut]];
      });
    }
    //Extend lut to include crosslisted courses
    //coursesAllowed = extendLutToCrosslisted(allCourses, coursesAllowed);

    //Find all valid courses
    let coursesMatching = filterCourseObjsByLut(list, coursesAllowed);
    if (type === 'observe') {
      coursesMatching = filterCourseObjsByLut(originalList, coursesAllowed);
    }
    let coursesExtracted = [];
    let amountStillNeeded = amount;
    
    //Filter out courses that are c/nc or s/nc past the limit
    coursesMatching = coursesMatching.filter((course) => {
      if (course.csnc && csnc > 0) {
        csnc--;
        return true;
      }
      return !course.csnc;
    });

    //Filter any courses that have a nonzero "bump"
    let coursesToDeBump = [];
    coursesMatching = coursesMatching.filter((course) => {
      if (course.bump > 0) {
        coursesToDeBump.push(course);
        return false || type === 'observe'; //Don't do any bump filtering if we're observing
      }
      return true;
    });
    //Debump the courses
    coursesToDeBump.forEach((course) => {
      list.map((course2) => {
        if (course2.id === course.id) {
          course2.bump--;
        }
      });
    });

    //Extract courses until we have enough
    let numUnits = 0;
    while ((amountStillNeeded > 0 || numUnits < minUnits) && coursesMatching.length > 0) {
      //Extract first course and remove from list
      let course = coursesMatching[0];
      
      coursesMatching = coursesMatching.slice(1);
      coursesExtracted.push(course);
      amountStillNeeded--;
      numUnits += course.units_taking;
      //If we have the "countGradAsFour" modifier, add 1 unit if the course is >200 level math
      if (modifiers.includes('countGradAsFour') && course.dept == "MATH" && course.number >= 200) {
        numUnits++;
      }
      //Remove from list (consume) if this is a consume requirement
      //(otherwise we're just observing)
      if (type === 'consume') {
        //Remove from list only if we're consuming
        list = list.filter((course2) => {
          return course2.id !== course.id;
        });
        
      }
    }
    
    //If we have enough courses, fulfill the requirement
    let fulfilled = amountStillNeeded <= 0 && numUnits >= minUnits;
    //Create the cell values array
    let cellValues = [name];

    if (bundleName != undefined) {
      cellValues[0] = bundleName;
    }
    
    coursesExtracted.forEach((course) => {
      cellValues.push(course.code);
    });
    //Add empty cells if we don't have enough courses
    while (cellValues.length < amount + 1) {
      cellValues.push('');
    }
    //Add one additional cell if we don't have enough units
    //to show that we're not fulfilling the requirement
    if (numUnits < minUnits && cellValues[cellValues.length-1] !== '') {
      cellValues.push('');
    }

    let retVal = {
      fulfilled: fulfilled,
      cellValues: cellValues,
      coursesExtracted: coursesExtracted, //These are course objects
      numUnits: numUnits,
      list: list
    };

    if (minUnits > 0) {
      retVal.numericFulfilled = {
        name: name,
        numNeeded: minUnits,
        numHas: numUnits
      }
    }

    return retVal;

  } else if (type === 'and') {
    //We need to run checkRequirement on each of the requirements in content
    //If the requirement has a minUnits property, we need to keep track of the number of units taken
      //On the final requirement, it's fulfilled if the number of units taken is >= minUnits
    
    let requirementChecks = [];
    content.forEach((req) => {
      //If this is the last req, set minUnits to the number of units we still need
      if (req === content[content.length-1]) {
        let numUnitsAlreadyTaken = requirementChecks.map((check) => {
          return check.numUnits;
        }).reduce((a, b) => {return a + b;} , 0);
        //Account for when the last requirement has its own minUnits property
          //(Will probably never happen though)
        req.minUnits = Math.max(minUnits - numUnitsAlreadyTaken, req.minUnits || 0);
      }
      requirementChecks.push(checkRequirement(compiledDegree, allCourses, grid, originalList, list, transfer, req));
      list = requirementChecks[requirementChecks.length-1].list;
    });
    //Count how many units we've taken
    let numUnits = requirementChecks.map((check) => {
      return check.numUnits;
    }).reduce((a, b) => {return a + b;} , 0);
    //If we have a minUnits property, check if we've fulfilled it
    //fulfilled is true if all requirements are fulfilled and we have enough units
    let fulfilled = requirementChecks.every((check) => {
      return check.fulfilled;
    }) && numUnits >= minUnits;
    //Create the cell values array
    let cellValuesArray = [];
    requirementChecks.forEach((check) => {
      if (check.cellValues) {
        cellValuesArray.push(check.cellValues);
      } else {
        check.cellValuesArray.forEach((cellValues) => {
          cellValuesArray.push(cellValues);
        });
      }
    });
    


    let cellValues = [name];
    if (bundle) {
      cellValues[0] = bundleName;
      //Cut first element off of each cellValuesArray and add to cellValues
      cellValuesArray.forEach((cellValuesElem) => {
        cellValuesElem = cellValuesElem.slice(1);
        //Don't remove empty cells
        cellValues = [...cellValues, ...cellValuesElem];
      });
    }

    let retVal = {
      fulfilled: fulfilled,
      cellValuesArray: cellValuesArray,
      coursesExtracted: requirementChecks.map((check) => {
        return check.coursesExtracted;
      }).flat(),
      numUnits: numUnits,
      list: list
    }

    if (bundle) {
      retVal.cellValues = cellValues;
      //Remove cellValuesArray
      delete retVal.cellValuesArray;
    }

    if (minUnits > 0) {
      retVal.numericFulfilled = {
        name: name,
        numNeeded: minUnits,
        numHas: numUnits
      }
    }

    return retVal;


  } else if (type === 'or') {
    //Go through each of either the content or the lutList
    //We check requirements in the same fashion as "and" requirements
    //until all of the following occur:
      //We fulfilled at least one requirement
      //We have enough units (if minUnits is specified)
      //We have taken enough courses (if amount is specified)

    let requirementChecks = [];
    let fulfilled = false;
    let numUnits = 0;
    let coursesExtracted = [];
    if (!content) {
      content = lutList.map((lut) => {
        return {lut: lut};
      });
    }

    let done = false;
    content.forEach((req) => {
      if (done) return;
      //If this is the last req, set minUnits to the number of units we still need
      if (req === content[content.length-1]) {
        let numUnitsAlreadyTaken = requirementChecks.map((check) => {
          return check.numUnits;
        }).reduce((a, b) => {return a + b;} , 0);
        //Account for when the last requirement has its own minUnits property
        req.minUnits = Math.max(minUnits - numUnitsAlreadyTaken, req.minUnits || 0);
      }
      requirementChecks.push(checkRequirement(compiledDegree, allCourses, grid, originalList, list, transfer, req));
      list = requirementChecks[requirementChecks.length-1].list;

      //Check if we're done
      fulfilled = requirementChecks.some((check) => {return check.fulfilled;});
      numUnits = requirementChecks.map((check) => {
        return check.numUnits;
      }).reduce((a, b) => {return a + b;} , 0);
      coursesExtracted = requirementChecks.map((check) => {
        return check.coursesExtracted;
      }).flat();
      done = fulfilled && numUnits >= minUnits && (coursesExtracted.length >= amount || amount == 1);
    });

    //fulfilled is true if at least one requirement is fulfilled and we have enough units
    //and courses
    fulfilled = requirementChecks.some((check) => {
      return check.fulfilled;
    }) && numUnits >= minUnits && coursesExtracted.length >= amount;
    //If done was triggered, return the used courses from the unfulfilled requirements
    if (done) {
      let coursesExtracted = requirementChecks.filter((check) => {
        return !check.fulfilled;
      }).map((check) => {
        return check.coursesExtracted;
      }).flat();
      list = list.concat(coursesExtracted);
    }

    //Create the cell values array. OR conditions don't preserve the internal conditions like AND
    let cellValues = [name];

    if (bundleName != undefined) {
      cellValues[0] = bundleName;
    }

    requirementChecks.forEach((check) => {
      //Remove first element of check.cellValues
      let cellValues2 = check.cellValues.slice(1);
      //Remove any empty cells at the end
      while (cellValues2[cellValues2.length-1] === '') {
        cellValues2 = cellValues2.slice(0, cellValues2.length-1);
      }
      //Add to cellValues
      cellValues = [...cellValues, ...cellValues2];
    });

    //Add empty cells if we don't have enough courses
    while (cellValues.length < amount+1) {
      cellValues.push('');
    }
    //Add one additional cell if we don't have enough units or aren't fulfilled
    //to show that we're not fulfilling the requirement
    if ((numUnits < minUnits || !fulfilled) && cellValues[cellValues.length-1] !== '') {
      cellValues.push('');
    }

    let retVal = {
      fulfilled: fulfilled,
      cellValues: cellValues,
      coursesExtracted: requirementChecks.map((check) => {
        return check.coursesExtracted;
      }).flat(),
      numUnits: numUnits,
      list: list
    }

    if (minUnits > 0) {
      retVal.numericFulfilled = {
        name: name,
        numNeeded: minUnits,
        numHas: numUnits
      }
    }

    return retVal;

  } else if (type === 'transfer') {
    //Look at id of transfer and see if it's enough for cutoff
    let numUnits = getTransferUnits(transfer, id);
    if (numUnits >= cutoff) {
      return {
        fulfilled: true,
        cellValues: [name, id],
        coursesExtracted: ["TRANSFER COURSE"],
        numUnits: numUnits,
        list: list
      }
    } else {
      return {
        fulfilled: false,
        cellValues: [name, ''],
        coursesExtracted: [],
        numUnits: numUnits,
        list: list
      }
    }
  } else if (type === 'transferUnits') {
    //Look at id of transfer and see if it's enough for cutoff
    let numUnits = getTransferUnits(transfer, id);
    return {
      fulfilled: true,
      cellValues: [name, numUnits > 0 ? 'Transfer' : ''],
      coursesExtracted: [],
      numUnits: numUnits,
      list: list
    }
    
  } else {
    //Throw an error
    console.log("Invalid requirement type");
    throw "Invalid requirement type";
  }
}

function GeneralizedDegreeCheck(degree, allCourses, grid, list, transfer) {
  //Make a copy of the list so we can modify it
  let listCopy = JSON.parse(JSON.stringify(list));
  //Also filter out ms courses so we don't have to do it later
  listCopy = listCopy.filter((course) => {
    return !course.ms;
  });

  let totalUnits = 0;
  //If level is undergraduate, add 180 credit check
  if (degree.level === "undergraduate") {
    totalUnits = calculateTotalUnits(listCopy, transfer);
  }

  //Compute requirements
  let reqResults = [];

  degree.requirements.forEach((req, i) => {
    try {

      reqResults = [...reqResults, checkRequirement(degree, allCourses, grid, list, listCopy, transfer, req)];
      listCopy = reqResults[i].list;
    } catch (e) {
      console.log("Error in requirement: ");
      console.log(req);
      console.log(e);
    }
  });

  //For each reqResult, unpack it correctly
  let unprocessedRows = [];
  reqResults.forEach((reqResult) => {
    if (reqResult?.numericFulfilled) {
      unprocessedRows.push([
        "PROGRESSBAR", 
        reqResult.numericFulfilled.name, 
        reqResult.numericFulfilled.numHas, 
        reqResult.numericFulfilled.numNeeded
      ]);
    }
    if (reqResult?.cellValues) {
      let thingToPush = reqResult.cellValues;
      //Add a "✔" to beginning if fulfilled, otherwise hangul filler
      if (reqIsFulfilled(reqResult.cellValues)) {
        thingToPush = ["✔", ...thingToPush];
      } else {
        thingToPush = ["ㅤ", ...thingToPush];
      }
      unprocessedRows.push(thingToPush);
    } else if (reqResult?.cellValuesArray) {
      reqResult.cellValuesArray.forEach((cellValues) => {
        let thingToPush = cellValues;
        //Add a "✔" to beginning if fulfilled, otherwise hangul filler
        //We don't have access to fulfilled for each subreq of AND reqs so we have to check
        //if the last cell value is empty
        if (reqIsFulfilled(cellValues)) {
          thingToPush = ["✔", ...thingToPush];
        } else {
          thingToPush = ["ㅤ", ...thingToPush];
        }
        unprocessedRows.push(thingToPush);
      });
    }
  });

  //Process the rows into a displayable format
  let rows = [];

  //Title
  rows.push({
    cells: [
      {
        value: degree.degree,
        isTitle: true,
        noBorder: true
      }
    ]
  });
  
  //Total units counter
  rows.push({
    cells: [
      { value: totalUnits > 180 ? '✔' : 'ㅤ', noBorder: true, weight: .25 },
      { value: 'Total Units', noBorder: true },
      { value: totalUnits + '/180', progress: totalUnits/180 , weight: 3}
    ]
  });

  //Text row
  if (degree.infoText) {
    rows.push({
      cells: [
        { value: degree.infoText, noBorder: true, weight: 4 }
      ]
    });
  }

  //Add the rest of the rows
  unprocessedRows.forEach((row) => {

    //Handle differently if this is a PROGRESSBAR
    if (row[0] === "PROGRESSBAR") {
      let cells = [];
      cells.push({value: row[2]>=row[3] ? '✔' : 'ㅤ', noBorder: true, weight: .25});
      cells.push({value: row[1], noBorder: true, weight: 1});
      cells.push({value: row[2] + '/' + row[3], progress: row[2]/row[3], weight: 3});
      rows.push({cells: cells});
    } else if (row.length <= 6) {
      let cells = [];
      cells.push({value: row[0], noBorder: true, weight: .25});
      cells.push({value: row[1], noBorder: true, weight: 1})
      for (let i = 2; i < row.length; i++) {
        cells.push({value: row[i], weight: 3/(row.length-2)});
      }
      rows.push({cells: cells});
    } else {
      //Divide into two rows
      let cells1 = [];
      let cells2 = [];
      cells1.push({value: row[0], noBorder: true, weight: .25});
      cells1.push({value: row[1], noBorder: true, weight: 1});
      cells2.push({value: 'ㅤ', noBorder: true, weight: .25});
      cells2.push({value: 'ㅤ', noBorder: true, weight: 1});
      //top cells is celing of row.length-2 / 2
      let topCells = Math.ceil((row.length-2)/2);
      let bottomCells = row.length-2-topCells;
      for (let i = 0; i < topCells; i++) {
        cells1.push({value: row[i+2], weight: 3/topCells});
      }
      for (let i = 0; i < bottomCells; i++) {
        cells2.push({value: row[i+2+topCells], weight: 3/bottomCells});
      }

      rows.push({cells: cells1});
      rows.push({cells: cells2});

    }

  });
  rows = {rows: rows};
  return rows;

  
}

function reqIsFulfilled(cellValues) {
  let res = true;
  cellValues.forEach((cellValue) => {
    if (cellValue == '' || cellValue == 'ㅤ' || cellValue == [""]) {
      res = false;
    }
  });
  return res;
}

//This function takes a list of course objects and a list of course codes and returns a list of course objects
//which are in the list of course codes
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
  //Note that we don't worry about the repeatable edge case
  courses.forEach((course) => {
    totalUnits += course.units_taking;
  });
  //Add transfer units if they are not undefined
  if (transfer) {
    totalUnits+=getTransferUnits(transfer, 'Total');
  }
  return totalUnits;
}


export default GeneralizedDegreeCheck;
