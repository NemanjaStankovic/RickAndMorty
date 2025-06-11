import { useEffect, useState, useRef, useCallback } from 'react'

function App() {
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [page, setPage] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(true);

    useEffect(() => {
        setSelectedCharacters([]);
        setPage(1);
    }, [statusFilter, nameFilter]);
    useEffect(() => { console.log(nameFilter) }, [nameFilter]);
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
            .then(res => res.json())
            .then(data => {
                setSelectedCharacters(prev => [...prev, ...data.results]);
                setHasMorePages(data.info.next != null);
            })
    }, [statusFilter, nameFilter, page]);

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
            <Filter statusFilter={statusFilter} setStatusFilter={setStatusFilter}></Filter>
            <Search nameFilter={nameFilter} setNameFilter={ setNameFilter}></Search>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 p-4">
                {selectedCharacters ? selectedCharacters.map((character, index) => (
                    <div key={character.id} ref={index===selectedCharacters.length - 1? lastCharacterRef: null} class="relative group cursor-pointer">
                      <div class="shadow m-1 p-2 rounded-2xl flex max-w-xs overflow-auto transition-all duration-300 max-h-[400px] bg-white custom-scrollbar">
                          <div>
                              <h1 class="font-bold text-xl mb-2">{character.name}</h1>
                              <h2 class="font-bold text-xl mb-2">{character.status}</h2>
                              <img class="max-w-xs max-h-48 object-contain md:object-cover rounded-lg shadow-md" src={character.image} alt={`${character.name} image`} key={character.id} /><br></br>
                          </div>
                      </div>
                  </div>
              )):<></>}
          </div>
      </>
  )
}
function Search({ nameFilter, setNameFilter }) {
    return (
        <div>
            <input value={nameFilter} onChange={(e) => setNameFilter(e.target.value)}></input>
        </div>
    )
}
function Filter({ statusFilter, setStatusFilter }) {
    return (
        <div className="p-4">
            <label>
                <input
                    name="status"
                    type="radio"
                    value=""
                    checked={statusFilter === ''}
                    onChange={(e) => setStatusFilter(e.target.value)}
                />
                Any
            </label>
            <label>
                <input
                    name="status"
                    type="radio"
                    value="alive"
                    checked={statusFilter === 'alive'}
                    onChange={(e) => setStatusFilter(e.target.value)}
                />
                Alive
            </label>
            <label>
                <input
                    name="status"
                    type="radio"
                    value="dead"
                    checked={statusFilter === 'dead'}
                    onChange={(e) => setStatusFilter(e.target.value)}
                />
                Dead
            </label>
            <label>
                <input
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
