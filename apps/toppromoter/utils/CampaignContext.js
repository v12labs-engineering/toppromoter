import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getCampaigns, useUser } from './useUser';
import { useCompany } from './CompanyContext';

export const useCampaign = () => {
  const { user, userFinderLoaded } = useUser();
  const { activeCompany } = useCompany();
  const [userCampaignDetails, setUserCampaignDetails] = useState(null);
  const [activeCampaign, setActiveCampaign] = useState('none');
  const router = useRouter();
  let value;
  
  useEffect(() => {
    if (userFinderLoaded && getCampaigns && user && userCampaignDetails === null && activeCompany?.company_id) {
      getCampaigns(activeCompany?.company_id).then(results => {
        setUserCampaignDetails(Array.isArray(results) ? results : [results])

        let newActiveCampaign = null;

        if(router?.query?.campaignId && results?.filter(campaign => campaign?.campaign_id === router?.query?.campaignId)?.length && activeCampaign === 'none' && results){
          newActiveCampaign = results?.filter(campaign => campaign?.campaign_id === router?.query?.campaignId);
          if( Array.isArray(newActiveCampaign) && newActiveCampaign !== null){
            newActiveCampaign = newActiveCampaign[0];
          }
        }            

        if(newActiveCampaign !== null){
          setActiveCampaign(newActiveCampaign);
        } else {
          setActiveCampaign(null);
        }
      });
    }
  }, [userFinderLoaded, getCampaigns, user, userCampaignDetails, activeCompany, activeCampaign, router?.query?.campaignId]);
    
  value = {
    activeCampaign,
    userCampaignDetails
  };

  return value;
}