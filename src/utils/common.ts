import { Color } from '../themes/types'

// eslint-disable-next-line @typescript-eslint/
let _tileIndex = 0;

export const nextTileIdnex = () => _tileIndex++;

export const resetTileIndex = () => {
    _tileIndex = 0
}

export const shuffle = <T>(arr: T[]) => {
    const shuffled = arr.slice(0);
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export const getId = (ind: number) => `${ind}_${Date.now()}`

export const getTileFontSize = (w: number, h: number, v: number) => {
    const factor = v >= 1024 ? 2.8 : 2;
    return Math.min(w, h) / factor
}

export const calcSegmentSize = (
    length: number,
    segementNum: number,
    spacing: number
) => (length - (segementNum + 1) * spacing) / segementNum;

export const calcTileSize = (
    gridSize: number,
    rows: number,
    cols: number,
    spacing: number
) => ({
    width: calcSegmentSize(gridSize, cols, spacing),
    height: calcSegmentSize(gridSize, rows, spacing)
})

export const calcLocation = (l: number, c: number, spacing: number) => (spacing + l) * c + spacing

export const createIndexArray = (len: number) => Array.from(Array(len).keys())
