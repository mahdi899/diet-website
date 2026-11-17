import { Outlet } from 'react-router-dom'
import { SiteFrame } from './components/SiteFrame'

export default function SiteLayout() {
  return (
    <SiteFrame>
      <Outlet />
    </SiteFrame>
  )
}
