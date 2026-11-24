export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const stats = [
  { label: 'Hospitals connected', value: 842, suffix: '+' },
  { label: 'Blood units available', value: 15600, suffix: '+' },
  { label: 'Successful donations', value: 48200, suffix: '+' },
  { label: 'Lives saved', value: 21300, suffix: '+' },
];

export const features = [
  {
    icon: 'Activity',
    title: 'Live blood availability',
    desc: 'See real-time stock across every connected blood bank, updated the moment inventory changes.',
  },
  {
    icon: 'MapPin',
    title: 'Nearby hospitals',
    desc: 'Sorted by distance and stock, so the closest match is always the first thing you see.',
  },
  {
    icon: 'Siren',
    title: 'Emergency search',
    desc: 'One tap surfaces every unit of your blood type within reach, ranked by how fast you can get there.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Verified hospitals',
    desc: 'Every listed facility is licensed and inventory-audited before it ever reaches your search results.',
  },
  {
    icon: 'Lock',
    title: 'Secure platform',
    desc: 'Patient records and requests are encrypted end-to-end and never shared without consent.',
  },
  {
    icon: 'RefreshCw',
    title: 'Real-time updates',
    desc: 'Stock counts, request status, and hospital responses sync live — no refreshing, no guessing.',
  },
];

export const steps = [
  { title: 'Search blood', desc: 'Enter your blood group and location to start.' },
  { title: 'Find nearby hospital', desc: 'Compare distance, stock, and response time at a glance.' },
  { title: 'Contact hospital', desc: 'Call directly or send a request in one tap.' },
  { title: 'Receive blood', desc: 'Get directions and confirmation the moment it is reserved.' },
];

export const hospitals = [
  {
    id: 1,
    name: 'Sanjeevani General Hospital',
    distance: '1.2 km',
    address: 'MI Road, Jaipur',
    rating: 4.8,
    phone: '+91 141 2200 111',
    stock: { 'A+': 12, 'A-': 2, 'B+': 20, 'B-': 0, 'AB+': 5, 'AB-': 1, 'O+': 30, 'O-': 4 },
    verified: true,
  },
  {
    id: 2,
    name: 'Rajdhani Blood Bank & Trust',
    distance: '2.5 km',
    address: 'C-Scheme, Jaipur',
    rating: 4.6,
    phone: '+91 141 2200 222',
    stock: { 'A+': 4, 'A-': 0, 'B+': 8, 'B-': 3, 'AB+': 0, 'AB-': 0, 'O+': 14, 'O-': 6 },
    verified: true,
  },
  {
    id: 3,
    name: 'Lifeline Care Hospital',
    distance: '3.8 km',
    address: 'Malviya Nagar, Jaipur',
    rating: 4.4,
    phone: '+91 141 2200 333',
    stock: { 'A+': 0, 'A-': 1, 'B+': 2, 'B-': 0, 'AB+': 3, 'AB-': 0, 'O+': 6, 'O-': 0 },
    verified: true,
  },
  {
    id: 4,
    name: 'Apex Multispeciality',
    distance: '5.1 km',
    address: 'Vaishali Nagar, Jaipur',
    rating: 4.7,
    phone: '+91 141 2200 444',
    stock: { 'A+': 18, 'A-': 5, 'B+': 11, 'B-': 4, 'AB+': 7, 'AB-': 2, 'O+': 22, 'O-': 9 },
    verified: true,
  },
];

export const testimonials = [
  {
    name: 'Ritika Sharma',
    role: 'Patient family, Jaipur',
    quote: 'We found four matching units within minutes during a night emergency. The distance sorting alone saved us over an hour.',
  },
  {
    name: 'Dr. Arvind Mehta',
    role: 'Blood Bank Director, Lifeline Care',
    quote: 'Updating our inventory takes seconds now, and requests arrive already sorted by urgency. Our response time has roughly halved.',
  },
  {
    name: 'Farhan Qureshi',
    role: 'Regular donor',
    quote: 'I get notified when my blood type is running low nearby. It turned donating from a yearly reminder into something I actually act on.',
  },
  {
    name: 'Sunita Rao',
    role: 'Patient, thalassemia care',
    quote: 'Knowing exactly which hospital has O-negative in stock before I even leave the house has changed how we plan transfusions.',
  },
];

export const notifications = [
  { id: 1, text: 'O- stock fell below 5 units at your facility', time: '6m ago', tone: 'caution' },
  { id: 2, text: 'New request from Patient #4482 for B+', time: '22m ago', tone: 'info' },
  { id: 3, text: 'Inventory audit completed successfully', time: '2h ago', tone: 'success' },
];
