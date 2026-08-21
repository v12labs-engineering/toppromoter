import { useRouter } from 'next/router';
import { useCompany } from '@/utils/CompanyContext';
import LoadingDots from '@/components/LoadingDots';
import { SEOMeta } from '@/templates/SEOMeta'; 
import { useEffect } from 'react';

export default function InnerDashboardPage() {
  const router = useRouter();
  const { activeCompany } = useCompany();

  useEffect(() => {
    if (activeCompany?.company_id) {
      router.replace(`/dashboard/${activeCompany.company_id}/home`);
    }
  }, [activeCompany, router]);
  
  return (
    <>
      <SEOMeta title="Dashboard" />
      <div className="pt-12 wrapper">
        <LoadingDots className='mx-auto my-0' />
      </div>
    </>
  );
}
