import { useState, useEffect, useRef } from "react"

type ComboBoxProps<T> = {
  items: T[]
  getLabel: (item: T) => string
  getKey: (item: T) => string | number
  onSelect: (item: T) => void
  placeholder?: string
}

export function SearchComboBox<Item>({
  items,
  getKey,
  getLabel,
  onSelect,
  placeholder,
}: ComboBoxProps<Item>) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (activeIndex < 0) return
    console.log("effect", activeIndex, listRef.current)
    const el = listRef.current?.children[activeIndex]
    el?.scrollIntoView({ block: "nearest" })
    console.log(el)
  }, [activeIndex])

  const filtered = items
    .filter((item) =>
      getLabel(item).toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 10)

  return (
    <div className="relative">
      <input
        className="border-2 border-blue-500 rounded-lg w-50 p-1"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
          setActiveIndex(0)
        }}
        onKeyDown={(e) => {
          switch (e.key) {
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
        }}
      />
      {isOpen && (
        <ul
          className="[scrollbar-color:#8b5cf6_#1e1b4b] overflow-auto h-30 w-50 border border-blue-500 rounded-lg mt-2 p-1"
          ref={listRef}
        >
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
