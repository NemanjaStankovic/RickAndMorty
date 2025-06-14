class IntersectionObserver {    //definisanje praznog observera za potrebe testiranja
    constructor(callback) {
        this.callback = callback;
    }
    observe() { }
    unobserve() { }
    disconnect() { }
}

globalThis.IntersectionObserver = IntersectionObserver;

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

vi.stubGlobal('fetch', vi.fn(() =>          //simulacija fetch funkcije sa hardcode-iranim podacima
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            results: [
                { id: 1, name: 'Rick Sanchez', status: 'Alive', image: 'rick.png' },
                { id: 2, name: 'Morty Smith', status: 'Alive', image: 'morty.png' },
                { id: 3, name: 'Summer Smith', status: 'Alive', image: 'summer.png' },
                { id: 4, name: 'Beth Smith', status: 'Alive', image: 'beth.png' },
                { id: 5, name: 'Jerry Smith', status: 'Alive', image: 'jerry.png' },
            ],
            info: {
                next: null,
            },
        }),
    })
));

describe('App test', () => {
    it('filters character by name and status', async () => {
        render(<App />);

        const input = screen.getByPlaceholderText(/search/i)
        fireEvent.change(input, { target: { value: 'Sm' } })        //postavljanje vrednosti Sm u polje za pretragu

        const aliveButton = screen.getByLabelText('Alive');         //postavljanje filtera 'Alive' za status
        fireEvent.click(aliveButton);

        await waitFor(() => {                                       //ocekuje se poziv fetch metode sa ovim filterima
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('status=alive')
            )
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('name=Sm')
            )
        })
        expect(await screen.findByText('Morty Smith')).toBeInTheDocument(); //ocekuje se prikaz ovih likova na virtualni DOM
        expect(await screen.findByText('Summer Smith')).toBeInTheDocument();
        expect(await screen.findByText('Beth Smith')).toBeInTheDocument();
        expect(await screen.findByText('Jerry Smith')).toBeInTheDocument();
    })
})