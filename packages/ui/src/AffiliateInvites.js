import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import { useUserAffiliate } from '../../../apps/toppromoter-affiliate/utils/UserAffiliateContext';
import Button from '@/components/Button'; 
import toast from 'react-hot-toast';
import { postData } from '@/utils/helpers';

const AffiliateInvites = (props) => {
  const router = useRouter();
  const { session } = useUser();
  const { userAffiliateInvites } = useUserAffiliate();
  const [loading, setLoading] = useState(false);
  const affiliateInvitePage = router?.query?.handle ? true : false;
  let campaignInviteData = null;

  useEffect(() => {
    if(props?.campaignId && userAffiliateInvites !== null && userAffiliateInvites?.length > 0){
      if(userAffiliateInvites?.filter(invite => invite?.campaign_id === props?.campaignId).length > 0){
        campaignInviteData = userAffiliateInvites?.filter(invite => invite?.campaign_id === props?.campaignId)[0];
      }
    }
  }, [userAffiliateInvites]);

  const handleInviteDecision = async (type, affiliateId) => {    
    setLoading(true);

    try {
      const { status } = await postData({
        url: '/api/affiliate/handle-invite',
        data: { 
          handleType: type,
          affiliateId: affiliateId
        },
        token: session.access_token
      });

      if(status === 'success'){
        setLoading(false);
        router.push(process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL+'?inviteRefresh=true');
        toast.success(type === 'accept' ? 'Congratulations! The invitation was accepted.' : 'The invitation was declined.')
      }
  
    } catch (error) {
      setLoading(false);
      toast.error(type === 'accept' ? 'The invitation could not be accepted. Please try again later.' : 'The invitation could not be declined. Please try again later.')
    }
  };

  return(
    <div className={ props.className || '' }>
      {
          userAffiliateInvites !== null && userAffiliateInvites?.length > 0 ?
            <div className='bg-primary-3 rounded-lg'>
              {
                affiliateInvitePage === true ?
                  <div>
                    {
                      campaignInviteData !== null ?
                        <Button
                          onClick={ e=>{handleInviteDecision('accept', campaignInviteData?.affiliate_id)} }
                          disabled={ loading }
                          secondary
                          large>
                          { loading ? 'Joining campaign...' : 'Accept Campaign Invite' }
                        </Button>
                      :
                        <p className="text-lg">
                          This campaign is not public, and requires a manual invite for you to join.
                        </p>
                    }
                  </div>
                :
                  <div className="space-y-4 rounded-lg">
                    { userAffiliateInvites?.map(invite => {
                      return(
                        <div className="rounded-lg border-2 border-gray-100 p-2 my-2">
                          <div className="flex">
                            <div className="xl:ml-3 flex-1 xl:flex xl:justify-between xl:items-center">
                              <p className="mb-3 xl:mb-0 text-md font-semibold">
                                You have been invited to join campaign
                                { ' ' }
                                <span className="font-bold underline">
                                  { invite?.campaign_name }
                                </span>
                                { ' ' }
                                by
                                { ' ' }
                                <span className="font-bold underline">
                                  { invite?.company_name }
                                </span>
                              </p>
                              <div className="flex items-center justify-between space-x-5">
                                <Button 
                                  disabled={ loading }
                                  ghost
                                  onClick={ e=>{handleInviteDecision('decline', invite?.affiliate_id)} }
                                  className="ml-3 xl:ml-0 xl:mt-2 font-semibold !text-red-700 text-xs xl:text-sm hover:underline">
                                  Decline
                                </Button>
                                <Button
                                  onClick={ e=>{handleInviteDecision('accept', invite?.affiliate_id)} }
                                  small
                                  primary
                                  disabled={ loading }>
                                  <span>
                                    Accept
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }) }
                  </div>
              }              
            </div>
          :
            <div>
              {
                affiliateInvitePage === true &&
                  <p className="text-lg">
                    This campaign is not public, and requires a manual invite for you to join.
                  </p>
              }
            </div>
        }
    </div>
  );
}

export default AffiliateInvites;