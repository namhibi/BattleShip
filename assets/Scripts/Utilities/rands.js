const horizontalOffsets = [
    [0, -1],
    [0, 1],
];
const verticalOffsets = [
    [-1, 0],
    [1, 0],
];
const offsets = [...horizontalOffsets, ...verticalOffsets];

const random = (min, max) => {
    if (!max) {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomInArray = (array) => {
    const index = random(array.length - 1);
    return array[index];
};

const randomPosition = (maxRow, maxColumn) => {
    const row = random(maxRow - 1);
    const column = random(maxColumn - 1);
    return { row, column };
};

const addPosition = (position, offset) => {
    return {
        row: position.row + offset[0],
        column: position.column + offset[1],
    };
};

const checkPosition = (position, maxRow, maxColumn) => {
    return (
        position.row >= 0 &&
        position.row < maxRow &&
        position.column >= 0 &&
        position.column < maxColumn
    );
};

const randomAroundPos = (position, maxRow, maxColumn) => {
    let newPos = {};
    do {
        const offset = randomInArray(offsets);
        newPos = addPosition(position, offset);
    } while (!checkPosition(newPos, maxRow, maxColumn));

    return newPos;
};

const randomAroundPosWithOffset = (
    firstPos,
    lastPos,
    maxRow,
    maxColumn,
    offsets
) => {
    let position = {};
    const newPositions = [
        addPosition(firstPos, offsets[0]),
        addPosition(lastPos, offsets[1]),
    ];
    do {
        position = randomInArray(newPositions);
    } while (!checkPosition(position, maxRow, maxColumn));

    return position;
};

const randomAroundPositions = (positions, maxRow, maxColumn) => {
    if (positions.length === 1) {
        return randomAroundPos(positions[0], maxRow, maxColumn);
    }

    positions.sort((a, b) => a.row - b.row || a.column - b.column);
    const firstPos = positions[0];
    const lastPos = positions[positions.length - 1];
    const isHorizontal = firstPos.row - lastPos.row === 0;
    const offsets = isHorizontal ? horizontalOffsets : verticalOffsets;

    return randomAroundPosWithOffset(
        firstPos,
        lastPos,
        maxRow,
        maxColumn,
        offsets
    );
};

const randomHitShip = (hitShips, maxRow, maxColumn) => {
    const shipId = randomInArray(Object.keys(hitShips));
    const shipPos = hitShips[shipId];
    return randomAroundPositions(shipPos, maxRow, maxColumn);
};

module.exports = {
    random,
    randomInArray,
    randomPosition,
    randomHitShip,
};
