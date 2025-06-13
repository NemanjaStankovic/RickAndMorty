import React, { useEffect, useState, useRef, useCallback } from 'react'
import Search from './Search';
import Filter from './Filter';
function App() {
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [page, setPage] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(true);
    const [trigger, setTrigger] = useState(0);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setSelectedCharacters([]);
        setPage(1);
        setTrigger(t => t + 1);
    }, [statusFilter, nameFilter]);
    useEffect(() => {
        const url = 'https://rickandmortyapi.com/api/character';
        const urlParams = new URLSearchParams();
        if (statusFilter) {
            urlParams.append('status', statusFilter);
        }
        if (nameFilter) {
            urlParams.append('name', nameFilter);
        }
        urlParams.append('page', page);

        fetch(url + `?${urlParams.toString()}`)
            .then(res =>
            {
                if (!res.ok) throw new Error('Fetch failed');
                return res.json();
            })
            .then(data => {
                setSelectedCharacters(prev => page === 1 ? data.results : [...prev, ...data.results]);
                setHasMorePages(data.info.next != null);
            })
            .catch(error => {
                console.log('Fetch error:',error);
                setSelectedCharacters([]);
                setHasMorePages(false);
            })
    }, [page, trigger]);

    const observer = useRef();
    const lastCharacterRef = useCallback(
        node => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMorePages) {
                    setPage(prevPage => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        }, [hasMorePages]);
    return (
        <>
            <div className="flex justify-between p-4">
                <img className="flex" src="/src/icons/home.png" alt="Home icon" width="40" height="40" />
                <Search className="flex" nameFilter={nameFilter} setNameFilter={setNameFilter} />
            </div>

            <div className="bg-slate-300">
                <Filter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {selectedCharacters ? selectedCharacters.map((character, index) => (
                        <div
                            key={character.id}
                            ref={index === selectedCharacters.length - 1 ? lastCharacterRef : null}
                            className="shadow m-1 rounded-2xl flex flex-col w-full bg-white"
                        >
                            <div className="relative w-full aspect-square bg-gray-200 overflow-hidden rounded-t-2xl">
                                <img
                                    src={character.image}
                                    alt={`${character.name} image`}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            </div>
                            <h1 className="font-bold text-2xl text-center mb-4">{character.name}</h1>
                        </div>
                    )) : <></>}
                </div>
            </div>
        </>
  )
}


export default App;
