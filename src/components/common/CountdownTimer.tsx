import { useState, useEffect } from 'react';
import { parseISO, differenceInSeconds, format } from 'date-fns';
import { cn } from '../../lib/utils';

interface CountdownTimerProps {
    matchDate: string;
    status?: string;
    className?: string;
}

export function CountdownTimer({ matchDate, status, className }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        isPast: boolean;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const matchTime = parseISO(matchDate);
            const diffInSeconds = differenceInSeconds(matchTime, now);

            if (diffInSeconds <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
                return;
            }

            const days = Math.floor(diffInSeconds / (3600 * 24));
            const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((diffInSeconds % 3600) / 60);
            const seconds = diffInSeconds % 60;

            setTimeLeft({ days, hours, minutes, seconds, isPast: false });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [matchDate]);

    if (!timeLeft) return null;

    if (status === 'InProgress' || status === 'Live') {
        return <span className={cn("text-danger font-bold animate-pulse", className)}>LIVE</span>;
    }

    if (status === 'Finished' || status === 'FullTime') {
        return <span className={cn("text-text-tertiary", className)}>FT</span>;
    }

    if (timeLeft.isPast) {
        // Fallback if status isn't clearly finished but time passed
        return <span className={cn("text-text-tertiary", className)}>{format(parseISO(matchDate), 'HH:mm')}</span>;
    }

    return (
        <div className={cn("font-mono font-medium text-text-secondary", className)}>
            {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
            {timeLeft.days === 0 && timeLeft.hours > 0 && <span>{timeLeft.hours}h </span>}
            <span>{timeLeft.minutes}m</span>
            {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 60 && (
                <span className="text-text-tertiary text-xs"> {timeLeft.seconds}s</span>
            )}
        </div>
    );
}
