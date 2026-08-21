import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from 'utils/useUser';
import DashboardShell from '@/components/DashboardShell';

export default function Layout({ children }) {
  const { user, userFinderLoaded } = useUser();
  const Toaster = dynamic(() =>
    import('react-hot-toast').then((module) => module.Toaster)
  );
  // const Footer = dynamic(() => import('@/components/Footer'));
  // const AdminMobileNav = dynamic(() => import('@/components/AdminNavbar/AdminMobileNav'));
  // const AdminDesktopNav = dynamic(() => import('@/components/AdminNavbar/AdminDesktopNav'));
  const SimpleNav = dynamic(() => import('@/components/SimpleNav'));
  const router = useRouter();
  let defaultPage = true;
  let dashboardPage = false;
  let simplePage = false;
  let campaignCustomizer = false;

  if(router.pathname.indexOf('/dashboard') === -1 && router.pathname.indexOf('/dashboard/add-company') === -1 && router.pathname.indexOf('/dashboard/create-team') === -1){
    dashboardPage = false;
    simplePage = false;
    campaignCustomizer = false;
    defaultPage = true;
  }

  if(router.pathname === '/dashboard/add-company' || router.pathname === '/dashboard/create-team'){
    defaultPage = false;
    dashboardPage = false;
    campaignCustomizer = false;
    simplePage = true;
  }

  if(router.pathname.indexOf('/dashboard') > -1 && simplePage !== true){
    defaultPage = false;
    simplePage = false;
    campaignCustomizer = false;
    dashboardPage = true;
  }
  
  useEffect(() => {
    if(dashboardPage === true){
      if(userFinderLoaded){
        if (!user) router.push('/signin');
      }
    }
  }, [userFinderLoaded, user, dashboardPage]);

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
                fontSize: '15px',
                fontWeight: '500'
              },
            },
            error: {
              style: {
                background: '#FEF2F2',
                color: '#DC3545',
                fontSize: '15px',
                fontWeight: '500'
              },
            },
        } }
      />
      { simplePage === true && <SimpleNav /> }
      { defaultPage === true ? (
        <main id="skip" className='bg-white'>
          { children }
        </main>) : simplePage === true ? (
          <main id="skip">
            { children }
          </main>)
          : dashboardPage === true ?
            <DashboardShell>{children}</DashboardShell>
          : (
            <main id="skip">
              { children }
            </main>)
        }
    </>
  );
}
