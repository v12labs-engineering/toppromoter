import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { editCampaign, newCampaign, useUser } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import Button from '@/components/Button';
import LoadingDots from '@/components/LoadingDots';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export const CampaignForm = ({ edit, setupMode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rewardType, setRewardType] = useState('percentage');
  const [discountType, setDiscountType] = useState('percentage');
  const { activeCompany } = useCompany();
  const { userDetails } = useUser();
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(loading === true){
      return false;
    }

    const formData = new FormData(e.target);
    const data = {};
 
    for (let entry of formData.entries()) {
      data[entry[0]] = entry[1];
    }

    if(data?.default_campaign === 'on'){
      data.default_campaign = true;
    } else {
      data.default_campaign = false;
    }

    setLoading(true);

    if(edit){
      await editCampaign(userDetails, edit?.campaign_id, data).then((result) => {
        if(result === 'success'){
          router.push(`/dashboard/${router?.query?.companyId}/campaigns/${edit?.campaign_id}`)
        } else {
          toast.error('There was an error when creating your campaign, please try again later.');
        }
  
        setLoading(false);
      });

    } else {

      await newCampaign(userDetails, data, router?.query?.companyId).then((result) => {
        if(result === 'success'){
          if(setupMode){
            router.push(`/dashboard/${router?.query?.companyId}/setup/add`)
          } else {
            router.push(`/dashboard/${router?.query?.companyId}/campaigns`)
          }
        } else {
          toast.error('There was an error when creating your campaign, please try again later.');
        }
  
        setLoading(false);
      });

    }
  };

  // if(edit && edit?.commission_type !== null && edit?.commission_type !== rewardType){
  //   setRewardType(edit?.commission_type);
  // }

  // if(edit && edit?.discount_type !== null && edit?.discount_type !== discountType){
  //   setDiscountType(edit?.discount_type);
  // }

  return(
    <div className='w-128'>
      {
        activeCompany?.company_name ?
          <form className="bg-white sm:overflow-hidden rounded-md border-2 border-gray-100" action="#" method="POST" onSubmit={ handleSubmit }>
            <div className="px-6 pt-8 pb-8">
              <div className="space-y-8">
                <div>
                  <div>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-12">
                        <label htmlFor="campaign_name" className="block text-sm font-bold text-gray-700">
                          Campaign Name
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            minLength="2"
                            required
                            defaultValue={ edit ? edit?.campaign_name : `${activeCompany?.company_name}'s Affiliate Campaign` }
                            type="text"
                            name="campaign_name"
                            id="campaign_name"
                            autoComplete="campaign_name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-12">
                        <label htmlFor="commission_type" className="block text-sm font-bold text-gray-700">
                          Reward type
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <select defaultValue={ rewardType ? rewardType : edit && edit?.commission_type } onChange={ e=>{setRewardType(e.target.value)} } className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required="required" name="commission_type" id="commission_type">
                            <option value="percentage">
                              Percentage of sale
                            </option>
                            <option value="fixed">
                              Fixed amount
                            </option>
                          </select>
                        </div>
                      </div>

                      { rewardType === 'percentage' &&
                        <div className="sm:col-span-12">
                          <label htmlFor="commission_value" className="block text-sm font-bold text-gray-700">
                            Commission percentage
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                            <input
                              minLength="1"
                              maxLength="100"
                              required
                              placeholder="20"
                              type="number"
                              name="commission_value"
                              id="commission_value"
                              defaultValue={ edit?.commission_value ?  edit?.commission_value : 20 }
                              autoComplete="commission_value"
                              className="mt-1 block w-full rounded-md border border-r-0 rounded-r-none border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <span className="mt-1 bg-gray-200 p-2 rounded-md shadow-sm sm:text-sm border border-l-0 focus:outline-none sm:text-md rounded-tl-none rounded-bl-none border-gray-300 focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                              %
                            </span>
                          </div>
                        </div>
                      }

                      { rewardType === 'fixed' &&
                        <div className="sm:col-span-12">
                          <label htmlFor="commission_value" className="block text-sm font-bold text-gray-700">
                            Amount
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                            <span className="mt-1 bg-gray-200 p-2 rounded-md shadow-sm sm:text-sm border border-r-0 focus:outline-none sm:text-md rounded-tr-none rounded-br-none border-gray-300 focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                              { activeCompany?.company_currency }
                            </span>
                            <input
                              minLength="1"
                              maxLength="100"
                              required
                              placeholder="1"
                              type="number"
                              name="commission_value"
                              id="commission_value"
                              defaultValue={ edit?.commission_value ?  edit?.commission_value : 20 }
                              autoComplete="commission_value"
                              className="mt-1 block w-full rounded-md rounded-tl-none rounded-bl-none border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                          </div>
                        </div>
                      }

                      { showAdvancedOptions &&
                      <>
                        <div className="sm:col-span-12">
                          <label htmlFor="cookie_window" className="block text-sm font-bold text-gray-700">
                            Cookie window
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                            <input
                              minLength="1"
                              maxLength="100"
                              required
                              type="number"
                              name="cookie_window"
                              id="cookie_window"
                              defaultValue={ edit?.cookie_window ? edit?.cookie_window : 60 }
                              className="mt-1 block w-full rounded-md border border-r-0 rounded-r-none border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <span className="mt-1 bg-gray-200 p-2 rounded-md shadow-sm sm:text-sm border border-l-0 focus:outline-none sm:text-md rounded-tl-none rounded-bl-none border-gray-300 focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                              days
                            </span>
                          </div>
                        </div>
                        <div className="sm:col-span-12">
                          <label htmlFor="commission_period" className="block text-sm font-bold text-gray-700">
                            Commission period
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                            <input
                              minLength="1"
                              maxLength="240"
                              required
                              placeholder="12"
                              type="number"
                              name="commission_period"
                              id="commission_period"
                              defaultValue={ edit && edit?.commission_period }
                              className="mt-1 block w-full rounded-md border border-r-0 rounded-r-none border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <span className="mt-1 whitespace-nowrap bg-gray-200 p-2 rounded-md shadow-sm sm:text-sm border border-l-0 focus:outline-none sm:text-md rounded-tl-none rounded-bl-none border-gray-300 focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                              months after the first sale
                            </span>
                          </div>
                        </div>
                        <div className="sm:col-span-12">
                          <label htmlFor="minimum_days_payout" className="block text-sm font-bold text-gray-700">
                            Minimum days before payout
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                            <input
                              minLength="1"
                              maxLength="90"
                              required
                              placeholder="30"
                              type="number"
                              name="minimum_days_payout"
                              id="minimum_days_payout"
                              defaultValue={ edit?.minimum_days_payout ? edit?.minimum_days_payout : 30 }
                              className="mt-1 block w-full rounded-md border border-r-0 rounded-r-none border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <span className="mt-1 bg-gray-200 p-2 rounded-md shadow-sm sm:text-sm border border-l-0 focus:outline-none sm:text-md rounded-tl-none rounded-bl-none border-gray-300 focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                              days
                            </span>
                          </div>
                        </div>
                      </>
                      }

                      <div className="sm:col-span-12 mt-2">
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="campaign_public"
                              name="campaign_public"
                              type="checkbox"
                              className="focus:ring-primary h-5 w-5 text-primary rounded-md cursor-pointer"
                              defaultChecked={ edit && edit?.campaign_public === false ? false : true }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="campaign_public" className="text-sm font-bold text-gray-700 cursor-pointer">
                              Campaign is publicly joinable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <Button
                className='-ml-4 mt-5'
                onClick={ e => {
                  showAdvancedOptions ? setShowAdvancedOptions(false) : setShowAdvancedOptions(true);
                  e.preventDefault();
                } }
                small
                ghost>
                <span>
                  { showAdvancedOptions ? 
                    <span className='flex ml-4 mt-2'>
                      Hide advanced options
                      { ' ' }
                      <ChevronUpIcon className='w-5 h-5 mt-1' />
                    </span> : (
                      <span className='flex ml-4 mt-2'>
                        Show advanced options
                        { ' ' }
                        <ChevronDownIcon className='w-5 h-5 mt-1' />
                      </span>
                ) }
                </span>
              </Button>
            </div>
            <hr />
            <div className="px-6 py-10">
              <div className="sm:col-span-12">
                <div>
                  <p className="text-xl font-bold mb-1">
                    Give new customers a discount (optional)
                  </p>
                  <p className="text-md mb-5">
                    Enter the details of a discount code that has already been created in your payment processor (e.g. Stripe, Paddle). Adding a discount code
                    { ' ' }
                    <span className="font-semibold">
                      greatly increases conversion rates
                    </span>
                    { ' ' }
                    for both referral sales, and EU based users giving cookie consent.
                  </p>
                  <div>
                    <div className="space-y-4">
                      <div className="mt-1 rounded-md shadow-sm">
                        <label htmlFor="discount_type" className="block text-sm font-bold text-gray-700">
                          Discount type
                        </label>
                        <select defaultValue={ discountType ? discountType : edit && edit?.discount_type } onChange={ e=>{setDiscountType(e.target.value)} } className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required="required" name="discount_type" id="discount_type">
                          <option value="percentage">
                            Percentage
                          </option>
                          <option value="fixed">
                            Fixed amount
                          </option>
                        </select>
                      </div>
                      <div className="mt-1 rounded-md shadow-sm">
                        <label htmlFor="discount_code" className="block text-sm font-bold text-gray-700">
                          Discount code
                        </label>
                        <input
                          minLength="1"
                          maxLength="100"
                          placeholder="e.g. 10OFF"
                          type="text"
                          name="discount_code"
                          id="discount_code"
                          defaultValue={ edit && edit?.discount_code }
                          autoComplete="discount_code"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>

                      {
                        discountType === 'percentage' &&
                        <div className="mt-1 rounded-md shadow-sm w-full">
                          <label htmlFor="discount_value" className="block text-sm font-bold text-gray-700">
                            Discount percentage
                          </label>
                          <div className='mt-1 flex rounded-md shadow-sm items-center justify-between'>
                            <input
                              minLength="1"
                              maxLength="100"
                              placeholder="15"
                              type="number"
                              name="discount_value"
                              id="discount_value"
                              defaultValue={ edit && edit?.discount_value }
                              autoComplete="discount_value"
                              className="mt-1 block w-full rounded-md border border-r-0 rounded-r-none border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <span className="mt-1 bg-gray-200 p-2 rounded-md shadow-sm sm:text-sm border border-l-0 focus:outline-none sm:text-md rounded-tl-none rounded-bl-none border-gray-300 focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                              %
                            </span>
                          </div>
                        </div>
                      }

                      {
                        discountType === 'fixed' &&
                        <div className="mt-1  rounded-md w-full shadow-sm">
                          <label htmlFor="discount_value" className="block text-sm font-bold text-gray-700">
                            Discount amount
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                            <span className="mt-1 bg-gray-200 p-2 rounded-md shadow-sm sm:text-sm border border-r-0 focus:outline-none sm:text-md rounded-tr-none rounded-br-none border-gray-300 focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                              { activeCompany?.company_currency }
                            </span>
                            <input
                              minLength="1"
                              maxLength="100"
                              placeholder="15"
                              type="number"
                              name="discount_value"
                              id="discount_value"
                              defaultValue={ edit && edit?.discount_value }
                              autoComplete="discount_value"
                              className="mt-1 block w-full rounded-md rounded-tl-none rounded-bl-none border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-2">
              <div className="sm:col-span-12">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="default_campaign"
                      name="default_campaign"
                      type="checkbox"
                      className="focus:ring-primary h-5 w-5 text-primary rounded-md cursor-pointer"
                      defaultChecked={ setupMode === true ? true : edit && edit?.default_campaign ? true : false }
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="default_campaign" className="font-bold text-gray-700 cursor-pointer">
                      Set as default campaign
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-8 bg-white flex items-center text-white justify-start relative">
              <Button
                small
                primary
                disabled={ loading }>
                <span>
                  { loading ? edit ? 'Editing Campaign...' : 'Creating Campaign...' : edit ? 'Save Changes' : 'Create Campaign' }
                </span>
              </Button>
            </div>
          </form>
        :
          <LoadingDots />
      }
    </div>
  )
};

export default CampaignForm;