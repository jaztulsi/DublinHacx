import { motion } from "framer-motion";
import { useState } from "react";

type Judge = {
  name: string;
  title: string;
  company?: string;
  location: string;
  education: string;
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
    name: "Mandar Chaudhari",
    title: "Full-Stack Geospatial Software Developer",
    company: "Land IQ",
    location: "United States",
    education: "M.S. Computer Science — George Mason University",
    img: "/mandar-chaudhari.png",
    tags: [
      "Geospatial Platforms",
      "AI/ML",
      "Aviation Decision-Support",
      "AWS Certified Solutions Architect",
    ],
    bio: "Full-Stack Geospatial Software Developer at Land IQ and Research Assistant at George Mason University's Center for Air Transportation Systems Research. His work spans production AI/ML and geospatial platforms for California state agencies and AI-enabled decision-support systems in aviation. He holds an M.S. in Computer Science from George Mason University and is an AWS Certified Solutions Architect.",
  },
  {
    name: "Santosh",
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
    name: "Nandish",
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
    bio: "Staff Software Engineer with deep expertise in distributed systems, Agentic AI platforms, cloud infrastructure, and high-availability control planes. He has architected resilient, large-scale production platforms for mission-critical workloads, focusing recently on multi-pod agentic execution harnesses, Model Context Protocol (MCP) tool integration, multi-model LLM routing, and automated evaluation frameworks. His broader track record spans scale-out workflow orchestration, exabyte-scale metadata tiering, zero-RPO synchronous storage replication, and high-concurrency job scheduling. Nandish enjoys mentoring builders and serving as an industry reviewer and judge, evaluating complex systems for technical depth, operational efficiency, and real-world problem solving.",
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

export function JudgesSection() {
  return (
    <section id="judges" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
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

        <div className="mx-auto grid max-w-xs grid-cols-1 justify-center gap-6 sm:max-w-2xl sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-3 xl:max-w-6xl xl:grid-cols-4">
          {judges.map((j, i) => (
            <motion.div
              key={j.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="w-full max-w-xs rounded-2xl border border-border bg-card/30 p-5 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <JudgeAvatar name={j.name} img={j.img} />
                <div className="min-w-0">
                  <h3 className={`font-display font-bold leading-tight ${j.emphasize ? "text-lg" : "text-base"}`}>{j.name}</h3>
                  <p className={`text-primary ${j.emphasize ? "text-sm" : "text-xs"}`}>
                    {j.title}{j.company ? ` @ ${j.company}` : ""}
                  </p>
                  <p className={`mt-0.5 text-muted-foreground ${j.emphasize ? "text-xs" : "text-[11px]"}`}>{j.location}</p>
                </div>
              </div>

              <p className={`mt-3 leading-relaxed text-muted-foreground ${j.emphasize ? "text-sm" : "text-xs"}`}>{j.bio}</p>
            </motion.div>
          ))}
        </div>

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
