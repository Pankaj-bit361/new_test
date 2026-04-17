export const mockStats = {
  totalRevenue: "$124,500",
  revenueGrowth: "+14.5%",
  activeDeals: 24,
  newContacts: 142,
};

export const mockDeals = [
  { id: "1", name: "Enterprise License Corp", value: 45000, stage: "Negotiation", probability: 80, company: "TechCorp Inc." },
  { id: "2", name: "Q3 Marketing Retainer", value: 12000, stage: "Proposal", probability: 50, company: "Growth Co." },
  { id: "3", name: "SaaS Implementation", value: 28000, stage: "Closed Won", probability: 100, company: "CloudSys" },
  { id: "4", name: "Consulting Package", value: 8500, stage: "Discovery", probability: 20, company: "StartupX" },
  { id: "5", name: "Annual Support Contract", value: 15000, stage: "Negotiation", probability: 90, company: "Global Industries" },
];

export const mockContacts = [
  { id: "1", name: "Alice Freeman", email: "alice@techcorp.com", company: "TechCorp Inc.", role: "CTO", status: "Active", lastContacted: "2 hours ago" },
  { id: "2", name: "Bob Smith", email: "bsmith@growth.co", company: "Growth Co.", role: "Marketing Dir.", status: "Lead", lastContacted: "1 day ago" },
  { id: "3", name: "Charlie Davis", email: "cdavis@cloudsys.net", company: "CloudSys", role: "CEO", status: "Customer", lastContacted: "3 days ago" },
  { id: "4", name: "Diana Prince", email: "diana@startupx.io", company: "StartupX", role: "Founder", status: "Cold", lastContacted: "2 weeks ago" },
  { id: "5", name: "Evan Wright", email: "evan.w@globalind.com", company: "Global Industries", role: "VP Sales", status: "Active", lastContacted: "4 hours ago" },
];

export const mockChartData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 8000 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 9000 },
  { name: "Jul", revenue: 11000 },
];
