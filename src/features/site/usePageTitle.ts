import { useEffect } from 'react'

export function usePageTitle(title: string) {
  useEffect(() => {
    if (document.title !== title) {
      document.title = title
    }
  }, [title])
}
