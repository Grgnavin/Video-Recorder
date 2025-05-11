import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = ({ subHeader, title, userImg }: SharedHeaderProps) => {
  return (
    <header className='header'>
        <section className='header-container'>
            <div className='details'>
                {userImg && (
                    <div>
                    <Image
                        src={userImg || '/assets/images/dummy.jpg'}
                        alt='user'
                        width={66}
                        height={66}
                        className='rounded-full'
                    />
                        </div>
                )}
                <article>
                    <p>{subHeader}</p>
                    <h1>{title}</h1>
                </article>
            </div>
            <aside>
                <Link href='/upload'>
                    <Image 
                        src='/assets/icons/upload.svg'
                        alt='upload'
                        width={16}
                        height={16}
                    />
                    <span>Upload a video</span>
                </Link>
            </aside>
        </section>
    </header>
  )
}

export default Header