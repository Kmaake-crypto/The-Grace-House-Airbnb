const columns = [
  {
    title: 'Support',
    links: ['Help Center', 'Safety information', 'Cancellation options', 'Our COVID-19 Response', 'Supporting people with disabilities', 'Report a neighborhood concern'],
  },
  {
    title: 'Community',
    links: ['Air B&B.org: disaster relief housing', 'Support Afghan refugees', 'Celebrating diversity & belonging', 'Combating discrimination'],
  },
  {
    title: 'Hosting',
    links: ['Try hosting', 'AirCover: protection for Hosts', 'Explore hosting resources', 'Visit our community forum', 'How to host responsibly'],
  },
  {
    title: 'About',
    links: ['Newsroom', 'Learn about new features', 'Letter from our founders', 'Careers', 'Investors', 'Air B&B Luxe'],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16" style={{ background: '#001E1E' }}>
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold text-sm mb-3" style={{ color: '#016764' }}>{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link} className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-teal-dark" style={{ borderColor: '#016764' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>&copy; 2026 Air B&amp;B, Inc. &middot; Privacy &middot; Terms &middot; Sitemap</span>
          <div className="flex items-center gap-4">
            <span>English (ZA)</span>
            <span>🇿🇦 ZAR</span>
            <span className="hover:text-white cursor-pointer transition-colors">Facebook</span>
            <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  )
}