import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardPage } from '@/pages/DashboardPage'
import { PlayerPage } from '@/pages/PlayerPage'
import { ResultsPage } from '@/pages/ResultsPage'
import { SuggestedBetsPage } from '@/pages/SuggestedBetsPage'
import { AppShell } from '@/components/layout/AppShell'
import { PlayersHomePage } from '@/pages/PlayersHomePage'

// Route table for the SPA. Expand here as new pages are added.
export const router = createBrowserRouter([
    { 
        path: '/', 
        element: <AppShell />,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />
            },
            {
                path: 'dashboard',
                element: <DashboardPage />
            },
            {
                path: 'player/:playerId',
                element: <PlayerPage />
            },
            {
                path:'players',
                element: <PlayersHomePage />
            },
            {
                path:'results',
                element: <ResultsPage />
            },
            {
                path:'suggested',
                element: <SuggestedBetsPage />
            },
            {
                path:'teams',
                element: <div>Teams Page coming soon</div>
            }
        ]
    }
])
