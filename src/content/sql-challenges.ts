import type { DatabaseId } from "@/lib/sql/databases";
import { hrSqlChallenges } from "./sql-challenges-hr";
import type { Difficulty } from "./types";

export type SqlChallenge = {
  slug: string;
  title: string;
  difficulty: Difficulty;
  /** Which SQL Playground database this challenge runs against. Defaults to "retail". */
  database?: DatabaseId;
  topics: string[];
  scenario: string;
  task: string;
  columns: string[];
  /** Whether row order is part of the answer. */
  ordered: boolean;
  hints: string[];
  solution: string;
  explanation: string;
  /** Queries that must be rejected. Used by the browser verification test. */
  wrong: string[];
  starter?: string;
};

export const XP: Record<Difficulty, number> = { Easy: 10, Medium: 20, Hard: 30 };
export const challengeId = (slug: string) => `practice-sql/${slug}`;

export const sqlChallenges: SqlChallenge[] = [
  {
    slug: "completed-orders",
    title: "Completed orders",
    difficulty: "Easy",
    topics: ["SELECT", "WHERE"],
    scenario: "Finance is reconciling payments and only wants orders that actually went through.",
    task: "Return the order ID, order date and amount of every order whose status is completed.",
    columns: ["order_id", "order_date", "amount"],
    ordered: false,
    hints: ["Everything you need is in the orders table.", "Filter rows with WHERE on the status column. Text values go in single quotes.", "SELECT three columns FROM orders WHERE status = 'completed'."],
    solution: `SELECT order_id, order_date, amount
FROM orders
WHERE status = 'completed';`,
    explanation: "WHERE keeps only the rows whose status equals 'completed'. SELECT then returns the three requested columns for those rows.",
    wrong: ["SELECT order_id, order_date, amount FROM orders", "SELECT order_id, amount FROM orders WHERE status = 'completed'"],
  },
  {
    slug: "enterprise-customers",
    title: "Enterprise customer list",
    difficulty: "Easy",
    topics: ["WHERE", "ORDER BY"],
    scenario: "The account team wants a contact sheet of its largest customers.",
    task: "Return the name and city of customers in the Enterprise segment, sorted by name from A to Z and then by city.",
    columns: ["full_name", "city"],
    ordered: true,
    hints: ["Filter the customers table on segment.", "ORDER BY can take two columns, separated by a comma.", "WHERE segment = 'Enterprise' ORDER BY full_name, city."],
    solution: `SELECT full_name, city
FROM customers
WHERE segment = 'Enterprise'
ORDER BY full_name, city;`,
    explanation: "The filter keeps Enterprise customers. ORDER BY sorts by name first and uses city only to order customers who share a name.",
    wrong: ["SELECT full_name, city FROM customers ORDER BY full_name, city", "SELECT full_name, city FROM customers WHERE segment = 'Enterprise' ORDER BY full_name DESC, city"],
  },
  {
    slug: "five-largest-orders",
    title: "Five largest orders",
    difficulty: "Easy",
    topics: ["ORDER BY", "LIMIT"],
    scenario: "The sales director wants to congratulate the teams behind the biggest deals.",
    task: "Return the order ID and amount of the five largest orders, largest first. If two orders have the same amount, list the lower order ID first.",
    columns: ["order_id", "amount"],
    ordered: true,
    hints: ["Sort before you limit. LIMIT alone returns arbitrary rows.", "Sort by amount descending, then by order_id ascending as the tie-breaker.", "ORDER BY amount DESC, order_id LIMIT 5."],
    solution: `SELECT order_id, amount
FROM orders
ORDER BY amount DESC, order_id
LIMIT 5;`,
    explanation: "ORDER BY puts the largest amounts first, and LIMIT keeps the top five. The second sort key makes the result the same every time when amounts tie.",
    wrong: ["SELECT order_id, amount FROM orders LIMIT 5", "SELECT order_id, amount FROM orders ORDER BY amount, order_id LIMIT 5"],
  },
  {
    slug: "product-categories",
    title: "Product categories",
    difficulty: "Easy",
    topics: ["DISTINCT", "ORDER BY"],
    scenario: "The website team is building a category menu.",
    task: "List each product category once, in alphabetical order.",
    columns: ["category"],
    ordered: true,
    hints: ["Many products share a category, so you need to remove duplicates.", "DISTINCT goes straight after SELECT.", "SELECT DISTINCT category FROM products ORDER BY category."],
    solution: `SELECT DISTINCT category
FROM products
ORDER BY category;`,
    explanation: "DISTINCT collapses repeated categories into one row each, and ORDER BY sorts them alphabetically.",
    wrong: ["SELECT category FROM products ORDER BY category", "SELECT DISTINCT category FROM products ORDER BY category DESC"],
  },
  {
    slug: "revenue-by-region",
    title: "Revenue by region",
    difficulty: "Medium",
    topics: ["GROUP BY", "SUM"],
    scenario: "Leadership is deciding which region gets extra sales staff.",
    task: "Return total revenue per region, counting completed orders only, with the highest revenue first. Name the total revenue.",
    columns: ["region", "revenue"],
    ordered: true,
    hints: ["You need one row per region, so group by region.", "Filter to completed orders with WHERE before grouping, and add the amounts with SUM.", "SELECT region, SUM(amount) AS revenue … WHERE status = 'completed' GROUP BY region ORDER BY revenue DESC."],
    solution: `SELECT region, SUM(amount) AS revenue
FROM orders
WHERE status = 'completed'
GROUP BY region
ORDER BY revenue DESC;`,
    explanation: "WHERE removes refunded and cancelled orders first. GROUP BY makes one row per region and SUM totals the amounts within each.",
    wrong: ["SELECT region, SUM(amount) AS revenue FROM orders GROUP BY region ORDER BY revenue DESC", "SELECT region, COUNT(*) AS revenue FROM orders WHERE status = 'completed' GROUP BY region ORDER BY revenue DESC"],
  },
  {
    slug: "frequent-buyers",
    title: "Frequent buyers",
    difficulty: "Medium",
    topics: ["GROUP BY", "HAVING"],
    scenario: "Marketing wants to invite the most active customers to a loyalty scheme.",
    task: "Return the customer ID and number of orders for every customer who has placed at least six orders, whatever their status. Name the count orders.",
    columns: ["customer_id", "orders"],
    ordered: false,
    hints: ["Count orders per customer with GROUP BY.", "A condition on a count cannot go in WHERE, because WHERE runs before grouping.", "GROUP BY customer_id HAVING COUNT(*) >= 6."],
    solution: `SELECT customer_id, COUNT(*) AS orders
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 6;`,
    explanation: "GROUP BY counts orders per customer. HAVING filters the groups after counting, which WHERE cannot do.",
    wrong: ["SELECT customer_id, COUNT(*) AS orders FROM orders GROUP BY customer_id", "SELECT customer_id, COUNT(*) AS orders FROM orders GROUP BY customer_id HAVING COUNT(*) > 6"],
  },
  {
    slug: "large-orders-with-names",
    title: "Large orders with customer names",
    difficulty: "Medium",
    topics: ["INNER JOIN"],
    scenario: "Customer success wants to call everyone who placed a large order.",
    task: "Return the order ID, the customer's full name and the amount for every order over 500.",
    columns: ["order_id", "full_name", "amount"],
    ordered: false,
    hints: ["The amount is in orders and the name is in customers.", "Join the two tables on customer_id.", "FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE o.amount > 500."],
    solution: `SELECT o.order_id, c.full_name, o.amount
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
WHERE o.amount > 500;`,
    explanation: "The join pairs each order with its customer through customer_id, so name and amount can sit on the same row. WHERE then keeps the large orders.",
    wrong: ["SELECT o.order_id, c.full_name, o.amount FROM orders o JOIN customers c ON c.customer_id = o.customer_id", "SELECT o.order_id, c.full_name, o.amount FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE o.amount >= 100"],
  },
  {
    slug: "revenue-by-category",
    title: "Revenue by product category",
    difficulty: "Medium",
    topics: ["INNER JOIN", "GROUP BY"],
    scenario: "The buying team is deciding which ranges to expand.",
    task: "Return each product category with its total line revenue (quantity times unit price across all order items), highest first. Name the total revenue.",
    columns: ["category", "revenue"],
    ordered: true,
    hints: ["Quantities and prices are in order_items; categories are in products.", "Join on product_id, then group by category.", "SUM(oi.quantity * oi.unit_price) … GROUP BY p.category ORDER BY revenue DESC."],
    solution: `SELECT p.category, SUM(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN products p ON p.product_id = oi.product_id
GROUP BY p.category
ORDER BY revenue DESC;`,
    explanation: "Each order item is matched to its product to find the category. The line value is calculated per row and summed within each category.",
    wrong: ["SELECT p.category, SUM(oi.quantity) AS revenue FROM order_items oi JOIN products p ON p.product_id = oi.product_id GROUP BY p.category ORDER BY revenue DESC", "SELECT p.category, SUM(oi.quantity * oi.unit_price) AS revenue FROM order_items oi JOIN products p ON p.product_id = oi.product_id GROUP BY p.category ORDER BY revenue"],
  },
  {
    slug: "customers-without-orders",
    title: "Customers who never ordered",
    difficulty: "Medium",
    topics: ["LEFT JOIN"],
    scenario: "The CRM team wants to send a first-purchase offer.",
    task: "Return the customer ID and full name of every customer who has never placed an order.",
    columns: ["customer_id", "full_name"],
    ordered: false,
    hints: ["An inner join would drop exactly the customers you are looking for.", "LEFT JOIN customers to orders and look for rows where the order side is missing.", "LEFT JOIN orders o ON o.customer_id = c.customer_id WHERE o.order_id IS NULL."],
    solution: `SELECT c.customer_id, c.full_name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;`,
    explanation: "LEFT JOIN keeps every customer. Those with no orders get NULL in the order columns, and the WHERE clause keeps only those rows. NOT EXISTS gives the same answer.",
    wrong: ["SELECT c.customer_id, c.full_name FROM customers c JOIN orders o ON o.customer_id = c.customer_id WHERE o.order_id IS NULL", "SELECT c.customer_id, c.full_name FROM customers c"],
  },
  {
    slug: "order-size-bands",
    title: "Order size bands",
    difficulty: "Medium",
    topics: ["CASE WHEN", "GROUP BY"],
    scenario: "Operations plans packing staff by order size.",
    task: "Label each order Large (amount 500 or more), Medium (150 or more) or Small, then return each label with the number of orders in it. Name the columns order_size and orders.",
    columns: ["order_size", "orders"],
    ordered: false,
    hints: ["Build the label with CASE WHEN … THEN … ELSE … END.", "Put the tightest condition first: CASE stops at the first match.", "Group by the same CASE expression (or by its alias) and COUNT(*)."],
    solution: `SELECT CASE
         WHEN amount >= 500 THEN 'Large'
         WHEN amount >= 150 THEN 'Medium'
         ELSE 'Small'
       END AS order_size,
       COUNT(*) AS orders
FROM orders
GROUP BY order_size;`,
    explanation: "CASE assigns one label per order, checking the largest threshold first. Grouping by that label counts the orders in each band.",
    wrong: ["SELECT CASE WHEN amount >= 150 THEN 'Medium' WHEN amount >= 500 THEN 'Large' ELSE 'Small' END AS order_size, COUNT(*) AS orders FROM orders GROUP BY order_size", "SELECT status AS order_size, COUNT(*) AS orders FROM orders GROUP BY status"],
  },
  {
    slug: "above-average-orders",
    title: "Above-average orders",
    difficulty: "Hard",
    topics: ["Subqueries"],
    scenario: "The pricing team wants to study orders that are bigger than usual.",
    task: "Return the order ID and amount of completed orders whose amount is above the average amount of all completed orders.",
    columns: ["order_id", "amount"],
    ordered: false,
    hints: ["First think about how to get the average completed amount as a single number.", "A query in brackets that returns one value can be used in a comparison.", "WHERE status = 'completed' AND amount > (SELECT AVG(amount) FROM orders WHERE status = 'completed')."],
    solution: `SELECT order_id, amount
FROM orders
WHERE status = 'completed'
  AND amount > (SELECT AVG(amount) FROM orders WHERE status = 'completed');`,
    explanation: "The subquery calculates the average once. The outer query compares each completed order with it. Both parts filter on status, so the average and the comparison use the same set of orders.",
    wrong: ["SELECT order_id, amount FROM orders WHERE amount > (SELECT AVG(amount) FROM orders)", "SELECT order_id, amount FROM orders WHERE status = 'completed' AND amount > 200"],
  },
  {
    slug: "strong-months",
    title: "Months that beat the average",
    difficulty: "Hard",
    topics: ["CTEs", "Date functions"],
    scenario: "The finance lead wants to know which months outperformed a typical month.",
    task: "Using completed orders, calculate revenue per month. Return the months whose revenue is above the average monthly revenue, earliest first. Use DATE_TRUNC('month', order_date) for the month and name the columns month and revenue.",
    columns: ["month", "revenue"],
    ordered: true,
    hints: ["Work in two steps: monthly totals first, then compare each with the average of those totals.", "Put the monthly totals in a CTE: WITH monthly AS (…).", "SELECT month, revenue FROM monthly WHERE revenue > (SELECT AVG(revenue) FROM monthly) ORDER BY month."],
    solution: `WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS month,
         SUM(amount) AS revenue
  FROM orders
  WHERE status = 'completed'
  GROUP BY 1
)
SELECT month, revenue
FROM monthly
WHERE revenue > (SELECT AVG(revenue) FROM monthly)
ORDER BY month;`,
    explanation: "The CTE names the monthly totals so they can be used twice: once as the rows to return and once to calculate their average.",
    wrong: ["SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS revenue FROM orders WHERE status = 'completed' GROUP BY 1 ORDER BY 1", "WITH monthly AS (SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS revenue FROM orders GROUP BY 1) SELECT month, revenue FROM monthly WHERE revenue > (SELECT AVG(revenue) FROM monthly) ORDER BY month"],
  },
  {
    slug: "largest-order-per-region",
    title: "Largest order in each region",
    difficulty: "Hard",
    topics: ["Window functions", "Ranking"],
    scenario: "Each regional manager wants to see their single biggest order.",
    task: "Return the region, order ID and amount of the largest order in each region. If amounts tie, take the lowest order ID.",
    columns: ["region", "order_id", "amount"],
    ordered: false,
    hints: ["GROUP BY with MAX gives the amount but loses the order ID.", "Number the orders inside each region with ROW_NUMBER() OVER (PARTITION BY region ORDER BY amount DESC, order_id).", "Calculate the row number in a CTE, then keep the rows where it equals 1."],
    solution: `WITH ranked AS (
  SELECT region, order_id, amount,
         ROW_NUMBER() OVER (PARTITION BY region ORDER BY amount DESC, order_id) AS rn
  FROM orders
)
SELECT region, order_id, amount
FROM ranked
WHERE rn = 1;`,
    explanation: "ROW_NUMBER restarts at 1 for each region and follows the sort order. A window function cannot be filtered in the same SELECT, so the numbering happens in a CTE and the filter outside it.",
    wrong: ["SELECT region, MAX(order_id) AS order_id, MAX(amount) AS amount FROM orders GROUP BY region", "WITH ranked AS (SELECT region, order_id, amount, ROW_NUMBER() OVER (PARTITION BY region ORDER BY amount, order_id) AS rn FROM orders) SELECT region, order_id, amount FROM ranked WHERE rn = 1"],
  },
  {
    slug: "running-revenue",
    title: "Running revenue by month",
    difficulty: "Hard",
    topics: ["Window functions", "CTEs"],
    scenario: "The board pack shows revenue building up through the year.",
    task: "Using completed orders, return each month, its revenue and the running total of revenue up to and including that month, earliest first. Use DATE_TRUNC('month', order_date) and name the columns month, revenue and running_total.",
    columns: ["month", "revenue", "running_total"],
    ordered: true,
    hints: ["Get monthly revenue first, in a CTE.", "SUM used as a window function with ORDER BY adds up everything so far.", "SUM(revenue) OVER (ORDER BY month) AS running_total."],
    solution: `WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS month,
         SUM(amount) AS revenue
  FROM orders
  WHERE status = 'completed'
  GROUP BY 1
)
SELECT month, revenue,
       SUM(revenue) OVER (ORDER BY month) AS running_total
FROM monthly
ORDER BY month;`,
    explanation: "With ORDER BY inside OVER, SUM becomes cumulative: each row's total includes all earlier months. Every monthly row is kept, which GROUP BY alone could not do.",
    wrong: ["WITH monthly AS (SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS revenue FROM orders WHERE status = 'completed' GROUP BY 1) SELECT month, revenue, SUM(revenue) OVER () AS running_total FROM monthly ORDER BY month", "WITH monthly AS (SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS revenue FROM orders WHERE status = 'completed' GROUP BY 1) SELECT month, revenue, revenue AS running_total FROM monthly ORDER BY month"],
  },
  {
    slug: "customer-spend-rank",
    title: "Customer spending league table",
    difficulty: "Hard",
    topics: ["Ranking", "GROUP BY"],
    scenario: "The account team wants customers ranked by what they have spent.",
    task: "For completed orders, return each customer ID, their total spend and their rank, where the highest spender is rank 1, tied customers share a rank and no rank numbers are skipped. Name the columns customer_id, total_spent and spend_rank.",
    columns: ["customer_id", "total_spent", "spend_rank"],
    ordered: false,
    hints: ["Total spend per customer is a GROUP BY with SUM.", "Three functions rank rows; only one shares ranks on ties without leaving gaps.", "DENSE_RANK() OVER (ORDER BY SUM(amount) DESC). A window function may order by an aggregate."],
    solution: `SELECT customer_id,
       SUM(amount) AS total_spent,
       DENSE_RANK() OVER (ORDER BY SUM(amount) DESC) AS spend_rank
FROM orders
WHERE status = 'completed'
GROUP BY customer_id;`,
    explanation: "The query groups first, then the window function ranks the grouped rows. DENSE_RANK gives tied customers the same rank and continues with the next number.",
    wrong: ["SELECT customer_id, SUM(amount) AS total_spent, DENSE_RANK() OVER (ORDER BY SUM(amount)) AS spend_rank FROM orders WHERE status = 'completed' GROUP BY customer_id", "SELECT customer_id, SUM(amount) AS total_spent, DENSE_RANK() OVER (ORDER BY SUM(amount) DESC) AS spend_rank FROM orders GROUP BY customer_id"],
  },
  ...hrSqlChallenges,
];
