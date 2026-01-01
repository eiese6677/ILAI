
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
}

export default function Board({ size, board, onPlace }: Props) {
    const stonesMap = new Map<string, string>();
    board.forEach(s => stonesMap.set(`${s.r},${s.c}`, s.color));

    const rows = [];
    for (let r = 0; r < size; r++) {
        const cols = [];
        for (let c = 0; c < size; c++) {
            const key = `${r},${c}`;
            const color = stonesMap.get(key);
            cols.push(
                <div
                    key={key}
                    onClick={() => onPlace(r, c)}
                    style={{
                        width: 28,
                        height: 28,
                        boxSizing: 'border-box',
                        border: '1px solid #999',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#d9b88a',
                        cursor: 'pointer'
                    }}
                    title={`r:${r}, c:${c}`}
                >
                    {color && (
                        <div style={{ width: 18, height: 18, borderRadius: 9, background: color === 'black' ? '#000' : '#fff', border: '1px solid #333' }} />
                    )}
                </div>
            );
        }
        rows.push(
            <div key={r} style={{ lineHeight: 0 }}>
                {cols}
            </div>
        );
    }

    return <div style={{ display: 'inline-block', padding: 8, background: '#b58863', borderRadius: 6 }}>{rows}</div>;
}
