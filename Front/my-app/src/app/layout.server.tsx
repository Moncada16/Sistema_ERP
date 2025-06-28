import { ReactNode } from 'react'
import { metadata } from './metadata'

export { metadata }

export default function RootLayoutServer({
  children,
}: {
  children: ReactNode
}) {
  return children
}