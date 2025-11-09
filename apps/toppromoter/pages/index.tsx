/* eslint-disable @next/next/no-img-element */

import { useEffect } from 'react';
import LoadingDots from '@/components/LoadingDots';
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';

export default function Index() {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        } else {
            router.push('/signup');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    
    return (
        <div className="pt-12 wrapper">
            <LoadingDots className='mx-auto my-0' />
        </div>
    )
}