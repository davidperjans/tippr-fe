import React from 'react';
import { cn } from '../../lib/utils';

interface FormIndicatorProps {
    form: string; // e.g., "WWDLW"
    className?: string;
    limit?: number;
}

export function FormIndicator({ form, className, limit = 5 }: FormIndicatorProps) {
    const chars = form.toUpperCase().split('').slice(-limit);

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {chars.map((char, i) => {
                let colorClass = "bg-bg-subtle text-text-tertiary";

                if (char === 'W') colorClass = "bg-success text-white border-success";
                else if (char === 'D') colorClass = "bg-warning text-white border-warning";
                else if (char === 'L') colorClass = "bg-danger text-white border-danger";

                return (
                    <div
                        key={i}
                        className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border",
                            colorClass
                        )}
                        title={char === 'W' ? 'Won' : char === 'D' ? 'Draw' : 'Lost'}
                    >
                        {char}
                    </div>
                );
            })}
        </div>
    );
}
