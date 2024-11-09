
import getCurrentUser from '@/utils/getCurrentUser'
import { GJCNavbar } from '@/components/gjc/gjcNavbar'

export async function NavbarWrapper() {
  const user = await getCurrentUser()
  return <GJCNavbar user={user} />
}