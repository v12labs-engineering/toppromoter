import { CheckIcon, XIcon } from '@heroicons/react/solid';

export const PricingParams = () => {
  return({
    "standard": {
      "companies": 'Unlimited',
      "campaigns": 'Unlimited',
      "affiliates": 'Unlimited'
    }
  })
}

export const PricingFeatures = ({ productName, normal }) => {

  if(!productName) return false;

  const capitalizedName = productName.charAt(0).toUpperCase() + productName.slice(1);

  const plans = PricingParams();

  const features = {
    "Standard": [
      {
        text: `${plans?.standard?.affiliates} affiliates`,
        type: 'eligible'
      },
      {
        text: `${plans?.standard?.companies} companies`,
        type: 'eligible'
      },
      {
        text: `${plans?.standard?.campaigns} campaigns`,
        type: 'eligible'
      },
      {
        text: 'Stripe / Paddle Auto Sync',
        type: 'eligible'
      },
      {
        text: 'PayPal Mass Payouts',
        type: 'eligible'
      },
      {
        text: 'Live chat & email support',
        type: 'eligible'
      },
      {
        text: 'Campaign page customizer',
        type: 'eligible'
      },    
      {
        text: 'Campaign and affiliate analytics',
        type: 'eligible'
      },    
    ]
  };

  return(
    <ul role="list" className="space-y-3">
      {
        features[capitalizedName]?.map((feature, index) => {
          return(
            <li key={index} className={`${feature.type === 'ineligible' && 'opacity-50'} flex space-x-2`}>
              {
                feature.type === 'eligible' ?
                  <CheckIcon className= 'text-green-600 h-6 w-6'/>
                : <XIcon className='text-gray-500 h-6 w-6'/>
              }
              <span className='text-gray-500text-base'>{feature.text}</span>
            </li>
          )
        })
      }
    </ul>
  )
};

export default PricingFeatures;