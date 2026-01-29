"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StreamProgressBarProps {
    startTime: number;
    endTime: number;
    totalAmount: string;
    withdrawnAmount: string;
    status: string;
    tokenSymbol: string;
}

const StreamProgressBar: React.FC<StreamProgressBarProps> = ({
    startTime,
    endTime,
    totalAmount,
    withdrawnAmount,
    status,
    tokenSymbol,
}) => {
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        if (status.toLowerCase() !== "active") return;

        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, [status]);

    const stats = useMemo(() => {
        const total = parseFloat(totalAmount);
        const withdrawnSize = parseFloat(withdrawnAmount);
        const now = currentTime;
        const start = startTime;
        const end = endTime;
        const duration = end - start;

        let vestedSize = 0;
        if (now > start) {
            const elapsed = Math.min(now - start, duration);
            vestedSize = (total * elapsed) / duration;
        }

        // Clamp vestedSize to be at least withdrawnSize
        const currentVested = Math.max(vestedSize, withdrawnSize);

        // Calculate segments
        const withdrawnPercent = (withdrawnSize / total) * 100;
        const vestedNotWithdrawnSize = currentVested - withdrawnSize;
        const vestedPercent = (vestedNotWithdrawnSize / total) * 100;
        const remainingPercent = 100 - withdrawnPercent - vestedPercent;

        return {
            withdrawnPercent,
            vestedPercent,
            remainingPercent,
            withdrawnSize,
            vestedSize: currentVested,
            vestedNotWithdrawnSize,
            remainingSize: total - currentVested,
            total,
        };
    }, [currentTime, startTime, endTime, totalAmount, withdrawnAmount]);

    return (
        <div className="w-full space-y-2">
            <TooltipProvider>
                <div className="h-2 w-full bg-zinc-700 rounded-full overflow-hidden flex">
                    {/* Withdrawn Segment */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="h-full bg-blue-500 transition-all duration-1000"
                                style={{ width: `${stats.withdrawnPercent}%` }}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Withdrawn: {stats.withdrawnSize.toFixed(4)} {tokenSymbol} ({stats.withdrawnPercent.toFixed(1)}%)</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Vested (Not Withdrawn) Segment */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="h-full bg-green-500 transition-all duration-1000"
                                style={{ width: `${stats.vestedPercent}%` }}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Vested: {stats.vestedNotWithdrawnSize.toFixed(4)} {tokenSymbol} ({stats.vestedPercent.toFixed(1)}%)</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Remaining Segment */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="h-full bg-zinc-600 transition-all duration-1000"
                                style={{ width: `${stats.remainingPercent}%` }}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Remaining: {stats.remainingSize.toFixed(4)} {tokenSymbol} ({stats.remainingPercent.toFixed(1)}%)</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>

            <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                <span>{stats.withdrawnPercent.toFixed(1)}% withdrawn</span>
                <span>{((stats.vestedSize / stats.total) * 100).toFixed(1)}% vested</span>
            </div>
        </div>
    );
};

export default StreamProgressBar;
