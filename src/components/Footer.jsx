const columns = [
  {
    title: 'Support',
    links: ['Help Center', 'Safety information', 'Cancellation options', 'Our COVID-19 Response', 'Supporting people with disabilities', 'Report a neighborhood concern'],
  },
  {
    title: 'Community',
    links: ['StayFinder.org: disaster relief housing', 'Support Afghan refugees', 'Celebrating diversity & belonging', 'Combating discrimination'],
  },
  {
    title: 'Hosting',
    links: ['Try hosting', 'AirCover: protection for Hosts', 'Explore hosting resources', 'Visit our community forum', 'How to host responsibly'],
  },
  {
    title: 'About',
    links: ['Newsroom', 'Learn about new features', 'Letter from our founders', 'Careers', 'Investors', 'StayFinder Luxe'],
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link} className="text-sm text-gray-600 hover:underline cursor-pointer">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>&copy; 2026 StayFinder, Inc. &middot; Privacy &middot; Terms &middot; Sitemap</span>
          <div className="flex items-center gap-4">
            <span>English (US)</span>
            <span>$ USD</span>
            <span>Facebook</span>
            <span>Twitter</span>
            <span>Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  )
}