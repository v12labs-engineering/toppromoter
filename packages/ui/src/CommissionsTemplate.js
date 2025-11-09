import { Fragment, useState, useEffect } from 'react';
import { getSales, payCommissions, useUser } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import LoadingDots from '@/components/LoadingDots';
import Button from '@/components/Button'; 
import {
  EmojiSadIcon
} from '@heroicons/react/solid';
import { UTCtoString, priceStringDivided, checkUTCDateExpired, classNames } from '@/utils/helpers';
import ReactTooltip from 'react-tooltip';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, ExclamationIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { CSVDownload } from 'react-csv';
import toast from 'react-hot-toast';

export const CommissionsTemplate = ({ page }) => {
  const { activeCompany } = useCompany();
  const { planDetails } = useUser();
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [downloadCSV, setDownloadCSV] = useState(false);
  const [checkedAll, setCheckedAll] = useState(false);
  const [payingCommissions, setPayingCommissions] = useState(false);
  const router = useRouter();

  const sortOptions = [
    { name: 'All Commissions', href: `/dashboard/${activeCompany?.company_id}/commissions` },
    { name: 'Due', href: `/dashboard/${activeCompany?.company_id}/commissions/due` },
    { name: 'Pending', href: `/dashboard/${activeCompany?.company_id}/commissions/pending` },
    { name: 'Paid', href: `/dashboard/${activeCompany?.company_id}/commissions/paid` },
  ];
 
  if(commissions?.length === 0 && activeCompany?.company_id){
    getSales(activeCompany?.company_id, null, page).then(results => {
      if(results !== 'error' && results?.data?.length){
        setCommissions(results);
      }

      if(results === 'error'){
        console.warn('There was an error when getting data');
      }

      if(results?.data?.length === 0){
        setCommissions({'data': [], 'count': 0});
      }
    })
  }

  const paginatedResults = async () => {
    if(commissions?.count > commissions?.data?.length){
      setLoading(true);

      getSales(activeCompany?.company_id, commissions?.data[commissions?.data?.length-1]?.created, page).then(results => {
        if(results !== 'error' && results?.data?.length){
          let newCommissionsData = [...commissions?.data, ...results?.data]
          setCommissions({'data': newCommissionsData, 'count': commissions?.count});
        }
  
        if(results === 'error'){
          console.warn('There was an error when getting data');
        }

        setLoading(false);
      })
    }
  };

  const checkAllItems = () => {
    if(checkedAll === true){
      setCheckedItems([]);
      setCheckedAll(false);
    } else {
      let commissionIds = [];
      let filteredCommissions = commissions?.data?.filter(commission => commission?.paid_at === null && checkUTCDateExpired(commission?.commission_due_date) === true);

      if(filteredCommissions?.length){
        filteredCommissions?.map(commission => {
          commissionIds.push(commission?.commission_id);
        })
      }

      setCheckedItems(commissionIds);
      setCheckedAll(true);
    }
  };

  const markAsPaid = async () => {
    setPayingCommissions(true);
    
    payCommissions(activeCompany?.company_id, checkedItems, commissions?.data).then(results => {
      if(results === 'success'){
        toast.success(`Successfully marked ${checkedItems.length ? checkedItems.length : 'all eligible commissions as paid'}`);
        setCheckedItems([]);
        setCheckedAll(false);
        setPayingCommissions(false);
        router.push(`/dashboard/${activeCompany?.company_id}/commissions/paid`);
      } else {
        toast.error('There was an error when marking the commissions as paid.');
      }
    });
  };

  let newCSVDownloadItems = [];
  if(commissions?.data?.length > 0){
    if(checkedItems?.length === 0){
      commissions?.data?.map(commission => {
        newCSVDownloadItems.push([ 
          commission?.affiliate?.details?.paypal_email,
          priceStringDivided(commission?.commission_sale_value, activeCompany?.company_currency),
          commission?.commission_id,
          activeCompany?.company_currency,
          `This is a commission payment from ${activeCompany?.company_name} for commission ${commission?.commission_id}`
        ]);
      })
    } else {
      commissions?.data?.map(commission => {
        checkedItems?.map(checkedItem => {
          if(commission?.commission_id === checkedItem){
            newCSVDownloadItems.push([ 
              commission?.affiliate?.details?.paypal_email,
              priceStringDivided(commission?.commission_total, activeCompany?.company_currency),
              commission?.commission_id,
              activeCompany?.company_currency,
              `This is a commission payment from ${activeCompany?.company_name} for commission ${commission?.commission_id}`
            ]);
          }
        })
      })
    }
  }

  useEffect(() => {
    if(downloadCSV === true){
      setTimeout(() => {
        setDownloadCSV(false);
      }, 1000);
    }
  }, [downloadCSV])

  return (
    <>
      <div className="mb-8">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold mb-3">
            { page === 'index' ? 'All' : page === 'due' ? 'Due' : page === 'pending' ? 'Pending' : page === 'paid' && 'Paid' }
            { ' ' }
            Sales & Commissions
          </h1>
          <p>
            Commissions are generated when your affiliates send you a paying customer.
          </p>
        </div>
      </div>
      <div className="wrapper">
        <div className="mb-5">
          <Menu as="div" className="relative z-10 inline-block text-left">
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
          commissions && commissions?.data?.length > 0 ?
            <div>
              <div className={ `${page !== 'index' && page !== 'pending' && 'mb-6'} sm:flex sm:items-center` }>
                {
                    page === 'due' &&
                    <Button
                      disabled={ payingCommissions }
                      onClick={ e=>{markAsPaid()} }
                      small
                      primary
                      className="mb-3 sm:mr-3 sm:mb-0">
                      { payingCommissions ? 'Marking' : 'Mark' } 
                      { ' ' }
                      { checkedItems.length === 0 ? 'all' : checkedItems.length } 
                      { ' ' }
                      { checkedItems?.length > 1 ? 'commissions' : checkedItems?.length === 0 ? 'commissions' : 'commission' }
                      { ' ' }
                      as paid
                      { ' ' }
                      { payingCommissions && '...' }
                    </Button>
                  }
                {
                    page !== 'index' && page !== 'pending' &&
                    <Button
                      onClick={ e=>{setDownloadCSV(true)} }
                      small
                      gray>
                      Export 
                      { ' ' }
                      { checkedItems.length === 0 ? 'all' : checkedItems.length } 
                      { ' ' }
                      { checkedItems?.length > 1 ? 'commissions' : checkedItems?.length === 0 ? 'commissions' : 'commission' }
                      { ' ' }
                      as PayPal CSV
                    </Button> 
                  }
              </div>
              {
                  page !== 'paid' && page !== 'due' && commissions?.data?.filter(commission => commission?.paid_at === null && checkUTCDateExpired(commission?.commission_due_date) === true)?.length > 0 &&
                  <div className="mb-6">
                    <a href={ `/dashboard/${router?.query?.companyId}/commissions/due` } className="inline-block bg-red-500 hover:bg-red-600 border-l-4 border-red-600 p-4 rounded-xl">
                      <div className="flex items-center">
                        <ExclamationIcon className="h-6 w-auto text-white" aria-hidden="true" />
                        <span className="font-semibold text-base text-white ml-2 mb-1">
                          You have 
                          { ' ' }
                          { commissions?.data?.filter(commission => commission?.paid_at === null && checkUTCDateExpired(commission?.commission_due_date) === true)?.length }
                          { ' ' }
                          sales with due commissions
                        </span>
                      </div>
                    </a>
                  </div>
                }
              <div className="flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden border-2 border-gray-100 rounded-md">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="border-b-2 border-gray-100">
                          <tr>
                            {
                                page === 'due' &&
                                <th scope="col" className="pl-4 pr-3 text-left text-sm font-bold">
                                  <input
                                    id="campaign_public"
                                    name="campaign_public"
                                    type="checkbox"
                                    className="focus:ring-primary h-5 w-5 text-primary rounded-md cursor-pointer"
                                    onClick={ (e) => {
                                      checkAllItems()
                                    } } 
                                  />
                                </th>
                              }
                            {
                                page !== 'due' &&
                                <th data-tip="The total amount received, after any deductions for refunds and discounts." scope="col" className="px-3 py-3.5 text-sm text-left font-semibold">
                                  Amount
                                </th>
                              }
                            <th data-tip="The amount due to your affiliate." scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                              { page !== 'due' ? 'Commission Due' : 'Total Due' }
                            </th>
                            {
                                planDetails === 'free' &&
                                <th data-tip="This is a 9% commission due to Toppromoter, since you are on the Pay As You Go plan. Upgrade your plan today to remove commission fees." scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                                  Toppromoter Fee (9%)
                                </th>
                              }
                            {
                                page !== 'due' &&
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                                  Products
                                </th>
                              }
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                              Referrer
                            </th>
                            {
                                page !== 'index' && page !== 'pending' &&
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                                  PayPal Email
                                </th>
                              }
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                              Referral ID
                            </th>
               
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                              Created
                            </th>
                            {
                                page === 'paid' &&
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                                  Date Paid
                                </th>
                              }
                            {
                                page !== 'due' && page !== 'paid' &&
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold">
                                  Status
                                </th>
                              }
                          </tr>
                        </thead>
                        <tbody className="bg-white text-sm">
                          { commissions?.data?.map((sale) => (
                            <tr key={ sale?.commission_id }>
                              {
                                  page === 'due' &&
                                  <td className="whitespace-nowrap pl-4 pr-3  text-sm">
                                    <div className="flex items-center h-5">
                                      <input
                                        disabled={ sale?.paid_at !== null || checkUTCDateExpired(sale?.commission_due_date) === false }
                                        id="campaign_public"
                                        name="campaign_public"
                                        type="checkbox"
                                        className='focus:ring-primary h-5 w-5 text-primary rounded-md cursor-pointer'
                                        onClick={ (e) => {
                                          checkedItems.includes(sale?.commission_id) ?
                                            setCheckedItems([...checkedItems.filter(item => item !== sale?.commission_id)]) 
                                          :
                                            setCheckedItems([
                                              ...checkedItems,
                                              sale?.commission_id
                                            ])
                                        } } 
                                        checked={ checkedItems.includes(sale?.commission_id) === true }
                                      />
                                    </div>
                                  </td>
                                }
                              {
                                  page !== 'due' &&
                                  <td className="whitespace-nowrap px-3 py-4 text-sm sm:pl-6">
                                    <span>
                                      { priceStringDivided(sale?.commission_sale_value, activeCompany?.company_currency) }
                                    </span>
                                  </td>
                                }
                              <td className={ `whitespace-nowrap px-3 py-4 font-semibold ${checkUTCDateExpired(sale?.commission_due_date) === true && 'text-red-500'}` }>
                                <span>
                                  { priceStringDivided(sale?.commission_total, activeCompany?.company_currency) }
                                </span>
                              </td>
                              {
                                  planDetails === 'free' &&
                                  <td className={ `whitespace-nowrap px-3 py-4 font-semibold ${checkUTCDateExpired(sale?.commission_due_date) === true && 'text-red-500'}` }>
                                    <span>
                                      { priceStringDivided(((9/100)*sale?.commission_sale_value).toFixed(2), activeCompany?.company_currency) }
                                    </span>
                                  </td>
                                }
                              {
                                  page !== 'due' &&
                                  <td className="px-3 py-4 text-sm max-w-xs break-all">
                                    { sale?.commission_description ?? 'N/A' }
                                  </td>
                                }
                              <td className="whitespace-nowrap px-3 py-4">
                                <span>
                                  { sale?.affiliate?.details?.email }
                                </span>
                              </td>
                              {
                                  page !== 'index' && page !== 'pending' &&
                                  <td className="whitespace-nowrap px-3 py-4">
                                    <span>
                                      { sale?.affiliate?.details?.paypal_email ?? 'Not set' }
                                    </span>
                                  </td>
                                }
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                { sale?.referral_id }
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <div data-tip={ sale?.created }>
                                  { UTCtoString(sale?.created) }
                                </div>
                              </td>
                              {
                                  page === 'paid' && sale?.paid_at &&
                                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    <div data-tip={ sale?.paid_at }>
                                      { UTCtoString(sale?.paid_at) }
                                    </div>
                                  </td>
                                }
                              {
                                  page !== 'due' && page !== 'paid' &&
                                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    <div data-tip={ `${sale?.paid_at !== null ? 'Paid at '+sale?.paid_at+'' : checkUTCDateExpired(sale?.commission_due_date) === true ? 'Unpaid' : 'Not valid to be paid out yet, due '+sale?.commission_due_date+''}` } className={ `${sale?.paid_at !== null ? 'bg-gray-500 text-white' : checkUTCDateExpired(sale?.commission_due_date) === true ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'} 'bg-gray-500 text-white'} inline-flex rounded-md px-3 py-1 text-xs font-semibold leading-5` }>
                                      { sale?.paid_at !== null ? 'Paid' : checkUTCDateExpired(sale?.commission_due_date) === true ? 'Unpaid' : 'Not payable yet' }
                                    </div>
                                  </td>
                                }
                            </tr>
                            )) }
                        </tbody>
                      </table>
                      <ReactTooltip />
                    </div>
                    <div className="mt-2">
                      <span className="text-xs">
                        { `Showing ${commissions?.data?.length} of ${commissions?.count} total commissions.` }
                      </span>
                    </div>
                    {
                        commissions?.count > commissions?.data?.length &&
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
            : commissions?.data?.length === 0 ?
              <div>
                <div
                  className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <EmojiSadIcon className="w-10 h-auto mx-auto text-gray-600" />
                  <span className="mt-2 block text-sm font-medium text-gray-600">
                    You have no
                    { ' ' }
                    { page !== 'index' && page }
                    { ' ' }
                    commissions yet.
                  </span>
                </div>
              </div>
          :
              <LoadingDots className='mx-auto my-0' />
        }
      </div>
      {
        downloadCSV === true &&
        <CSVDownload data={ newCSVDownloadItems } target="_blank" />
      }
    </>
  );
};

export default CommissionsTemplate;