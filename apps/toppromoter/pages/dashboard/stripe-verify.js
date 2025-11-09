import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser, newStripeAccount } from '@/utils/useUser';
import SetupProgress from '@/components/SetupProgress'; 
import { useCompany } from '@/utils/CompanyContext';
import { SEOMeta } from '@/templates/SEOMeta'; 
import LoadingDots from '@/components/LoadingDots'; 

let toast;
if (typeof window !== 'undefined' ) {
  import('react-hot-toast').then(({ toast: t }) => {
    toast = t;
  })
}

export default function Onboarding() {
  const router = useRouter();
  const { user } = useUser();
  const { activeCompany } = useCompany();
  const [runningStripeFunction, setRunningStripeFunction] = useState(false);
  const [error, setError] = useState(null);

  const handleAddStripeAccount = async (stripeId, companyId) => {
    setRunningStripeFunction(true);

    try {      
      const tokenConfirm = await fetch('/api/get-stripe-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripeCode: stripeId
        })
      });

      if (!tokenConfirm.ok) {
        const err = await tokenConfirm.json();
        setError(err?.message)
        throw new Error(err?.message);
      }

      const stripeRes = await tokenConfirm.json();

      if(stripeRes?.stripe_id){
        const addStripeAccount = await newStripeAccount(stripeRes?.stripe_id, companyId);
        if(addStripeAccount === 'success'){
          router.push(`/dashboard/${activeCompany?.company_id}/setup/currency`);
        } else {
          if(addStripeAccount === 'error'){
            setError('There was an error when connecting your Stripe account. Please try again later.')
          }
        }
      }
      
    } catch (error) {
      toast.error(error?.message || 'Something went wrong, please try again');
    }
  };

  if(router?.query?.code && runningStripeFunction === false && user?.id && activeCompany?.company_id){
    handleAddStripeAccount(router?.query?.code, activeCompany?.company_id);
  }

  return(
    <>
      <SEOMeta title="Verifying Stripe Account" />
      <div className="py-12 border-b-2 border-gray-100">
        <SetupProgress />
      </div>
      <div className="pt-12 mb-6">
        <div className="wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">
            Verifying stripe account...
          </h1>
          <p className='text-sm'>
            This may take a while, please wait...
          </p>
        </div>
      </div>
      <div className="wrapper">
        <div className="rounded-xl bg-white max-w-2xl overflow-hidden border-2 border-gray-100 p-6">
          <div>
            <LoadingDots className='mx-auto my-0' />
          </div>
          {
            error !== null &&
            <div>
              <div className="bg-red-500 py-4 px-6 rounded-lg mt-6 text-center">
                <p className="text-white">
                  { error || 'Something went wrong, please try again' }
                </p>  
              </div>
              <a className="mt-6 underline block" href={`${activeCompany?.company_id}/setup/payment-processor`}>
                Try again
              </a>
            </div>
          }
        </div>
      </div>
    </>
  );
}