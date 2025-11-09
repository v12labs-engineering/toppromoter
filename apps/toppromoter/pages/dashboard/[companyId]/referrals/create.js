import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUser } from '@/utils/useUser';
import Button from '@/components/Button'; 
import { useCompany } from '@/utils/CompanyContext';
import { useCampaign } from '@/utils/CampaignContext';
import { SEOMeta } from '@/templates/SEOMeta'; 
import { postData } from 'utils/helpers';
import LoadingDots from '@/components/LoadingDots';
import {
  ArrowNarrowLeftIcon
} from '@heroicons/react/outline';
import setupStepCheck from '@/utils/setupStepCheck';
import toast from 'react-hot-toast';

export default function ReferralCreatePage() {
  setupStepCheck('light');
  
  const router = useRouter();
  const { session } = useUser();
  const { activeCompany } = useCompany();
  const { userCampaignDetails } = useCampaign();
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const { response } = await postData({
        url: '/api/referrals/create',
        data: { 
          companyId: router?.query?.companyId,
          campaignId: data?.campaign_id,
          teamId: activeCompany?.team_id,
          affiliateId: data?.affiliate_id,
          emailAddress: data?.email_address,
          stripeAccountId: activeCompany?.stripe_id,
          orderId: data?.order_id ? data?.order_id : null,
        },
        token: session.access_token
      });

      if(response !== 'error'){
        setErrorMessage(false);
        
        if(response === 'referral_success'){
          toast.success('Referral successfully created');
        } else if(response === 'commission_success'){
          toast.success('Referral and commission successfully created');
        }

        router.push(`/dashboard/${router?.query?.companyId}/referrals`);
      }

      setErrorMessage(true);
      setLoading(false);

    } catch (error) {
      setLoading(false);
      setErrorMessage(true);
    }
  };

  return (
    <>
      <SEOMeta title="Create manual referral" />
      <div className="py-8">
        <div className="wrapper">
          <Button
            href={ `/dashboard/${router?.query?.companyId}/referrals` }
            small
            ghost>
            <ArrowNarrowLeftIcon className="mr-2 w-6 h-auto" />
            <span>
              Back to referrals
            </span>
          </Button>
        </div>
      </div>
      <div className="mb-6">
        <div className="wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">
            Create a manual referral
          </h1>
        </div>
      </div>
      <div className="wrapper">
        {
          activeCompany ?
            <div className='w-128 rounded-md border-2 border-gray-100'>
              <form className="bg-white max-w-2xl overflow-hidden" action="#" method="POST" onSubmit={ handleSubmit }>
                <div className="p-6">
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="campaign_id" className="tex-sm font-semibold text-gray-900 mb-3 block">
                        Select a campaign
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required="required" name="campaign_id" id="campaign_id">
                          {
                            userCampaignDetails?.map(campaign => {
                              return(
                                <option value={ campaign?.campaign_id }>
                                  { campaign?.campaign_name }
                                </option>
                              )
                            })
                          }
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="affiliate_id" className="tex-sm font-semibold text-gray-900 mb-3 block">
                        Affiliate ID
                      </label>
                      <p className="mb-3">
                        You can find an affiliate&lsquo;s ID on the
                        { ' ' }
                        <a className="font-bold underline" href={ `/dashboard/${router?.query?.companyId}/affiliates` }>
                          Affiliates
                        </a>
                        { ' ' }
                        page
                      </p>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          placeholder="Affiliate ID (e.g. 6ryqri3cdjxeyqwl14yi)"
                          name="affiliate_id"
                          id="affiliate_id"
                          type="text"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email_address" className="tex-sm font-semibold text-gray-900 mb-3 block">
                        User&lsquo;s Email Address
                      </label>
                      <p className="mb-3">
                        The email address which the user used to sign up to your product with.
                      </p>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          placeholder="youruser@email.com"
                          name="email_address"
                          id="email_address"
                          type="email"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                    </div>
                    {
                      activeCompany?.payment_integration_type !== null && activeCompany?.payment_integration_type !== 'manual' &&
                      <div>
                        {
                          activeCompany?.payment_integration_type === 'stripe' ?
                            <>
                              <label htmlFor="order_id" className="tex-sm font-semibold text-gray-900 mb-3 block">
                                Stripe Payment ID (*optional*)
                              </label>
                              <p className="mb-3">
                                The ID of the Stripe payment intent or invoice. If the payment is found, this will automatically create a commission for the affiliate.
                              </p>
                            </>
                          :
                            <>
                              <label htmlFor="order_id" className="tex-sm font-semibold text-gray-900 mb-3 block">
                                Paddle Order ID (*optional*)
                              </label>
                              <p className="mb-3">
                                The ID of the Paddle order. If the order is found, this will automatically create a commission for the affiliate.
                              </p>
                            </>
                        }
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            placeholder={ activeCompany?.payment_integration_type === 'stripe' ? 'Stripe Payment ID (e.g. pi_2FaPXJC7NSaZYFlG02P1MRVx' : activeCompany?.payment_integration_type === 'paddle' ? 'Paddle Order ID (e.g. 1022907-384786)' : null }
                            name="order_id"
                            id="order_id"
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                        </div>
                      </div>
                    }
                    {
                      errorMessage &&
                      <div className="bg-red-500 text-center p-4 mt-8 rounded-lg">
                        <p className="text-white text-md font-medium">
                          There was an error when creating the referral, please try again later.
                        </p>
                      </div>
                    }
                  </div>
                </div>
                <div className="p-6 bg-white flex items-center justify-start">
                  <Button
                    small
                    primary
                    disabled={ loading }>
                    <span className='text-white'>
                      { loading ? 'Creating referral...' : 'Create referral' }
                    </span>
                  </Button>
                </div>
              </form>
            </div>
          :
            <div>
              <LoadingDots className='mx-auto my-0' />
            </div>
        }
      </div>
    </>
  );
}