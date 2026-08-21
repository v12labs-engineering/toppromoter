/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import '@/dist/styles.css';
import Layout from '@/templates/Layout';
import { useRouter } from 'next/router';
import SEOMeta from '@/templates/SEOMeta';
import { UserContextProvider } from '@/utils/useUser';
import { UserAffiliateContextProvider } from '@/utils/UserAffiliateContext';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  useEffect(() => {
    document.body.classList?.remove('loading');

    const recoveryParams = new URLSearchParams(window.location.hash.slice(1));
    if (
      recoveryParams.get('type') === 'recovery' &&
      recoveryParams.get('access_token') &&
      router.pathname !== '/reset-password'
    ) {
      router.replace(`/reset-password${window.location.hash}`);
    }
  }, [router]);

  return (
    <>
      <SEOMeta />
      <UserContextProvider>
        <UserAffiliateContextProvider>
          <Layout>
            <Component { ...pageProps } />
          </Layout>
        </UserAffiliateContextProvider>
      </UserContextProvider>
    </>
  );
}
