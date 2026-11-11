import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "retail-sales-analysis",
    title: "Retail Sales Analysis",
    tools: ["SQL", "Excel"],
    problem:
      "A regional retailer's revenue has flattened. Management wants to know which regions, categories and months are driving the slowdown before setting next quarter's targets.",
    objectives: ["Measure revenue, orders and average order value by month", "Compare regions and product categories", "Identify the segments behind the slowdown"],
    datasetSlug: "retail-sales",
    dataset: "Retail sales: customers, products, orders and order_items",
    tasks: [
      {
        instruction: "Profile the tables: row counts, date range, and customers or products with no matching orders.",
        hint: "COUNT(*) and MIN/MAX(order_date) on orders, then a LEFT JOIN from customers to orders to find the ones with no match.",
        expectedOutput: "Four tables; orders span the full data period; a LEFT JOIN turns up a handful of customers with zero orders and products with zero sales.",
        solution:
          "SELECT COUNT(*), MIN(order_date), MAX(order_date) FROM orders;\n\nSELECT c.customer_id FROM customers c\nLEFT JOIN orders o ON o.customer_id = c.customer_id\nWHERE o.order_id IS NULL;",
      },
      {
        instruction: "Build monthly revenue, order count and average order value.",
        hint: "Truncate order_date to the month, keep only status = 'completed', and GROUP BY that month.",
        expectedOutput: "One row per month with revenue, order count and revenue ÷ order count as the average order value.",
        solution:
          "SELECT date_trunc('month', order_date) AS month,\n       SUM(amount) AS revenue,\n       COUNT(*) AS orders,\n       SUM(amount) / COUNT(*) AS aov\nFROM orders\nWHERE status = 'completed'\nGROUP BY 1\nORDER BY 1;",
      },
      {
        instruction: "Break revenue down by region and by category.",
        hint: "Region is already on orders. Category lives on products, so revenue by category needs order_items joined to products.",
        expectedOutput: "A short table of revenue by region, and a separate table of revenue by product category, each summing back to total revenue.",
        solution:
          "SELECT region, SUM(amount) AS revenue\nFROM orders WHERE status = 'completed'\nGROUP BY region ORDER BY revenue DESC;\n\nSELECT p.category, SUM(oi.quantity * oi.unit_price) AS revenue\nFROM order_items oi\nJOIN products p ON p.product_id = oi.product_id\nJOIN orders o ON o.order_id = oi.order_id\nWHERE o.status = 'completed'\nGROUP BY p.category ORDER BY revenue DESC;",
      },
      {
        instruction: "Calculate month-over-month change by region and flag declining segments.",
        hint: "LAG() over the monthly-by-region series gives you the prior month to compare against, inside the same window partition.",
        expectedOutput: "A month-over-month change and percentage column per region; at least one region shows two or more consecutive negative months.",
        solution:
          "WITH monthly AS (\n  SELECT date_trunc('month', order_date) AS month, region, SUM(amount) AS revenue\n  FROM orders WHERE status = 'completed'\n  GROUP BY 1, 2\n)\nSELECT month, region, revenue,\n       revenue - LAG(revenue) OVER (PARTITION BY region ORDER BY month) AS change\nFROM monthly ORDER BY region, month;",
      },
      {
        instruction: "Summarise three findings and one recommendation.",
        hint: "Tie each finding to a specific number from the queries above — a reader should be able to check it without rerunning anything.",
        expectedOutput: "A short written summary naming the weakest region or category by its actual revenue figures, and one recommendation tied to that number.",
        solution:
          "There's no single correct wording here. A strong answer names a specific region or category using the numbers you computed — for example: \"Region X's revenue fell in 3 of the last 4 months while Y grew; shift next quarter's promotional budget from X toward Y.\"",
      },
    ],
    deliverables: ["SQL script with commented queries", "One-page summary with two charts"],
    portfolioDeliverables: ["A documented SQL script showing the full analysis, runnable end to end", "A one-page findings summary with supporting charts, ready to share with a manager"],
  },
  {
    slug: "hr-employee-attrition",
    title: "HR Employee Attrition",
    tools: ["Excel", "Power BI"],
    problem:
      "Voluntary turnover has risen for two years. HR needs to understand who is leaving and which factors are associated with attrition.",
    objectives: ["Calculate attrition rate overall and by department", "Compare leavers and stayers on tenure, pay band and overtime", "Present the findings in a report HR can filter"],
    datasetSlug: "employee-information",
    dataset: "Employee information: 300 employees with tenure, pay, overtime and exit status",
    tasks: [
      {
        instruction: "Clean the employee table and standardise department names.",
        hint: "TRIM and PROPER normalise stray spacing and casing; COUNTIF on employee_id checks for accidental duplicates.",
        expectedOutput: "No blank or inconsistently-cased department names, and employee_id has no duplicates.",
        solution: '=PROPER(TRIM(A2))  for the department column\n=COUNTIF($A$2:$A$301,A2)>1  to flag a duplicate employee_id',
      },
      {
        instruction: "Compute attrition rate by department, tenure band and pay band.",
        hint: 'Attrition rate = leavers ÷ everyone in that group. COUNTIFS gets you both the numerator and denominator.',
        expectedOutput: "A department-by-department attrition percentage table; the department-weighted average matches the company-wide attrition rate.",
        solution: '=COUNTIFS(Department,"Sales",LeftCompany,"Yes") / COUNTIFS(Department,"Sales")\n(repeat for each department, then again grouping by a tenure band and a pay band you bucket from salary)',
      },
      {
        instruction: "Compare overtime and promotion history for leavers and stayers.",
        hint: "AVERAGEIFS on overtime_hours and years_since_promotion, split by left_company = Yes vs No.",
        expectedOutput: "Leavers show a higher average overtime and a longer gap since their last promotion than stayers.",
        solution: '=AVERAGEIFS(OvertimeHours,LeftCompany,"Yes")   vs.   =AVERAGEIFS(OvertimeHours,LeftCompany,"No")\n(repeat for YearsSincePromotion)',
      },
      {
        instruction: "Build a report page with slicers for department and year.",
        hint: "A PivotTable with department and hire-year gets you most of the way there before you add slicers.",
        expectedOutput: "A page where moving the department or year slicer updates the attrition figures live, with no manual recalculation.",
        solution: "Insert a PivotTable from the cleaned table → put Department and the year of hire_date on Rows/Filters → show attrition rate as the value → Insert → Slicer for both fields.",
      },
      {
        instruction: "Write up which groups are most at risk.",
        hint: "Combine the three cuts (department, tenure, overtime) instead of reporting just the single worst number from one of them.",
        expectedOutput: "A short memo naming one specific department-and-tenure combination with the highest attrition and overtime, backed by the actual percentages.",
        solution:
          "No single correct wording. A strong memo names one department and tenure band using your computed attrition % and overtime averages, and recommends one specific intervention (overtime caps, earlier promotion reviews) for that group.",
      },
    ],
    deliverables: ["Cleaned workbook", "Report with an attrition overview page", "Short findings memo"],
    portfolioDeliverables: ["A cleaned, formula-driven workbook (not hardcoded values)", "A filterable attrition report page with slicers", "A one-page findings memo naming the at-risk group"],
  },
  {
    slug: "e-commerce-performance",
    title: "E-commerce Performance",
    tools: ["SQL", "Tableau"],
    problem:
      "An online store spends across several acquisition channels and wants to know which ones bring back customers who actually convert well, so it can decide where to put next quarter's budget.",
    objectives: ["Measure order volume, delivered rate and average order value by channel", "Find how much revenue repeat customers contribute", "Recommend where to shift budget"],
    datasetSlug: "ecommerce-orders",
    dataset: "E-commerce orders: one row per order, with channel, device, country and delivery status",
    tasks: [
      {
        instruction: "Profile the table: row count, date range, and which channels and countries are represented.",
        hint: "COUNT(DISTINCT channel) and COUNT(DISTINCT country) alongside MIN/MAX(order_date).",
        expectedOutput: "A single row showing total orders, how many distinct channels and countries appear, and the date range they cover.",
        solution: "SELECT COUNT(*), COUNT(DISTINCT channel), COUNT(DISTINCT country), MIN(order_date), MAX(order_date)\nFROM ecommerce_orders;",
      },
      {
        instruction: "Calculate order count, delivered rate and average order value by channel.",
        hint: "Delivered rate = delivered orders ÷ all orders for that channel; status is one of delivered, returned or cancelled.",
        expectedOutput: "A channel-by-channel table; delivered rate and average order value both vary noticeably between channels.",
        solution:
          "SELECT channel,\n       COUNT(*) AS orders,\n       AVG(order_value) AS aov,\n       100.0 * SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) / COUNT(*) AS delivered_pct\nFROM ecommerce_orders\nGROUP BY channel\nORDER BY orders DESC;",
      },
      {
        instruction: "Identify repeat customers and the share of revenue they bring.",
        hint: "Group by customer_id first to get orders and revenue per customer, then split that result into repeat (2+ orders) vs one-time.",
        expectedOutput: "A minority of customer_ids place more than one order, and that group accounts for a disproportionate share of total order_value.",
        solution:
          "WITH per_customer AS (\n  SELECT customer_id, COUNT(*) AS orders, SUM(order_value) AS revenue\n  FROM ecommerce_orders GROUP BY customer_id\n)\nSELECT CASE WHEN orders > 1 THEN 'Repeat' ELSE 'One-time' END AS segment,\n       COUNT(*) AS customers, SUM(revenue) AS revenue\nFROM per_customer GROUP BY 1;",
      },
      {
        instruction: "Compare device and country performance.",
        hint: "The same group-and-aggregate pattern as the channel breakdown, applied to device and then to country.",
        expectedOutput: "Order volume and average order value by device (Mobile/Desktop/Tablet), and total revenue ranked by country.",
        solution:
          "SELECT device, COUNT(*) AS orders, AVG(order_value) AS aov FROM ecommerce_orders GROUP BY device;\n\nSELECT country, SUM(order_value) AS revenue FROM ecommerce_orders GROUP BY country ORDER BY revenue DESC;",
      },
      {
        instruction: "Recommend a budget change with supporting numbers.",
        hint: "Tie the recommendation to the channel with the strongest combination of AOV and delivered rate versus the weakest one.",
        expectedOutput: "A short, specific recommendation naming one channel to invest in and, optionally, one to pull back from, backed by the numbers from task 2.",
        solution:
          "No single correct wording — cite the actual channel-level AOV and delivered-rate figures you computed, and recommend shifting budget toward the channel with the strongest combination of the two.",
      },
    ],
    deliverables: ["Channel, device and country queries", "Dashboard with channel and repeat-customer views", "Recommendation slide"],
    portfolioDeliverables: ["A commented SQL script covering channel, device, country and repeat-customer analysis", "A dashboard view (Tableau or equivalent) built from the same queries", "A one-slide budget recommendation with numbers"],
  },
  {
    slug: "customer-segmentation",
    title: "Customer Segmentation",
    tools: ["SQL", "Python"],
    problem: "Marketing sends the same campaign to everyone. They want customer groups based on actual buying behaviour.",
    objectives: ["Score customers on recency, frequency and monetary value", "Group them into actionable segments", "Describe each segment and a suitable action"],
    datasetSlug: "customer-transactions",
    dataset: "Customer transactions: purchases and refunds by customer, with loyalty tier",
    tasks: [
      {
        instruction: "Compute recency, frequency and monetary value per customer.",
        hint: "Recency = days since the most recent transaction; frequency = count of purchase rows; monetary = sum of purchase amounts, excluding refunds, which are stored as negative amounts.",
        expectedOutput: "One row per customer with a last-purchase date, a purchase count and a total purchase amount.",
        solution:
          "SELECT customer_id,\n       MAX(transaction_date) AS last_purchase,\n       COUNT(*) FILTER (WHERE type = 'purchase') AS frequency,\n       SUM(CASE WHEN type = 'purchase' THEN amount ELSE 0 END) AS monetary\nFROM customer_transactions\nGROUP BY customer_id;",
      },
      {
        instruction: "Assign 1 to 5 scores for each with NTILE or quantiles.",
        hint: "NTILE(5) ordered by recency ascending (most recent = best) and by frequency/monetary descending.",
        expectedOutput: "Every customer gets an R, F and M score from 1 to 5, each roughly a fifth of customers per bucket.",
        solution:
          "SELECT customer_id,\n       NTILE(5) OVER (ORDER BY last_purchase DESC) AS r_score,\n       NTILE(5) OVER (ORDER BY frequency ASC) AS f_score,\n       NTILE(5) OVER (ORDER BY monetary ASC) AS m_score\nFROM rfm_base;",
      },
      {
        instruction: "Combine scores into named segments.",
        hint: "A simple rule works: high R+F+M together is \"Champions\"; low across the board is \"At risk\"; everything else is \"Regular\".",
        expectedOutput: "Every customer lands in exactly one named segment, and the segment counts add up to the total customer count.",
        solution:
          "CASE\n  WHEN r_score >= 4 AND f_score >= 4 AND m_score >= 4 THEN 'Champions'\n  WHEN r_score <= 2 AND f_score <= 2 THEN 'At risk'\n  ELSE 'Regular'\nEND AS segment",
      },
      {
        instruction: "Profile each segment: size, revenue share, typical basket.",
        hint: "GROUP BY segment, then aggregate customer count, total monetary value, and monetary ÷ frequency for a typical basket size.",
        expectedOutput: "One row per segment with customer count, share of total revenue, and average amount per purchase.",
        solution:
          "SELECT segment, COUNT(*) AS customers, SUM(monetary) AS revenue,\n       SUM(monetary) / SUM(frequency) AS avg_basket\nFROM segmented\nGROUP BY segment;",
      },
      {
        instruction: "Propose one campaign per segment.",
        hint: "Match the offer to the segment's actual behaviour — a win-back offer for \"At risk\" looks different from a loyalty perk for \"Champions\".",
        expectedOutput: "One specific, named campaign idea per segment, each referencing that segment's R/F/M profile.",
        solution:
          "No single correct answer — for example: Champions get early access to new stock; At risk get a time-limited win-back discount; Regular get a frequency-based loyalty nudge.",
      },
    ],
    deliverables: ["RFM table", "Segment profile chart", "Campaign plan by segment"],
    portfolioDeliverables: ["An RFM scoring script (SQL or Python) that runs end to end on the dataset", "A segment-profile chart (size and revenue share per segment)", "A one-page campaign plan, one idea per segment"],
  },
  {
    slug: "inventory-analysis",
    title: "Inventory Analysis",
    tools: ["Excel", "SQL"],
    problem:
      "A distributor has cash tied up in slow stock while popular items run out. Operations wants a view of what to reorder and what to clear.",
    objectives: ["Calculate stock turnover and days of cover per product", "Classify products by revenue contribution", "Flag stock-out risks and overstock"],
    datasetSlug: "inventory-management",
    dataset: "Inventory management: stock levels, reorder points and sales rates for 40 products",
    tasks: [
      {
        instruction: "Check the inventory table for missing values and bring product name and category alongside stock figures.",
        hint: "The file already carries product_name, category and avg_daily_sales per product_id — this is a sanity check, not a join you need to build from scratch.",
        expectedOutput: "stock_on_hand, reorder_point and avg_daily_sales present for all 40 products with no missing values.",
        solution: "=COUNTBLANK(range) across each column to confirm there are no gaps. Spot-check a couple of avg_daily_sales figures against the retail order_items data if you want an independent check.",
      },
      {
        instruction: "Compute days of cover for each product.",
        hint: "Days of cover = stock on hand ÷ average daily sales.",
        expectedOutput: "A days-of-cover figure for all 40 products; a handful are very low (near zero) and a handful are very high (100+ days).",
        solution: "=StockOnHand/AvgDailySales",
      },
      {
        instruction: "Run an ABC classification by revenue contribution.",
        hint: "Use unit_cost × avg_daily_sales as a revenue proxy, rank products descending, then take the cumulative share of total: top ~80% is A, next ~15% is B, the rest is C.",
        expectedOutput: "Roughly a fifth of products fall in class A and account for about 80% of estimated revenue — the classic ABC split.",
        solution: '=IF(cumulative_share<=0.8,"A",IF(cumulative_share<=0.95,"B","C"))  — after sorting by revenue descending and computing a running total ÷ grand total',
      },
      {
        instruction: "Flag items below reorder point and items with over 180 days of cover.",
        hint: "Two independent IF flags, one per condition.",
        expectedOutput: "A short list of products flagged \"Reorder\" and a separate short list flagged \"Overstock\", with no product on both lists.",
        solution: '=IF(StockOnHand<ReorderPoint,"Reorder","")\n=IF(DaysOfCover>180,"Overstock","")',
      },
      {
        instruction: "Produce a reorder list and a clearance list, with the cash tied up in overstock.",
        hint: "Filter each flag column down to the flagged rows; cash tied up = unit_cost × (stock_on_hand − reorder_point) for the overstocked rows.",
        expectedOutput: "Two sorted product lists (reorder, by lowest days of cover first; overstock, by highest first), plus a total dollar figure for cash tied up in overstock.",
        solution: "Filter + sort on the flag columns from task 4; =SUMPRODUCT((Flag=\"Overstock\")*(StockOnHand-ReorderPoint)*UnitCost) for the cash figure.",
      },
    ],
    deliverables: ["Analysis workbook or SQL script", "Reorder and clearance lists", "Summary of cash tied up in slow stock"],
    portfolioDeliverables: ["A formula-driven workbook with days-of-cover and ABC classification", "A reorder list and a clearance list, each sorted by urgency", "A one-line summary of cash tied up in overstock, with the dollar figure"],
  },
];
