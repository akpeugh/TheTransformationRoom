import fs from 'fs';
['src/pages/Contact.tsx', 'src/pages/CareerTool.tsx', 'src/components/CareerPathSimulator.tsx', 'src/components/ChatBot.tsx', 'src/components/ScorecardTool.tsx', 'src/components/VideoCompanionMode.tsx'].forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\/Nova_face\.webp/g, 'https://storage.googleapis.com/thetransformationroomassets/Nova%20face');
  fs.writeFileSync(f, content);
});
