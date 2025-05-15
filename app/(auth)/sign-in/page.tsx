import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <main className='sign-in'>
      <aside className='testimonial'>
        <Link  href='/'>
          <Image
            src="/assets/icons/logo.svg"
            width={32}
            height={32}
            alt='logo'
            />
          <h1>SnapCast</h1>
        </Link>
        <div className='description'>
          <section>
            <figure>
              {Array.from({ length: 5 }).map((_, index) => (
                <Image 
                src="/assets/icons/star.svg"
                alt='star'
                width={20}
                height={20}
                key={index}
                />
              ))}
            </figure>
            <p>SnapCast makes screen recording easy. From quick walkthrough
              to full presentations, SnapCast has you covered. With a simple
              interface and powerful features, you can record your screen
              and share it with the world.
            </p>
            <article>
              <Image 
                src="/assets/images/jason.png"
                alt='json'
                width={64}
                height={64}
                className='rounded-full'
              />
              <div>
                <h2>Jason Rivera</h2>
                <p>Product Designer, NovaByte</p>
              </div>
            </article>
          </section>
          </div>
          <p>© SnapCast{(new Date()).getFullYear()} </p>
        </aside>
        <aside className='google-sign-in'>
              <section>
                <Link href='/'>
                  <Image
                    src="/assets/icons/logo.svg"
                    width={40}
                    height={40}
                    alt='logo'
                  />
                  <h1>SnapCast</h1>
                </Link>
                <p>Create and share your very first <span>SnapCast video</span> in no time!</p>
                <button>
                  <Image
                    src="/assets/icons/google.svg"
                    width={20}
                    height={20}
                    alt='google'
                  />
                  Sign in with Google
                </button>
              </section>
        </aside>
        <div className='overlay' />
      </main>
  )
}

export default page