/* Career content: the profession, workplace scenarios, the roadmap and the career centre. */

/* ------------------------------------------------------------------ Explore */

export const dayInTheLife = [
  { time: "9:00", title: "Check the numbers", body: "Open the sales dashboard. Yesterday's revenue is 12% below a normal Tuesday, so you note it before anyone asks." },
  { time: "9:30", title: "Stand-up", body: "The marketing lead wants to know whether last week's email campaign worked. You agree what 'worked' means: extra orders, not extra clicks." },
  { time: "10:00", title: "Pull the data", body: "Write a SQL query joining campaign sends to orders. Half an hour goes on finding out why 300 customers appear twice." },
  { time: "11:30", title: "Analyse", body: "Compare customers who received the email with similar customers who did not. Build a pivot table by segment to see where the lift came from." },
  { time: "14:00", title: "Build the view", body: "Add a campaign page to the Power BI report so the team can check results themselves next time." },
  { time: "15:30", title: "Explain it", body: "Write five sentences and one chart: what happened, how sure you are, and what you would do next." },
  { time: "16:30", title: "Follow the morning's question", body: "The revenue dip was one large customer ordering a day late. You post a short note so nobody panics." },
];

export const responsibilities = [
  { title: "Answer business questions", body: "Turn a vague question such as 'why are sales down?' into something you can measure, then measure it." },
  { title: "Collect and clean data", body: "Find the right tables, join them correctly, and deal with duplicates, gaps and inconsistent labels." },
  { title: "Analyse and find patterns", body: "Compare groups, track trends and test explanations until one holds up." },
  { title: "Build reports and dashboards", body: "Give teams numbers they can check themselves, updated automatically." },
  { title: "Communicate findings", body: "Explain what the data says, how confident you are, and what you recommend, to people who do not read SQL." },
  { title: "Protect data quality", body: "Notice when a number looks wrong, trace it to its cause, and document definitions so two reports agree." },
];

export const deliverables = [
  "A dashboard the sales team opens every Monday",
  "A one-page analysis answering a specific question",
  "A recurring report, automated so it no longer takes anyone a day",
  "A clean dataset other analysts can build on",
  "A recommendation with the evidence behind it",
  "A metric definition everyone agrees to use",
];

export const applications = [
  { area: "Retail", example: "Which products should a store reorder this week, and which are tying up cash on the shelf?" },
  { area: "Marketing", example: "Which channel brings customers who buy again, and which only brings one-time bargain hunters?" },
  { area: "Finance", example: "Why did costs exceed budget in March, and which departments drove it?" },
  { area: "Operations", example: "Where do deliveries get delayed, and what would one extra van on that route save?" },
  { area: "HR", example: "Which teams are losing people fastest, and what do the leavers have in common?" },
  { area: "Product", example: "Do customers who use the new feature stay longer than those who do not?" },
  { area: "Healthcare", example: "Which clinics have the longest waits, and at what times of day?" },
  { area: "Customer service", example: "Which issues generate the most tickets, and are they getting resolved faster than last quarter?" },
];

export const industries = [
  "Technology and software",
  "Banking, insurance and fintech",
  "Retail and e-commerce",
  "Healthcare and pharmaceuticals",
  "Consulting and professional services",
  "Telecommunications",
  "Manufacturing and logistics",
  "Media, travel and hospitality",
  "Government and non-profits",
  "Education",
];

export const roleTypes = [
  { role: "Data Analyst", focus: "General-purpose analysis across a business or team.", tools: "SQL, Excel, a BI tool" },
  { role: "Business Analyst", focus: "Processes and requirements: what the business needs and how systems should support it.", tools: "Excel, SQL, process mapping" },
  { role: "BI Analyst", focus: "Dashboards, data models and self-service reporting.", tools: "Power BI or Tableau, SQL, DAX" },
  { role: "Marketing Analyst", focus: "Campaign performance, customer acquisition and channel spend.", tools: "SQL, Excel, web analytics" },
  { role: "Financial Analyst", focus: "Budgets, forecasts and variance against plan.", tools: "Excel, financial modelling, SQL" },
  { role: "Product Analyst", focus: "How people use a product, and whether changes improve it.", tools: "SQL, Python, experiment analysis" },
  { role: "Operations Analyst", focus: "Efficiency of supply chains, staffing and service delivery.", tools: "Excel, SQL, a BI tool" },
];

export const technicalSkills = [
  { skill: "Excel", why: "Still where most quick analysis and most stakeholder requests begin." },
  { skill: "SQL", why: "How you get data out of company databases. Asked about in almost every analyst interview." },
  { skill: "Statistics", why: "Tells you whether a difference is real or just noise." },
  { skill: "A BI tool (Power BI or Tableau)", why: "Turns one-off answers into reports people reuse." },
  { skill: "Python", why: "Handles data too big or too repetitive for a spreadsheet." },
  { skill: "Data cleaning", why: "Real data is messy, and wrong inputs give confident wrong answers." },
];

export const softSkills = [
  { skill: "Asking good questions", why: "Most requests arrive vague. The first job is finding out what decision the answer will inform." },
  { skill: "Business understanding", why: "A number only matters if you know what it means for revenue, cost or customers." },
  { skill: "Clear communication", why: "An insight nobody understands changes nothing." },
  { skill: "Scepticism", why: "If a result looks too good, it is usually a join that duplicated rows." },
  { skill: "Prioritisation", why: "There are always more questions than hours. Work on the ones that change a decision." },
];

export const progression = [
  { level: "Junior / Associate Data Analyst", years: "0 to 2 years", body: "Runs defined reports, cleans data and answers scoped questions with guidance." },
  { level: "Data Analyst", years: "2 to 4 years", body: "Owns analyses end to end and works directly with stakeholders." },
  { level: "Senior Data Analyst", years: "4 to 7 years", body: "Chooses which problems matter, mentors others and shapes how metrics are defined." },
  { level: "Lead Analyst or Analytics Manager", years: "7+ years", body: "Sets priorities for a team and is accountable for the quality of its work." },
];

export const branches = [
  "Analytics engineering: building the data models analysts rely on",
  "Data science: prediction, experimentation and machine learning",
  "Product or strategy roles: using analysis to decide what a business builds or does next",
];

/** Published estimates, checked November 2026. Sources disagree widely; see the note on the page. */
export const salaries = {
  checked: "November 2026",
  rows: [
    {
      country: "United States",
      entry: "about $68,000",
      mid: "about $98,000",
      senior: "about $120,000",
      note: "Salary.com averages by years of experience (under 1, 2 to 4, 5 to 8), as of October 2026.",
      source: { label: "Salary.com", href: "https://www1.salary.com/job/analyst-data-analysis-salary" },
    },
    {
      country: "United Kingdom",
      entry: "£26,000 to £35,000",
      mid: "£40,000 to £55,000",
      senior: "£50,000 to £70,000",
      note: "UK Net Pay's 2026 ranges for junior, mid-level and senior analysts.",
      source: { label: "UK Net Pay", href: "https://uknetpay.co.uk/insights/data-analyst-salary-uk-2026" },
    },
    {
      country: "India",
      entry: "₹3.5 to ₹6 lakh",
      mid: "average about ₹6.5 lakh",
      senior: "₹14 to ₹22 lakh",
      note: "Placement Preparation's 2026 guide: freshers, overall average, and five to eight years' experience.",
      source: { label: "Placement Preparation", href: "https://www.placementpreparation.io/blog/?p=22353" },
    },
  ],
};

/* ---------------------------------------------------------------- Scenarios */

export type Scenario = {
  id: string;
  title: string;
  who: string;
  steps: { label: string; body: string; points?: string[] }[];
};

const step = (label: string, body: string, points?: string[]) => ({ label, body, points });

export const scenarios: Scenario[] = [
  {
    id: "retail",
    title: "Declining retail sales",
    who: "A retail manager",
    steps: [
      step("The business problem", "Revenue at a 40-store chain has fallen for three months. The manager needs to know whether this is every store or a few, and what to do before next quarter's targets are set.", ["Decision to inform: where to focus effort and budget", "Question to answer: what changed, where and when?"]),
      step("The data required", "You need sales at the most detailed level you can get, plus anything that explains it.", ["Transactions: date, store, product, quantity, price, discount", "Store details: region, size, opening date", "Product catalogue: category, cost", "Promotions calendar and stock levels"]),
      step("The tools", "SQL to pull and join the tables, Excel for a fast first look, and a BI tool to share the result.", ["SQL: GROUP BY month, store and category", "Excel: PivotTable to compare periods", "Power BI: a page managers can filter"]),
      step("The analysis", "Break the total into parts until the decline has an address.", ["Split revenue into number of orders and average order value", "Compare each month with the same month last year to remove seasonality", "Rank stores and categories by their contribution to the drop", "Check whether stock-outs or ended promotions line up with the timing"]),
      step("The insights", "Illustrative findings for this example: most of the decline comes from one category in the northern region, where order counts fell while order values held steady. The fall began the week a competitor opened nearby and a long-running promotion ended.", ["The problem is local and specific, not chain-wide", "Fewer customers are coming, but those who come spend the same"]),
      step("The recommendations", "Say what to do, what it should achieve and how you will know.", ["Run a targeted promotion in the affected stores and category", "Leave pricing unchanged elsewhere, where sales are healthy", "Track weekly order counts in those stores against a comparable group", "Review in six weeks"]),
    ],
  },
  {
    id: "hr",
    title: "Employee attrition",
    who: "An HR manager",
    steps: [
      step("The business problem", "More people have resigned this year than last. Replacing them is expensive and teams are stretched. HR wants to know who is leaving and why.", ["Decision to inform: where to spend a limited retention budget", "Question to answer: which groups leave most, and what do they share?"]),
      step("The data required", "Employee records over time, handled with care because the data is personal.", ["Employee table: department, role, hire date, pay band, manager", "Exit records: leaving date, voluntary or not, stated reason", "Promotion and pay-review history", "Overtime and engagement survey scores, if available"]),
      step("The tools", "Excel is often enough here, with a BI report for HR to explore.", ["Excel: COUNTIFS and PivotTables for attrition rates", "SQL: if records sit in an HR database", "Power BI: slicers for department, tenure and year"]),
      step("The analysis", "Calculate rates, not counts, so large departments do not dominate.", ["Attrition rate = leavers divided by average headcount", "Compare by department, tenure band, pay band and manager", "Compare leavers with stayers on overtime and time since last promotion", "Read the exit reasons for themes numbers miss"]),
      step("The insights", "Illustrative findings for this example: attrition is concentrated among people with one to two years' tenure in two departments. Leavers worked more overtime than stayers and most had not had a pay review since joining.", ["It is not a company-wide problem", "The risk peaks at a predictable point in tenure"]),
      step("The recommendations", "Tie each action to a finding.", ["Introduce a structured review at 12 months in the two departments", "Monitor overtime and act before it becomes sustained", "Report attrition rate by tenure band every quarter", "Be clear that this shows association, not proof of cause"]),
    ],
  },
  {
    id: "ecommerce",
    title: "Customer behaviour in e-commerce",
    who: "An e-commerce business",
    steps: [
      step("The business problem", "Plenty of people visit the site but few buy, and most buyers never return. The team wants to understand where customers drop out.", ["Decision to inform: which part of the journey to fix first", "Question to answer: where do we lose people, and who comes back?"]),
      step("The data required", "Behaviour on the site joined to orders.", ["Sessions: visit time, device, traffic source, pages viewed", "Events: product view, add to basket, checkout start, purchase", "Orders and customers: first order date, repeat orders", "Product and delivery details"]),
      step("The tools", "SQL for the funnel, Python when the event data gets large, and a dashboard to watch it.", ["SQL: count sessions reaching each stage", "Python and pandas: cohort tables", "Tableau or Power BI: funnel and cohort views"]),
      step("The analysis", "Follow people through the journey, then follow buyers over time.", ["Build a funnel: visit, product view, basket, checkout, purchase", "Compare conversion by device and traffic source", "Group customers by first-purchase month and track how many reorder", "Look at what first-time buyers who return bought first"]),
      step("The insights", "Illustrative findings for this example: the largest drop is between basket and checkout on mobile, where delivery cost first appears. Customers whose first order came from a recommendation return far more often than those from discount adverts.", ["The checkout loses more people than the product pages", "Acquisition source predicts loyalty"]),
      step("The recommendations", "Prioritise by likely impact and effort.", ["Show delivery cost earlier on mobile and test the change", "Shift some advertising budget from discount adverts to referral", "Add a second-purchase prompt for new customers", "Measure each change with a controlled test before rolling it out"]),
    ],
  },
  {
    id: "marketing",
    title: "Campaign performance",
    who: "A marketing team",
    steps: [
      step("The business problem", "The team ran campaigns on email, search and social last quarter and must decide next quarter's budget. They need to know what each channel actually delivered.", ["Decision to inform: how to split the budget", "Question to answer: which campaigns produced profitable customers?"]),
      step("The data required", "Spend and results per campaign, tied to real orders where possible.", ["Campaign spend by channel and date", "Impressions, clicks and sign-ups", "Orders linked to campaigns through tracking codes", "Revenue and margin per order"]),
      step("The tools", "A spreadsheet handles the core maths. SQL links campaigns to orders.", ["Excel: cost per acquisition and return on spend", "SQL: join campaign codes to orders", "A BI tool: one page per channel"]),
      step("The analysis", "Move from activity metrics to money.", ["Calculate cost per click, cost per acquisition and return on ad spend", "Compare against a period or group with no campaign, to estimate what would have happened anyway", "Check how many acquired customers ordered again", "Look at results by audience, not just by channel"]),
      step("The insights", "Illustrative findings for this example: social produced the most clicks but the highest cost per customer. Email cost little and performed best with existing customers. Search brought new customers at a reasonable cost, and they reordered.", ["Clicks and customers are different things", "The cheapest channel is not automatically the best one to scale"]),
      step("The recommendations", "Give a budget split and its reasoning.", ["Move part of the social budget to search", "Keep email for retention, with segmented messages", "Agree one definition of 'conversion' for every channel", "Hold back a small no-campaign group next quarter to measure true lift"]),
    ],
  },
];

/* ------------------------------------------------------------------ Roadmap */

export type RoadmapStage = {
  id: string;
  title: string;
  why: string;
  prerequisite: string;
  objectives: string[];
  skills: string[];
  /** Learning path whose lessons track this stage automatically. */
  path?: string;
  /** Self-tracked items for stages without a lesson path. */
  items?: { label: string; href?: string }[];
  practice: { label: string; href: string };
  project: { label: string; href: string };
  note?: string;
};

export const roadmap: RoadmapStage[] = [
  {
    id: "fundamentals",
    title: "Data Analytics Fundamentals",
    why: "Tools change. The habit of turning a business question into something measurable is what makes the tools useful.",
    prerequisite: "None. Start here.",
    objectives: ["Explain what a data analyst does and delivers", "Describe the steps from question to recommendation", "Tell a metric from a dimension, and a count from a rate"],
    skills: ["Framing questions", "Basic data vocabulary", "Reading charts critically"],
    items: [
      { label: "Read what data analytics is and what analysts do", href: "/explore#what" },
      { label: "Follow a day in the life of an analyst", href: "/explore#day" },
      { label: "Work through all four workplace scenarios", href: "/explore#scenarios" },
      { label: "Review the technical and soft skills employers ask for", href: "/explore#skills" },
      { label: "Write down one business question from your own work or studies that data could answer" },
    ],
    practice: { label: "Workplace scenarios", href: "/explore#scenarios" },
    project: { label: "Read the Retail Sales Analysis brief to see where this leads", href: "/projects#retail-sales-analysis" },
  },
  {
    id: "excel",
    title: "Excel",
    why: "Most analysis requests start and often end in a spreadsheet. It is also the fastest way to learn how formulas, tables and summaries work.",
    prerequisite: "Stage 1. No prior Excel knowledge is assumed.",
    objectives: ["Write formulas that survive being copied", "Sort, filter and summarise a dataset", "Structure data as a table others can build on"],
    skills: ["Cell references", "Core functions", "Sorting and filtering", "Tables"],
    path: "excel",
    practice: { label: "Interactive formula exercises", href: "/paths/excel/formulas-and-cell-references#practice" },
    project: { label: "Inventory Analysis", href: "/projects#inventory-analysis" },
  },
  {
    id: "sql",
    title: "SQL",
    why: "Company data lives in databases. SQL is how you ask for it, and it is tested in almost every analyst interview.",
    prerequisite: "Stage 2 helps: tables, filters and totals work the same way.",
    objectives: ["Select, filter and sort data", "Aggregate with GROUP BY and combine tables with joins", "Use CTEs and window functions for multi-step questions"],
    skills: ["Querying", "Joins", "Aggregation", "Window functions"],
    path: "sql",
    practice: { label: "SQL challenges with a real query engine", href: "/practice" },
    project: { label: "Retail Sales Analysis", href: "/projects#retail-sales-analysis" },
  },
  {
    id: "statistics",
    title: "Statistics",
    why: "Without statistics you can describe data but not judge it. It tells you whether a difference is worth acting on.",
    prerequisite: "Stages 2 and 3, so you have data to apply it to.",
    objectives: ["Summarise data with the right measure", "Recognise when a difference could be chance", "Avoid claiming cause from correlation"],
    skills: ["Descriptive statistics", "Distributions", "Sampling", "Hypothesis testing basics"],
    items: [
      { label: "Mean, median and mode, and when each misleads" },
      { label: "Spread: range, variance and standard deviation" },
      { label: "Percentiles and outliers" },
      { label: "Distributions: normal and skewed data" },
      { label: "Correlation, and why it is not causation" },
      { label: "Samples, populations and sampling bias" },
      { label: "Hypothesis tests and p-values in plain terms" },
      { label: "Reading an A/B test result" },
    ],
    practice: { label: "Core Functions exercises (averages, counts, spread)", href: "/paths/excel/core-functions#practice" },
    project: { label: "E-commerce Performance", href: "/projects#e-commerce-performance" },
    note: "DataQuest lessons for statistics are not written yet. Use this as a study checklist and tick topics off as you cover them elsewhere.",
  },
  {
    id: "power-bi",
    title: "Power BI",
    why: "A dashboard answers the same question every week without you. BI tools are how analysis reaches the rest of the company.",
    prerequisite: "Stage 3. A clean model depends on understanding tables and joins.",
    objectives: ["Connect to data and shape it", "Build a model with relationships", "Design a report people can filter and trust"],
    skills: ["Data modelling", "DAX basics", "Visual design"],
    path: "power-bi",
    practice: { label: "Connecting to Data lesson", href: "/paths/power-bi/connecting-to-data#practice" },
    project: { label: "HR Employee Attrition", href: "/projects#hr-employee-attrition" },
  },
  {
    id: "python",
    title: "Python",
    why: "Python takes over when data is too large or a task too repetitive for a spreadsheet, and it opens the door to more advanced analysis.",
    prerequisite: "Stage 3. pandas operations mirror SQL ones.",
    objectives: ["Write basic Python", "Load, clean and summarise data with pandas", "Make an analysis repeatable"],
    skills: ["Python basics", "pandas", "Data cleaning"],
    path: "python",
    practice: { label: "Variables & Data Types lesson", href: "/paths/python/variables-and-data-types#practice" },
    project: { label: "Customer Segmentation", href: "/projects#customer-segmentation" },
  },
  {
    id: "projects",
    title: "Real-world Projects",
    why: "Employers hire evidence. A finished project shows you can go from a messy question to a clear answer.",
    prerequisite: "Stages 2 and 3 at minimum. Add tools as you learn them.",
    objectives: ["Complete an analysis from question to recommendation", "Write up findings for a non-technical reader", "Publish work you can link to"],
    skills: ["End-to-end analysis", "Writing", "Presentation"],
    items: [
      { label: "Retail Sales Analysis", href: "/projects#retail-sales-analysis" },
      { label: "HR Employee Attrition", href: "/projects#hr-employee-attrition" },
      { label: "E-commerce Performance", href: "/projects#e-commerce-performance" },
      { label: "Customer Segmentation", href: "/projects#customer-segmentation" },
      { label: "Inventory Analysis", href: "/projects#inventory-analysis" },
    ],
    practice: { label: "Project briefs", href: "/projects" },
    project: { label: "Start with Retail Sales Analysis", href: "/projects#retail-sales-analysis" },
    note: "Finish at least three. Depth beats quantity.",
  },
  {
    id: "interview",
    title: "Interview Preparation",
    why: "Interviews test whether you can explain your thinking under time pressure, which is a separate skill from doing the analysis.",
    prerequisite: "Stage 3, and at least one finished project to talk about.",
    objectives: ["Answer common behavioural and technical questions", "Solve SQL problems aloud", "Structure a business case answer"],
    skills: ["Structured answers", "SQL under pressure", "Case reasoning"],
    items: [
      { label: "Work through the interview question bank", href: "/career#questions" },
      { label: "Complete three mock interviews", href: "/career#mock" },
      { label: "Solve the SQL interview set", href: "/career#sql" },
      { label: "Practise all three business case studies", href: "/career#cases" },
      { label: "Prepare a two-minute walkthrough of your best project" },
    ],
    practice: { label: "Mock interview", href: "/career#mock" },
    project: { label: "Rehearse presenting one finished project", href: "/projects" },
  },
  {
    id: "job-ready",
    title: "Job Readiness",
    why: "Skills only count once an employer can see them. This stage is about being findable and credible.",
    prerequisite: "Stages 7 and 8.",
    objectives: ["Have a resume that passes a 30-second scan", "Have a portfolio with three projects", "Apply to roles that match your skills"],
    skills: ["Resume writing", "Portfolio", "LinkedIn", "Reading job descriptions"],
    items: [
      { label: "Complete the resume checklist", href: "/career#resume" },
      { label: "Complete the portfolio checklist", href: "/career#portfolio" },
      { label: "Complete the LinkedIn checklist", href: "/career#linkedin" },
      { label: "Compare your skills with the role profiles", href: "/career#roles" },
      { label: "Apply to ten roles that match at least 60% of the requirements" },
    ],
    practice: { label: "Career centre", href: "/career" },
    project: { label: "Polish your three best projects for the portfolio", href: "/career#portfolio" },
  },
];

/* ------------------------------------------------------------ Career centre */

export const resume = {
  intro: "A recruiter decides in well under a minute. Your resume has one job: show quickly that you can do analysis and have done it.",
  principles: [
    { title: "Lead with evidence", body: "Put projects and results above coursework. A link to a finished analysis beats a list of courses." },
    { title: "Write bullets as outcomes", body: "Start with a verb, say what you did with which tool, and end with the result or scale." },
    { title: "Match the posting", body: "Use the exact skill names from the job description where they are true of you. Screening is often keyword-based." },
    { title: "One page", body: "For a first analyst role, one page is enough. Cut anything that does not support this job." },
  ],
  before: "Responsible for sales reports using Excel.",
  after: "Built a weekly sales report in Excel with PivotTables covering 40 stores, replacing a manual process and cutting preparation from four hours to twenty minutes.",
  checklist: [
    "One page, with a clear headline such as 'Data Analyst: SQL, Excel, Power BI'",
    "Skills section lists tools you can demonstrate, grouped by type",
    "Two or three projects, each with a link and a one-line result",
    "Every bullet starts with a verb and includes a tool and an outcome",
    "Numbers are used wherever they are true and checkable",
    "Tailored to the specific job description",
    "Proofread by someone else, saved as a PDF with your name in the filename",
  ],
};

export const portfolio = {
  intro: "A portfolio is proof. Three well-explained projects are enough if each shows a different skill.",
  structure: [
    { title: "The question", body: "One or two sentences on the business problem and who would care." },
    { title: "The data", body: "Where it came from, its size, and what was wrong with it." },
    { title: "The approach", body: "The steps you took and why, with the key queries or formulas." },
    { title: "The findings", body: "Two or three insights, each with one chart." },
    { title: "The recommendation", body: "What you would advise, and what you would check next." },
  ],
  mix: [
    "A SQL project: joins, aggregation and a window function on a multi-table dataset",
    "A dashboard project: an interactive report in Power BI or Tableau",
    "An analysis write-up: a question answered end to end in Excel or Python",
  ],
  checklist: [
    "Three finished projects, each answering a specific question",
    "Each project has a short written summary a non-analyst can follow",
    "Code and queries are readable and commented",
    "Charts have titles that state the finding",
    "Hosted somewhere public, such as GitHub or a personal site",
    "Linked from your resume and LinkedIn profile",
  ],
};

export const linkedin = {
  intro: "Recruiters search LinkedIn by skill and title. Your profile should make it obvious what role you want and what you can do.",
  tips: [
    { title: "Headline", body: "Say the role and your tools, not 'Seeking opportunities'. Example: 'Data Analyst | SQL, Excel, Power BI | Retail and e-commerce analytics'." },
    { title: "About", body: "Three short paragraphs: what you do, the evidence (projects and results), and what you are looking for." },
    { title: "Featured", body: "Pin your two best projects with a one-line description of the result." },
    { title: "Skills", body: "List the tools from the job descriptions you are targeting, most important first." },
    { title: "Activity", body: "Post a short write-up when you finish a project: the question, one chart, one finding." },
  ],
  checklist: [
    "Professional photo and a headline naming the role and tools",
    "About section with evidence and a clear goal",
    "Projects pinned in Featured",
    "Skills ordered to match target roles",
    "Experience bullets written as outcomes",
    "Profile URL customised and added to your resume",
  ],
};

export type InterviewQuestion = { category: string; q: string; points: string[] };

export const interviewQuestions: InterviewQuestion[] = [
  { category: "Behavioural", q: "Tell me about a time you found an error in data. What did you do?", points: ["Describe the situation briefly and how you noticed the problem", "Explain how you traced the cause instead of patching the symptom", "Say who you told and how you prevented it recurring", "End with the result"] },
  { category: "Behavioural", q: "How do you handle a stakeholder who asks for a number without explaining why?", points: ["Ask what decision the number will inform", "Confirm the definition, time period and level of detail", "Deliver a first answer quickly, then refine", "Show you see this as normal, not as a nuisance"] },
  { category: "Behavioural", q: "Describe a project you are proud of.", points: ["Pick one with a clear question and outcome", "Cover question, data, approach, finding, recommendation", "Mention one thing that went wrong and how you handled it", "Keep it to about two minutes"] },
  { category: "Behavioural", q: "How do you prioritise when several teams want analysis at once?", points: ["Ask about deadlines and the decision each request supports", "Rank by impact and urgency, and say so openly", "Offer a quick partial answer where it unblocks someone", "Escalate conflicts instead of silently picking a winner"] },
  { category: "SQL", q: "What is the difference between WHERE and HAVING?", points: ["WHERE filters rows before grouping", "HAVING filters groups after aggregation", "Aggregates such as SUM cannot appear in WHERE", "Give a one-line example of each"] },
  { category: "SQL", q: "Explain the difference between INNER JOIN and LEFT JOIN.", points: ["INNER JOIN keeps only rows that match in both tables", "LEFT JOIN keeps every left row and fills NULLs where there is no match", "LEFT JOIN is how you find missing matches, with WHERE right.key IS NULL", "Mention that a WHERE filter on the right table can undo a LEFT JOIN"] },
  { category: "SQL", q: "How would you find duplicate rows in a table?", points: ["GROUP BY the columns that should be unique", "HAVING COUNT(*) > 1", "To see the full rows, use ROW_NUMBER() partitioned by those columns", "Ask what counts as a duplicate before answering"] },
  { category: "SQL", q: "What does a window function do that GROUP BY cannot?", points: ["It calculates across related rows while keeping every row", "Examples: running totals, rank within a group, previous-row comparisons", "PARTITION BY defines the group, ORDER BY the sequence", "GROUP BY would collapse the detail you need"] },
  { category: "Excel", q: "When would you use an absolute reference?", points: ["When a formula is copied but one input must stay fixed, such as a tax rate", "$F$1 locks column and row; F$1 or $F1 lock one", "Give a concrete example", "Mention F4 to toggle"] },
  { category: "Excel", q: "What is a PivotTable and when would you use one?", points: ["A tool that summarises rows by categories without formulas", "Use it to total, count or average by one or more dimensions", "Fast for exploring data and answering ad hoc questions", "Mention refreshing when source data changes"] },
  { category: "Excel", q: "How is COUNT different from COUNTA?", points: ["COUNT counts cells containing numbers", "COUNTA counts all non-empty cells, including text", "The difference reveals text entries in a numeric column", "Useful as a data-quality check"] },
  { category: "Statistics", q: "When would you report the median instead of the mean?", points: ["When data is skewed or has outliers, such as salaries or order values", "The mean is pulled toward extreme values; the median is not", "Reporting both shows the skew", "Give a concrete example"] },
  { category: "Statistics", q: "What is the difference between correlation and causation?", points: ["Correlation means two things move together", "Causation means one produces the other", "A third factor or coincidence can explain a correlation", "A controlled experiment is the usual way to show cause"] },
  { category: "Statistics", q: "A new page design shows a 2% higher conversion rate. Is it better?", points: ["Not necessarily: ask about sample size and test duration", "Check whether the difference is statistically significant", "Confirm users were randomly assigned", "Consider whether 2% matters commercially even if it is real"] },
  { category: "Business", q: "Daily active users dropped 10% yesterday. How would you investigate?", points: ["First rule out a data or tracking problem", "Segment by platform, region, user type and acquisition source", "Check for releases, outages, holidays or campaigns ending", "State a hypothesis, test it, and say what you would report"] },
  { category: "Business", q: "Which metrics would you track for a subscription business?", points: ["Acquisition: new subscribers and cost per acquisition", "Retention: churn rate and retention by cohort", "Revenue: monthly recurring revenue and average revenue per user", "Tie each metric to a decision it informs"] },
];

export const caseStudies = [
  {
    title: "A coffee chain's morning sales are falling",
    prompt: "A 25-shop coffee chain reports that sales between 7 and 10 a.m. are down 15% compared with last year, while afternoon sales are flat. How would you approach it?",
    clarify: ["Is the drop in every shop or some?", "Is it fewer customers, or smaller orders?", "Has anything changed: prices, opening hours, menu, staffing?", "What has happened locally, such as office closures or new competitors?"],
    approach: ["Split revenue into transactions and average order value", "Compare shops, weekdays and product categories", "Look at location type: office districts against residential areas", "Check timing against known changes"],
    answer: "A strong answer narrows the problem before proposing causes. For example: if transactions fell but order value held, and the drop is concentrated in office-district shops on Mondays and Fridays, a shift to hybrid working is the likely driver. You would recommend adjusting staffing and stock on those days, testing a mid-week loyalty offer, and watching whether residential shops are gaining the lost trade.",
  },
  {
    title: "Should the company keep its free delivery offer?",
    prompt: "An online retailer introduced free delivery on orders over 50 three months ago. Finance says it is too expensive. Marketing says it drives sales. How would you decide?",
    clarify: ["What was the delivery charge before, and what does delivery cost the company?", "Is there a period or group without the offer to compare against?", "What is the margin on a typical order?", "What matters more to the company right now: growth or profit?"],
    approach: ["Compare order volume and average order value before and after, allowing for seasonality", "Look at the share of orders just above 50, which shows people adding items to qualify", "Calculate profit per order including delivery cost", "Check whether new customers acquired under the offer reorder"],
    answer: "A strong answer turns the argument into a profit calculation. If average order value rose because customers added items to reach 50, the extra margin may cover delivery. If it only made existing orders less profitable, it does not. You would present profit per order before and after, state how confident the comparison is, and suggest testing a higher threshold on part of the customer base.",
  },
  {
    title: "Measuring a new onboarding flow",
    prompt: "A software company redesigned its sign-up process. The product manager asks whether it worked. What do you measure, and how?",
    clarify: ["What was the goal: more sign-ups completed, or more users becoming active?", "Was it released to everyone, or tested on a share of users?", "What counts as an active user?", "How long after sign-up should we measure?"],
    approach: ["Define the success metric before looking at data", "If there was a test, compare the two groups' completion and activation rates", "If not, compare cohorts before and after, noting other changes in the period", "Check secondary effects such as support tickets"],
    answer: "A strong answer separates completing sign-up from becoming an active user, because a flow can improve the first and harm the second. With a randomised test you can report the difference and whether it is significant. Without one, be explicit that a before-and-after comparison cannot rule out other causes, and recommend a proper test for the next change.",
  },
];

export const roleProfiles = [
  {
    title: "Junior Data Analyst",
    experience: "0 to 2 years",
    responsibilities: ["Maintain recurring reports and dashboards", "Clean and validate data", "Answer scoped questions for one team", "Document queries and definitions"],
    required: ["Excel: formulas, PivotTables, lookups", "SQL: SELECT, joins, GROUP BY", "One BI tool at a basic level", "Clear written communication"],
    bonus: ["Python basics", "A portfolio of projects", "Knowledge of the employer's industry"],
    stages: "Roadmap stages 1 to 3, plus one or two projects",
  },
  {
    title: "Data Analyst",
    experience: "2 to 4 years",
    responsibilities: ["Own analyses from question to recommendation", "Build and maintain dashboards and data models", "Work directly with stakeholders to define metrics", "Investigate anomalies and data-quality issues"],
    required: ["Advanced SQL: CTEs, window functions", "Power BI or Tableau, including calculated measures", "Statistics: significance and experiment reading", "Presenting findings to non-technical audiences"],
    bonus: ["Python with pandas", "Experience with A/B testing", "Version control"],
    stages: "Roadmap stages 1 to 7",
  },
  {
    title: "Senior Data Analyst",
    experience: "4 to 7 years",
    responsibilities: ["Decide which questions the team should work on", "Design metrics and the models behind them", "Mentor junior analysts and review their work", "Advise senior stakeholders"],
    required: ["Expert SQL and data modelling", "Experiment design and statistical reasoning", "Python or R for analysis", "A record of analysis that changed a decision"],
    bonus: ["Analytics engineering tools", "Domain expertise", "Team leadership"],
    stages: "All roadmap stages, plus experience on the job",
  },
];
