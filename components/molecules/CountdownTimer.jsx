'use client';
import { useEffect, useState } from 'react';

export default function CountdownTimer({ targetDate, hours = 0, minutes = 0, seconds = 0 }) {
  const [time, setTime] = useState({
    d: 0,
    h: hours,
    m: minutes,
    s: seconds
  });

  useEffect(() => {
    let timer;

    if (targetDate) {
      const calculateTimeLeft = () => {
        const difference = new Date(targetDate) - new Date();

        if (difference > 0) {
          setTime({
            d: Math.floor(difference / (1000 * 60 * 60 * 24)),
            h: Math.floor((difference / (1000 * 60 * 60)) % 24),
            m: Math.floor((difference / 1000 / 60) % 60),
            s: Math.floor((difference / 1000) % 60),
          });
        } else {
          setTime({ d: 0, h: 0, m: 0, s: 0 });
        }
      };

      calculateTimeLeft();
      timer = setInterval(calculateTimeLeft, 1000);
    } else {
      // Fallback to static countdown
      timer = setInterval(() => {
        setTime(prev => {
          let { d, h, m, s } = prev;

          if (s > 0) s--;
          else {
            s = 59;
            if (m > 0) m--;
            else {
              m = 59;
              if (h > 0) h--;
              else {
                h = 23;
                if (d > 0) d--;
              }
            }
          }

          return { d, h, m, s };
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      {time.d > 0 && (
        <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">
          {String(time.d).padStart(2, '0')}d
        </span>
      )}
      <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">
        {String(time.h).padStart(2, '0')}h
      </span>
      <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">
        {String(time.m).padStart(2, '0')}m
      </span>
      <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">
        {String(time.s).padStart(2, '0')}s
      </span>
    </div>
  );
}
