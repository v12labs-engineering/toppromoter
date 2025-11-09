import SEOMeta from '@/templates/SEOMeta'; 

const stats = [
  { name: 'Total Subscribers', stat: '71,897' },
  { name: 'Avg. Open Rate', stat: '58.16%' },
  { name: 'Avg. Click Rate', stat: '24.57%' },
];

export default function HomePage() {
  return (
    <>
      <SEOMeta title="Home" />
      <div className="py-10 mb-12 border-b-4">
        <div className="wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">
            Home
          </h1>
        </div>
      </div>
      <div className="pb-10 mb-12 border-b-4">
        <div className="wrapper">
          <h3 className="text-sm font-semibold">
            Last 30 days
          </h3>
          <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3">
            { stats.map((item) => (
              <div key={ item.name } className="overflow-hidden rounded-xl bg-white p-6 border-4 shadow-lg">
                <dt className="text-sm">
                  { item.name }
                </dt>
                <dd className="mt-1 text-3xl font-semibold">
                  { item.stat }
                </dd>
              </div>
            )) }
          </dl>
        </div>
      </div>
      <div className="wrapper">
      </div>
    </>
  );
}