import Auth from '@/templates/Auth'; 
import SEOMeta from '@/templates/SEOMeta';
import { useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();
  const { user } = useUser();

   useEffect(() => {
    if (user) {
      router.push('/dashboard/campaigns');
    }
  }, [user]);

  return (
    <>
      <SEOMeta title="Sign In" />
      <Auth type="signin" />
    </>
  );
}