import { Outlet, NavLink } from 'react-router-dom'

export function AppShell() {
    const navLinkClass = 'block px-4 py-2 rounded hover:bg-gray-800'
    return (
        <div className="flex h-screen">
            <aside className="w-40 bg-gray-900 text-white p-4">
                <nav className="space-y-2">
                    <NavLink to="/dashboard" className={navLinkClass}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/players" className={navLinkClass}>
                        Players
                    </NavLink>
                    <NavLink to="/teams" className={navLinkClass}>
                        Teams
                    </NavLink>
                    <NavLink to="/results" className={navLinkClass}>
                        Bet Results
                    </NavLink>
                    <NavLink to="/suggested" className={navLinkClass}>
                        Suggested Bets
                    </NavLink>
                </nav>
            </aside>
        <main className="flex-1 w-auto left-full bg-black-50 overflow-y-auto">
            <Outlet />
        </main>
        
        </div>

        
    )
}
