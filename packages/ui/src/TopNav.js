import { useCompany } from '@/utils/CompanyContext';
import { classNames } from '@/utils/helpers';
import { useUser, handleActiveCompany } from '@/utils/useUser';
import Modal from '@/components/Modal';
import Logo from './Icons/Logo';
import { Menu, Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon, ChevronDownIcon, PlusIcon  } from '@heroicons/react/solid';
import {  UserCircleIcon, GiftIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, Fragment } from 'react';
import dynamic from 'next/dynamic';


export const TopNav = () => {
  const router = useRouter();
  const { signOut, userDetails, planDetails } = useUser();
  const { activeCompany, userCompanyDetails } = useCompany();
  const [showModal, setShowModal] = useState(false);
  const Company = dynamic(() => import('@/components/AddCompany'));

  const handleCompanySwitch = async (companyId) => {
    if(!companyId) return false;

    await handleActiveCompany(companyId).then((result) => {
      if(result === 'success'){
        router.push(`/dashboard/${companyId}`);
      }
    });
  };

  return (
    <div className="flex items-center justify-between flex-shrink-0 px-6 py-4 border-b-2 border-gray-100">
      <div className='flex items-end'>
        <Link href="/dashboard">
          <Logo width={ 180 } height={ 55 } />
        </Link>
      </div>
      <div className="flex justify-between items-center gap-3">
        { planDetails === 'free' &&
          <Link
            passHref
            href="/pricing"
            className='flex p-2 rounded-md text-primary'>
            <GiftIcon name='upgrade' className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
            <span className='font-black'>
              Upgrade
            </span>
          </Link>
        }
        { activeCompany &&
          <Listbox onChange={ value=>{handleCompanySwitch(value)} } value={ activeCompany?.company_id }>
            { ({ open }) => (
              <>
                <div className="relative">
                  <Listbox.Button className="relative w-[200px] bg-white rounded-md font-semibold pl-3 pr-10 py-2 flex text-left cursor-pointer focus:outline-none sm:text-sm border-2 border-gray-100">
                    <span className="flex items-center truncate text-primary font-bold">
                      { activeCompany?.company_name }
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    show={ open }
                    as={ Fragment }
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Listbox.Options
                      static
                      className="absolute rounded-md z-10 w-full bg-white max-h-60 text-base overflow-auto focus:outline-none sm:text-sm  border-2 border-gray-100 ">
                      { userCompanyDetails?.map((company) => (
                        <Listbox.Option
                          key={ company?.company_id }
                          className={ ({ selected, active }) =>
                            classNames(
                              selected && 'bg-primary text-white',
                              'cursor-pointer select-none relative py-3 px-3 hover:text-primary-2 hover:bg-primary-3'
                            )
                          }
                          value={ company?.company_id }>
                          { ({ selected, active }) => (
                            <>
                              <div className="flex">
                                <span className='font-semibold flex items-center truncate'>
                                  { company?.company_name }
                                </span>
                              </div>

                              { selected ? (
                                <span
                                  className="absolute inset-y-0 right-0 flex items-center mr-2">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null }
                            </>
                          ) }
                        </Listbox.Option>
                      )) }
                      <a onClick={ ()=> setShowModal(true) }
                        className="block font-extra-bold  py-3 px-3 cursor-pointer select-none border-t-2 relative -mt-1 hover:text-primary-2 hover:bg-primary-3">
                        <span className='flex text-primary font-black'>
                          <PlusIcon className="h-5 w-5" />
                          { ' ' }
                          Add company
                        </span>
                      </a>
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            ) }
          </Listbox>
        }
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
                          href={ process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL }
                          target="_blank"
                          className="block text-black font-semibold hover:text-primary-2 hover:bg-primary-3 cursor-pointer px-3 py-2"
                          rel="noreferrer">
                          Affiliate Dashboard 
                          { ' ' }
                        </a>
                      ) }
                    </Menu.Item>
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
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        }
      </div>
      { showModal && 
        <Modal modalOpen={ showModal } setModalOpen={ setShowModal }>
          <Company />
        </Modal>
      }
    </div>
  );
};

export default TopNav;