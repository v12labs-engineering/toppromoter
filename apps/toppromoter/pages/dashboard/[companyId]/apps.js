import SEOMeta from '@/templates/SEOMeta'; 
import LoadingDots from '@/components/LoadingDots';

export default function AppsPage() {
  return (
    <>
      <SEOMeta title="Apps" />
      <div className="pb-10 mb-12 border-b-4">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">
            Apps
          </h1>
        </div>
      </div>
      <div className="wrapper">
        <div
          className="p-8 rounded-xl bg-white shadow-lg border-4 border-gray-200 max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-3">
            <LoadingDots className='mx-auto my-0' />
          </div>
          <p className="mt-3 text-xl">
            Apps are coming very soon.
          </p>
        </div>
      </div>
    </>
  );
}