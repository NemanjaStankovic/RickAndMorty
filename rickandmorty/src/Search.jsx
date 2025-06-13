import React from 'react';
export default function Search({ nameFilter, setNameFilter }) {
    return (
        <>
            <input class="rounded-2xl max-w-md border-2 text-2xl border-slate-300 flex flex-shrink" value={nameFilter} placeholder="  Search" onChange={(e) => setNameFilter(e.target.value)}></input>
        </>
    )
}