import { useState, useEffect } from 'react';
import { useUser, getToppromoterCommissionsDue } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import SEOMeta from '@/templates/SEOMeta'; 
import { postData, priceStringDivided, checkUTCDateExpired, UTCtoString } from '@/utils/helpers';
import Button from '@/components/Button'; 
import Card from '@/components/Card'; 
import { PricingParams, PricingFeatures } from '@/components/PricingFeatures'; 
import LoadingDots from '@/components/LoadingDots';
import toast from 'react-hot-toast';

export default function BillingPage() {
  const { session, planDetails, subscription, user, team } = useUser();
  const { activeCompany } = useCompany();
  const [loading, setLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [usageData, setUsageData] = useState(null);
  const [loadingUsageData, setLoadingUsageData] = useState(false);
  const [commissions, setCommissions] = useState([]);
  const [receivedInvoiceUrl, setReceivedInvoiceUrl] = useState(null);
 
  const redirectToCustomerPortal = async () => {
    setLoading(true);
    const { url, error } = await postData({
      url: '/api/create-portal-link',
      token: session.access_token,
      data: { teamId: team?.team_id }
    });
    if (error) return alert(error.message);
    window.location.assign(url);
    setLoading(false);
  };

  const generateInvoice = async () => {
    if(invoiceLoading === true) return false;
    setInvoiceLoading(true);
    
    try {
      const { response } = await postData({
        url: '/api/team/invoice',
        data: { 
          commissions: commissions,
          currency: activeCompany?.company_currency,
          teamId: team?.team_id
        },
        token: session.access_token
      });

      if(response !== 'error'){
        console.log(response);
      }

      if(response === 'above_50'){
        toast.error('You are trying to pay for more than 50 commissions, please contact support, or upgrade your plan to remove all outstanding fees.')
      }

      if(response?.invoice_url){
        window.open(response?.invoice_url, '_blank');
        setReceivedInvoiceUrl(response?.invoice_url);
      }

      setInvoiceLoading(false);
      
    } catch (error) {
      console.log(error)
    }
  };
  
  if(commissions?.length === 0 && planDetails === 'free'){
    getToppromoterCommissionsDue(team?.team_id).then(results => {
      if(results !== 'error' && results?.data?.length){
        setCommissions(results);
      }

      if(results === 'error'){
        console.warn('There was an error when getting data');
      }

      if(results?.data?.length === 0){
        setCommissions({'data': []});
      }
    })
  }
  
  const ProgressBar = ({ type, unlimited }) => {
    if(usageData === null) return false;
    
    const plans = PricingParams();
    // const usagePercentage = ((usageData[type] / plans[planDetails][type]) * 100).toFixed(0);
    
    return(
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="capitalize">
            { type }
          </h3>
          <span>
            { usageData[type] } 
            { ' ' }
            <span className="text-gray-500">
              /
              { unlimited === true ? '∞' : plans[planDetails][type] }
            </span>
          </span>
        </div>
        {/* <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={ { width: `${unlimited === true ? '1%' : usagePercentage > 100 ? '100%' : usagePercentage+'%'}` } }>
          </div>
        </div> */}
      </div>
    )
  }
  
  useEffect(() => {
    const getUsageData = async () => {    
      try {
        const { response } = await postData({
          url: '/api/team/usage',
          data: { 
            teamId: team?.team_id,
          },
          token: session.access_token
        });
  
        if(response !== 'error'){
          setUsageData(response);
        }
        
      } catch (error) {
        console.log(error)
      }
    };
    if (user && team?.team_id && usageData === null && loadingUsageData === false) {
      setLoadingUsageData(true);
      getUsageData();
    }
  }, [user, team?.team_id, session, usageData, loadingUsageData]);

  return (
    <>
      <SEOMeta title="Billing" />
      <div className="mb-12">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">
            Billing / Plans
          </h1>
        </div>
      </div>
      <div className="wrapper">
        <div className="grid grid-cols-1 space-y-6 md:space-y-0 md:grid-cols-2 md:space-x-6">
          <Card>
            <div className="flex items-center mb-4">
              <h2 className="text-xl leading-6 font-semibold text-gray-900">
                Current Plan:
                { ' ' }
                {planDetails?.length && <span className="capitalize font-medium">
                  { planDetails } <span className='text-sm'>{subscription?.status === 'trialing' &&  `(Free trial - ${subscription?.canceled_at ? 'Cancelled' : 'Active'})`}</span>
                </span>}
                {!planDetails && <span className='text-sm'>Not subscribed</span>}
              </h2>
            </div>
            <p className='mb-4 text-sm'>
              {subscription?.status === 'trialing' && !subscription?.canceled_at && `You will be billed automatically from ${new Date(subscription.trial_end)}`}
            </p>
            {(planDetails || planDetails?.length) && <div className="bg-gray-100 rounded-xl p-6">
             { planDetails?.length && <PricingFeatures normal productName={planDetails}/> }
            </div>
            }
            <div className="mt-6 pt-6 bg-white sm:flex sm:items-center sm:justify-start">
              {(!planDetails || planDetails?.length) &&  
                <Button
                  small
                  mobileFull
                  primary
                  href="/pricing">
                  Upgrade Plan
                </Button>
              }
              { planDetails?.length &&
                <Button
                  className="mt-3 ml-0 sm:ml-3 sm:mt-0"
                  mobileFull
                  small
                  secondary
                  onClick={ e=>{redirectToCustomerPortal()} }>
                  { loading ? 'Loading...' : 'Manage Billing' }
                </Button>
              }
            </div>
          </Card>
          {/* <Card>
            <div>
              <h2 className="text-xl leading-6 font-semibold text-gray-900 mb-5">
                Usage Metrics
              </h2>
              {
                usageData !== null ?
                  <div className="space-y-10">
                    <ProgressBar type="companies" unlimited={ true } />
                    <ProgressBar type="campaigns" unlimited={ true } />
                    <ProgressBar type="affiliates" unlimited={ true } />
                    <ProgressBar type="referrals" unlimited={ true } />
                    <ProgressBar type="commissions" unlimited={ true } />
                  </div>
                :
                  <div className="flex items-center justify-center mt-24">
                    <LoadingDots className='mx-auto my-0'/>
                  </div>
              }
            </div>
          </Card> */}
        </div>
      </div>
    </>
  );
}