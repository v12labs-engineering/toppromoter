/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/utils/useUser';
import { useUserAffiliate } from '@/utils/UserAffiliateContext';
import {
  ArrowNarrowLeftIcon
} from '@heroicons/react/outline';
import CampaignInvitePageBlock from '@/components/CampaignInvitePageBlock'; 
import { Logo } from '@/components/Icons/Logo';

export default function CampaignInvite({ publicCampaignData }) {
  const router = useRouter();
  const { user, session } = useUser();
  const { userAffiliateDetails } = useUserAffiliate();
  const [loading, setLoading] = useState(false);
  const [campaignAlreadyJoined, setCampaignAlreadyJoined] = useState(false);

  if(campaignAlreadyJoined === false && user && publicCampaignData !== null && userAffiliateDetails !== null && userAffiliateDetails?.length > 0 && JSON.stringify(userAffiliateDetails).includes(publicCampaignData?.campaign_id)){
    setCampaignAlreadyJoined(true);
  }

  if(router?.asPath.includes('campaignRedirect=true') && localStorage.getItem('join_campaign_details')){
    if (typeof window !== "undefined") {
      localStorage.removeItem('join_campaign_details');
    }
  }
  
  return(
    <>
      <div>
        {
          user &&
          <div className="w-full  border-b-4 border-gray-300 py-4">
            <div className="wrapper">
              <a className="font-semibold flex items-center" href="/dashboard">
                <ArrowNarrowLeftIcon className="w-7 h-auto"/>
                <span className="ml-2">Back to Dashboard</span>
              </a>
            </div>
          </div>
        }
        <div className="wrapper py-12">
          {
            publicCampaignData?.company_name ?
              <CampaignInvitePageBlock 
                publicCampaignData={publicCampaignData}
                campaignAlreadyJoined={campaignAlreadyJoined} 
                loading={loading}
                setLoading={setLoading}
                user={user}
                session={session}
              />
            :
              <div className="p-8 rounded-md bg-white shadow-md border-2 border-gray-100 max-w-2xl mx-auto text-center">
                <div className="mb-4">
                  <p className="text-5xl mb-3">🤔</p>
                  <h1 className="text-3xl mb-2">Sorry, this campaign could not be found</h1>
                  <p className="text-xl">Please <a href="#" className="underline font-bold">let us know</a> if you were expecting something else.</p>
                </div>
                <div className=" mt-10 pt-8">
                  <a href={`${process.env.NEXT_PUBLIC_SITE_URL}?ref=CampaignNotFound`}>
                    <Logo className="w-36 h-auto mx-auto"/>
                  </a>
                </div>
              </div>
          }
        </div>
      </div>
    </>
  )
}