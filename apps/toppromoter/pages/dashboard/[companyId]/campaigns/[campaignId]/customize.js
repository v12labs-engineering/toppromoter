import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCampaign } from '@/utils/CampaignContext';
import { useCompany } from '@/utils/CompanyContext';
import { editCampaignMeta, useUser } from '@/utils/useUser';
import { SEOMeta } from '@/templates/SEOMeta'; 
import Button from '@/components/Button'; 
import {
  ArrowNarrowLeftIcon,
  PencilIcon,
  AdjustmentsIcon
} from '@heroicons/react/outline';
import CampaignInvitePageBlock from '@/components/CampaignInvitePageBlock'; 
import LoadingDots from '@/components/LoadingDots';
import CompanyLogoUpload from '@/components/CompanyLogoUpload'; 
import { toast } from 'react-hot-toast';

export default function CampaignCustomizerPage() {
  const router = useRouter();
  const { planDetails } = useUser();
  const { activeCampaign } = useCampaign();
  const { activeCompany } = useCompany();
  const [campaignEditData, setCampaignEditData] = useState(null);
  const [tabType, setTabType] = useState('details');
  const [saveRequired, setSaveRequired] = useState(false); 

  let mergedCampaignData = null;

  if(activeCampaign !== 'none' && !activeCampaign?.campaign_id){
    router.push('/dashboard');
  }

  if(activeCampaign?.campaign_id && activeCompany?.company_id){
    mergedCampaignData = activeCampaign;
    mergedCampaignData.company_id = activeCompany?.company_id;
    mergedCampaignData.company_image = activeCompany?.company_image;
    mergedCampaignData.company_name = activeCompany?.company_name;
    mergedCampaignData.company_currency = activeCompany?.company_currency;
  }

  if(campaignEditData === null && activeCampaign !== null && activeCampaign !== 'none'){
    if(activeCampaign?.custom_campaign_data !== null){
      setCampaignEditData(activeCampaign?.custom_campaign_data);
    } else {
      setCampaignEditData({
        'campaign_welcome_message': `Join ${activeCampaign?.campaign_name} and get ${activeCampaign?.commission_type === 'percentage' ? activeCampaign?.commission_value + '% commission on all paid referrals.' : activeCampaign?.company_currency + '' + activeCampaign?.commission_value + 'commission on all paid referrals.'}`,
        'campaign_bg_color': null,
        'random_number': Math.random(1000)
      })
    }
  }

  const liveEditForm = (e, type) => {
    let data = campaignEditData !== null ? campaignEditData : {};

    e.preventDefault();
    const formData = new FormData(e.target.form);
  
    for (let entry of formData.entries()) {
      data[entry[0]] = entry[1];
    }

    setCampaignEditData(data);
    setSaveRequired(true);
  };
  
  const saveButton = async () => {
    if(campaignEditData === null) return false;
    
    if(planDetails === 'free'){
      toast.error(() => (
        <span className="text-xl">
          Please
          { ' ' }
          <a className="font-bold" href="/pricing">
            upgrade your plan
          </a>
          { ' ' }
          to save customizations.
        </span>
      ));
      return false;
    }
    
    await editCampaignMeta(activeCampaign?.campaign_id, campaignEditData).then((result) => {
      if(result === 'success'){
        toast.success('Saved customization');
        router.reload();
      } else {
        toast.error('Unable to save data. Please try again later.');
      }

      setSaveRequired(false);
    });
  }
  
  return (
    <>
      <SEOMeta title="Customize Campaign" />
      <div className="py-8">
        <div className="wrapper">
          <Button
            href={ `/dashboard/${router?.query?.companyId}/campaigns` }
            className='p-0'
            small
            ghost>
            <ArrowNarrowLeftIcon className="mr-2 w-6 h-auto" />
            <span>
              Back to campaigns
            </span>
          </Button>
        </div>
      </div>
      <div className='wrapper'>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold mb-6">
              Customize campaign
            </h1>
          </div>
          <Button
            onClick={ e=>{saveRequired === true && saveButton()} }
            className={ `${saveRequired === false && 'opacity-50 cursor-not-allowed'} ${saveRequired === true && 'animate-pulse'}` }
            small
            primary>
            <span>
              Save changes
            </span>
          </Button>
        </div>
        <div className="flex w-full border-2 border-gray-100 rounded-lg overflow-hidden">
          <div className="w-[500px] border-r-2 border-gray-100 bg-white overflow-y-scroll">
            <div className="flex h-full">
              {/* <div className="w-14 h-full ">
                <div className="pt-4 flex flex-col items-center justify-center space-y-2">
                  <button onClick={ e=>{setTabType('details')} } className={ `${tabType === 'details' && 'bg-white border-gray-300'} w-10 h-10 border-2 rounded-xl flex justify-center items-center` }>
                    <PencilIcon className="w-6 h-6" />
                  </button>
                  <button onClick={e=>{setTabType("settings")}} className={`${tabType === "settings" && "bg-white border-gray-300"} w-10 h-10 border-2 rounded-xl flex justify-center items-center`}>
                    <AdjustmentsIcon className="w-6 h-6"/>
                  </button> 
                </div>
              </div> */}
              <div className="flex flex-grow">
                {
                  activeCampaign?.campaign_id ?
                    <form className="px-6 py-5 w-full" action="#">
                      <div className="space-y-6">
                        {
                          tabType === 'details' &&
                            <>
                              <div>
                                <CompanyLogoUpload />
                              </div>
                              <div>
                                <label htmlFor="campaign_welcome_message" className="block font-semibold mb-2">
                                  Campaign Welcome Text
                                </label>
                                <div className="flex rounded-lg">
                                  <textarea
                                    rows="3"
                                    name="campaign_welcome_message"
                                    id="campaign_welcome_message"
                                    defaultValue={ campaignEditData?.campaign_welcome_message }
                                    onInput={ e=>{liveEditForm(e)} }
                                    maxLength="500"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                  </textarea>
                                </div>
                              </div>
                            </>
                        }
                        {
                          tabType === 'settings' &&
                            <>
                              <div className="flex items-center">
                                <input
                                  id="campaign_hide_attribution"
                                  name="campaign_hide_attribution"
                                  type="checkbox"
                                  className="focus:ring-primary h-7 w-7 text-secondary border-2 border-gray-300 rounded-md cursor-pointer"
                                  defaultChecked={ campaignEditData?.campaign_hide_attribution && campaignEditData?.campaign_hide_attribution }
                                  // defaultChecked={campaignEditData?.campaign_hide_attribution === true ? true : false}
                                  onInput={ e=>{liveEditForm(e)} }
                                />
                                <label htmlFor="campaign_hide_attribution" className="block font-semibold ml-3">
                                  Hide &quot;Powered by Toppromoter&quot; Attribution
                                </label>
                              </div>
                            </>
                        }
                      </div>
                    </form>
                  :
                    <div className="flex w-full justify-center">
                      <LoadingDots className='my-5' />
                    </div>
                }
              </div>
            </div>
          </div>
          <div className="bg-white flex flex-grow items-center justify-center p-8 overflow-y-scroll">
            <div className="rounded-xl p-8 border-2 border-gray-100 w-full h-full pointer-events-none cursor-not-allowed">
              {
                <CampaignInvitePageBlock publicCampaignData={ mergedCampaignData } editor={ true } editorData={ campaignEditData } />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}