import fs from 'fs';
['src/pages/Home.tsx', 'src/components/Navbar.tsx', 'src/components/Footer.tsx', 'src/components/SEO.tsx', 'src/constants/schema.ts'].forEach(f => fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/\/TR_Logo\.webp/g, 'https://storage.googleapis.com/thetransformationroomassets/TR%20Logo.png')));
