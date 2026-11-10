import type { Lesson } from "../types";

export const sqlAdvanced: Record<string, Lesson> = {
  "sql/ctes": {
    summary: "A CTE names a query with WITH so later steps can use it like a table, turning one tangled query into readable stages.",
    explanation: [
      "A common table expression (CTE) is a named, temporary result defined at the top of a query. You write WITH name AS (query) and then select from name as if it were a table. Several CTEs can be chained, each building on the ones before.",
      "CTEs do the same job as subqueries in FROM, but they read top to bottom in the order you think: first get the monthly totals, then compare them. They exist only for the one statement they belong to.",
    ],
    syntax: `WITH step_one AS (
  SELECT ...
),
step_two AS (
  SELECT ... FROM step_one
)
SELECT ...
FROM step_two;`,
    examples: [
      {
        title: "One CTE",
        code: `WITH customer_totals AS (
  SELECT customer_id, SUM(amount) AS total_spent
  FROM orders
  WHERE status = 'completed'
  GROUP BY customer_id
)
SELECT customer_id, total_spent
FROM customer_totals
WHERE total_spent > 5000;`,
        note: "The CTE calculates totals; the final query filters them. No HAVING needed.",
      },
      {
        title: "Chained CTEs",
        code: `WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS month,
         SUM(amount) AS revenue
  FROM orders
  WHERE status = 'completed'
  GROUP BY 1
),
average AS (
  SELECT AVG(revenue) AS avg_revenue FROM monthly
)
SELECT m.month, m.revenue
FROM monthly m
CROSS JOIN average a
WHERE m.revenue > a.avg_revenue;`,
        note: "The second CTE reads from the first. The result is the months that beat the average month.",
      },
    ],
    scenario: {
      title: "Share of revenue from top customers",
      body: "The account team wants to know how much revenue comes from customers who have spent over 5,000. One CTE totals spend per customer; the final query compares the big spenders with everyone.",
      code: `WITH customer_totals AS (
  SELECT customer_id, SUM(amount) AS total_spent
  FROM orders
  WHERE status = 'completed'
  GROUP BY customer_id
)
SELECT ROUND(100.0 * SUM(total_spent) FILTER (WHERE total_spent > 5000)
             / SUM(total_spent), 1) AS pct_from_top_customers
FROM customer_totals;`,
    },
    mistakes: [
      { mistake: "Putting a comma after the last CTE.", fix: "Commas separate CTEs. The last one is followed directly by the main SELECT." },
      { mistake: "Writing WITH again for the second CTE.", fix: "WITH appears once. Later CTEs are added after a comma." },
    ],
    practice: [
      {
        title: "Above-average regions",
        prompt: "Using a CTE of completed revenue per region, return regions whose revenue is above the average region's revenue.",
        difficulty: "Medium",
        hint: "Compare each row of the CTE with (SELECT AVG(revenue) FROM the_cte).",
        solution: `WITH region_revenue AS (
  SELECT region, SUM(amount) AS revenue
  FROM orders
  WHERE status = 'completed'
  GROUP BY region
)
SELECT region, revenue
FROM region_revenue
WHERE revenue > (SELECT AVG(revenue) FROM region_revenue);`,
      },
      {
        title: "First order per customer",
        prompt: "Return each customer's name and the date of their first order, using a CTE for the first order dates.",
        difficulty: "Medium",
        hint: "MIN(order_date) per customer in the CTE, then join to customers.",
        solution: `WITH first_orders AS (
  SELECT customer_id, MIN(order_date) AS first_order_date
  FROM orders
  GROUP BY customer_id
)
SELECT c.full_name, f.first_order_date
FROM first_orders f
JOIN customers c ON c.customer_id = f.customer_id;`,
      },
    ],
    checks: [
      {
        q: "How long does a CTE exist?",
        options: ["Until the session ends", "For the single statement it is defined in", "Permanently", "Until COMMIT"],
        answer: 1,
        why: "A CTE is part of one statement and disappears when it finishes.",
      },
      {
        q: "How do you define a second CTE?",
        options: ["Repeat WITH", "Add it after a comma", "Nest it inside the first", "Use AND"],
        answer: 1,
        why: "WITH a AS (...), b AS (...) SELECT ...",
      },
    ],
  },

  "sql/window-functions": {
    summary: "Window functions calculate across a set of related rows while keeping every row, which makes running totals and comparisons possible.",
    explanation: [
      "GROUP BY collapses rows into one per group. A window function also looks at a group of rows, but it returns a value for every row and removes none. You add OVER (...) after the function to describe the window.",
      "PARTITION BY splits rows into groups, like GROUP BY without the collapse. ORDER BY inside OVER puts the rows in sequence, which turns SUM into a running total and gives LAG and LEAD a previous and next row to read.",
    ],
    syntax: `FUNCTION(column) OVER (
  PARTITION BY group_column
  ORDER BY sort_column
) AS result`,
    examples: [
      {
        title: "Each order beside its region total",
        code: `SELECT order_id, region, amount,
       SUM(amount) OVER (PARTITION BY region) AS region_total
FROM orders;`,
        note: "Every order is still there, and each row also carries its region's total.",
      },
      {
        title: "Running total and previous value",
        code: `SELECT order_date, amount,
       SUM(amount) OVER (ORDER BY order_date, order_id) AS running_total,
       LAG(amount) OVER (ORDER BY order_date, order_id) AS previous_amount
FROM orders
WHERE customer_id = 42;`,
        note: "With ORDER BY, SUM adds up everything so far. LAG reads the row before.",
      },
    ],
    scenario: {
      title: "Month-over-month revenue change",
      body: "The finance lead wants each month's revenue next to the change from the previous month. Aggregate to months in a CTE, then use LAG to bring the prior month onto the same row.",
      code: `WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS month,
         SUM(amount) AS revenue
  FROM orders
  WHERE status = 'completed'
  GROUP BY 1
)
SELECT month, revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change_vs_prior
FROM monthly
ORDER BY month;`,
    },
    mistakes: [
      { mistake: "Filtering on a window function in WHERE.", fix: "Window functions run after WHERE. Compute them in a CTE or subquery and filter in the outer query." },
      { mistake: "Ordering a running total by a column with ties.", fix: "Tied rows are added together in one step. Add a unique tie-breaker such as order_id to the window's ORDER BY." },
    ],
    practice: [
      {
        title: "Share of region revenue",
        prompt: "For each completed order, return its amount and its percentage of the region's completed revenue.",
        difficulty: "Medium",
        hint: "Divide amount by SUM(amount) OVER (PARTITION BY region).",
        solution: `SELECT order_id, region, amount,
       ROUND(100.0 * amount
             / SUM(amount) OVER (PARTITION BY region), 2) AS pct_of_region
FROM orders
WHERE status = 'completed';`,
      },
      {
        title: "Days since previous order",
        prompt: "For each order, return the number of days since the same customer's previous order.",
        difficulty: "Hard",
        hint: "LAG(order_date) partitioned by customer and ordered by date; subtracting two dates gives days.",
        solution: `SELECT customer_id, order_id, order_date,
       order_date - LAG(order_date) OVER (
         PARTITION BY customer_id
         ORDER BY order_date, order_id
       ) AS days_since_previous
FROM orders;`,
      },
    ],
    checks: [
      {
        q: "How does a window function differ from GROUP BY?",
        options: ["It is faster", "It keeps every input row", "It cannot use SUM", "It requires a join"],
        answer: 1,
        why: "GROUP BY returns one row per group; a window function returns a value on each original row.",
      },
      {
        q: "What does PARTITION BY do inside OVER?",
        options: ["Sorts the final result", "Splits rows into groups the function works within", "Filters rows", "Limits rows"],
        answer: 1,
        why: "The function restarts for each partition.",
      },
    ],
  },

  "sql/ranking": {
    summary: "ROW_NUMBER, RANK and DENSE_RANK number rows within a group, which is how you answer 'top N per category' questions.",
    explanation: [
      "Ranking functions are window functions that assign a position to each row based on the window's ORDER BY. They differ only in how they treat ties. ROW_NUMBER gives every row a different number. RANK gives tied rows the same number and then skips ahead. DENSE_RANK gives tied rows the same number and does not skip.",
      "For values 500, 400, 400, 300: ROW_NUMBER gives 1, 2, 3, 4; RANK gives 1, 2, 2, 4; DENSE_RANK gives 1, 2, 2, 3. To keep the top N per group, compute the rank in a CTE and filter on it outside, because a window function cannot be used in WHERE.",
    ],
    syntax: `ROW_NUMBER() OVER (PARTITION BY group_column ORDER BY sort_column DESC)
RANK()       OVER (PARTITION BY group_column ORDER BY sort_column DESC)
DENSE_RANK() OVER (PARTITION BY group_column ORDER BY sort_column DESC)`,
    examples: [
      {
        title: "Rank orders within each region",
        code: `SELECT region, order_id, amount,
       RANK() OVER (PARTITION BY region ORDER BY amount DESC) AS amount_rank
FROM orders;`,
        note: "The ranking restarts at 1 for each region.",
      },
      {
        title: "Top three per region",
        code: `WITH ranked AS (
  SELECT region, order_id, amount,
         ROW_NUMBER() OVER (
           PARTITION BY region
           ORDER BY amount DESC, order_id
         ) AS rn
  FROM orders
)
SELECT region, order_id, amount
FROM ranked
WHERE rn <= 3;`,
        note: "ROW_NUMBER guarantees exactly three rows per region, with order_id breaking ties.",
      },
    ],
    scenario: {
      title: "Each customer's most recent order",
      body: "Support wants one row per customer showing their latest order. Number each customer's orders from newest to oldest and keep number 1.",
      code: `WITH numbered AS (
  SELECT customer_id, order_id, order_date, status,
         ROW_NUMBER() OVER (
           PARTITION BY customer_id
           ORDER BY order_date DESC, order_id DESC
         ) AS rn
  FROM orders
)
SELECT customer_id, order_id, order_date, status
FROM numbered
WHERE rn = 1;`,
    },
    mistakes: [
      { mistake: "Using RANK when you need exactly N rows.", fix: "Ties can return more than N. Use ROW_NUMBER with a tie-breaker when the count must be exact." },
      { mistake: "Using ROW_NUMBER when tied rows should share a place.", fix: "It splits ties arbitrarily. Use RANK or DENSE_RANK for league-table style results." },
    ],
    practice: [
      {
        title: "Best-selling product per category",
        prompt: "Return the product with the most units sold in each category.",
        difficulty: "Hard",
        hint: "Total units per product in one CTE, rank within category in a second, keep rank 1.",
        solution: `WITH product_units AS (
  SELECT p.category, p.product_name,
         SUM(oi.quantity) AS units
  FROM order_items oi
  JOIN products p ON p.product_id = oi.product_id
  GROUP BY p.category, p.product_name
),
ranked AS (
  SELECT *,
         RANK() OVER (PARTITION BY category ORDER BY units DESC) AS rnk
  FROM product_units
)
SELECT category, product_name, units
FROM ranked
WHERE rnk = 1;`,
      },
      {
        title: "Customer spending league table",
        prompt: "Rank customers by total completed spend, with tied customers sharing a rank and no gaps in the numbering.",
        difficulty: "Medium",
        hint: "DENSE_RANK over the aggregated total. A window function can order by an aggregate.",
        solution: `SELECT customer_id,
       SUM(amount) AS total_spent,
       DENSE_RANK() OVER (ORDER BY SUM(amount) DESC) AS spend_rank
FROM orders
WHERE status = 'completed'
GROUP BY customer_id;`,
      },
    ],
    checks: [
      {
        q: "Values 500, 400, 400, 300 sorted descending. What does RANK give the 300 row?",
        options: ["3", "4", "2", "1"],
        answer: 1,
        why: "RANK skips after ties: 1, 2, 2, 4.",
      },
      {
        q: "Which function always gives a different number to every row in a partition?",
        options: ["RANK", "DENSE_RANK", "ROW_NUMBER", "COUNT"],
        answer: 2,
        why: "ROW_NUMBER never repeats within a partition, even for ties.",
      },
    ],
  },

  "sql/date-functions": {
    summary: "Date functions truncate, extract and shift dates so you can group by month, compare periods and measure time between events.",
    explanation: [
      "Most business reporting is by period. DATE_TRUNC rounds a date down to the start of its month, week, quarter or year, which makes it the natural thing to group by. EXTRACT pulls out one part, such as the year number or the day of the week.",
      "You can add and subtract INTERVAL values to move dates, and subtracting one date from another gives the number of days between them. The functions here are PostgreSQL's; other databases have equivalents with different names.",
    ],
    syntax: `DATE_TRUNC('month', date_column)
EXTRACT(YEAR FROM date_column)
date_column + INTERVAL '30 days'
CURRENT_DATE - date_column`,
    examples: [
      {
        title: "Revenue by month",
        code: `SELECT DATE_TRUNC('month', order_date) AS month,
       SUM(amount) AS revenue
FROM orders
WHERE status = 'completed'
GROUP BY 1
ORDER BY 1;`,
        note: "Every order in March 2024 is mapped to 2024-03-01, so they fall into one group.",
      },
      {
        title: "Orders by day of week",
        code: `SELECT EXTRACT(DOW FROM order_date) AS day_of_week,
       COUNT(*) AS orders
FROM orders
GROUP BY 1
ORDER BY 1;`,
        note: "DOW runs from 0 (Sunday) to 6 (Saturday).",
      },
    ],
    scenario: {
      title: "Customers at risk of lapsing",
      body: "Retention wants customers whose last order was more than 90 days ago. Find each customer's most recent order date and compare it with today.",
      code: `SELECT customer_id,
       MAX(order_date) AS last_order,
       CURRENT_DATE - MAX(order_date) AS days_since
FROM orders
GROUP BY customer_id
HAVING MAX(order_date) < CURRENT_DATE - INTERVAL '90 days';`,
    },
    mistakes: [
      { mistake: "Filtering a timestamp column with BETWEEN '2024-03-01' AND '2024-03-31'.", fix: "Anything after midnight on the 31st is missed. Use >= '2024-03-01' AND < '2024-04-01'." },
      { mistake: "Grouping by EXTRACT(MONTH …) across several years.", fix: "January 2023 and January 2024 merge. Group by DATE_TRUNC('month', …) instead." },
    ],
    practice: [
      {
        title: "Signups per year",
        prompt: "Count customer signups for each calendar year.",
        difficulty: "Easy",
        hint: "EXTRACT(YEAR FROM signup_date) and group by it.",
        solution: `SELECT EXTRACT(YEAR FROM signup_date) AS signup_year,
       COUNT(*) AS customers
FROM customers
GROUP BY 1
ORDER BY 1;`,
      },
      {
        title: "Days from signup to first order",
        prompt: "For each customer with at least one order, return the number of days between signup and first order.",
        difficulty: "Medium",
        hint: "MIN(order_date) per customer, minus signup_date.",
        solution: `SELECT c.customer_id,
       MIN(o.order_date) - c.signup_date AS days_to_first_order
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.signup_date;`,
      },
    ],
    checks: [
      {
        q: "What does DATE_TRUNC('month', DATE '2024-03-18') return?",
        options: ["2024-03-18", "2024-03-01", "3", "2024-03-31"],
        answer: 1,
        why: "It rounds down to the first moment of the month.",
      },
      {
        q: "Why prefer DATE_TRUNC over EXTRACT(MONTH …) for a multi-year monthly report?",
        options: ["It is shorter", "It keeps the year, so the same month in different years stays separate", "EXTRACT is deprecated", "It sorts automatically"],
        answer: 1,
        why: "EXTRACT(MONTH) returns only 1 to 12, so different years collapse together.",
      },
    ],
  },

  "sql/query-optimization": {
    summary: "Query optimisation means reading the plan the database chose and removing the work it does not need to do.",
    explanation: [
      "The database decides how to run your query: which table to read first, whether to scan it all or use an index. EXPLAIN shows that plan, and EXPLAIN ANALYZE runs the query and reports real timings. Start there instead of guessing.",
      "Most slow queries come down to a few causes: reading every row when an index could find a few (a sequential scan on a large table), wrapping an indexed column in a function so the index cannot be used, selecting columns you do not need, and joining before filtering so far more rows are carried than necessary.",
    ],
    syntax: `EXPLAIN ANALYZE
SELECT ...;

CREATE INDEX index_name
  ON table_name (column_1, column_2);`,
    examples: [
      {
        title: "Read the plan",
        code: `EXPLAIN ANALYZE
SELECT order_id, amount
FROM orders
WHERE customer_id = 42;`,
        note: "'Seq Scan on orders' means every row was read. 'Index Scan' means the database jumped to the matching rows.",
      },
      {
        title: "Keep the filter index-friendly",
        code: `-- Cannot use an index on order_date
SELECT COUNT(*) FROM orders
WHERE EXTRACT(YEAR FROM order_date) = 2024;

-- Can use an index on order_date
SELECT COUNT(*) FROM orders
WHERE order_date >= '2024-01-01'
  AND order_date <  '2025-01-01';`,
        note: "Both return the same count. The second compares the bare column to a range, so an index applies.",
      },
    ],
    scenario: {
      title: "A dashboard query that times out",
      body: "A customer-detail page loads a customer's recent orders and has become slow as the orders table grew. The plan shows a sequential scan filtered on customer_id. An index on the filter column, with the sort column second, lets the database fetch only that customer's rows in order.",
      code: `CREATE INDEX idx_orders_customer_date
  ON orders (customer_id, order_date DESC);

SELECT order_id, order_date, amount
FROM orders
WHERE customer_id = 42
ORDER BY order_date DESC
LIMIT 20;`,
    },
    mistakes: [
      { mistake: "Adding indexes everywhere.", fix: "Each index slows down writes and takes space. Index the columns your slow queries filter, join and sort on." },
      { mistake: "Optimising without measuring.", fix: "Run EXPLAIN ANALYZE before and after a change and compare. Keep the change only if the numbers improve." },
    ],
    practice: [
      {
        title: "Make the filter index-friendly",
        prompt: "Rewrite this so an index on order_date can be used: SELECT * FROM orders WHERE DATE_TRUNC('month', order_date) = '2024-06-01';",
        difficulty: "Medium",
        hint: "Compare the bare column against the start of the month and the start of the next.",
        solution: `SELECT *
FROM orders
WHERE order_date >= '2024-06-01'
  AND order_date <  '2024-07-01';`,
      },
      {
        title: "Choose an index",
        prompt: "A report often runs: SELECT region, SUM(amount) FROM orders WHERE status = 'completed' AND order_date >= '2024-01-01' GROUP BY region. Write an index to support the filter.",
        difficulty: "Hard",
        hint: "Put the equality column first, then the range column.",
        solution: `CREATE INDEX idx_orders_status_date
  ON orders (status, order_date);`,
      },
    ],
    checks: [
      {
        q: "What does 'Seq Scan' in a plan mean?",
        options: ["The query used an index", "Every row of the table was read", "The query ran in parallel", "Results were cached"],
        answer: 1,
        why: "A sequential scan reads the whole table and filters as it goes.",
      },
      {
        q: "Which filter can use an index on order_date?",
        options: [
          "WHERE EXTRACT(YEAR FROM order_date) = 2024",
          "WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'",
          "WHERE CAST(order_date AS TEXT) LIKE '2024%'",
          "WHERE DATE_TRUNC('year', order_date) = '2024-01-01'",
        ],
        answer: 1,
        why: "The column is compared directly to a range, so the index on it applies.",
      },
    ],
  },
};
