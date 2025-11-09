import SEOMeta from '@/templates/SEOMeta'; 
import Button from '@/components/Button'; 

const CampaignFinder = () => {
  return (
    <>
      <SEOMeta title="Campaign Finder"/>
      <div className="pb-10 mb-12 border-b-4">
        <div className="pt-10 wrapper flex items-center">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Campaign Finder</h1>
          <div className="bg-red-400 text-white inline-flex py-1.5 px-4 text-sm font-bold rounded-md ml-3">
            COMING SOON
          </div>
        </div>
      </div>
      <div className="wrapper">
        <div className="p-8 rounded-xl bg-white shadow-lg border-4 border-gray-200 max-w-2xl mx-auto text-center">
          <p className="text-xl mb-5">We are hard at work building <span className="font-bold">Campaign Finder</span>, a built-in service which will allow you to search for and join other Toppromoter powered affiliate programs directly from your dashboard.</p>
          <Button
            href="https://forms.reform.app/45Dbqq/toppromoter-campaign-finder"
            external
            primary
            large
          >
            Get Updates
          </Button>
        </div>
      </div>
    </>
  );
};

export default CampaignFinder;