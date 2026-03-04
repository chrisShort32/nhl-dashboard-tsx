type Tab = {
    label: string
    value: string
}

type TabsProps = {
    tabs: Tab[]
    activeTab: string
    onChange: (value: string) => void
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
    const activeStyles = 'bg-blue-600 text-white px-4 py-2 rounded-lg'
    const inactiveStyles = 'bg-gray-700 text-gray-300 px-4 py-2 rounded-lg'
    return (
        <div className="flex space-x-6 h-25 p-6">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    className={tab.value === activeTab ? activeStyles : inactiveStyles}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}