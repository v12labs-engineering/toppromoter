import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { useUser, getReferrals } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import LoadingDots from '@/components/LoadingDots';
import Button from '@/components/Button'; 
import { SEOMeta } from '@/templates/SEOMeta'; 
import { EmojiSadIcon, ChevronDownIcon, PencilIcon  } from '@heroicons/react/solid';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { UTCtoString, checkUTCDateExpired, priceString, classNames, postData } from '@/utils/helpers';
import ReactTooltip from 'react-tooltip';
import Modal from '@/components/Modal';
import toast from 'react-hot-toast';
import { Menu, Transition } from '@headlessui/react';

export const ReferralsTemplate = ({ page }) => {
  const router = useRouter();
  const { session } = useUser();
  const { activeCompany } = useCompany();
  const [referrals, setReferrals] = useState([]);
  const [refId, setReferralId] = useState(null);
  const [invoiceTotal, setInvoiceTotal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);

  const sortOptions = [
    { name: 'All Referrals', href: `/dashboard/${activeCompany?.company_id}/referrals` },
    { name: 'Expired', href: `/dashboard/${activeCompany?.company_id}/referrals/expired` },
    { name: 'Visited Link', href: `/dashboard/${activeCompany?.company_id}/referrals/visited-link` },
    { name: 'Signed Up', href: `/dashboard/${activeCompany?.company_id}/referrals/signed-up` },
    { name: 'Converted', href: `/dashboard/${activeCompany?.company_id}/referrals/converted` },
  ];
 
  if(referrals?.length === 0 && activeCompany?.company_id){
    getReferrals(activeCompany?.company_id, null, page).then(results => {
      if(results !== 'error' && results?.data?.length){
        setReferrals(results);
      }

      if(results === 'error'){
        console.warn('There was an error when getting data');
      }

      if(results?.data?.length === 0){
        setReferrals({'data': [], 'count': 0});
      }
    })
  }

  const paginatedResults = async () => {
    if(referrals?.count > referrals?.data?.length){
      setLoading(true);

      getReferrals(activeCompany?.company_id, referrals?.data[referrals?.data?.length-1]?.created, page).then(results => {
        if(results !== 'error' && results?.data?.length){
          let newReferralsData = [...referrals?.data, ...results?.data]
          setReferrals({'data': newReferralsData, 'count': referrals?.count});
        }
  
        if(results === 'error'){
          console.warn('There was an error when getting data');
        }

        setLoading(false);
      })
    }
  }

  const manualConversion = async () => {
    try {
      if (refId) {
        setConverting(true)
        await postData({
          url: `/api/referrals/manual-conversion`,
          data: { 
            referralId: refId,
            invoiceTotal
          },
          token: session.access_token
        });
        setReferralId(null);
        setConverting(false);
        setShowModal(false);
        toast.success('Sale created manually');
      } else {
        console.warn('Select referral id');
        setConverting(false);
      }
    } catch(e) {
      toast.error('Something went wrong while creating sale');
    } finally {
      setConverting(false);
      setReferralId(null);
    }
  }

  return (
    <>
      <SEOMeta title="Referrals" />
      <div className="mb-8">
        <div className="pt-10 wrapper flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold mb-3 capitalize">
              { page === 'index' ? 'All' : page.replace('-', ' ') }
              { ' ' }
              Referrals
            </h1>
            <p>
              Referrals are tracked when a cookie has been successfully placed on the users device.
            </p>
          </div>
          <Button
            href={ `/dashboard/${router?.query?.companyId}/referrals/create` }
            small
            outline>
            <span className='flex items-center'>
              <PlusCircleIcon className="h-5 w-5 mr-1" />
              Create referral
            </span>
          </Button>
        </div>
      </div>
      <div className="wrapper">
        <div className="mb-5">
          <Menu as="div" className="relative z-[99] inline-block text-left">
            <div>
              <Menu.Button className="group inline-flex items-center justify-center bg-white rounded-md py-2 px-5 border-2 border-gray-100">
                <span className="font-bold text-primary">
                  Filter
                </span>
                <ChevronDownIcon
                  className="flex-shrink-0 ml-1 h-4 w-4"
                  aria-hidden="true"
                />
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
              <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div>
                  { sortOptions.map((option) => (
                    <Menu.Item key={ option }>
                      <a
                        href={ option.href }
                        className={ classNames(
                          option.href === router.asPath ? 'text-primary bg-primary-3 font-semibold' : '',
                          'block px-3 py-2 hover:text-primary-2 hover:bg-primary-3 cursor-pointer'
                        ) }>
                        { option.name }
                      </a>
                    </Menu.Item>
                  )) }
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <div className="wrapper">
        {
          referrals && referrals?.data?.length > 0 ?
            <div>
              <div className="flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden border-2 border-gray-100 rounded-lg">
                      <table className="min-w-full">
                        <thead className="border-b-2 border-gray-100">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-bold sm:pl-6">
                              Referral ID
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                              Referrer
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                              Signup Email/ID
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                              Campaign
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                              Commission Amount
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                              Status
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                              Date Created
                            </th>
                          </tr>
                        </thead>
                        <tbody className=" bg-white text-sm ">
                          { referrals?.data?.map((referral) => (
                            <tr key={ referral?.referral_id }>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                <span>
                                  { referral?.referral_id }
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span>
                                  { referral?.affiliate?.details }
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span>
                                  { referral?.referral_reference_email }
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                {
                                    referral?.campaign?.campaign_name ?
                                      <a href={ `/dashboard/${router?.query?.companyId}/campaigns/${referral?.campaign_id}` } className="font-bold underline">
                                        { referral?.campaign?.campaign_name }
                                      </a>
                                    :
                                      <p className="font-semibold text-gray-600 italic">
                                        This campaign is no longer available.
                                      </p>
                                  }
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                { referral?.commission_type === 'percentage' ? `${referral?.commission_value}%` : `${priceString(referral?.commission_value, activeCompany?.company_currency)}` }
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                {
                                    referral?.referral_converted === true ?
                                      <div className={ 'bg-success text-white inline-flex rounded-md px-3 py-1 text-xs font-semibold leading-5' }>
                                        Converted
                                      </div>
                                    : referral?.referral_reference_email !== null ?
                                      <div className={ 'bg-orange-400 text-white inline-flex rounded-md px-3 py-1 text-xs font-semibold leading-5' }>
                                        Signed up
                                      </div>
                                    :
                                      <div data-tip={ `${checkUTCDateExpired(referral?.referral_expiry) === true ? 'Expired' : 'Expires'} at ${referral?.referral_expiry}` } className={ `${checkUTCDateExpired(referral?.referral_expiry) === true ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'} 'bg-gray-500 text-white'} inline-flex rounded-md px-3 py-1 text-xs font-semibold leading-5` }>
                                        { checkUTCDateExpired(referral?.referral_expiry) === true ? 'Expired' : 'Visited link' }
                                      </div>
                                  }
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <div data-tip={ referral?.created }>
                                  { UTCtoString(referral?.created) }
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <button onClick={ e=>{setShowModal(true); setReferralId(referral?.referral_id);} }>
                                  <PencilIcon className="w-5 h-auto" />
                                </button>
                              </td>
                            </tr>
                          )) }
                        </tbody>
                      </table>
                      <ReactTooltip />
                    </div>
                    <div className="mt-2">
                      <span className="text-xs">
                        { `Showing ${referrals?.data?.length} of ${referrals?.count} total referrals.` }
                      </span>
                    </div>
                    {
                        referrals?.count > referrals?.data?.length &&
                        <div className="mt-8 flex justify-center">
                          <Button
                            disabled={ loading }
                            onClick={ e=>{paginatedResults()} }
                            small
                            gray>
                            <span>
                              { loading ? 'Loading...' : 'Load more' }
                            </span>
                          </Button>
                        </div>
                      }
                  </div>
                </div>
              </div>
            </div>
            :
              referrals?.data?.length === 0 ?
                <div>
                  <div
                    className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <EmojiSadIcon className="w-10 h-auto mx-auto text-gray-600" />
                    <span className="mt-2 block text-sm font-medium text-gray-600">
                      You have no referrals yet.
                    </span>
                  </div>
                </div>
          :
                <LoadingDots className='mx-auto my-0'/>
        }
      </div>
      {
        showModal && 
        <Modal modalOpen={ showModal } setModalOpen={ setShowModal }>
          <h1 className='font-semibold text-2xl'>Update Referral Status(to &quot;Converted&quot;)</h1>
          <div className="pt-6">
            <p className='py-5'>
              <span className='font-bold'>Note: </span>Use this feature only when needed, most of it is done automatically once a customer purchases a product on your platform.
            </p>
            <label htmlFor="commission_value" className="block text-sm font-bold text-gray-700">
              Total Amount
            </label>
            <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
              <span className="mt-1 bg-gray-200 p-2 rounded-md shadow-sm sm:text-sm border border-r-0 focus:outline-none sm:text-md rounded-tr-none rounded-br-none border-gray-300 focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                { activeCompany?.company_currency }
              </span>
              <input
                minLength="1"
                maxLength="100"
                required
                placeholder="Enter the price of the product, we will calculate commission automatically"
                type="number"
                name="commission_value"
                id="commission_value"
                autoComplete="commission_value"
                onChange={(e) => setInvoiceTotal(e.target.value)}
                className="mt-1 block w-full rounded-md rounded-tl-none rounded-bl-none border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="bg-white relative text-right mt-5">
              <Button
                small
                primary
                onClick={manualConversion}
                disabled={ loading }>
                <span>
                  { converting ? 'Converting...' : 'Convert' }
                </span>
              </Button>
            </div>
          </div>
        </Modal>
      }
    </>
  );
}