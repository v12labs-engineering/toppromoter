import {  useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useUser } from '@/utils/useUser';
import { postData } from '@/utils/helpers';
import { SimpleNav } from '@/components/SimpleNav';
import AdminMobileNav from './AdminNavbar/AdminMobileNav';
import AdminDesktopNav from './AdminNavbar/AdminDesktopNav';

function Layout({ children }) {
  const { user, session, userFinderLoaded } = useUser();
  const Toaster = dynamic(() =>
    import('react-hot-toast').then((module) => module.Toaster)
  );

  const router = useRouter();
  const [inviteLoading, setInviteLoading] = useState(false);

  let defaultPage = true;
  let dashboardPage = false;
  let simplePage = false;
  
  if(router.pathname.indexOf('/dashboard') === -1 && router.pathname.indexOf('/dashboard/add-company') === -1 && router.pathname.indexOf('/dashboard/create-team') === -1){
    defaultPage = true;
    dashboardPage = false;
    simplePage = false;
  }
  
  if(router.pathname === '/dashboard/add-company' || router.pathname === '/dashboard/create-team' || router.pathname.includes('/invite/')){
    defaultPage = false;
    dashboardPage = false;
    simplePage = true;
  }
  
  if(router.pathname.indexOf('/dashboard') > -1 && simplePage !== true){
    defaultPage = false;
    dashboardPage = true;
    simplePage = false;
  }

  if(dashboardPage === true){
    if(userFinderLoaded){
      if (!user) router.push('/signin');
    }
  }
  
  const joinCampaignFromInvite = async (details) => {    
    if(!details?.campaign_id){
      return false;
    }
    
    try {
      const { status } = await postData({
        url: '/api/affiliate/campaign-join',
        data: { 
          companyId: details?.company_id,
          campaignId: details?.campaign_id
        },
        token: session.access_token
      });
      
      if(status === 'success'){
        setInviteLoading(false);
        router.push(process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL+'?inviteRefresh=true');
        localStorage.removeItem('join_campaign_details');
      }
  
    } catch (error) {
      setInviteLoading(false);
      router.push(`/invite/${details?.campaign_handle}/${details?.campaign_id}?campaignRedirect=true`);
    }
  };

  if(!router?.asPath.includes('/invite/') && !router?.asPath.includes('inviteRefresh=true')){
    if (typeof window !== 'undefined') {
      if(localStorage.getItem('join_campaign_details')){
        if(user && session){          
          let details = localStorage.getItem('join_campaign_details');
  
          try {
            details = JSON.parse(details);
          } catch (error) {
            console.warn(error);
          }
  
          if(details && inviteLoading === false){
            console.log('----RUNNING JOIN CAMPAIGN FROM INVITE----')
            setInviteLoading(true);
            joinCampaignFromInvite(details);
          }
        }
      }
    }
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={ true }
        gutter={ 20 }
        toastOptions={ {
            className: '',
            duration: 9000,
            success: {
              style: {
                background: '#F0FDF4',
                color: '#28A745',
              },
            },
            error: {
              style: {
                background: '#FEF2F2',
                color: '#DC3545',
              },
            },
        } }
      />
      {
        defaultPage === true ?
          <main id="skip">{children}</main>
        : simplePage === true ?
          <main id="skip">{children}</main>
        : dashboardPage === true ?
          <div>
            <SimpleNav />
            <div className="flex overflow-auto h-screen" style={ {height: 'calc(100vh - 100px)'} }>
              <AdminDesktopNav/>
              <div className="flex-1 overflow-auto focus:outline-none">
                <AdminMobileNav/>
                <main className="flex-1 relative pb-8 z-0 overflow-y-auto">
                  <>
                    {children}
                  </>
                </main>
              </div>
            </div>
          </div>
        : <main id="skip">{children}</main>
      }
    </>
  );
}

export default Layout;