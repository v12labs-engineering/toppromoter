import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { classNames } from '@/utils/helpers';
import { Tooltip } from '@/components/Tooltip';
import {
  CogIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TemplateIcon,
  SparklesIcon,
} from '@heroicons/react/outline';

export const AdminNavItems = () => {
  const router = useRouter();
  const navItemClass = 'w-12 h-12 mt-2 flex items-center font-semibold rounded-lg hover:bg-primary-3 hover:text-primary';

  const navigation = [
    // { name: 'Dashboard', href: '/dashboard', icon: TemplateIcon },
    { name: 'My Campaigns', href: '/dashboard/campaigns', icon: UserGroupIcon },
    { name: 'Referrals', href: '/dashboard/referrals', icon: SparklesIcon },
    { name: 'Commissions', href: '/dashboard/commissions', icon: CurrencyDollarIcon },
    // { name: 'Campaign Finder', href: '/dashboard/campaign-finder', icon: SearchIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: CogIcon }
  ];
  
  return(
    <>
      <nav className="flex-1 flex flex-col overflow-y-auto" aria-label="Sidebar">
        <div className="p-5">
          { navigation.map((item) => (
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
      </nav>
    </>
  )
};

export default AdminNavItems;