import { useCompany } from '@/utils/CompanyContext';
import { classNames } from '@/utils/helpers';
import { Tooltip } from '@/components/Tooltip';
import { PresentationChartLineIcon, BookOpenIcon, GiftIcon, ClipboardCheckIcon, CogIcon, CollectionIcon, CreditCardIcon, CurrencyDollarIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const AdminNavItems = () => {
  const { activeCompany } = useCompany();
  const router = useRouter();

  const manageNavigation = [
    // { name: 'Home', href: `/dashboard/${activeCompany?.company_id}/home`, icon: TemplateIcon },
    { name: 'Dashboard', href: `/dashboard/${activeCompany?.company_id}/analytics`, icon: PresentationChartLineIcon },
    { name: 'Campaigns', href: `/dashboard/${activeCompany?.company_id}/campaigns`, icon: CollectionIcon },
    { name: 'Affiliates', href: `/dashboard/${activeCompany?.company_id}/affiliates`, icon: UserGroupIcon },
    { name: 'Referrals', href: `/dashboard/${activeCompany?.company_id}/referrals`, icon: SparklesIcon },
    { name: 'Sales & Commissions', href: `/dashboard/${activeCompany?.company_id}/commissions`, icon: CurrencyDollarIcon },
    // { name: 'Apps', href: `/dashboard/${activeCompany?.company_id}/apps`, icon: ChipIcon },
  ];

  const settingsNavigation = [
    { name: 'Setup', href: `/dashboard/${activeCompany?.company_id}/setup`, icon: ClipboardCheckIcon },
    { name: 'Company Settings', href: `/dashboard/${activeCompany?.company_id}/settings`, icon: CogIcon },
    { name: 'Billing / Plans', href: '/dashboard/billing', icon: CreditCardIcon }
  ];

  const navItemClass = 'w-12 h-12 mt-2 flex items-center font-semibold rounded-lg hover:bg-primary-3 hover:text-primary';
  
  return(
    <>
      <nav className="flex-1 flex flex-col overflow-y-auto" aria-label="Sidebar">
        <div className="p-5 border-b-2 border-gray-100">
          { manageNavigation.map((item) => (
            <Link
              passHref
              key={ item.name }
              href={ item.href }
              aria-current={ item.current ? 'page' : undefined }
              className={ classNames(
                router?.asPath?.includes(item.href) && 'bg-primary-3 text-primary',
                navItemClass
              ) }>
              <Tooltip title={ item.name }>
                <item.icon className="h-6 w-12" aria-hidden="true" />
              </Tooltip>
            </Link>
          )) }
        </div>
        <div className="p-5 border-b-2 border-gray-100">
          { settingsNavigation.map((item) => (
            <Link
              passHref
              key={ item.name }
              href={ item.href }
              aria-current={ item.current ? 'page' : undefined }
              className={ classNames(
                router?.asPath?.includes(item.href) && 'bg-primary-3 text-primary',
                navItemClass
              ) }>
              <Tooltip title={ item.name }>
                <item.icon className="h-6 w-12" aria-hidden="true" />
              </Tooltip>
            </Link>
          )) }
        </div>
        <div className="p-5">
          <Link
            passHref
            href={ process.env.NEXT_PUBLIC_DOCS_SITE_URL }
            className={ classNames(
              navItemClass
            ) } 
            rel="noreferrer"
            target="_blank">
            <Tooltip title='Docs & Guides'>
              <BookOpenIcon className="h-6 w-12" aria-hidden="true" />
            </Tooltip>
          </Link>
          
          <Link
            passHref
            href="/pricing"
            className='flex py-4 rounded-md text-primary'>
            <Tooltip title='Upgrade'>
              <GiftIcon className="h-6 w-12" aria-hidden="true" />
            </Tooltip>
          </Link>
        </div>
      </nav>
    </>
  )
};

export default AdminNavItems;