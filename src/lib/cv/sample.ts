import { nid } from "@/lib/utils";
import type { CvDocument, SkillGroup } from "./types";

function group(
  id: string,
  name: string,
  skills: Array<[string, number]>,
): SkillGroup {
  return {
    id,
    name,
    skills: skills.map(([skillName, level], index) => ({
      id: `${id}-${index}`,
      name: skillName,
      level,
    })),
  };
}

export const SAMPLE_CV: CvDocument = {
  name: "Pavlo Shtefanesku",
  title: "Quality Assistance Lead Engineer",
  introHeading: "Hey, I'm Pasha",
  intro:
    "Starting my career as a AQA Engineer in 2013, I honed my expertise in **automation testing**, driven by the belief in seamless processes and empowered decision-making. From creating test cases to later responsibilities in **requirement analysis**, developing frameworks from scratch and CI support, I evolved into an autonomous QA engineer who leads by example. I advocate for paradigm shift from Quality Assurance to **Quality Assistance**, emphasising **Continuous Testing** throughout the entire development process. This approach ensures a higher quality and reliability in the final product.",
  labels: {
    skills: "Skills",
    contact: "Contact",
    experience: "Experience",
    education: "Education",
  },
  contacts: [
    { id: "c-email", kind: "email", value: "pavlo.shtefanesku@gmail.com" },
    { id: "c-phone", kind: "phone", value: "+48796485223" },
    { id: "c-linkedin", kind: "linkedin", value: "pavlo.shtefanesku" },
    { id: "c-location", kind: "location", value: "Wroclaw" },
  ],
  skillGroups: [
    group("g-auto", "Web automation toolset", [
      ["cypress.io", 5],
      ["e2e testing", 5],
      ["DD Synthetics", 5],
      ["BDD/cucumber", 4],
      ["javascript", 5],
      ["API testing", 5],
      ["postman", 4],
      ["git", 4],
      ["typescript", 4],
      ["selenium", 3],
      ["java", 3],
      ["performance", 3],
      ["appium", 2],
    ]),
    group("g-manual", "Manual testing", [
      ["requirement analysis", 5],
      ["exploratory", 5],
      ["mobile", 4],
      ["design verification", 4],
    ]),
    group("g-soft", "Soft skills", [
      ["effective communication", 5],
      ["collaboration", 5],
      ["leadership", 4],
      ["mentorship", 4],
      ["learning", 5],
      ["prioritisation", 4],
      ["problem-solving", 5],
    ]),
    group("g-lang", "Languages", [
      ["Ukrainian", 5],
      ["English", 5],
      ["Polish", 3],
      ["Romanian", 2],
    ]),
  ],
  experience: [
    {
      id: "job-finder",
      from: "2018",
      to: "Present",
      current: true,
      company: "Finder",
      role: "Senior QA engineer",
      location: "Wroclaw",
      description:
        "Assisted building and delivering multiple projects throughout the whole process. Proactively **analysed** software projects within different stages like **requirements definition**, **design verification**, implementation, and post go-live maintenance. Designed user journeys in collaboration with PM and Dev (**Three Amigos**). Delivered 90% e2e test coverage for new web features and API services using **cypress & cucumber**. Introduced new testing standards, led meetings, and incentivised improvements in QA collaboration. Mentored junior engineers.",
    },
    {
      id: "job-intive",
      from: "2016",
      to: "2018",
      current: false,
      company: "Intive",
      role: "Middle QA engineer",
      location: "Wroclaw",
      description:
        "Actively involved in developing POC of automated frameworks for web and mobile applications: **Selenium** tests in **Java** and **C#** for web, **Appium** with Java for mobile, Java, **javascript** for **API** tests.",
    },
    {
      id: "job-softserve",
      from: "2013",
      to: "2016",
      current: false,
      company: "Softserve",
      role: "Automation QA engineer",
      location: "Chernivtsi",
      description:
        "Analysed and improved manual test scenarios. Increased e2e automated test coverage by writing smoke, acceptance, and regression cases using **Java+Selenium** framework. Delivered effective reports about completed test runs. Involved in improvements of API test cases.",
    },
  ],
  education: [
    {
      id: "edu-chnu",
      from: "2006",
      to: "2010",
      degree: "Bachelor degree in Computer Science",
      school: "Chernivtsi National University, Ukraine",
      details:
        "Computer systems and networks, algorithms, computer programming, probability theory, etc.",
    },
  ],
};

export function createSampleCv(): CvDocument {
  return structuredClone(SAMPLE_CV);
}

export function createBlankCv(): CvDocument {
  return {
    name: "Imię Nazwisko",
    title: "Stanowisko",
    introHeading: "Cześć, jestem …",
    intro:
      "Kilka zdań o Twoim doświadczeniu, sposobie pracy i tym, co wnosisz do zespołu. Możesz wyróżnić **ważne frazy** gwiazdkami.",
    labels: {
      skills: "Skills",
      contact: "Contact",
      experience: "Experience",
      education: "Education",
    },
    contacts: [
      { id: nid(), kind: "email", value: "you@email.com" },
      { id: nid(), kind: "phone", value: "+48 000 000 000" },
      { id: nid(), kind: "linkedin", value: "twoj-profil" },
      { id: nid(), kind: "location", value: "Miasto" },
    ],
    skillGroups: [
      group(nid(), "Narzędzia", [
        ["Umiejętność", 4],
        ["Kolejna", 3],
      ]),
    ],
    experience: [
      {
        id: nid(),
        from: "2022",
        to: "Present",
        current: true,
        company: "Firma",
        role: "Rola",
        location: "Miasto",
        description: "Opisz, co dostarczałeś i jaki miał to wpływ.",
      },
    ],
    education: [
      {
        id: nid(),
        from: "2016",
        to: "2020",
        degree: "Kierunek",
        school: "Uczelnia",
        details: "Najważniejsze przedmioty lub wyróżnienia.",
      },
    ],
  };
}
