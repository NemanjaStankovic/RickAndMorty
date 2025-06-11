import { useEffect, useState } from 'react'

function App() {
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
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
        fetch(url + `?${urlParams.toString()}`)
            .then(res => res.json())
            .then(data => {
                setSelectedCharacters(data.results);
            })
    }, [statusFilter, nameFilter]);
    return (
        <>
            <Filter statusFilter={statusFilter} setStatusFilter={setStatusFilter}></Filter>
            <Search nameFilter={nameFilter} setNameFilter={ setNameFilter}></Search>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 p-4">
              {selectedCharacters?selectedCharacters.map(character => (
                  <div key={character.id} class="relative group cursor-pointer">
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
