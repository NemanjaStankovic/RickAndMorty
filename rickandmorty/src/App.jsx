import { useEffect, useState, useRef, useCallback } from 'react'

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
                setSelectedCharacters(prev => [...prev, ...data.results]);
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
            <div class="flex justify-between p-4">
                <img class="flex" src="/src/icons/home.png" alt="Home icon" width="40" height="40"></img>
                <Search class="flex" nameFilter={nameFilter} setNameFilter={setNameFilter}></Search>
            </div>
            <div class="bg-slate-300">
              <Filter statusFilter={statusFilter} setStatusFilter={setStatusFilter}></Filter>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {selectedCharacters ? selectedCharacters.map((character, index) => (
                      <div key={character.id} ref={index === selectedCharacters.length - 1 ? lastCharacterRef : null} class="shadow m-1 rounded-2xl flex flex-col w-full bg-white">
                        <img class="object-center h-full w-full rounded-lg shadow-md" src={character.image} alt={`${character.name} image`} /><br></br>
                        <h1 class="font-bold text-2xl text-center mb-4">{character.name}</h1>
                      </div>
                  )):<></>}
              </div>
          </div>
      </>
  )
}
function Search({ nameFilter, setNameFilter }) {
    return (
        <>
            <input class="rounded-2xl max-w-md border-2 text-2xl border-slate-300 flex flex-shrink" value={nameFilter} placeholder="  Search" onChange={(e) => setNameFilter(e.target.value)}></input>
        </>
    )
}
function Filter({ statusFilter, setStatusFilter }) {
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

export default App
