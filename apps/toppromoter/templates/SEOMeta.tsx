import Head from 'next/head';

type SEOMetaProps = {
  title?: string;
  description?: string;
  keywords?: string;
  img?: string;
}

export const SEOMeta: React.FC<SEOMetaProps> = ({ title, description, keywords, img }) => {

  let setTitle = "Toppromoter: Create a privacy-friendly referral program for your SaaS.";
  let setDescription = "Create a privacy-friendly referral program for your SaaS.";
  let setKeywords = "Toppromoter, Referral software, create referral program, stripe referral program";
  let setImg = "/og.png";

  if(title){
    setTitle = title;
  }

  if(description){
    setDescription = description;
  }

  if(keywords){
    setKeywords = keywords;
  }

  if(img){
    setImg = img;
  }

  setTitle = setTitle + " | Toppromoter";

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="description" content={setDescription} />
      <meta name="keywords" content={setKeywords} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" key="twcard" />
      <meta name="twitter:image" content={`https://toppromoter.io${setImg}`}/>

      {/* Open Graph */}
      <meta property="og:url" content="https://toppromoter.io" key="ogurl" />
      <meta property="og:image" content={setImg} key="ogimage" />
      <meta property="og:site_name" content="Toppromoter" key="ogsitename" />
      <meta property="og:title" content={setTitle} key="ogtitle" />
      <meta property="og:description" content={setDescription} key="ogdesc" />
      <title>{setTitle}</title>
    </Head>
  )
};

export default SEOMeta;