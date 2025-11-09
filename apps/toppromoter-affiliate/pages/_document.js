import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/tpr-favicon.svg" type="image/x-icon" />
          <link rel="icon" type="image/png" sizes="32x32" href="/tpr-favicon.svg" />
          <link rel="icon" type="image/png" sizes="16x16" href="/tpr-favicon.svg" />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <body className="loading affiliate-body">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;