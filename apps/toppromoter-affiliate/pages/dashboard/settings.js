import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUser, paypalEmail } from '@/utils/useUser';
import SEOMeta from '@/templates/SEOMeta'; 
import { checkValidEmail } from '@/utils/helpers';
import Button from '@/components/Button'; 

const SettingsPage = () => {
  const router = useRouter();
  const { user, userDetails } = useUser();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState(null);
  const [emailValid, setEmailValid] = useState(null);

  const handlePaypalEmail = async (email) => {  
    setLoading(true);  
    await paypalEmail(user?.id, email).then((result) => {
      if(result === 'success'){
        setErrorMessage(null);
        setLoading(false);
      } else {
        setErrorMessage('Unable to change your PayPal email. Please contact support, or try again later.');
        setLoading(false);
      }
    });
  };
  
  return (
    <>
      <SEOMeta title="Settings" />
      <div className="mb-8">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">
            Settings
          </h1>
        </div>
      </div>
      <div className="wrapper">
        <div className="bg-white rounded-lg mt-5 max-w-3xl border-2 border-gray-100">
          <div className="p-6 sm:p-8">
            <div>
              <h3 className="text-lg leading-6 font-semibold text-gray-900 mb-2">
                PayPal Payout Email
              </h3>
              <div>
                <div className="mt-1 flex items-center mb-3">
                  <input
                    minLength="3"
                    maxLength="50"
                    required
                    defaultValue={ userDetails?.paypal_email && userDetails?.paypal_email }
                    placeholder="youremail@email.com"
                    type="email"
                    name="paypal_email"
                    id="paypal_email"
                    autoComplete="paypal_email"
                    onInput={ e=>{setEmailInput(e.target.value)} }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-primary-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    onChange={ e=>{setEmailValid(checkValidEmail(e.target.value)), emailValid ? setEmailInput(e.target.value) : setEmailInput(null)} }
                  />
                </div>
                <p className="text-gray-500">
                  This is the email that your affiliate payout payments will be sent to. Please make sure that it&apos;s the correct email.
                </p>
              </div>
            </div>
          </div>
            <div className="p-6 bg-white flex items-center justify-start">
              <Button
                small
                primary
                disabled={ loading }
                onClick={ e=>{handlePaypalEmail(emailInput)} }>
                <span>
                  { loading ? 'Saving Changes...' : 'Save Changes' }
                </span>
              </Button>
            </div>
          {
            !emailValid && emailValid !== null && emailInput?.length > 4 &&
            <div className=" p-6 bg-white flex items-center justify-start">
              <div className="bg-red-600 text-center p-4 rounded-lg">
                <p className="text-white text-sm font-medium">
                  The email you entered is not valid. Please check it and try again.
                </p>
              </div>
            </div>
          }
        </div>
        {
          errorMessage !== null &&
          <div className="bg-red-600 text-center p-4 mt-5 rounded-lg">
            <p className="text-white text-sm font-medium">
              { errorMessage }
            </p>
          </div>
        }
      </div>
    </>
  );
};

export default SettingsPage;