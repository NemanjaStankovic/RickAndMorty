import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Search from './Search'

describe('Search component', () => {
    it('renders input changes and updates nameFilter on change', () => {
        const setNameFilter = vi.fn()
        render(<Search nameFilter="" setNameFilter={setNameFilter} />)

        const input = screen.getByPlaceholderText(/search/i)
        expect(input).toBeInTheDocument()

        fireEvent.change(input, { target: { value: 'Rick' } })
        expect(setNameFilter).toHaveBeenCalledWith('Rick')
    })
})