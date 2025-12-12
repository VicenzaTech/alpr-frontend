import WhepPlayer from '@/components/WhepPlayer'
import React from 'react'

export default function page() {
  return (
    <div>
        <WhepPlayer whepUrl='http://localhost:8889/cam01/whep'/>
        <WhepPlayer whepUrl='http://localhost:8889/cam02/whep'/>
    </div>
  )
}
