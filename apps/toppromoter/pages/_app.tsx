import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Layout from '@/templates/Layout';
import { useRouter } from 'next/router';
import SEOMeta from '@/templates/SEOMeta';
import { UserContextProvider } from '@/utils/useUser';
import { CompanyContextProvider } from '@/utils/CompanyContext';
import '@/dist/styles.css';

export default function MyApp({ Component, pageProps: { ...pageProps }, }: AppProps<{}>) {
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
      <div>
        {
          router.pathname.indexOf('/dashboard') > -1 ?
            <UserContextProvider>
              <CompanyContextProvider>
                <Layout>
                  <Component { ...pageProps } />
                </Layout>
              </CompanyContextProvider>
            </UserContextProvider>
            :
            <UserContextProvider>
              <Layout>
                <Component { ...pageProps } />
              </Layout>
            </UserContextProvider>
        }
      </div>
    </>
  );
}
