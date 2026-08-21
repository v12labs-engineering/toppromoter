import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  CalendarIcon,
  ChartBarIcon,
  ChatAlt2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ClipboardCheckIcon,
  CogIcon,
  CollectionIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  HomeIcon,
  MenuAlt2Icon,
  PuzzleIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  UserCircleIcon,
  UserGroupIcon,
  XIcon
} from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from './Icons/Logo';
import { useCompany } from '@/utils/CompanyContext';
import { useUser } from '@/utils/useUser';

const primaryItems = [
  { label: 'Home', segment: 'home', icon: HomeIcon },
  { label: 'Campaigns', segment: 'campaigns', icon: CollectionIcon },
  { label: 'Affiliates', segment: 'affiliates', icon: UserGroupIcon },
  { label: 'Referrals', segment: 'referrals', icon: SparklesIcon },
  { label: 'Conversions', segment: 'analytics', icon: CurrencyDollarIcon },
  { label: 'Payouts', segment: 'commissions', icon: CreditCardIcon }
];

const secondaryItems = [
  { label: 'Reports', segment: 'analytics', icon: ChartBarIcon },
  { label: 'Messages', segment: 'affiliates/mailer', icon: ChatAlt2Icon },
  { label: 'Integrations', segment: 'apps', icon: PuzzleIcon },
  { label: 'Settings', segment: 'settings', icon: CogIcon }
];

const Navigation = ({ companyId, collapsed, onNavigate }) => {
  const router = useRouter();
  const navGroups = [primaryItems, secondaryItems];

  return (
    <nav aria-label="Main navigation" className="tp-sidebar-nav">
      {navGroups.map((items, groupIndex) => (
        <div className="tp-nav-group" key={groupIndex}>
          {items.map((item) => {
            const href = `/dashboard/${companyId}/${item.segment}`;
            const active =
              router.asPath === href ||
              router.asPath.startsWith(`${href}/`) ||
              (item.segment === 'home' && router.asPath === `/dashboard/${companyId}`);
            return (
              <Link
                aria-current={active ? 'page' : undefined}
                aria-label={item.label}
                className={`tp-nav-item ${active ? 'is-active' : ''}`}
                href={href}
                key={item.label}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
              >
                <item.icon aria-hidden="true" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
};

export const DashboardShell = ({ children }) => {
  const router = useRouter();
  const { activeCompany, userCompanyDetails } = useCompany();
  const { userDetails, signOut, localDemo } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dateRange, setDateRange] = useState('Last 30 days');
  const companyId = router.query.companyId || activeCompany?.company_id || 'demo';

  const switchCompany = (event) => {
    const nextCompanyId = event.target.value;
    const currentSegment = router.asPath.split('/')[4] || 'home';
    router.push(`/dashboard/${nextCompanyId}/${currentSegment}`);
  };

  return (
    <div className={`tp-shell ${collapsed ? 'is-collapsed' : ''}`}>
      <aside className="tp-sidebar" aria-label="Product navigation">
        <Link className="tp-brand" href={`/dashboard/${companyId}/home`} aria-label="TopPromoter home">
          {collapsed ? <ChartBarIcon aria-hidden="true" /> : <Logo width={172} height={34} />}
        </Link>
        <Navigation companyId={companyId} collapsed={collapsed} />
        {!collapsed && (
          <div className="tp-sidebar-promo">
            <span className="tp-promo-icon"><ChartBarIcon aria-hidden="true" /></span>
            <strong>Grow faster with TopPromoter</strong>
            <p>Invite affiliates and run high-converting campaigns.</p>
            <Link href={`/dashboard/${companyId}/campaigns/new`}>Learn how <span aria-hidden="true">→</span></Link>
          </div>
        )}
        <div className="tp-sidebar-footer">
          <a className="tp-nav-item" href={process.env.NEXT_PUBLIC_DOCS_SITE_URL || '#'}>
            <QuestionMarkCircleIcon aria-hidden="true" />
            {!collapsed && <span>Help center</span>}
          </a>
          <button
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            className="tp-nav-item"
            onClick={() => setCollapsed((value) => !value)}
            type="button"
          >
            <ChevronLeftIcon aria-hidden="true" className={collapsed ? 'rotate-180' : ''} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      <header className="tp-topbar">
        <button className="tp-mobile-menu" onClick={() => setMobileOpen(true)} type="button" aria-label="Open navigation">
          <MenuAlt2Icon aria-hidden="true" />
        </button>
        <div className="tp-mobile-brand"><Logo width={145} height={28} /></div>
        <div className="tp-topbar-controls">
          <label className="tp-control tp-date-control">
            <CalendarIcon aria-hidden="true" />
            <span className="sr-only">Reporting period</span>
            <select value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </label>
          <label className="tp-control tp-company-control">
            <span className="sr-only">Company</span>
            <select value={companyId} onChange={switchCompany}>
              {(userCompanyDetails || [activeCompany]).filter(Boolean).map((company) => (
                <option key={company.company_id} value={company.company_id}>{company.company_name}</option>
              ))}
            </select>
          </label>
          <Menu as="div" className="tp-account-menu">
            <Menu.Button aria-label="Account menu" className="tp-account-button">
              <UserCircleIcon aria-hidden="true" />
              <span>{userDetails?.full_name || userDetails?.email || 'Account'}</span>
              <ChevronDownIcon aria-hidden="true" />
            </Menu.Button>
            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Menu.Items className="tp-account-popover">
                <Menu.Item><Link href={`/dashboard/${companyId}/settings`}>Account settings</Link></Menu.Item>
                <Menu.Item><Link href={process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL || '#'}>Affiliate dashboard</Link></Menu.Item>
                <Menu.Item>
                  <button type="button" onClick={() => localDemo ? undefined : signOut()}>Sign out</button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>

      <main className="tp-main" id="skip">{children}</main>

      {mobileOpen && (
        <div className="tp-mobile-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button className="tp-mobile-backdrop" onClick={() => setMobileOpen(false)} aria-label="Dismiss navigation overlay" type="button" />
          <aside className="tp-mobile-drawer">
            <div className="tp-mobile-drawer-head">
              <Logo width={165} height={32} />
              <button onClick={() => setMobileOpen(false)} type="button" aria-label="Close navigation"><XIcon aria-hidden="true" /></button>
            </div>
            <Navigation companyId={companyId} collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
};

export default DashboardShell;
