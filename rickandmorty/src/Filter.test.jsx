import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Filter from './Filter';

describe('Filter component', () => {
    it('renders radio button changes and updates statusFilter on change', () => {
        const setStatusFilter = vi.fn()
        render(<Filter statusFilter="any" setStatusFilter={setStatusFilter} />)

        const aliveLabel = screen.getByText('Alive');       //trazi komponente po labeli...
        const anyLabel = screen.getByText('Any');
        const deadLabel = screen.getByText('Dead');
        const unknownLabel = screen.getByText('Unknown');


        const aliveButton = aliveLabel.querySelector('input[type="radio"]');    //...na osnovu koje nalazi radio dugme vezano uz nju
        const anyButton = anyLabel.querySelector('input[type="radio"]');
        const deadButton = deadLabel.querySelector('input[type="radio"]');
        const unknownButton = unknownLabel.querySelector('input[type="radio"]');

        expect(aliveButton).toBeInTheDocument();    //ocekujemo da ova 4 radio dugmeta postoje
        expect(anyButton).toBeInTheDocument();
        expect(deadButton).toBeInTheDocument();
        expect(unknownButton).toBeInTheDocument();

        fireEvent.click(aliveButton);                           //provera promene selektiranog radio dugmeta klikom na njega
        expect(setStatusFilter).toHaveBeenCalledWith('alive');
        fireEvent.click(anyButton);
        expect(setStatusFilter).toHaveBeenCalledWith('');
        fireEvent.click(deadButton);
        expect(setStatusFilter).toHaveBeenCalledWith('dead');
        fireEvent.click(unknownButton);
        expect(setStatusFilter).toHaveBeenCalledWith('unknown');
    })
})