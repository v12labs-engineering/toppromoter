import Head from 'next/head';

function SEOMeta({ title, description, keywords, img }) {
  let setTitle = title ?? 'Toppromoter: Create a privacy-friendly referral program for your SaaS.';
  let setDescription = description ?? 'Create a privacy-friendly referral program for your SaaS.';
  let setKeywords = keywords ?? 'Toppromoter, Referral software, create referral program, stripe referral program';
  let setImg = img ?? '/og.png';

  setTitle = setTitle + ' | Toppromoter Affiliates';

  return (
    <Head>
      <meta key="utfType" charSet="utf-8" />
      <meta key="httpEquiv" httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta key="description" name="description" content={ setDescription } />
      <meta key="keywords" name="keywords" content={ setKeywords } />

      { /* Twitter */ }
      <meta key="twCard" name="twitter:card" content="summary_large_image" />
      <meta key="twImage" name="twitter:image" content={ `${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}${setImg}` } />

      { /* Open Graph */ }
      <meta key="ogURL" property="og:url" content={ `${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}` } />
      <meta key="ogImage" property="og:image" content={ `${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}${setImg}` } />
      <meta key="ogSiteName" property="og:site_name" content="Toppromoter" />
      <meta key="ogTitle" property="og:title" content={ setTitle } />
      <meta key="ogDescription" property="og:description" content={ setDescription } />
      <meta key="themeColor" name="theme-color" content="#ffaf45" />
      <title>
        { setTitle }
      </title>
      <link rel="manifest" href="/site.webmanifest" />
      <link
        href="/tpr-favicon.svg"
        rel="icon"
        type="image/png"
        sizes="16x16"
        purpose="any maskable"
      />
      <link
        href="/tpr-favicon.svg"
        rel="icon"
        type="image/png"
        sizes="32x32"
        purpose="any maskable"
      />
      <link rel="icon" href="/tpr-favicon.svg" type="image/x-icon" />
    </Head>
  )
}

export default SEOMeta;