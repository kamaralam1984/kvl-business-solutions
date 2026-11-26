// Every product/website KVL hosts on its VPS (one entry per nginx site).
// The "Live Products Built" stat on the homepage and About page counts this list,
// NOT the case studies (those are only the ones with a written-up page).
// Add a line here whenever a new site is hosted; keep `live: false` for sites that are
// built and hosted but currently switched off — they still count.
export const hostedProducts: { name: string; host: string; live: boolean }[] = [
  { name: 'VidYT', host: 'vidyt.com', live: true },
  { name: 'AapKaPlot', host: 'aapkaplot.com', live: true },
  { name: '8Rupiya', host: '8rupiya.in', live: true },
  { name: 'Balratn Oil', host: 'balratnoil.in', live: true },
  { name: 'AI Coach', host: 'aicoach.kvlbusinesssolutions.com', live: true },
  { name: 'Body Tracker', host: 'bodytracker.kvlbusinesssolutions.com', live: true },
  { name: 'KVL CRM', host: 'crm.kvlbusinesssolutions.com', live: true },
  { name: 'CRM CE', host: 'crmce.kvlbusinesssolutions.com', live: true },
  { name: 'Growth OS', host: 'growthos.kvlbusinesssolutions.com', live: true },
  { name: 'KVL International School', host: 'school.kvlbusinesssolutions.com', live: true },
  { name: 'KVL Track', host: 'kvltrack.kvlbusinesssolutions.com', live: true },
  { name: 'Naaz Creation', host: 'naazcreation.kvlbusinesssolutions.com', live: true },
  { name: 'Piyu AI', host: 'ai.kvlbusinesssolutions.com', live: true },
  { name: 'Restro OS', host: 'restro.kvlbusinesssolutions.com', live: true },
  { name: 'Sales OS', host: 'salesos.kvlbusinesssolutions.com', live: true },
  { name: 'Super AI Chatbot', host: 'superai.kvlbusinesssolutions.com', live: true },
  { name: 'Gravity Pro', host: 'gravitypro.kvlbusinesssolutions.com', live: true },
  { name: 'Gravity', host: 'gravity.kvlbusinesssolutions.com', live: false },
];

export const hostedProductCount = hostedProducts.length;
