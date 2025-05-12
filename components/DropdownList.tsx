"use client"
import Image from 'next/image';
import React from 'react'

const DropdownList = () => {
    const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className='relative'>
        <div className='cursor-pointer' onClick={() => setIsOpen(prev => !prev)}>
            <div className='filter-trigger '>
                <figure>
                    <Image
                        src='/assets/icons/hamburger.svg'
                        alt='hamburger'
                        width={14}
                        height={14}
                    />
                    <span>Most Recent</span>
                </figure>
                <Image
                    src="/assets/icons/arrow-down.svg"
                    alt='arrow'
                    width={20}
                    height={20}
                />
            </div>
        </div>
        {
            isOpen && (
                <ul className='dropdown'>
                    {['Most Recent', 'Most Liked', 'Most Viewed'].map((item) => (
                        <li key={item} className='text-center list-item'>
                            {item}
                        </li>
                    ))}
                </ul>
            )
        }
    </div>
  )
}

export default DropdownList