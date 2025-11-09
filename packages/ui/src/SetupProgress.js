import { useRouter } from 'next/router';
import { useCompany } from '@/utils/CompanyContext';
import { useCampaign } from '@/utils/CampaignContext';
import LoadingDots from '@/components/LoadingDots';
import setupStepCheck from '@/utils/setupStepCheck';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { OfficeBuildingIcon, CreditCardIcon, CurrencyDollarIcon, CollectionIcon, ClipboardCheckIcon, BadgeCheckIcon } from '@heroicons/react/outline';

const Step = ({ step, current }) => (
  <div className="w-full">
    <a href={ step.href }>
      <div className="relative mb-2">
        { (step.name !== 'Add Company' && step.name !== 'Edit Company') && 
          <div className="absolute flex align-center items-center align-middle content-center" style={ { width: 'calc(100% - 2.5rem - 1rem)', top: '50%', transform: 'translate(-50%, -50%)'} }>
            <div className="w-full rounded bg-primary-3 items-center align-middle align-center flex-1">
              <div className="h-1 bg-primary rounded" style={ { width: step.status === 'complete' ? '100%' : '0%' } }></div>
            </div>
          </div> 
        }
        <div className={ classNames('w-12 h-12 mx-auto rounded-full border-2 border-gray-100 text-lg flex items-center justify-center', { 'bg-primary text-white': step.status === 'complete', 'animate-pulse border-primary': current }) }>
          <step.icon className='h-6 w-6' />
        </div>
      </div>
      <div className="text-sm font-bold text-center">
        { step.name }
      </div>
    </a>
  </div>
);

export const SetupProgress = () => {
  setupStepCheck('light');

  const router = useRouter();
  const { activeCompany } = useCompany();
  const { userCampaignDetails } = useCampaign();
  const [steps, setSteps] = useState([]);
  const companyId = router?.query?.companyId || null;

  useEffect(() => {
    let editCompany, connectPaymentProcessor, chooseCurrency, createCampaign, companyVerified = null;
    if(activeCompany) {
      editCompany = 'complete';

      if(activeCompany?.payment_integration_type !== null){
        connectPaymentProcessor = 'complete';
      }
    
      if(activeCompany?.payment_integration_type !== null && activeCompany?.company_currency !== null){
        chooseCurrency = 'complete';
      }
    
      if(activeCompany?.payment_integration_type !== null && activeCompany?.company_currency !== null && userCampaignDetails?.length > 0){
        createCampaign = 'complete';
      }

      if(activeCompany?.domain_verified === true){
        companyVerified = 'complete';
      }
    }

    setSteps([
      { name: !activeCompany ? 'Add Company' : 'Edit Company', href: !activeCompany ? '/dashboard/add-company' : `/dashboard/${activeCompany?.company_id}/settings`, status: editCompany, icon: OfficeBuildingIcon},
      { name: 'Connect payment processor', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/payment-processor`, status: connectPaymentProcessor, icon: CreditCardIcon },
      { name: 'Choose a currency', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/currency`, status: chooseCurrency, icon: CurrencyDollarIcon },
      { name: 'Create a campaign', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/campaign`, status: createCampaign, icon: CollectionIcon },
      { name: 'Setup Toppromoter', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/add`, status: companyVerified, icon: ClipboardCheckIcon },
      { name: 'Verify setup', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/verify`, status: companyVerified, icon: BadgeCheckIcon },
    ]);
  }, [activeCompany, userCampaignDetails, companyId]);

  return (
    <div className="w-full">
      <div className="flex">
        { activeCompany ? steps?.map((step, index) => <Step key={ `${step?.name}-${index}` } step={ step } current={router.asPath === step.href} />) : <LoadingDots /> }  
      </div>
    </div>
  )
};

export default SetupProgress;