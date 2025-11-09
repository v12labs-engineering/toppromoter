import { useState, useEffect } from 'react';
import { getAffiliates, useUser } from './useUser';
import { useCompany } from '@/utils/CompanyContext';
import { useCampaign } from '@/utils/CampaignContext';

export const useAffiliate = (props) => {
  const { user, userFinderLoaded } = useUser();
  const { activeCompany } = useCompany();
  const { userCampaignDetails } = useCampaign();
  const [userAffiliateDetails, setUserAffiliateDetails] = useState(null);
  const [mergedAffiliateDetails, setMergedAffiliateDetails] = useState(null);
  let value;

  useEffect(() => {
    if (userFinderLoaded && getAffiliates && user && userAffiliateDetails === null && activeCompany?.company_id) {
      getAffiliates(activeCompany?.company_id).then(results => {
        setUserAffiliateDetails(Array.isArray(results) ? results : [results])
      });
    }
  }, [userFinderLoaded, getAffiliates, user, userAffiliateDetails, activeCompany]);

  if(mergedAffiliateDetails === null && userCampaignDetails !== null && userCampaignDetails?.length && userAffiliateDetails !== null && userAffiliateDetails?.length && activeCompany?.company_id ){
    let clonedAffiliateDetails = userAffiliateDetails;

    clonedAffiliateDetails?.map(affiliate =>{
      userCampaignDetails?.map(campaign =>{
        if(affiliate?.campaign_id === campaign?.campaign_id){
          affiliate.campaign_name = campaign.campaign_name;
        }
      })
    });

    setMergedAffiliateDetails(clonedAffiliateDetails);
  }

  if(userAffiliateDetails !== null && userAffiliateDetails?.length === 0 && mergedAffiliateDetails === null){
    setMergedAffiliateDetails([]);
  }

  value = {
    userAffiliateDetails,
    mergedAffiliateDetails
  };

  return value;
}