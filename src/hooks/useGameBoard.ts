import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from 'react';

import {
    clamp,
    createIndexArray,
    nextTileIndex,
    getId,
    resetTileIndex,
    shuffle,
} from '../utils/common';

import { DIRECTION_MAP } from '../utils/constants';
import { Vector } from '../utils/types';
import { GameStatus } from './useGameState';

export interface Location {
    r: number;
    c: number;
}

export interface Tile extends Location {
    index: number;
    id: string;
    isNew: boolean;
    isMerging: boolean;
    canMerge: boolean;
    value: number;
}

export type Cell = Tile | undefined;

export type GameBoardParams = {
    rows: number;
    cols: number;
    pause: boolean;
    gameStatus: GameStatus;
    setGameStatus: (nextStatus: GameStatus) => void;
    addScore: (score: number) => void;
}

const createRow = <T>(rows: number, cb: (r: number) => T) => Array.from(Array(rows)).map((_, r) => cb(r));

const createEmptyGrid = (rows: number, cols: number) => createRow(rows, () => createRow<Cell>(cols, () => undefined))

const createNewTile = (r: number, c: number): Tile => {
    const index = nextTileIndex();
    const id = getId(index);
    return {
        index,
        id,
        r,
        c,
        isNew: true,
        canMerge: false,
        isMerging: false,
        value: Math.random() > 0.99 ? 4 : 2
    };
};

const getEmptyCellsLocation = (grid: Cell[][]) =>
    grid.flatMap((row, r) =>
        row.flatMap<Location>((cell, c) => (cell === null ? { r, c } : []))
    );

const createRandomTiles = (emptyCells: Location[], amount: number) => {
    const tilesNumber = emptyCells.length < amount ? emptyCells.length : amount;

    if (!tilesNumber) return [];
    return shuffle(emptyCells)
        .slice(0, tilesNumber)
        .map(({ r, c }) => createNewTile(r, c));
}

const createTraversalMap = (rows: number, cols: number, dir: Vector) => {
    const rowsMap = createIndexArray(rows);
    const colsMap = createIndexArray(cols);

    return {
        // Always start from the last cell in the moving direction
        rows: dir.r > 0 ? rowsMap.reverse() : rowsMap,
        cols: dir.c > 0 ? colsMap.reverse() : colsMap
    }
}

const sortTiles = (tiles: Tile[]) =>
  tiles.sort((t1, t2) => t1.index - t2.index);

  const isWin = (tiles: Tile[]) => tiles.some(({ value }) => value === 2048);

const canGameContinue = (grid: Cell[][], tiles: Tile[]) => {
    const totalRows = grid.length;
    const totalCols = grid[0].length;
    // We can always continue the game when there're empty cells,
    if (tiles.length < totalRows * totalCols) return true;
  
    const dirs = [
      DIRECTION_MAP.Left,
      DIRECTION_MAP.Right,
      DIRECTION_MAP.Up,
      DIRECTION_MAP.Down,
    ];
  
    for (let ind = 0; ind < tiles.length; ind++) {
      const { r, c, value } = tiles[ind];
      for (let d = 0; d < dirs.length; d++) {
        const dir = dirs[d];
        const nextRow = clamp(r + dir.r, 0, totalRows - 1);
        const nextCol = clamp(c + dir.c, 0, totalCols - 1);
  
        if (nextRow !== r || nextCol !== c) {
          const tile = grid[nextRow][nextCol];
          if (tile == null || tile.value === value) return true;
        }
      }
    }
    return false;
  };