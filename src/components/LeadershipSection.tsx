import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const LeadershipSection = () => {
  const team = [
    {
      name: "Katie Peugh",
      role: "Operations & Talent Strategy",
      image: "https://storage.googleapis.com/thetransformationroomassets/Katie.jpg",
      desc: "10+ years across supply chain and warehouse environments. Focuses on aligning people, processes, and strategy."
    },
    {
      name: "Fawn Cook",
      role: "Business Insights & Organizational Design",
      image: "https://storage.googleapis.com/thetransformationroomassets/Fawn.JPG",
      desc: "Proven track record of building high-performing teams and driving transformation at scale."
    },
    {
      name: "Emily Zraunig",
      role: "Solution Design & Leadership",
      image: "https://storage.googleapis.com/thetransformationroomassets/Emily%20Z.jpg",
      desc: "Worked closely with leaders to assess challenges, design practical solutions, and create clarity."
    },
    {
      name: "Valeria Mazo",
      role: "Finance & ROI Strategy",
      image: "https://storage.googleapis.com/thetransformationroomassets/Valeria%20Mazo.jpg",
      desc: "Valeria drives the strategic alignment of technology solutions, ensuring that every project delivers clear, measurable return on investment and financial health for our clients."
    },
    {
      name: "Katie Albares",
      role: "Operations & Human Performance",
      image: "https://storage.googleapis.com/thetransformationroomassets/Katie%20Albares.jpg",
      desc: "Specializes in operational excellence and bridging communication gaps between leadership and field operations."
    }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-24">
           <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">The Leadership Behind the Room</h2>
           <div className="w-24 h-1.5 bg-brand-secondary mx-auto mb-8" />
           <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Bringing together decades of experience in supply chain, technology, and organizational growth.
           </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {team.map((member, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="aspect-[4/5] bg-slate-100 rounded-[2.5rem] mb-8 overflow-hidden transition-all duration-700 relative shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                   <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center text-slate-900 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <ArrowRight className="w-5 h-5" />
                   </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{member.name}</h3>
                <p className="text-brand-primary text-xs font-bold uppercase tracking-widest mb-4 inline-block bg-brand-primary/5 px-2 py-1 rounded">{member.role}</p>
                <p className="text-slate-500 leading-relaxed text-sm">{member.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
