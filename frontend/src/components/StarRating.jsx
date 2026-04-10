import { useState } from 'react';

const StarRating = ({ value, onChange, readOnly = false }) => {
    const [hovered, setHovered] = useState(0);

    return (
        <div style={{ display: 'flex', gap: '0.35rem', cursor: readOnly ? 'default' : 'pointer' }}>
            {[1, 2, 3, 4, 5].map(n => (
                <span
                    key={n}
                    style={{
                        fontSize: '2rem',
                        color: (hovered || value) >= n ? '#f5a623' : 'rgba(255,255,255,0.15)',
                        transition: 'color 0.15s, transform 0.15s',
                        transform: (hovered || value) >= n ? 'scale(1.2)' : 'scale(1)',
                        userSelect: 'none',
                    }}
                    onMouseEnter={() => !readOnly && setHovered(n)}
                    onMouseLeave={() => !readOnly && setHovered(0)}
                    onClick={() => !readOnly && onChange && onChange(n)}
                >
                    ★
                </span>
            ))}
            {value > 0 && (
                <span style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', alignSelf: 'center' }}>
                    {value}/5
                </span>
            )}
        </div>
    );
};

export default StarRating;
