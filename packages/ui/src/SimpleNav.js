import {  Fragment } from 'react';
import { Logo } from './Icons/Logo';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon  } from '@heroicons/react/solid';
import {  UserCircleIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useUser } from '@/utils/useUser';

export const SimpleNav = (props) => {
  const { signOut, userDetails } = useUser();

  return(
    <nav className="flex items-center justify-between flex-shrink-0 px-6 py-4 border-b-2 border-gray-100">
      <Link href="/">
         <Logo  width={ 180 } height={ 55 } />
      </Link>
      { userDetails && 
          <div className='flex justify-between items-center hover:text-primary-2 cursor-pointer px-3 py-2 rounded-md'>
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="inline-flex w-full justify-center align-middle items-center">
                  <UserCircleIcon className="h-6 w-6 mr-1" aria-hidden="true" />
                  <span className='font-bold tracking-tight'>
                    { userDetails?.full_name || userDetails?.email }
                  </span>
                  <ChevronDownIcon className="mt-[2px] ml-2 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
              </div>
              <Transition
                as={ Fragment }
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right border-2 border-gray-100 rounded-md bg-white ">
                  <div className="py-1">
                    <Menu.Item>
                      { () => (
                        <a
                          href="#"
                          onClick={ signOut }
                          className="block text-black font-semibold hover:text-primary-2 hover:bg-primary-3 cursor-pointer px-3 py-2">
                          Sign Out
                        </a>
                ) }
                    </Menu.Item>
                    {/* <Menu.Item>
                      { () => (
                        <a
                          href={ process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL }
                          target="_blank"
                          className="block text-black font-semibold hover:text-primary-2 hover:bg-primary-3 cursor-pointer px-3 py-2"
                          rel="noreferrer">
                          Affiliate Dashboard 
                          { ' ' }
                        </a>
                ) }
                    </Menu.Item> */}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        }
    </nav>
  )
};

export default SimpleNav;