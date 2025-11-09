import setupStepCheck from '@/utils/setupStepCheck';
import LoadingDots from '@/components/LoadingDots'; 

export default function SetupPage() {
  setupStepCheck('normal');

  return (
    <div className="pt-12 wrapper">
      <LoadingDots className='mx-auto my-0' />
    </div>
  );
}