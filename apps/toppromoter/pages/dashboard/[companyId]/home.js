import { Fragment, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  ArrowNarrowRightIcon,
  BadgeCheckIcon,
  CashIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  CollectionIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  MinusCircleIcon,
  PlusIcon,
  SparklesIcon,
  TrendingUpIcon,
  UserAddIcon,
  UserGroupIcon,
  XIcon
} from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SEOMeta from '@/templates/SEOMeta';
import { useUser } from '@/utils/useUser';

const metrics = [
  { label: 'Attributed revenue', value: '$128,430.25', change: '18.6%', note: 'vs previous period', icon: CurrencyDollarIcon, tone: 'purple' },
  { label: 'Conversion rate', value: '7.34%', change: '0.96 pp', note: 'vs previous period', icon: TrendingUpIcon, tone: 'green' },
  { label: 'Active affiliates', value: '342', change: '24', note: 'vs previous period', icon: UserGroupIcon, tone: 'indigo' },
  { label: 'Payouts due', value: '$24,780.60', change: null, note: 'Due on Aug 25, 2026', icon: CreditCardIcon, tone: 'plum' }
];

const funnel = [
  { label: 'Visits', value: '187,652', rate: '—', progress: 100 },
  { label: 'Referrals', value: '35,412', rate: '18.9%', progress: 79 },
  { label: 'Leads', value: '12,689', rate: '35.9%', progress: 60 },
  { label: 'Paid conversions', value: '9,223', rate: '72.7%', progress: 43 },
  { label: 'Revenue', value: '$128,430.25', rate: '$13.91 AOV', progress: 28 }
];

const initialActivity = [
  { title: 'Payout approved', detail: '$3,250.00 to TechGuru.com', time: '10:24 AM', icon: CreditCardIcon, tone: 'indigo' },
  { title: 'New conversion', detail: '$129.00 from ReviewBuddy.io', time: '9:58 AM', icon: TrendingUpIcon, tone: 'amber' },
  { title: 'New affiliate joined', detail: 'BestDealsToday.com', time: '9:41 AM', icon: UserAddIcon, tone: 'purple' },
  { title: 'New lead', detail: 'via TechGuru.com', time: '9:15 AM', icon: SparklesIcon, tone: 'amber' },
  { title: 'Campaign updated', detail: '“Summer Launch”', time: '8:33 AM', icon: CollectionIcon, tone: 'green' }
];

const timeline = [
  { date: 'Today · Aug 21', title: 'Revenue up 18.6%', detail: 'Attributed revenue increased to $128,430.25', time: '8:42 AM', icon: TrendingUpIcon, tone: 'green' },
  { date: 'Aug 20', title: '23 new affiliates joined', detail: 'Total active affiliates is now 342', time: '4:15 PM', icon: UserGroupIcon, tone: 'indigo' },
  { date: 'Aug 19', title: 'Conversion rate improved', detail: 'Now 7.34% (↑ 0.96 pp)', time: '11:03 AM', icon: TrendingUpIcon, tone: 'green' },
  { date: 'Aug 18', title: 'Campaign “Summer Launch” published', detail: 'Active and accepting traffic', time: '9:27 AM', icon: SparklesIcon, tone: 'purple' }
];

const affiliates = [
  { initials: 'TG', name: 'TechGuru.com', clicks: '12,842', conversions: '842', revenue: '$18,642.18', commission: '$3,728.44', tone: 'indigo' },
  { initials: 'DC', name: 'DealCentral.net', clicks: '9,715', conversions: '612', revenue: '$12,930.75', commission: '$2,586.15', tone: 'green' },
  { initials: 'RB', name: 'ReviewBuddy.io', clicks: '8,231', conversions: '508', revenue: '$9,886.40', commission: '$1,977.28', tone: 'plum' },
  { initials: 'LM', name: 'LaunchMaven.com', clicks: '7,664', conversions: '432', revenue: '$8,431.90', commission: '$1,686.38', tone: 'blue' },
  { initials: 'SF', name: 'SmartFinds.co', clicks: '6,451', conversions: '365', revenue: '$6,782.12', commission: '$1,356.42', tone: 'amber' }
];

const setupItems = [
  { label: 'Create your first campaign', detail: 'Launch an offer affiliates can share', complete: true },
  { label: 'Add tracking integration', detail: 'Install the referral tracking snippet', complete: true },
  { label: 'Customize commission rules', detail: 'Set competitive rates for your affiliates', complete: false },
  { label: 'Invite your first affiliates', detail: 'Build your initial partner cohort', complete: true },
  { label: 'Review brand & creatives', detail: 'Add logos, banners, and messaging', complete: false },
  { label: 'Configure payout method', detail: 'Set up how affiliates get paid', complete: false }
];

const SectionLink = ({ children, href }) => (
  <Link className="tp-section-link" href={href}>{children}<ArrowNarrowRightIcon aria-hidden="true" /></Link>
);

export default function HomePage() {
  const router = useRouter();
  const { userDetails, localDemo } = useUser();
  const companyId = router.query.companyId || 'demo';
  const [createOpen, setCreateOpen] = useState(false);
  const [campaignName, setCampaignName] = useState('Partner Growth Sprint');
  const [commissionRate, setCommissionRate] = useState('20');
  const [createdCampaign, setCreatedCampaign] = useState(null);
  const [completedSetup, setCompletedSetup] = useState(() => setupItems.map((item) => item.complete));
  const [activityFilter, setActivityFilter] = useState('Last 7 days');
  const completedCount = completedSetup.filter(Boolean).length;

  const recentActivity = useMemo(() => {
    if (!createdCampaign) return initialActivity;
    return [
      { title: 'Campaign created', detail: `“${createdCampaign}” · ${commissionRate}% commission`, time: 'Just now', icon: CollectionIcon, tone: 'green' },
      ...initialActivity.slice(0, 4)
    ];
  }, [createdCampaign, commissionRate]);

  const handleCreate = (event) => {
    event.preventDefault();
    if (!localDemo) {
      router.push(`/dashboard/${companyId}/campaigns/new`);
      return;
    }
    setCreatedCampaign(campaignName.trim() || 'New campaign');
    setCreateOpen(false);
  };

  return (
    <>
      <SEOMeta title="Affiliate program overview" />
      <div className="tp-dashboard-page">
        <section className="tp-page-intro">
          <div>
            <p className="tp-eyebrow">Welcome back, {userDetails?.full_name || 'V12 Demo Operator'}</p>
            <h1>Overview</h1>
            <p>Here’s what’s happening with your affiliate program.</p>
          </div>
          <button className="tp-primary-action" type="button" onClick={() => setCreateOpen(true)}>
            <PlusIcon aria-hidden="true" /> Create campaign
          </button>
        </section>

        {createdCampaign && (
          <div className="tp-success-banner" role="status">
            <BadgeCheckIcon aria-hidden="true" />
            <span><strong>{createdCampaign}</strong> was created and added to recent activity.</span>
            <button type="button" onClick={() => setCreatedCampaign(null)} aria-label="Dismiss"><XIcon aria-hidden="true" /></button>
          </div>
        )}

        <section className="tp-metric-grid" aria-label="Program performance">
          {metrics.map((metric) => (
            <article className="tp-metric" key={metric.label}>
              <span className={`tp-metric-icon is-${metric.tone}`}><metric.icon aria-hidden="true" /></span>
              <div>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
                <small className={metric.change ? 'is-positive' : ''}>
                  {metric.change && <>↑ {metric.change} </>}{metric.note}
                </small>
              </div>
            </article>
          ))}
        </section>

        <div className="tp-dashboard-grid">
          <section className="tp-panel tp-funnel-panel">
            <div className="tp-panel-heading"><h2>Referral funnel <span>(Last 30 days)</span></h2></div>
            <div className="tp-funnel-list">
              {funnel.map((step, index) => (
                <div className="tp-funnel-row" key={step.label}>
                  <span className={`tp-funnel-dot is-${index}`} />
                  <div className="tp-funnel-copy"><strong>{step.label}</strong><span>{step.value}</span><small>{step.rate}</small></div>
                  <progress value={step.progress} max="100" aria-label={`${step.label}: ${step.value}`} />
                </div>
              ))}
            </div>
            <SectionLink href={`/dashboard/${companyId}/analytics`}>View full funnel report</SectionLink>
          </section>

          <section className="tp-panel tp-timeline-panel">
            <div className="tp-panel-heading">
              <h2>Campaign health timeline</h2>
              <label className="tp-compact-select"><span className="sr-only">Activity period</span><select value={activityFilter} onChange={(event) => setActivityFilter(event.target.value)}><option>Last 7 days</option><option>Last 30 days</option></select></label>
            </div>
            <div className="tp-timeline">
              {timeline.map((item) => (
                <article key={item.title}>
                  <time>{item.date}</time>
                  <span className={`tp-activity-icon is-${item.tone}`}><item.icon aria-hidden="true" /></span>
                  <div><strong>{item.title}</strong><p>{item.detail}</p></div>
                  <small>{item.time}</small>
                </article>
              ))}
            </div>
            <SectionLink href={`/dashboard/${companyId}/analytics`}>View all activity</SectionLink>
          </section>

          <aside className="tp-panel tp-activity-panel">
            <div className="tp-panel-heading"><h2>Recent activity</h2></div>
            <div className="tp-activity-list">
              {recentActivity.map((item) => (
                <article key={`${item.title}-${item.time}`}>
                  <span className={`tp-activity-icon is-${item.tone}`}><item.icon aria-hidden="true" /></span>
                  <div><strong>{item.title}</strong><p>{item.detail}</p></div>
                  <small>{item.time}</small>
                </article>
              ))}
            </div>
            <SectionLink href={`/dashboard/${companyId}/analytics`}>View all activity</SectionLink>
          </aside>

          <section className="tp-panel tp-affiliates-panel">
            <div className="tp-panel-heading"><h2>Top performing affiliates <span>(by revenue)</span></h2></div>
            <div className="tp-table-wrap">
              <table>
                <thead><tr><th>Affiliate</th><th>Clicks</th><th>Conversions</th><th>Revenue</th><th>Commission</th></tr></thead>
                <tbody>
                  {affiliates.map((affiliate) => (
                    <tr key={affiliate.name}>
                      <td><span className={`tp-avatar is-${affiliate.tone}`}>{affiliate.initials}</span><strong>{affiliate.name}</strong></td>
                      <td>{affiliate.clicks}</td><td>{affiliate.conversions}</td><td>{affiliate.revenue}</td><td>{affiliate.commission}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <SectionLink href={`/dashboard/${companyId}/affiliates`}>View all affiliates</SectionLink>
          </section>

          <section className="tp-panel tp-setup-panel">
            <div className="tp-panel-heading"><h2>Setup checklist</h2><small>{completedCount} of {setupItems.length} completed</small></div>
            <div className="tp-progress"><span style={{ width: `${(completedCount / setupItems.length) * 100}%` }} /></div>
            <div className="tp-setup-list">
              {setupItems.map((item, index) => (
                <button type="button" key={item.label} onClick={() => setCompletedSetup((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))} className={completedSetup[index] ? 'is-complete' : ''}>
                  {completedSetup[index] ? <CheckCircleIcon aria-hidden="true" /> : <MinusCircleIcon aria-hidden="true" className="tp-incomplete-icon" />}
                  <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                  {!completedSetup[index] && <ChevronRightIcon aria-hidden="true" />}
                </button>
              ))}
            </div>
            <SectionLink href={`/dashboard/${companyId}/setup`}>View setup guide</SectionLink>
          </section>

          <aside className="tp-panel tp-insight-panel">
            <span className="tp-insight-icon"><LightBulbIcon aria-hidden="true" /></span>
            <div><h2>Focus on what converts</h2><p>Affiliates in the top 20% bring in 78% of your revenue.</p></div>
            <SectionLink href={`/dashboard/${companyId}/analytics`}>View insights</SectionLink>
          </aside>
        </div>
      </div>

      <Transition appear show={createOpen} as={Fragment}>
        <Dialog as="div" className="tp-modal-root" onClose={setCreateOpen}>
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="tp-modal-backdrop" /></Transition.Child>
          <div className="tp-modal-wrap"><div className="tp-modal-positioner">
            <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 translate-y-2" enterTo="opacity-100 translate-y-0" leave="ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-2">
              <Dialog.Panel className="tp-create-dialog">
                <div className="tp-dialog-heading"><div><Dialog.Title>Create a campaign</Dialog.Title><Dialog.Description>Start a focused offer for your affiliate partners.</Dialog.Description></div><button type="button" onClick={() => setCreateOpen(false)} aria-label="Close"><XIcon aria-hidden="true" /></button></div>
                <form onSubmit={handleCreate}>
                  <label>Campaign name<input autoFocus value={campaignName} onChange={(event) => setCampaignName(event.target.value)} required /></label>
                  <label>Commission rate<div className="tp-input-suffix"><input min="1" max="100" type="number" value={commissionRate} onChange={(event) => setCommissionRate(event.target.value)} required /><span>%</span></div></label>
                  <div className="tp-dialog-actions"><button type="button" className="tp-secondary-button" onClick={() => setCreateOpen(false)}>Cancel</button><button type="submit" className="tp-primary-action"><PlusIcon aria-hidden="true" /> Create campaign</button></div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div></div>
        </Dialog>
      </Transition>
    </>
  );
}
