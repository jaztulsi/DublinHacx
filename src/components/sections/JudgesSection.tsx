import { motion } from "framer-motion";
import { useState } from "react";

type Judge = {
  name: string;
  title: string;
  company: string;
  location: string;
  education: string;
  tags: string[];
  bio: string;
  img?: string;
};

const judges: Judge[] = [
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
      <div className="mx-auto max-w-4xl">
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

        <div className="flex flex-wrap justify-center gap-6">
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
                  <h3 className="font-display text-base font-bold leading-tight">{j.name}</h3>
                  <p className="text-xs text-primary">
                    {j.title} @ {j.company}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{j.location}</p>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{j.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
