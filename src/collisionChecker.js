  const collisionChecker = (config) => {
    const { shapeArr, activeColumnIndex, activeRowIndex, currFieldState, prevElemPos } = config;

    const maxRowLength = () => Math.max(...shapeArr.map(el => el.length));

    const getCorrColumnIndex = (side, row) => {
      switch (side) {
        case 'left':
          return row[0];

        case 'right':
          return row[row.length - 1];

        case 'beforeLeft':
          return row[0] - 1;

        case 'twoBeforeLeft':
          return row[0] - 2;

        case 'afterLeft':
          return row[0] + 1;

        case 'beforeRight':
          return row[row.length - 1] - 1;

        case 'afterRight':
          return row[row.length - 1] + 1;

        default:
          return false;
      }
    }

    const testElementCollision = (side) => {
      let rowCorrIndex,
        currRow,
        exactRow,
        exactColumn,
        blockToCheck,
        collision = false,
        rowCorrIndexArr = [-1, 0, 1, 2];

      if (shapeArr.length > 1) { // activeRowIndex will be in index === 1 of the shape
        for (var row = 0; row < shapeArr.length; row++) {
          currRow = shapeArr[row];

          rowCorrIndex = rowCorrIndexArr[row];
          exactRow = activeRowIndex + rowCorrIndex;
          exactColumn = activeColumnIndex + getCorrColumnIndex(side, currRow);

          blockToCheck = currFieldState[exactRow][exactColumn];

          if (currRow.length === 1 && blockToCheck === undefined && currRow.length !== maxRowLength()) continue; // for shapes L and J (exclude I) near walls

          const isBlockFromPrev = prevElemPos.some(el => el[0] === exactRow && el[1] === exactColumn);
          if (blockToCheck === undefined || (blockToCheck > 0 && !isBlockFromPrev)) collision = true;

        }
      } else {
        currRow = shapeArr[0];
        exactRow = activeRowIndex;
        exactColumn = activeColumnIndex + getCorrColumnIndex(side, currRow);

        blockToCheck = currFieldState[exactRow][exactColumn];
        const isBlockFromPrev = prevElemPos.some(el => el[0] === exactRow && el[1] === exactColumn);
        if (blockToCheck === undefined || (blockToCheck > 0 && !isBlockFromPrev)) collision = true;
      }

      return collision;
    }

    const left = testElementCollision('left');
    const right = testElementCollision('right');
    const beforeRight = testElementCollision('beforeRight'); //shapeArr[0].length === 4 &&
    const afterLeft = testElementCollision('afterLeft'); //shapeArr[0].length === 4 &&
    const beforeLeft = testElementCollision('beforeLeft');
    const twoBeforeLeft = testElementCollision('twoBeforeLeft'); //(right && beforeRight) && 
    const afterRight = testElementCollision('afterRight');

    return {
      left,
      right,
      beforeLeft,
      twoBeforeLeft,
      afterRight,
      beforeRight,
      afterLeft
    }


  }

  export default collisionChecker;