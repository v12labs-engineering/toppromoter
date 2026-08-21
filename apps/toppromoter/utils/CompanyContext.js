import { useRouter } from 'next/router';
import { useState, useEffect, createContext, useContext } from 'react';
import { getCompanies, useUser, newTeam, updateUserDetailsWithTeam, getSubscription } from './useUser';

export const CompanyContext = createContext();

export const CompanyContextProvider = (props) => {
  const { user, team, subscription, userFinderLoaded, updateTeam, updateUserDetails, localDemo } = useUser();
  const [userCompanyDetails, setUserCompanyDetails] = useState(null);
  const [creatingTeam, setCreatingTeam] = useState(false);
  const router = useRouter();
  let value;

  useEffect(() => {
    if (localDemo && userCompanyDetails === null) {
      setUserCompanyDetails([
        {
          id: user?.id,
          company_id: 'demo',
          company_name: 'Acme Cloud',
          company_currency: 'USD',
          company_handle: 'acme-cloud',
          active_company: true,
          created: '2025-01-14T00:00:00.000Z',
          domain_verified: true,
          payment_integration_type: 'stripe'
        },
        {
          id: user?.id,
          company_id: 'northstar',
          company_name: 'Northstar Labs',
          company_currency: 'USD',
          company_handle: 'northstar',
          active_company: false,
          created: '2025-04-08T00:00:00.000Z',
          domain_verified: true,
          payment_integration_type: 'stripe'
        }
      ]);
    }
  }, [localDemo, user, userCompanyDetails]);

  useEffect(() => {
    if (!localDemo && userFinderLoaded && getCompanies && user && userCompanyDetails === null) {
      getCompanies(user?.id).then(results => {
        setUserCompanyDetails(Array.isArray(results) ? results : [results])
      });
    }
  }, [localDemo, userFinderLoaded, user, userCompanyDetails]);

  if(!localDemo && userCompanyDetails !== null && userCompanyDetails?.length === 0 && !router?.asPath?.includes('add-company') && router?.pathname !== '/dashboard/create-team'){
    if(team === 'none' && router?.pathname !== '/dashboard/create-team' && creatingTeam === false){
      setCreatingTeam(true);
      newTeam(user, {'team_name': 'My team'}).then((newTeam) => {
        updateTeam(newTeam?.[0]);
        updateUserDetailsWithTeam(user, newTeam?.[0]).then((updatedUser) => {
          updateUserDetails(updatedUser?.[0]);
          router.push('/dashboard/add-company');
        });
      });
    }

    if(team?.team_id){
      router.push('/dashboard/add-company');
    }
  }
  
  if(!localDemo && userCompanyDetails !== null && userCompanyDetails?.length > 0 && (router?.asPath === '/dashboard' || router?.asPath === '/dashboard#')){
    const activeComp = userCompanyDetails?.filter(company=>company?.active_company === true);
    if (!subscription || subscription.length <= 0) {
      getSubscription(user).then((subDetails) => {
        if (!subDetails || subDetails?.data?.length <= 0 || subDetails.error) { 
          router.push('/pricing');
        } else {
          activeComp?.length > 0 
          ? router.push(`/dashboard/${activeComp[0].company_id}/setup`)
          : router.push(`/dashboard/${userCompanyDetails[0].company_id}/setup`)
        }
      })
    } else {
      if (activeComp?.length > 0 && activeComp?.[0]?.payment_integration_type === null) {
        router.push(`/dashboard/${activeComp[0].company_id}/setup`);
      } else {
        router.push(`/dashboard/${userCompanyDetails[0].company_id}/setup`);
      }
    }
  }

  let activeCompany = router?.query?.companyId ? userCompanyDetails?.filter(company => company?.company_id === router?.query?.companyId) : userCompanyDetails?.filter(company => company?.active_company === true)?.length > 0 ? userCompanyDetails?.filter(company => company?.active_company === true) : Array.isArray(userCompanyDetails) ? userCompanyDetails[0] : userCompanyDetails;
  if(Array.isArray(activeCompany)){
    activeCompany = activeCompany[0]
  }

  value = {
    activeCompany,
    userCompanyDetails,
    setUserCompanyDetails
  };

  return <CompanyContext.Provider value={ value } { ...props }  />;
}

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a CompanyContextProvider.');
  }
  return context;
};
