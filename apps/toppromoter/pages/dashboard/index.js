import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LoadingDots } from '@/components/LoadingDots';
import SEOMeta from '@/templates/SEOMeta'; 
import { getCompanies, useUser, getSubscription } from '@/utils/useUser';

export default function DashboardPage() {
  const { user, subscription } = useUser();
  const [userCompanyDetails, setUserCompanyDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (user && userCompanyDetails === null) {
      getCompanies(user?.id).then(results => {
        setUserCompanyDetails(Array.isArray(results) ? results : [results])
      });
    }
  }, [user]);

  useEffect(() => {
    if(userCompanyDetails !== null && userCompanyDetails?.length > 0) {
      if (!subscription || subscription.length <= 0) {
        getSubscription(user).then((subDetails) => {
          if (!subDetails || subDetails?.data?.length <= 0 || subDetails.error) {
            router.push('/pricing');
          }
        })
      }
    }
  }, [userCompanyDetails, subscription]);
  
  return (
    <>
      <SEOMeta title="Dashboard" />
      <div className="pt-12 wrapper">
        <LoadingDots className='mx-auto my-0' />
      </div>
    </>
  );
}