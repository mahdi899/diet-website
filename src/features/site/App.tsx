import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { SiteFrame } from './components/SiteFrame'

export default function SiteLayout() {
  return (
    <SiteFrame>
      <Suspense fallback={<div className="min-h-[60vh] bg-white" />}>
        <Outlet />
      </Suspense>
    </SiteFrame>
  )
}
