import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "retail-sales-analysis",
    title: "Retail Sales Analysis",
    tools: ["SQL", "Excel"],
    problem:
      "A regional retailer's revenue has flattened. Management wants to know which regions, categories and months are driving the slowdown before setting next quarter's targets.",
    objectives: ["Measure revenue, orders and average order value by month", "Compare regions and product categories", "Identify the segments behind the slowdown"],
    dataset: "Retail sales: orders, order_items, products, customers",
    tasks: [
      "Profile the tables: row counts, date range, missing values",
      "Build monthly revenue, order count and average order value",
      "Break revenue down by region and by category",
      "Calculate month-over-month change and flag declining segments",
      "Summarise three findings and one recommendation",
    ],
    deliverables: ["SQL script with commented queries", "One-page summary with two charts"],
  },
  {
    slug: "hr-employee-attrition",
    title: "HR Employee Attrition",
    tools: ["Excel", "Power BI"],
    problem:
      "Voluntary turnover has risen for two years. HR needs to understand who is leaving and which factors are associated with attrition.",
    objectives: ["Calculate attrition rate overall and by department", "Compare leavers and stayers on tenure, pay band and overtime", "Present the findings in a report HR can filter"],
    dataset: "HR analytics: employees, departments, exits",
    tasks: [
      "Clean the employee table and standardise department names",
      "Compute attrition rate by department, tenure band and pay band",
      "Compare overtime and promotion history for leavers and stayers",
      "Build a report page with slicers for department and year",
      "Write up which groups are most at risk",
    ],
    deliverables: ["Cleaned workbook", "Report with an attrition overview page", "Short findings memo"],
  },
  {
    slug: "e-commerce-performance",
    title: "E-commerce Performance",
    tools: ["SQL", "Tableau"],
    problem:
      "An online store spends heavily on acquisition but does not know which channels bring customers who come back.",
    objectives: ["Build a visit-to-purchase funnel", "Measure conversion and repeat-purchase rate by channel", "Recommend where to move budget"],
    dataset: "E-commerce: sessions, orders, customers, channels",
    tasks: [
      "Define each funnel stage from the sessions table",
      "Calculate conversion rate by channel and device",
      "Compute 90-day repeat-purchase rate by acquisition channel",
      "Visualise the funnel and channel comparison",
      "Recommend a budget change with supporting numbers",
    ],
    deliverables: ["Funnel and channel queries", "Dashboard with funnel and channel views", "Recommendation slide"],
  },
  {
    slug: "customer-segmentation",
    title: "Customer Segmentation",
    tools: ["SQL", "Python"],
    problem:
      "Marketing sends the same campaign to everyone. They want customer groups based on actual buying behaviour.",
    objectives: ["Score customers on recency, frequency and monetary value", "Group them into actionable segments", "Describe each segment and a suitable action"],
    dataset: "Customer analytics: customers, orders",
    tasks: [
      "Compute recency, frequency and monetary value per customer",
      "Assign 1 to 5 scores for each with NTILE or quantiles",
      "Combine scores into named segments",
      "Profile each segment: size, revenue share, typical basket",
      "Propose one campaign per segment",
    ],
    deliverables: ["RFM table", "Segment profile chart", "Campaign plan by segment"],
  },
  {
    slug: "inventory-analysis",
    title: "Inventory Analysis",
    tools: ["Excel", "SQL"],
    problem:
      "A distributor has cash tied up in slow stock while popular items run out. Operations wants a view of what to reorder and what to clear.",
    objectives: ["Calculate stock turnover and days of cover per product", "Classify products by revenue contribution", "Flag stock-out risks and overstock"],
    dataset: "Inventory: products, stock_levels, sales, suppliers",
    tasks: [
      "Join sales to stock levels by product",
      "Compute average daily sales and days of cover",
      "Run an ABC classification by revenue",
      "Flag items below reorder point and items with over 180 days of cover",
      "Produce a reorder list and a clearance list",
    ],
    deliverables: ["Analysis workbook or SQL script", "Reorder and clearance lists", "Summary of cash tied up in slow stock"],
  },
];
