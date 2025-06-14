import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Search from './Search'

describe('Search component', () => {
    it('renders input changes and updates nameFilter on change', () => {
        const setNameFilter = vi.fn()
        render(<Search nameFilter="" setNameFilter={setNameFilter} />)

        const input = screen.getByPlaceholderText(/search/i)    //trazi komponentu u kojoj pise search
        expect(input).toBeInTheDocument()   //ako je pronadje...

        fireEvent.change(input, { target: { value: 'Rick' } }) //u nju upisuje 'Rick'
        expect(setNameFilter).toHaveBeenCalledWith('Rick')  //ocekuje da se input prikazuje u komponenti
    })
})