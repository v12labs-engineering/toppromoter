import { Button } from '@/components/Button';
import { Github } from '@/components/Icons/Github';
import { Logo } from '@/components/Icons/Logo';
import { useUser } from '@/utils/useUser';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const { user } = useUser();
  const [active, setActive] = useState(false);
  const [scroll, setScroll] = useState(false);
  const router = useRouter();
  const navClass = `text-xl font-medium hover:underline mx-3 ${router?.pathname === '/' && 'text-white'}`;

  useEffect(() => {
    if(router.asPath === '/') {
      window.addEventListener('scroll', () => {
        setScroll(window.scrollY > 50);
      });
      if(window.scrollY > 50 && scroll === false){
        setScroll(true);
      }
    }
  }, []);

  return (
    <>
      <div className={ `${router?.pathname === '/' ? scroll ? 'bg-secondary-3' : 'bg-transparent' : 'bg-white border-b-4 border-gray-200'} sticky top-0 z-40 transition-background ease-in-out duration-300` }>
        <div className="py-6 wrapper">
          <div className="flex justify-between">
            <div className="flex justify-start">
              <div className="flex-shrink-0 flex items-center mr-4">
                <Link
                  href="/">
                  {
                    router?.pathname === '/' ?
                      <Logo white className="h-10 md:h-12 w-auto" />
                    :
                      <Logo className="h-10 md:h-12 w-auto" />
                  }
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <nav className="flex items-center justify-center">
                <a
                  href="/#features"
                  className={ navClass }>
                  Features
                </a>
                <a
                  href="/pricing"
                  className={ navClass }>
                  Pricing
                </a>
                <a
                  href="https://toppromoter.com/resources"
                  className={ navClass }>
                  Docs & Guides
                </a>
              </nav>
            </div>

            <button
              className='inline-flex rounded lg:hidden outline-none'
              onClick={ e=>{active ? setActive(false) : setActive(true) } }>
              {
                active ?
                  <XIcon className={ `w-8 h-auto ${router?.pathname === '/' && 'text-white'}` } />
                : <MenuIcon className={ `w-8 h-auto ${router?.pathname === '/' && 'text-white'}` } />
              }
            </button>

            {
              active &&
              <div className="lg:hidden origin-top-right absolute left-0 top-auto overflow-hidden mt-12 md:mt-14 w-full shadow-xl  border-gray-200 bg-white z-50">
                <a onClick={ e=>{setActive(false)} } className="block p-5 text-md bg:text-white hover:bg-gray-100 border-b-2 border-gray-200" href="/#features">
                  Features
                </a>
                <a onClick={ e=>{setActive(false)} } className="block p-5 text-md bg:text-white hover:bg-gray-100 border-b-2 border-gray-200" href="/pricing">
                  Pricing
                </a>
                <a onClick={ e=>{setActive(false)} } className="block p-5 text-md bg:text-white hover:bg-gray-100 border-b-2 border-gray-200" href="/resources">
                  Docs & Guides
                </a>
                {
                  !user &&
                  <a onClick={ e=>{setActive(false)} } className="block p-5 text-md bg:text-white hover:bg-gray-100 font-semibold" href="/signin">
                    Sign In
                  </a>
                }
                <a onClick={ e=>{setActive(false)} } className="block p-5 text-md bg-primary border-b-primary-3 border-b-4 hover:bg-primary-2 font-semibold" href={ user ? '/dashboard' : '/signup' }>
                  { user ? 'Dashboard' : 'Get Started for Free' }
                </a>
              </div>
            }

            <div className="hidden lg:flex items-center justify-end">
              <a className="mr-1" href="https://github.com/Toppromoter-com/toppromoter" target="_blank" rel="noreferrer">
                <Github className={ `w-auto h-6 ${router?.pathname === '/' && 'text-white'}` } />
              </a>
              {
                user ?
                  <div className="flex-shrink-0">
                    <Button
                      small
                      primary
                      href="/dashboard">
                      <span>
                        View Dashboard
                      </span>
                    </Button>
                  </div>
                :
                  <div className="flex-shrink-0">
                    <a
                      href="/signin"
                      className={ navClass + ' mr-4' }>
                      Sign In
                    </a>
                    <Button
                      small
                      primary
                      href="/signup">
                      <span>
                        Get Started for Free
                      </span>
                    </Button>
                  </div>        
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;