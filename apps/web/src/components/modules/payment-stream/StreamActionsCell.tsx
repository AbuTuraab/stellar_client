"use client";

import React, { useState } from "react";
import { ExternalLink, MoreHorizontal, Copy, Wallet } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { StreamRecord } from "@/lib/validations";
import { STELLAR_EXPERT_URL } from "@/lib/constants";
import { WithdrawStreamModal } from "./WithdrawStreamModal";

type StreamActionsCellProps = {
    stream: StreamRecord;
};

export default function StreamActionsCell({ stream }: StreamActionsCellProps) {
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

    const handleViewOnExplorer = () => {
        // For Stellar, we can link to stellar.expert
        const url = `${STELLAR_EXPERT_URL}/tx/${stream.id}`;
        window.open(url, "_blank");
    };

    const handleCopyStreamId = async () => {
        if (!stream?.id) return;
        try {
            await navigator.clipboard.writeText(stream.id);
        } catch { }
    };

    const handleOpenWithdraw = () => setIsWithdrawOpen(true);
    const handleCloseWithdraw = () => setIsWithdrawOpen(false);

    const isActive = stream.status === "Active";

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-700">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4 text-white" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {isActive && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={handleOpenWithdraw}
                        >
                            <Wallet className="mr-2 h-4 w-4" />
                            Withdraw
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={handleViewOnExplorer}
                    >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on Explorer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={handleCopyStreamId}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Stream ID
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <WithdrawStreamModal
                open={isWithdrawOpen}
                onOpenChange={setIsWithdrawOpen}
                stream={stream}
            />
        </>
    );
}
