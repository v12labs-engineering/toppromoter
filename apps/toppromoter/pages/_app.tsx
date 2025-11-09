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

    if (router?.asPath?.indexOf('&token_type=bearer&type=recovery') > 0) {
      let access_token = router?.asPath?.split('access_token=')[1].split('&')[0];
      router.push('/reset-password?passwordReset=true&access_token=' + access_token + '');
    }
  });

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