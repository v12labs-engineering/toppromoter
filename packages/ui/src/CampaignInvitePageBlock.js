import { useRouter } from 'next/router';
import AuthForm from '@/components/AuthForm';
import LoadingDots from '@/components/LoadingDots';
import Button from '@/components/Button';  
import toast from 'react-hot-toast';
import AffiliateInvites from '@/components/AffiliateInvites'; 
import { postData } from '@/utils/helpers';

export const CampaignInvitePageBlock = ({ publicCampaignData, campaignAlreadyJoined, loading, setLoading, user, session, editor, editorData }) => {
  const router = useRouter();
  let customCampaignData = null;

  if(publicCampaignData?.custom_campaign_data !== null){
    customCampaignData = publicCampaignData?.custom_campaign_data;
  }
  if(editor === true && editorData !== null){
    customCampaignData = editorData;
  }
    
  const handleCampaignJoin = async (companyId, campaignId) => {    
    setLoading(true);

    try {
      const { status } = await postData({
        url: '/api/affiliate/campaign-join',
        data: { 
          companyId: companyId,
          campaignId: campaignId
        },
        token: session.access_token
      });
      
      if(status === 'success'){
        setLoading(false);
        toast.success(`Congratulations! You have joined campaign ${publicCampaignData?.campaign_name}`)
        router.push(process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL+'?inviteRefresh=true');
      }

      if(status === 'private'){
        setLoading(false);
        toast.error('This campaign is private. Please contact the campaign owner for an invite.')
      }

      if(status === 'error'){
        setLoading(false);
        toast.error('There was an error when joining the campaign. Please try again later, or contact support.')
      }
  
    } catch (error) {
      setLoading(false);
      toast.error('There was an error when joining the campaign. Please try again later, or contact support.')
    }
  };

  return (
    <>
      <div>
        {
          editor &&
          <div className="bg-warning text-white inline-flex py-1.5 px-4 text-md font-bold rounded-md">
            PREVIEW MODE
          </div>
        }
        {
          publicCampaignData !== null ?
            <div className="text-center">
              <div>
                {
                  publicCampaignData?.company_image !== null ?
                    <img alt={ `${publicCampaignData?.company_name} Logo` } src={ process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL+publicCampaignData?.company_image } className="h-12 w-auto mx-auto mb-2" />
                  :
                    <h1 className="text-4xl font-semibold mb-2">
                      { publicCampaignData?.company_name }
                    </h1>
                }
                <>
                  <div className="mb-12">
                    <h2 className="text-xl text-gray-400">
                      { publicCampaignData?.campaign_name }
                    </h2>
                  </div>
                  <div className="p-8 rounded-xl bg-white border-2 border-gray-100 max-w-2xl mx-auto">
                    {
                      publicCampaignData?.campaign_public === true &&
                      <div>
                        {
                          customCampaignData !== null && customCampaignData?.campaign_welcome_message !== null ?
                            <p className="text-lg mb-5 text-gray-500">
                              { customCampaignData?.campaign_welcome_message }
                            </p>
                          :
                            <p className="text-lg mb-5 text-gray-500">
                              Join 
                              { ' ' }
                              <span className="font-semibold text-gray-700">
                                { publicCampaignData?.campaign_name }
                              </span>
                              { ' ' }
                              and get
                              { ' ' }
                              { publicCampaignData?.commission_type === 'percentage' ? `${publicCampaignData?.commission_value}% commission on all paid referrals.` : `${publicCampaignData?.company_currency}${publicCampaignData?.commission_value} commission on all paid referrals.` }
                            </p> 
                        }
                      </div>
                    }
                    {
                      user ?
                        <div>
                          {
                            campaignAlreadyJoined === true ?
                              <div className="p-3 rounded-xl bg-green-600 text-white text-lg font-semibold">
                                You have already joined this campaign.
                              </div>
                            : publicCampaignData?.campaign_public === true ?
                              <Button
                                onClick={ e=>{handleCampaignJoin(publicCampaignData?.company_id, publicCampaignData?.campaign_id)} }
                                disabled={ loading }
                                secondary
                                large>
                                { loading ? 'Joining campaign...' : 'Join campaign' }
                              </Button>
                            :
                              <AffiliateInvites campaignId={ publicCampaignData?.campaign_id } />
                          }
                        </div>
                      :
                        <div>
                          <AuthForm editor={ editor } affiliate={ true } type="signup" campaignId={ publicCampaignData?.campaign_id } companyId={ publicCampaignData?.company_id } campaignHandle={ router?.query?.handle } hideDetails={ true } />
                        </div>
                    }
                  </div>
                </>
              </div>
              <div className="mt-12">
                <p className="text-sm text-gray-500">
                  { publicCampaignData?.campaign_name }
                  { ' ' }
                  is powered by
                  { ' ' }
                  <a target="_blank" className="font-semibold underline" href={ `https://toppromoter.com?ref=${publicCampaignData?.campaign_name}` } rel="noreferrer">
                    Toppromoter
                  </a>
                </p>
              </div>
            </div>
          : 
            <div>
              <LoadingDots className='mx-auto my-0' />
            </div>
        }
      </div>
    </>
  );
};

export default CampaignInvitePageBlock;