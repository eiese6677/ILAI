
import { useState } from 'react';

interface Stone {
    r: number;
    c: number;
    color: 'black' | 'white';
}

interface PlayerData {
    [id: string]: [[number, number]];
}

interface Props {
    size: number;
    players: PlayerData;
    myId: string | null;
    members: string[];
    board: Stone[];
    onPlace: (r: number, c: number) => void;
    myColor: 'black' | 'white' | null;
}

export default function Board({ board, onPlace, myColor }: Props) {
    const [hoveredCell, setHoveredCell] = useState<{ r: number, c: number } | null>(null);

    const stonesMap = new Map<string, string>();
    board.forEach(s => stonesMap.set(`${s.r},${s.c}`, s.color));

    const rows = [];
    const gridSize = 3; // 틱택토는 3x3
    for (let r = 0; r < gridSize; r++) {
        const cols = [];
        for (let c = 0; c < gridSize; c++) {
            const key = `${r},${c}`;
            const color = stonesMap.get(key);
            const isHovered = hoveredCell && hoveredCell.r === r && hoveredCell.c === c && !color;
            const displaySymbol = color ? (color === 'black' ? 'X' : 'O') : (isHovered && myColor ? (myColor === 'black' ? 'X' : 'O') : '');
            const textOpacity = isHovered ? 0.5 : 1;
            cols.push(
                <div
                    key={key}
                    onClick={() => onPlace(r, c)}
                    onMouseEnter={() => setHoveredCell({ r, c })}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{
                        width: 100,
                        height: 100,
                        boxSizing: 'border-box',
                        border: '3px solid #000',
                        position: 'relative',
                        background: '#fff',
                        cursor: 'pointer'
                    }}
                    title={`r:${r}, c:${c}`}
                >
                    {displaySymbol && (
                        <span
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '48px',
                                fontWeight: 'bold',
                                color: color === 'black' ? '#000' : '#f00',
                                opacity: textOpacity
                            }}
                        >
                            {displaySymbol}
                        </span>
                    )}
                </div>
            );
        }
        rows.push(
            <div key={r} style={{ display: 'flex', lineHeight: 0 }}>
                {cols}
            </div>
        );
    }

    return <div style={{ display: 'inline-block', padding: 8, background: '#fff', border: '3px solid #000', borderRadius: 6 }}>{rows}</div>;
}
