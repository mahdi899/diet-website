import { useEffect, useRef } from 'react'

export function useHorizontalSlider(itemSelector: string, autoplayMs = 0) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = ref.current
    if (!track) return
    track.tabIndex = 0
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const stepSize = () => {
      const first = track.querySelector(itemSelector)
      if (!first) return 0
      return first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || '0')
    }
    const isRtl = () => getComputedStyle(track).direction === 'rtl'
    const move = (direction: number) => {
      const step = stepSize()
      if (!step) return
      const sign = isRtl() ? -direction : direction
      track.scrollBy({ left: sign * step, behavior: reduced.matches ? 'auto' : 'smooth' })
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.target !== track) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      move(event.key === 'ArrowLeft' ? -1 : 1)
    }

    let startX = 0
    let startScroll = 0
    let down = false
    let dragging = false
    let lastDrag = -Infinity
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      down = true
      dragging = false
      startX = event.clientX
      startScroll = track.scrollLeft
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!down) return
      if (!dragging && Math.abs(event.clientX - startX) > 8) {
        dragging = true
        track.classList.add('dragging')
        track.setPointerCapture(event.pointerId)
      }
      if (!dragging) return
      event.preventDefault()
      track.scrollLeft = startScroll - (event.clientX - startX)
    }
    const end = (event: PointerEvent) => {
      if (dragging) {
        lastDrag = performance.now()
        if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId)
      }
      down = false
      dragging = false
      track.classList.remove('dragging')
    }
    const onClick = (event: MouseEvent) => {
      if (performance.now() - lastDrag >= 300) return
      event.preventDefault()
      event.stopPropagation()
    }

    track.addEventListener('keydown', onKey)
    track.addEventListener('pointerdown', onPointerDown)
    track.addEventListener('pointermove', onPointerMove)
    track.addEventListener('pointerup', end)
    const onPointerLeave = () => {
      if (!dragging) down = false
    }
    track.addEventListener('pointercancel', end)
    track.addEventListener('pointerleave', onPointerLeave)
    track.addEventListener('click', onClick, true)

    let timer = 0
    let observer: IntersectionObserver | undefined
    const onPageDown = () => {
      pagePointerDown = true
    }
    const onPageUp = () => {
      pagePointerDown = false
    }
    const onEnter = () => {
      sliderPaused = true
    }
    const onLeave = () => {
      sliderPaused = false
    }
    let pagePointerDown = false
    let sliderPaused = false

    if (autoplayMs > 0 && !reduced.matches) {
      let inView = false
      let index = 0
      const items = () => [...track.querySelectorAll(itemSelector)]
      const scrollToItem = (element: Element) => {
        const frame = track.getBoundingClientRect()
        const box = element.getBoundingClientRect()
        const delta = isRtl() ? box.right - frame.right : box.left - frame.left
        track.scrollBy({ left: delta, behavior: reduced.matches ? 'auto' : 'smooth' })
      }
      observer = new IntersectionObserver(([entry]) => {
        inView = Boolean(entry?.isIntersecting)
      }, { threshold: 0.12 })
      observer.observe(track.closest('.testimonials') ?? track)
      addEventListener('pointerdown', onPageDown, { passive: true, capture: true })
      addEventListener('pointerup', onPageUp, { passive: true, capture: true })
      addEventListener('pointercancel', onPageUp, { passive: true, capture: true })
      track.addEventListener('pointerenter', onEnter)
      track.addEventListener('pointerleave', onLeave)
      timer = window.setInterval(() => {
        if (!inView || pagePointerDown || sliderPaused || dragging || down || document.hidden) return
        const list = items()
        if (!list.length) return
        index = (index + 1) % list.length
        const next = list[index]
        if (next) scrollToItem(next)
      }, autoplayMs)
    }

    return () => {
      track.removeEventListener('keydown', onKey)
      track.removeEventListener('pointerdown', onPointerDown)
      track.removeEventListener('pointermove', onPointerMove)
      track.removeEventListener('pointerup', end)
      track.removeEventListener('pointercancel', end)
      track.removeEventListener('pointerleave', onPointerLeave)
      track.removeEventListener('click', onClick, true)
      if (timer) window.clearInterval(timer)
      observer?.disconnect()
      removeEventListener('pointerdown', onPageDown, true)
      removeEventListener('pointerup', onPageUp, true)
      removeEventListener('pointercancel', onPageUp, true)
      track.removeEventListener('pointerenter', onEnter)
      track.removeEventListener('pointerleave', onLeave)
    }
  }, [autoplayMs, itemSelector])

  return ref
}
