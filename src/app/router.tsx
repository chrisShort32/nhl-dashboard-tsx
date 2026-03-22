import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardPage } from '@/pages/DashboardPage'
import { PlayerPage } from '@/pages/PlayerPage'
import { ResultsPage } from '@/pages/ResultsPage'
import { AppShell } from '@/components/layout/AppShell'

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
                element: <div>List of players coming soon?</div>
            },
            {
                path:'results',
                element: <ResultsPage />
            },
            {
                path:'suggested',
                element: <div>Suggested page coming soon</div>
            },
            {
                path:'teams',
                element: <div>Teams Page coming soon</div>
            }
        ]
    }
])
