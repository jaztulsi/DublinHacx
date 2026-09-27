import { motion } from "framer-motion";
import { useState } from "react";

type Judge = {
  name: string;
  title: string;
  company?: string;
  location: string;
  /** Credential line kept with the data; not currently rendered. */
  education?: string;
  tags: string[];
  bio: string;
  img?: string;
  emphasize?: boolean;
};

const judges: Judge[] = [
  {
    name: "Palvinder Singh",
    title: "Co-Founder & CTO",
    company: "Context66",
    location: "United States",
    education: "Distinguished Engineer & Inventor",
    img: "/palvinder-singh.png",
    emphasize: true,
    tags: [
      "Distinguished Engineer",
      "Inventor",
      "Enterprise Leadership",
      "Applied Innovation",
    ],
    bio: "Co-Founder and CTO of Context66. He previously held senior leadership roles at Salesforce, Viasat, Intel, and LG Electronics. He's recognized as a distinguished engineer and inventor, known for bringing cutting-edge technology into practical, everyday use.",
  },
  {
    name: "Vasuki Uday Kiran Vudathala",
    title: "Staff Performance Engineer",
    company: "ServiceNow",
    location: "Pleasanton, California",
    education: "MCA, Computer Science — Jawaharlal Nehru Technological University",
    img: "/uday-vudathala.jpg",
    tags: [
      "Generative AI",
      "Cloud & Reliability",
      "Performance Engineering",
      "Google Cloud Certified — Generative AI",
    ],
    bio: "15+ years in performance engineering and distributed systems, building scalable enterprise cloud and Generative AI platforms. Google Cloud certified in GenAI; has judged and mentored at hackathons including UC Berkeley's AI Hackathon 2026.",
  },
  {
    name: "Sourabh Kukar",
    title: "Director of Technical Consulting",
    company: "Salesforce",
    location: "United States",
    education: "IEEE Senior Member — 23 industry certifications",
    img: "/sourabh-kukar.jpg",
    tags: [
      "Revenue Cloud & CPQ",
      "Agentforce",
      "Enterprise Architecture",
      "IEEE Senior Member",
    ],
    bio: "Leads a team of enterprise architects delivering Revenue Cloud, CPQ, and Agentforce solutions for major enterprise clients. Holds 23 industry certifications, is an IEEE Senior Member, and was named Salesforce's FY24 CMT Technical Architect of the Year. An active mentor and judge across the tech community — hackathons, IEEE conference reviewing, and industry awards panels — passionate about helping the next generation of technologists build and present real-world solutions.",
  },
  {
    name: "Sashank Agarwal",
    title: "Senior Cloud Infrastructure & Software Engineer",
    company: "NVIDIA",
    location: "United States",
    education: "Previously Intuit & Red Hat",
    img: "/sashank-agarwal.jpg",
    tags: [
      "AI Infrastructure",
      "Distributed Systems",
      "Kubernetes",
      "Cloud-Native Platforms",
    ],
    bio: "Senior Cloud Infrastructure and Software Engineer at NVIDIA, specializing in AI infrastructure, distributed systems, Kubernetes, and cloud-native platforms. Previously at Intuit and Red Hat, where he contributed to large-scale infrastructure, observability systems, and open-source cloud-native technologies including the Loki Operator ecosystem. His expertise spans AI infrastructure, high-performance computing, platform engineering, observability, and scalable distributed systems.",
  },
  {
    name: "Yash Shah",
    title: "Software Engineer II",
    company: "Apple",
    location: "Cupertino, California",
    education: "M.S. Computer Science — University of Texas at Dallas",
    img: "/yash-shah.jpg",
    tags: [
      "AI/ML Systems",
      "Distributed Systems",
      "Developer Tooling",
      "Cloud Infrastructure",
    ],
    bio: "Software Engineer II at Apple, building backend and distributed systems. Previously at Microsoft, Oracle OCI, and HSBC, working with Go, Java, Python, Kafka, Kubernetes, and AWS. Holds an M.S. in Computer Science from UT Dallas. His interests sit at the intersection of AI/ML systems, developer tooling, and cloud infrastructure, and he especially enjoys mentoring early-career builders.",
  },
  {
    name: "Santosh Koti",
    title: "Senior Staff Software Engineer",
    location: "United States",
    education: "IEEE Senior Member",
    img: "/santosh.jpg",
    tags: [
      "Distributed Systems",
      "Kubernetes",
      "AI/ML Platforms",
      "IEEE Senior Member",
    ],
    bio: "Senior Staff Software Engineer with expertise in distributed systems, Kubernetes, cloud infrastructure, and AI/ML platforms. He has architected and built large-scale production systems for high-throughput, low-latency workloads, focusing recently on streaming data platforms using Kafka, Benthos, and Kubernetes. His broader interests span platform engineering, observability, reliability, LLM inference and serving, and scalable AI infrastructure. Santosh is an IEEE Senior Member and enjoys mentoring builders and evaluating projects for technical depth, practical impact, and real-world scalability.",
  },
  {
    name: "Venkat Munjeti",
    title: "Founder & Chair",
    company: "Dream College Path · Variant Systems",
    location: "United States",
    education: "M.S. IT Management — Postgraduate Certification, Cloud Computing & AI for Leadership",
    img: "/venkat-munjeti.jpg",
    tags: [
      "Technology Leadership",
      "Entrepreneurship",
      "Cloud & AI",
      "Education Advocacy",
    ],
    bio: "Technology leader, entrepreneur, and education advocate. Founder of Dream College Path and Variant Systems Inc., and Chair of DVTI. He holds an M.S. in IT Management with postgraduate certification in Cloud Computing and AI for Leadership. In 2025–26 he served as Destination Imagination Team Manager for the Windmere Ranch 8th Grade Girls Team, mentoring them all the way to the Global Finals. Learn more at DreamCollegePath.com and VariantSystems.us.",
  },
  {
    name: "Vishal Punjabi",
    title: "Principal AI Scientist",
    company: "SAP Labs",
    location: "United States",
    education: "12+ years in AI & Machine Learning",
    img: "/vishal-punjabi.jpg",
    tags: [
      "Artificial Intelligence",
      "Machine Learning",
      "Applied Research",
      "Hackathon Judge",
    ],
    bio: "Principal AI Scientist at SAP Labs, where he works on artificial intelligence and machine learning with more than 12 years of experience in the field. He has judged several hackathons and competed in many of them himself. He believes in AI as a way to build things that actually matter — and in hackathons as one of the best places to put that belief to work.",
  },
  {
    name: "Nandish Nanjappa",
    title: "Staff Software Engineer",
    location: "United States",
    education: "Distributed Systems & Agentic AI Platforms",
    img: "/nandish.jpg",
    tags: [
      "Agentic AI Platforms",
      "Distributed Systems",
      "Cloud Infrastructure",
      "High-Availability Control Planes",
    ],
    bio: "Staff Software Engineer with deep expertise in distributed systems, Agentic AI platforms, cloud infrastructure, and high-availability control planes. He has architected resilient, large-scale production platforms for mission-critical workloads, focusing recently on multi-pod agentic execution harnesses, Model Context Protocol (MCP) tool integration, and multi-model LLM routing. Nandish enjoys mentoring builders and serving as an industry reviewer and judge, evaluating complex systems for technical depth and real-world problem solving.",
  },
  {
    name: "Amit Panda",
    title: "Staff Software Engineer",
    company: "LinkedIn",
    location: "United States",
    education: "M.S. Computer Science — Georgia Tech",
    img: "/amit-panda.jpg",
    tags: [
      "Backend Platform Engineering",
      "Data Infrastructure",
      "Distributed Systems",
      "Ads Ranking & Delivery",
    ],
    bio: "Staff Software Engineer at LinkedIn with 10+ years of experience across LinkedIn, Meta, Google, and Yelp, specializing in backend platform engineering, data infrastructure, and large-scale distributed systems. His expertise spans data lakehouse and cataloging platforms, ads ranking and delivery infrastructure, ETL pipelines, and cloud-native backend services. He holds an M.S. in Computer Science from Georgia Tech and has judged and mentored at multiple internal hackathons at LinkedIn and Meta.",
  },
  {
    name: "Prakshal Doshi",
    title: "Architect",
    company: "Apple",
    location: "United States",
    img: "/prakshal-doshi.jpg",
    tags: ["Infrastructure", "Reliability & Availability", "Security", "Performance"],
    bio: "Prakshal Doshi is an architect and builds infrastructure that's reliable, available, secure and performing for Apple.",
  },
  {
    name: "Naveen Prakash",
    title: "Senior Test Engineer",
    company: "Yahoo",
    location: "United States",
    education: "Published researcher — IEEE Xplore · ACM certified peer reviewer",
    img: "/naveen-prakash.jpg",
    tags: ["Quality Engineering", "Test Architecture", "Intelligent Test Automation", "AI in Engineering"],
    bio: "Senior Test Engineer at Yahoo with over 16 years of experience in quality engineering and test architecture across Yahoo, eBay, and Apple. His expertise includes software reliability, intelligent test automation, and applying artificial intelligence to solve complex engineering challenges. He is a published researcher with work indexed on IEEE Xplore, an ACM certified peer reviewer, and has previously served as a judge for the Claro Awards. He enjoys supporting emerging talent and helping young developers turn creative concepts into practical solutions.",
  },
  {
    name: "Timur Rakhmatullin",
    title: "Senior Software Engineer & Backend Architect",
    company: "Softline Solutions",
    location: "Los Angeles, California",
    education: "Stanford Continuing Studies — Large Language Models for Business with Python (2026)",
    img: "/timur-rakhmatullin.jpg",
    tags: ["AI/ML", "Cloud Platforms", "Backend Architecture", "Awards Judging"],
    bio: "Senior Software Engineer and Backend Architect at Softline Solutions in Los Angeles, with deep expertise in AI/ML, cloud platforms, and backend systems. He holds an O-1 Extraordinary Ability visa (approved twice) and is completing Stanford Continuing Studies — Large Language Models for Business with Python. He brings extensive judging experience from the Edison Awards, CODiE Leadership Awards, Golden App Awards, the AITEX Summit, and the SiliconANGLE TechForward Awards.",
  },
];

function JudgeAvatar({ name, img }: { name: string; img?: string }) {
  const [errored, setErrored] = useState(false);
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  if (img && !errored) {
    return (
      <img
        src={img}
        alt={name}
        onError={() => setErrored(true)}
        className="h-16 w-16 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow font-display text-xl font-bold text-primary-foreground">
      {initials}
    </div>
  );
}

/** One judge card. Fixed width so the belt scrolls at a steady rhythm. */
function JudgeCard({ j }: { j: Judge }) {
  return (
    <article
      className={`flex w-[300px] shrink-0 flex-col rounded-2xl border bg-card/30 p-5 backdrop-blur-md sm:w-[340px] ${
        j.emphasize ? "border-primary/40" : "border-border"
      }`}
    >
      <div className="flex items-center gap-3">
        <JudgeAvatar name={j.name} img={j.img} />
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold leading-tight">{j.name}</h3>
          <p className="text-xs text-primary">
            {j.title}
            {j.company ? ` @ ${j.company}` : ""}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{j.location}</p>
        </div>
      </div>

      {/* Clamped so every card is the same height — hover pauses the belt to read. */}
      <p className="mt-3 line-clamp-6 text-xs leading-relaxed text-muted-foreground">{j.bio}</p>
    </article>
  );
}

/**
 * Judges scroll as one continuous loop. The list is rendered twice and the
 * track slides exactly one copy's width, so the seam is invisible; the second
 * copy is aria-hidden so screen readers hear each judge once.
 */
function JudgeBelt() {
  return (
    <div className="group relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <style>{`
        @keyframes judge-belt { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @media (prefers-reduced-motion: reduce) { .judge-belt { animation: none !important } }
      `}</style>
      <div
        className="judge-belt flex w-max group-hover:[animation-play-state:paused]"
        style={{ animation: "judge-belt 80s linear infinite" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex w-max gap-5 pr-5" aria-hidden={copy === 1}>
            {judges.map((j) => (
              <JudgeCard key={j.name} j={j} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function JudgesSection() {
  return (
    <section id="judges" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 font-pixel text-sm uppercase tracking-widest text-primary">Judges</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
            The people judging your <span className="text-gradient-primary">build</span>.
          </h2>
        </motion.div>
      </div>

      {/* Full-bleed: the belt runs edge to edge rather than inside the container. */}
      <JudgeBelt />

      <div className="mx-auto max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          Want to become a judge? Email{" "}
          <a
            href="mailto:parvaan.dublinhacx@gmail.com"
            className="text-primary underline underline-offset-4"
          >
            parvaan.dublinhacx@gmail.com
          </a>
        </motion.p>
      </div>
    </section>
  );
}
