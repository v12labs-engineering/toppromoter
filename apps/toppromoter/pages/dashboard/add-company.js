import dynamic from 'next/dynamic';

export default function AddCompany() {
  const Company = dynamic(() => import('@/components/AddCompany'));
  return <Company />
}