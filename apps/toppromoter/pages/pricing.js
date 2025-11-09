import { useEffect, useState, useRef } from 'react';
import Pricing from '@/components/Pricing';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import { SEOMeta } from '@/templates/SEOMeta'; 
import LoadingDots from '@/components/LoadingDots';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';

export default function Products() {
  const [products, setProducts] = useState(null);

  const getProducts = async () => {
    const productsWithPrices = await getActiveProductsWithPrices();
    setProducts(productsWithPrices);
  };

  useEffect(() => {
    (async () => {
      if (!products) {
        await getProducts();
      }
    })();
  }, [products]);
  
  return(
    <>
      <SEOMeta 
        title="Pricing"
      />
      <div className="relative bg-white py-5">
        <div className="wrapper">
          <div className="text-center mb-12">
            <p className="text-primary text-medium font-bold mb-5">
              Pricing
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Pricing plans for teams of all sizes
            </h1>
            <p className="text-xl text-gray-500 font-semibold mt-5">
              Choose an affordable plan that&apos;s packed with the best features and start driving sales.
            </p>
          </div>
          <div>
            {
              products !== null ?
                <Pricing products={ products } />
              :
                <div className="flex items-center justify-center">
                  <LoadingDots className='mx-auto my-0' />
                </div>
            }
          </div>
          {/* <div className="py-14 md:pt-32 md:pb-24">
            <Testimonials small />
          </div> */}
          {/* <div className="py-14 md:py-24">
            <Features />
          </div> */}
        </div>
      </div>
    </>
  );

}