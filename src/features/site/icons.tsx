const icons = {
  leaf: '<path d="M12 22V10M12 15C3 15 1 8 2 3c8 0 12 4 10 12ZM12 20c0-8 4-12 11-12 1 7-3 12-11 12Z"/>',
  arrow: '<path d="M19 12H5m6-6-6 6 6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  chat: '<path d="M4 4h16v13H9l-5 4Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  carrot: '<path d="M8 8c-4 2-5 10-5 13 5-1 11-4 13-8L8 8Z M10 5c0-4 5-4 5-3l-2 5c5-4 8-1 8 0l-7 3M6 12l3 2m-5 2 3 1"/>',
  tomato: '<path d="M12 7c-9-7-15 12-3 14 12 4 19-14 6-14M12 3v5M7 5l5 3 5-3M12 8l-4 3m4-3 4 3"/>',
  bowl: '<path d="M2 12h20c0 11-20 11-20 0Zm5 10h10M6 10C1 3 8 0 11 7m1 3c0-7 9-9 9-4l-4 4M4 7l5 3"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-3 14h2"/>',
} as const

export type IconName = keyof typeof icons

export function Icon({ name }: { name: IconName }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: icons[name] }} />
  )
}
