import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
    value = 0,
    max = 5,
    readOnly = false,
    onChange,
    size = 20,
    className = ''
}) => {
    const [hoverValue, setHoverValue] = useState(null);

    const effectiveValue = hoverValue ?? value;

    const handleSelect = (selected) => {
        if (readOnly) return;
        if (onChange) onChange(selected);
    };

    return (
        <div className={`flex items-center ${readOnly ? '' : 'cursor-pointer'} ${className}`} aria-label="Rating">
            {Array.from({ length: max }, (_, index) => {
                const starNumber = index + 1;
                const isActive = starNumber <= effectiveValue;
                return (
                    <button
                        key={starNumber}
                        type="button"
                        className={`p-0.5 ${readOnly ? 'cursor-default' : 'hover:scale-105 transition-transform'}`}
                        onClick={() => handleSelect(starNumber)}
                        onMouseEnter={() => !readOnly && setHoverValue(starNumber)}
                        onMouseLeave={() => !readOnly && setHoverValue(null)}
                        aria-label={`${starNumber} bintang`}
                        disabled={readOnly}
                    >
                        <Star
                            size={size}
                            className={isActive ? 'text-yellow-400' : 'text-gray-300'}
                            // Fill star when active; outline when inactive
                            fill={isActive ? 'currentColor' : 'none'}
                            strokeWidth={1.5}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;


