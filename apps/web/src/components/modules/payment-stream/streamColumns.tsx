"use client";

import { sliceAddress } from "@/lib/utils";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { StreamRecord } from "@/lib/validations";

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case "active":
            return "bg-green-500";
        case "canceled":
            return "bg-red-500";
        case "transferred":
            return "bg-blue-500";
        case "paused":
            return "bg-orange-500";
        case "completed":
            return "bg-gray-500";
        default:
            return "bg-gray-500";
    }
};

export const streamColumns: ColumnDef<StreamRecord>[] = [
    {
        accessorKey: "id",
        header: () => <div className="text-center">ID</div>,
        cell: ({ row }) => (
            <div className="text-white font-mono text-center text-xs">
                {sliceAddress(row.getValue("id") as string, 8, 8)}
            </div>
        ),
    },
    {
        accessorKey: "sender",
        header: () => <div className="text-center">Sender</div>,
        cell: ({ row }) => (
            <div className="text-white font-mono text-center">
                {sliceAddress(row.getValue("sender") as string)}
            </div>
        ),
    },
    {
        accessorKey: "recipient",
        header: () => <div className="text-center">Receiver</div>,
        cell: ({ row }) => (
            <div className="text-white font-mono text-center">
                {sliceAddress(row.getValue("recipient") as string)}
            </div>
        ),
    },
    {
        accessorKey: "totalAmount",
        header: () => <div className="text-center">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalAmount") as string);
            const tokenSymbol = row.original.tokenSymbol;
            return (
                <div className="text-center">
                    <span className="text-white font-mono">
                        {amount.toFixed(2)} {tokenSymbol}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "startTime",
        header: () => <div className="text-center">Start Date</div>,
        cell: ({ row }) => {
            const startTime = row.getValue("startTime") as number;
            const formattedDate = format(new Date(startTime), "MMM dd, yyyy HH:mm");
            return (
                <div className="text-white font-mono text-center text-xs">{formattedDate}</div>
            );
        },
    },
    {
        accessorKey: "endTime",
        header: () => <div className="text-center">End Date</div>,
        cell: ({ row }) => {
            const endTime = row.getValue("endTime") as number;
            const formattedDate = format(new Date(endTime), "MMM dd, yyyy HH:mm");
            return (
                <div className="text-white font-mono text-center text-xs">{formattedDate}</div>
            );
        },
    },
    {
        accessorKey: "tokenSymbol",
        header: () => <div className="text-center">Token</div>,
        cell: ({ row }) => {
            const token = row.getValue("tokenSymbol") as string;
            return <div className="text-white text-center">{token}</div>;
        },
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const endTime = row.original.endTime;
            const currentTime = Date.now();

            const status =
                currentTime > endTime
                    ? "completed"
                    : (row.getValue("status") as string);

            return (
                <div className="flex justify-center items-center">
                    <span
                        className={`size-2 rounded-full ${getStatusColor(status)} mr-2`}
                    />
                    <div className="text-white capitalize">{status}</div>
                </div>
            );
        },
    },
];
