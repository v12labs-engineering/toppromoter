import { useRouter } from 'next/router';
import { useState } from 'react';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { useUser } from '@/utils/useUser';
import Button from '@/components/Button'; 
import PricingFeatures from '@/components/PricingFeatures'; 

let toast;
if (typeof window !== 'undefined' ) {
  import('react-hot-toast').then(({ toast: t }) => {
    toast = t;
  })
}

export const Pricing = ({ products }) => {
  const router = useRouter();
  const { userDetails, session, planDetails } = useUser();
  const [priceIdLoading, setPriceIdLoading] = useState(false);

  const handleCheckout = async (price) => {    
    setPriceIdLoading(price);

    if (!session) {
      return router.push('/signin');
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price: price, teamId: userDetails?.team_id },
        token: session.access_token
      });

      const stripe = await getStripe();
      stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      return toast.error(error.message);
    } finally {
      setPriceIdLoading(false);
    }
  };

  let productsSorted = products;

  if(products?.length){
    productsSorted = products.sort(function(a, b) {
      return parseFloat(a.prices[0].unit_amount/100) - parseFloat(b.prices[0].unit_amount/100);
    });
  }

  if(productsSorted?.length){
    return (
      <div>
        <div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0">
            {/* <div key="free" className="border-2 border-gray-100 rounded-[22px] bg-white">
              <div className="p-6">
                <h2 className="text-xl font-bold leading-6 text-gray-900">Free</h2>
                <p className="mt-8">
                  <span className="text-2xl font-extrabold text-gray-900">9%</span>
                  <span className="text-medium font-semibold text-gray-600"> fee per successful referral*</span>
                </p>
                <Button
                  medium
                  outline
                  className="mt-8 w-full"
                  href="/signup"
                >
                  {planDetails === 'free' ? 'Current Plan' : 'Get Started for Free'}
                </Button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <PricingFeatures productName="free"/>
              </div>
            </div> */}
            {productsSorted?.map((product) => {
              const priceString = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: product?.prices[0].currency,
                minimumFractionDigits: 0
              }).format(product.prices[0].unit_amount / 100);

              return (
                <div key={product?.name} className={`${product?.name === "Standard" ? 'border-primary' : 'bg-white'} border-2 rounded-[22px] w-[50%] mx-auto my-0 relative flex justify-center items-center`}>
                  <div className="pt-6 pb-8 px-6">
                    <PricingFeatures productName={product?.name}/>
                  </div>
                  <div className="p-6">
                    <h2 className={`${product?.name === "Standard" ? 'text-primary' : 'text-gray-900'} text-xl leading-6 font-bold`}>
                      {product?.name}
                    </h2>
                    <p className="mt-8">
                      <span className='text-gray-900 text-4xl font-bold'>{priceString}</span>
                      <span className='text-medium font-semibold text-gray-600'> /month</span><br></br>
                      <span className="text-base text-gray-400">7-day free trial</span>
                    </p>
                    <Button
                      disabled={planDetails === product?.name}
                      medium
                      outline={product?.name !== "Standard"}
                      primary={product?.name === "Standard"}
                      className='mt-8 w-full'
                      onClick={() => handleCheckout(product?.prices[0].id)}
                    >
                      {planDetails === product?.name ? 'Current Plan' : priceIdLoading === product?.prices[0].id ? 'Loading...' : 'Subscribe'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    return false;
  }
};

export default Pricing;