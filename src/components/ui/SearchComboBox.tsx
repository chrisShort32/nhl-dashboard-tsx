import { useState } from "react"

type ComboBoxProps<T> = {
    items: T[]
    getLabel: (item: T) => string
    getKey: (item: T) => string | number
    onSelect: (item: T) => void
    placeholder?: string
}

export function SearchComboBox<Item>({ items, getKey, getLabel, onSelect, placeholder }: ComboBoxProps<Item>) {
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)

    const filtered = items.filter((item) => getLabel(item).toLowerCase().includes(query.toLowerCase()))

    return (
        <div className="relative">
            <input
                className="border-2 border-blue-500 rounded-lg w-50 p-1" 
                placeholder={placeholder}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value) 
                    setIsOpen(true)
                }}
                onKeyDown={((e) => {
                        switch(e.key) {
                            case "ArrowUp": 
                                e.preventDefault()    
                                setActiveIndex(Math.max(activeIndex - 1, 0))
                                break
                            case "ArrowDown": 
                                e.preventDefault()    
                                setActiveIndex(Math.min(activeIndex + 1, filtered.length - 1)) 
                                break
                            case "Enter":
                                if (activeIndex < 0) break
                                onSelect(filtered[activeIndex])
                                break
                            case "Escape":
                                setActiveIndex(-1)
                                setIsOpen(false)
                                break

                        }
                    })}
            />
            {isOpen && (
                <ul className="absolute... overscroll-y-auto overflow-auto h-30 w-50 border-1 border-blue-500 rounded-lg mt-2 p-1">
                    {filtered.map((item, index) => (
                        <li 
                            key={getKey(item)}
                            onClick={() => onSelect(item)}
                            className={index === activeIndex ? "bg-blue-500" : ""}
                        >
                            {getLabel(item)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}