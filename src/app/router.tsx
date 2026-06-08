import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardPage } from '@/pages/DashboardPage'
import { PlayerPage } from '@/pages/PlayerPage'
import { TeamsHomePage } from '@/pages/TeamsHomePage'
import { ResultsPage } from '@/pages/ResultsPage'
import { SuggestedBetsPage } from '@/pages/SuggestedBetsPage'
import { AppShell } from '@/components/layout/AppShell'
import { PlayersHomePage } from '@/pages/PlayersHomePage'
import { TeamPage } from '@/pages/TeamPage'


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
                element: <TeamsHomePage />
            },
            {
                path: 'team/:teamId',
                element: <TeamPage />
            }
        ]
    }
])
