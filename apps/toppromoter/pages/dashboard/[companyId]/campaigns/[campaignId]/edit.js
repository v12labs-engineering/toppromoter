import { useRouter } from 'next/router';
import { useCampaign } from '@/utils/CampaignContext';
import CampaignForm from '@/forms/CampaignForm';
import { SEOMeta } from '@/templates/SEOMeta'; 
import Button from '@/components/Button'; 
import {
  ArrowNarrowLeftIcon
} from '@heroicons/react/outline';
import LoadingDots from '@/components/LoadingDots';

export default function EditCampaignPage() {
  const router = useRouter();
  const { activeCampaign } = useCampaign();

  return (
    <>
      <SEOMeta title="Edit campaign" />
      <>
        <div className="py-8">
          <div className="wrapper p-0">
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
        <div className="wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold mb-6">
            Edit campaign
          </h1>
          {
            activeCampaign !== null && activeCampaign !== 'none' ?
              <CampaignForm edit={ activeCampaign } />
            :
              <>
                <LoadingDots className='mx-auto my-0'/>
              </>
          }
        </div>
      </>
    </>
  );
}