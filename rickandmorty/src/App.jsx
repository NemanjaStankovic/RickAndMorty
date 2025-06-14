import React, { useEffect, useState, useRef, useCallback } from 'react'
import Search from './Search';
import Filter from './Filter';
function App() {
    const [selectedCharacters, setSelectedCharacters] = useState([]); //cuva listu likova za prikaz
    const [statusFilter, setStatusFilter] = useState('');   //cuva vrednost filtera statusa (Any, Alive, Dead, Unknown)
    const [nameFilter, setNameFilter] = useState('');   //cuva string za pretragu likova po imenu
    const [page, setPage] = useState(1);    //cuva redni broj stranice, inkrementira se kad treba da se ucita sledeca
    const [hasMorePages, setHasMorePages] = useState(true); //cuva link ka sledecoj stranici, ako postoji
    const [trigger, setTrigger] = useState(0);  // povezan sa promenom stranice koji je asinhroni proces pa se ovim zadrzava ucitavanje dok se ne promeni state page da bi se sprecilo da se prva stranica ucitava dva puta
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {    //sprecava da se ovaj hook izvrsi pri prvom renderovanju jer bi to pozvalo setPage koji bi aktivirao drugi hook gde bi se isti podaci ponovo ucitali
            isFirstRender.current = false;
            return;
        }
        setSelectedCharacters([]);  //resetuje stanje...
        setPage(1);                 //...pre ucitavanja novog seta podataka uzrokovanog promenom filtera
        setTrigger(t => t + 1);
    }, [statusFilter, nameFilter]);

    useEffect(() => {               //ucitavanje novih podataka
        const url = 'https://rickandmortyapi.com/api/character';
        const urlParams = new URLSearchParams();  //za cuvanje parametara za filtriranje
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
                setSelectedCharacters(prev => page === 1 ? data.results : [...prev, ...data.results]);      //ako je trenutra stranica 1 znaci da se ovaj fetch pozvao zbog promene filtera pa se stari rezultati brisu, u suprotnom stranica je 2 ili vise znaci da treba ucitati novi set podataka i dodati ga na stari 
                setHasMorePages(data.info.next != null);
            })
            .catch(error => {   //ako je doslo do greske ucitava praznu stranicu sto ce se uglavnom desiti kad fetch ne vrati rezultat ili vrati prazan niz
                console.log('Fetch error:',error);
                setSelectedCharacters([]);
                setHasMorePages(false);
            })
    }, [page, trigger]);

    const observer = useRef();
    const lastCharacterRef = useCallback(   //definise se callback funkcija koja ce da se pozove kad se zadnji lik pojavi na ekran korisnika sto znaci da je dosao do kraja stranice
        node => {
            if (observer.current) observer.current.disconnect();    //ako vec postoji observer iskljucuje ga
            observer.current = new IntersectionObserver(entries => {    //kreira se novi observer
                if (entries[0].isIntersecting && hasMorePages) {    //ako se zadnji lik nalazi na ekranu i postoji jos stranica potrebno je ucitati nove podatke sa te sledece stranice...
                    setPage(prevPage => prevPage + 1);  //...postavlja se stranica na novu vrednost sto ce ponovo da aktivira hook za ucitavanje novih podataka
                }
            });
            if (node) observer.current.observe(node);   //observer se postavlja na karticu sa zadnjim ucitanim likom i ceka se da se on pojavi na ekranu da bi se ova funkcija ponovo pozvala
        }, [hasMorePages]); //observer se zakaci za zadnjeg ucitanog lika kad se promeni vrednost hasMorePages tj. kad se ucita novi set podataka 

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
                            ref={index === selectedCharacters.length - 1 ? lastCharacterRef : null} //Callback funkcija se kaci na zadnjeg ucitanog lika iz seta podataka. Kada korisnik scroll-uje do njega on izaziva ucitavanje novih podataka
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
