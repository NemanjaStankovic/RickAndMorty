import React from 'react';

export default function Filter({ statusFilter, setStatusFilter }) {
    return (
        <div className="grid grid-cols-2 font-bold max-w-xl p-4 text-2xl sm:grid-cols-1 sm:flex sm:text-xl sm:flex-wrap sm:justify-between">
            <label class="col-span-full">Character status:</label>
            <label class="flex gap-1">
                <input
                    class="mr-1 acent-slate-300"
                    name="status"
                    type="radio"
                    value=""
                    checked={statusFilter === ''}
                    onChange={(e) => setStatusFilter(e.target.value)}
                />
                Any
            </label>
            <label class="flex gap-1">
                <input
                    class="mr-1"
                    name="status"
                    type="radio"
                    value="alive"
                    checked={statusFilter === 'alive'}
                    onChange={(e) => setStatusFilter(e.target.value)}
                />
                Alive
            </label>
            <label class="flex gap-1">
                <input
                    class="mr-1"
                    name="status"
                    type="radio"
                    value="dead"
                    checked={statusFilter === 'dead'}
                    onChange={(e) => setStatusFilter(e.target.value)}
                />
                Dead
            </label>
            <label class="flex gap-1">
                <input
                    class="mr-1"
                    name="status"
                    type="radio"
                    value="unknown"
                    checked={statusFilter === 'unknown'}
                    onChange={(e) => setStatusFilter(e.target.value)}
                />
                Unknown
            </label>
        </div>
    )
}