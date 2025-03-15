

"use client"
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

const NavbarComponent = dynamic(() => import('./NavbarComponent'))

const MobileNavBar = () => {
    return (
        <>

            <Suspense fallback={<div className='flex justify-center items-center w-full h-full'>
                Loading...
            </div>}>
                <NavbarComponent />
            </Suspense>
        </>
    )
}

export default MobileNavBar