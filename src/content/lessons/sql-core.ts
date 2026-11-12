import type { Lesson } from "../types";

export const sqlCore: Record<string, Lesson> = {
  "sql/select": {
    summary: "SELECT chooses which columns a query returns. It is the first clause of almost every SQL query you will write.",
    explanation: [
      "A table holds many columns, and most questions need only a few of them. SELECT lists the columns you want, and FROM names the table they come from. The database returns one row of output for every row in the table.",
      "You can rename a column in the output with AS, and you can calculate new columns from existing ones. SELECT * returns every column, which is handy for a first look but a poor habit in finished queries because it hides what you depend on.",
    ],
    syntax: `SELECT column_1, column_2 AS new_name, expression
FROM table_name;`,
    examples: [
      {
        title: "Pick specific columns",
        code: `SELECT order_id, order_date, amount
FROM orders;`,
        note: "Returns three columns for every order, in the order you listed them.",
      },
      {
        title: "Calculate and rename",
        code: `SELECT order_item_id,
       quantity * unit_price AS line_total
FROM order_items;`,
        note: "line_total does not exist in the table. It is computed for each row and named with AS.",
      },
    ],
    scenario: {
      title: "A customer list for the support team",
      body: "Support wants a simple contact sheet: each customer's name, city and segment. They do not need IDs or signup dates, so you select only the three columns they asked for.",
      code: `SELECT full_name, city, segment
FROM customers;`,
    },
    mistakes: [
      { mistake: "Using SELECT * in a report query.", fix: "List the columns. The query stays readable and does not change shape when someone adds a column to the table." },
      { mistake: "Forgetting the comma between columns, so the second name becomes an alias.", fix: "SELECT amount status returns amount renamed to status. Check there is a comma after every column except the last." },
    ],
    practice: [
      {
        kind: "sql",
        title: "Product catalogue",
        prompt: "Return the product name and category of every product.",
        difficulty: "Easy",
        hints: ["Both columns live in the products table.", "List them in SELECT, separated by a comma, in the order product_name then category."],
        columns: ["product_name", "category"],
        ordered: false,
        starter: "SELECT\n  \nFROM products;",
        solution: `SELECT product_name, category
FROM products;`,
        explanation: "SELECT names only the columns you need, in the order you list them. Every other column in the table is simply left out of the result.",
        wrong: ["SELECT * FROM products;", "SELECT product_name FROM products;"],
      },
      {
        kind: "sql",
        title: "Line totals",
        prompt: "For every order item, return order_id, product_id and the line revenue (quantity times unit price) as revenue.",
        difficulty: "Easy",
        hints: ["Multiply two columns in the SELECT list.", "Name the computed column with AS revenue."],
        columns: ["order_id", "product_id", "revenue"],
        ordered: false,
        starter: "SELECT\n  \nFROM order_items;",
        solution: `SELECT order_id, product_id,
       quantity * unit_price AS revenue
FROM order_items;`,
        explanation: "revenue does not exist as a stored column. It is calculated for every row from quantity and unit_price, and AS gives the calculation a name in the output.",
        wrong: ["SELECT order_id, product_id, quantity, unit_price FROM order_items;"],
      },
      {
        kind: "sql",
        title: "Every column, quickly",
        prompt: "Retrieve every column from the customers table.",
        difficulty: "Easy",
        hints: ["SELECT * returns every column without listing them by name."],
        columns: ["customer_id", "full_name", "segment", "city", "signup_date"],
        ordered: false,
        starter: "SELECT\nFROM customers;",
        solution: `SELECT *
FROM customers;`,
        explanation: "The * wildcard stands in for every column in the table, in their stored order. It is a quick way to look at a whole table, though listing columns by name is usually better in a finished query.",
        wrong: ["SELECT customer_id FROM customers;"],
      },
      {
        kind: "sql",
        title: "Rename for a report",
        prompt: "Retrieve order_id and amount from orders, with amount renamed to order_total.",
        difficulty: "Easy",
        hints: ["Select both columns, then add AS after amount."],
        columns: ["order_id", "order_total"],
        ordered: false,
        starter: "SELECT\n  \nFROM orders;",
        solution: `SELECT order_id, amount AS order_total
FROM orders;`,
        explanation: "AS only renames the column in the output. The underlying amount column in the orders table is unchanged.",
        wrong: ["SELECT order_id, amount FROM orders;"],
      },
      {
        kind: "sql",
        title: "A discounted price column",
        prompt: "Retrieve product_name and a 10%-off price, calculated from unit_cost, named sale_price.",
        difficulty: "Medium",
        hints: ["A 10% discount means multiplying by 0.9.", "SELECT product_name, unit_cost * 0.9 AS sale_price ..."],
        columns: ["product_name", "sale_price"],
        ordered: false,
        starter: "SELECT\n  \nFROM products;",
        solution: `SELECT product_name, unit_cost * 0.9 AS sale_price
FROM products;`,
        explanation: "sale_price is computed per row from unit_cost, the same pattern as the revenue example above, just with a different calculation.",
        wrong: ["SELECT product_name, unit_cost FROM products;", "SELECT product_name, unit_cost * 1.1 AS sale_price FROM products;"],
      },
    ],
    checks: [
      {
        q: "What does AS do in a SELECT list?",
        options: ["Filters rows", "Renames a column in the output", "Sorts the result", "Joins two tables"],
        answer: 1,
        why: "AS gives a column or expression an alias. It changes the output name only, not the table.",
      },
      {
        q: "Which query returns only the amount column from orders?",
        options: ["SELECT * FROM orders;", "SELECT orders FROM amount;", "SELECT amount FROM orders;", "FROM orders SELECT amount;"],
        answer: 2,
        why: "SELECT names the column, FROM names the table, in that order.",
      },
    ],
  },

  "sql/where": {
    summary: "WHERE filters rows, keeping only those that meet a condition, before anything else is calculated.",
    explanation: [
      "WHERE comes after FROM and tests every row against a condition. Rows where the condition is true are kept; the rest are dropped. You can compare with =, <>, <, >, <= and >=, and combine conditions with AND and OR.",
      "A few operators cover most filters: IN matches a list of values, BETWEEN matches an inclusive range, LIKE matches text patterns, and IS NULL finds missing values. Text values go in single quotes.",
    ],
    syntax: `SELECT columns
FROM table_name
WHERE condition_1
  AND (condition_2 OR condition_3);`,
    examples: [
      {
        title: "One condition",
        code: `SELECT order_id, amount
FROM orders
WHERE status = 'completed';`,
        note: "Only completed orders are returned.",
      },
      {
        title: "Several conditions",
        code: `SELECT order_id, region, amount
FROM orders
WHERE region IN ('North', 'West')
  AND amount >= 500
  AND order_date BETWEEN '2024-01-01' AND '2024-03-31';`,
        note: "All three conditions must be true. BETWEEN includes both end dates.",
      },
    ],
    scenario: {
      title: "Refunds worth reviewing",
      body: "Finance wants to review large refunds. You filter orders to those with status 'refunded' and an amount over 300, so the team reads a short list instead of the whole table.",
      code: `SELECT order_id, customer_id, amount
FROM orders
WHERE status = 'refunded'
  AND amount > 300;`,
    },
    mistakes: [
      { mistake: "Writing column = NULL to find missing values.", fix: "NULL is never equal to anything. Use column IS NULL or column IS NOT NULL." },
      { mistake: "Mixing AND and OR without brackets.", fix: "AND is evaluated before OR. Put brackets around the OR group so the logic reads the way you mean it." },
    ],
    practice: [
      {
        title: "Enterprise customers",
        prompt: "Return the name and city of customers in the 'Enterprise' segment.",
        difficulty: "Easy",
        hint: "Filter on the segment column with a quoted value.",
        solution: `SELECT full_name, city
FROM customers
WHERE segment = 'Enterprise';`,
      },
      {
        title: "High-value orders outside the South",
        prompt: "Return completed orders over 1,000 that are not in the South region.",
        difficulty: "Medium",
        hint: "Three conditions joined with AND. 'Not equal' is <>.",
        solution: `SELECT order_id, region, amount
FROM orders
WHERE status = 'completed'
  AND amount > 1000
  AND region <> 'South';`,
      },
    ],
    checks: [
      {
        q: "Which condition finds orders with no region recorded?",
        options: ["region = NULL", "region IS NULL", "region = ''", "region NOT IN (NULL)"],
        answer: 1,
        why: "Missing values are tested with IS NULL. Comparing to NULL with = never returns true.",
      },
      {
        q: "amount BETWEEN 100 AND 200 includes which values?",
        options: ["101 to 199", "100 to 199", "100 to 200", "101 to 200"],
        answer: 2,
        why: "BETWEEN is inclusive at both ends.",
      },
    ],
  },

  "sql/order-by": {
    summary: "ORDER BY sorts the result. Without it, the database is free to return rows in any order.",
    explanation: [
      "ORDER BY goes at the end of a query and sorts by one or more columns. ASC (the default) sorts from low to high; DESC sorts from high to low. When you list several columns, the second is used only to break ties in the first.",
      "You can sort by a column alias or an expression. Never rely on rows coming back in table order: if the order matters, say so with ORDER BY.",
    ],
    syntax: `SELECT columns
FROM table_name
ORDER BY column_1 DESC, column_2 ASC;`,
    examples: [
      {
        title: "Largest first",
        code: `SELECT order_id, amount
FROM orders
ORDER BY amount DESC;`,
        note: "The biggest order is the first row.",
      },
      {
        title: "Two sort keys",
        code: `SELECT region, order_date, amount
FROM orders
ORDER BY region, order_date DESC;`,
        note: "Regions are alphabetical; within each region the newest order comes first.",
      },
    ],
    scenario: {
      title: "Newest customers first",
      body: "The onboarding team calls new customers in the order they signed up, most recent first. Sorting by signup_date descending gives them a ready-made call list.",
      code: `SELECT full_name, city, signup_date
FROM customers
ORDER BY signup_date DESC;`,
    },
    mistakes: [
      { mistake: "Assuming results are sorted because they looked sorted once.", fix: "Order is only guaranteed when ORDER BY is present." },
      { mistake: "Writing ORDER BY a, b DESC and expecting both to be descending.", fix: "DESC applies to one column. Write ORDER BY a DESC, b DESC." },
    ],
    practice: [
      {
        title: "Cheapest products to make",
        prompt: "List product names and unit costs, lowest cost first.",
        difficulty: "Easy",
        hint: "Ascending is the default direction.",
        solution: `SELECT product_name, unit_cost
FROM products
ORDER BY unit_cost;`,
      },
      {
        title: "Orders by region and size",
        prompt: "List completed orders sorted by region A to Z, and within each region by amount from highest to lowest.",
        difficulty: "Medium",
        hint: "Filter first, then give two sort keys with different directions.",
        solution: `SELECT order_id, region, amount
FROM orders
WHERE status = 'completed'
ORDER BY region ASC, amount DESC;`,
      },
    ],
    checks: [
      {
        q: "What is the default sort direction?",
        options: ["Descending", "Ascending", "Random", "Insertion order"],
        answer: 1,
        why: "ASC is assumed when no direction is given.",
      },
      {
        q: "In ORDER BY region, amount DESC, how is region sorted?",
        options: ["Descending", "Ascending", "Not sorted", "By amount"],
        answer: 1,
        why: "DESC applies only to amount. region uses the default, ascending.",
      },
    ],
  },

  "sql/distinct": {
    summary: "DISTINCT removes duplicate rows from a result, leaving one row per unique combination of the selected columns.",
    explanation: [
      "Put DISTINCT straight after SELECT to return each unique row once. It looks at every column in the SELECT list together, so SELECT DISTINCT region, status returns each region and status pair once, not each region once.",
      "COUNT(DISTINCT column) counts unique values, which answers questions like 'how many different customers ordered?'. DISTINCT makes the database do extra work, so use it when you need unique values, not to hide duplicates you do not understand.",
    ],
    syntax: `SELECT DISTINCT column_1, column_2
FROM table_name;

SELECT COUNT(DISTINCT column_1)
FROM table_name;`,
    examples: [
      {
        title: "Unique values",
        code: `SELECT DISTINCT region
FROM orders;`,
        note: "One row per region, however many orders each has.",
      },
      {
        title: "Count unique customers",
        code: `SELECT COUNT(DISTINCT customer_id) AS customers_who_ordered
FROM orders;`,
        note: "A customer with ten orders is counted once.",
      },
    ],
    scenario: {
      title: "Which cities do we sell to?",
      body: "Marketing is planning local events and needs the list of cities where you have customers. DISTINCT turns thousands of customer rows into a short list of places.",
      code: `SELECT DISTINCT city
FROM customers
ORDER BY city;`,
    },
    mistakes: [
      { mistake: "Expecting DISTINCT to apply to the first column only.", fix: "It applies to the whole row. Select fewer columns if you want fewer combinations." },
      { mistake: "Adding DISTINCT to hide duplicates caused by a join.", fix: "Find out why the join multiplies rows. DISTINCT hides the symptom and can hide wrong totals too." },
    ],
    practice: [
      {
        title: "Product categories",
        prompt: "List each product category once, in alphabetical order.",
        difficulty: "Easy",
        hint: "DISTINCT on one column, then ORDER BY.",
        solution: `SELECT DISTINCT category
FROM products
ORDER BY category;`,
      },
      {
        title: "Products actually sold",
        prompt: "How many different products appear in order_items?",
        difficulty: "Easy",
        hint: "Put DISTINCT inside COUNT.",
        solution: `SELECT COUNT(DISTINCT product_id) AS products_sold
FROM order_items;`,
      },
    ],
    checks: [
      {
        q: "SELECT DISTINCT region, status returns one row per…",
        options: ["region", "status", "unique region and status pair", "order"],
        answer: 2,
        why: "DISTINCT compares whole rows, so it keeps each unique combination.",
      },
      {
        q: "Which expression counts unique customers in orders?",
        options: ["COUNT(customer_id)", "DISTINCT COUNT(customer_id)", "COUNT(DISTINCT customer_id)", "COUNT(*)"],
        answer: 2,
        why: "DISTINCT goes inside the brackets of COUNT.",
      },
    ],
  },

  "sql/limit": {
    summary: "LIMIT caps how many rows a query returns. With ORDER BY, it answers 'top N' questions.",
    explanation: [
      "LIMIT n returns at most n rows. On its own it gives you an arbitrary sample, which is fine for a quick look at a table. Combined with ORDER BY it becomes meaningful: sort first, then keep the top few.",
      "OFFSET skips rows before LIMIT starts counting, which is how simple pagination works. LIMIT is PostgreSQL and MySQL syntax; SQL Server uses TOP and the SQL standard uses FETCH FIRST.",
    ],
    syntax: `SELECT columns
FROM table_name
ORDER BY column_1 DESC
LIMIT 10 OFFSET 20;`,
    examples: [
      {
        title: "Preview a table",
        code: `SELECT *
FROM orders
LIMIT 5;`,
        note: "Any five rows. Good for seeing what the columns look like.",
      },
      {
        title: "Top five orders",
        code: `SELECT order_id, amount
FROM orders
ORDER BY amount DESC
LIMIT 5;`,
        note: "Sorted first, so these are the five largest.",
      },
    ],
    scenario: {
      title: "The ten newest signups",
      body: "A welcome campaign goes to the ten most recent customers each morning. Sort by signup date, newest first, and keep ten rows.",
      code: `SELECT full_name, signup_date
FROM customers
ORDER BY signup_date DESC
LIMIT 10;`,
    },
    mistakes: [
      { mistake: "Using LIMIT without ORDER BY and calling the result 'the top 10'.", fix: "Without a sort the rows are arbitrary. Add ORDER BY to define what 'top' means." },
      { mistake: "Ignoring ties at the cut-off.", fix: "If the 10th and 11th rows have the same value, LIMIT 10 drops one arbitrarily. Add a tie-breaker to ORDER BY, or use a ranking function." },
    ],
    practice: [
      {
        title: "Three most expensive products to make",
        prompt: "Return the names and unit costs of the three products with the highest unit cost.",
        difficulty: "Easy",
        hint: "Sort descending, then limit.",
        solution: `SELECT product_name, unit_cost
FROM products
ORDER BY unit_cost DESC
LIMIT 3;`,
      },
      {
        title: "Second page of orders",
        prompt: "Orders are shown 20 per page, newest first. Return page two.",
        difficulty: "Medium",
        hint: "Skip the first 20 rows with OFFSET.",
        solution: `SELECT order_id, order_date, amount
FROM orders
ORDER BY order_date DESC, order_id DESC
LIMIT 20 OFFSET 20;`,
      },
    ],
    checks: [
      {
        q: "What does LIMIT 5 return without ORDER BY?",
        options: ["The 5 newest rows", "The 5 largest rows", "Any 5 rows", "An error"],
        answer: 2,
        why: "With no sort, the database may return any five rows.",
      },
      {
        q: "LIMIT 10 OFFSET 30 returns which rows of the sorted result?",
        options: ["1 to 10", "30 to 40", "31 to 40", "10 to 30"],
        answer: 2,
        why: "OFFSET skips 30 rows, then LIMIT keeps the next 10: rows 31 to 40.",
      },
    ],
  },

  "sql/group-by": {
    summary: "GROUP BY collapses rows that share a value into one summary row, so you can total, count or average per group.",
    explanation: [
      "Aggregate functions such as SUM, COUNT, AVG, MIN and MAX turn many rows into one number. GROUP BY tells the database to do that separately for each group: one row per region, per month, per customer.",
      "The rule to remember: every column in SELECT must either appear in GROUP BY or sit inside an aggregate function. WHERE runs before grouping, so it decides which rows go into the groups.",
    ],
    syntax: `SELECT group_column,
       AGGREGATE(value_column) AS summary
FROM table_name
WHERE row_condition
GROUP BY group_column;`,
    examples: [
      {
        title: "Orders per region",
        code: `SELECT region, COUNT(*) AS orders
FROM orders
GROUP BY region;`,
        note: "COUNT(*) counts the rows in each group.",
      },
      {
        title: "Revenue and average order value by region",
        code: `SELECT region,
       SUM(amount) AS revenue,
       ROUND(AVG(amount), 2) AS avg_order_value
FROM orders
WHERE status = 'completed'
GROUP BY region
ORDER BY revenue DESC;`,
        note: "Refunded and cancelled orders are removed by WHERE before the totals are calculated.",
      },
    ],
    scenario: {
      title: "Which categories sell the most units?",
      body: "The buying team is deciding where to expand the range. Group order items by product category and total the quantity to see what customers actually buy.",
      code: `SELECT p.category,
       SUM(oi.quantity) AS units_sold
FROM order_items oi
JOIN products p ON p.product_id = oi.product_id
GROUP BY p.category
ORDER BY units_sold DESC;`,
    },
    mistakes: [
      { mistake: "Selecting a column that is neither grouped nor aggregated.", fix: "PostgreSQL rejects this. Add the column to GROUP BY or wrap it in an aggregate." },
      { mistake: "Filtering on an aggregate in WHERE, for example WHERE SUM(amount) > 1000.", fix: "WHERE runs before grouping. Filter on aggregates with HAVING." },
    ],
    practice: [
      {
        title: "Revenue by region",
        prompt: "Return total revenue per region for completed orders, highest revenue first.",
        difficulty: "Easy",
        hint: "Filter with WHERE, group by region, sum the amount.",
        solution: `SELECT region, SUM(amount) AS revenue
FROM orders
WHERE status = 'completed'
GROUP BY region
ORDER BY revenue DESC;`,
      },
      {
        title: "Customers per segment and city",
        prompt: "Count customers for each segment and city combination.",
        difficulty: "Medium",
        hint: "You can group by two columns.",
        solution: `SELECT segment, city, COUNT(*) AS customers
FROM customers
GROUP BY segment, city
ORDER BY segment, customers DESC;`,
      },
    ],
    checks: [
      {
        q: "Which query is valid?",
        options: [
          "SELECT region, status, SUM(amount) FROM orders GROUP BY region;",
          "SELECT region, SUM(amount) FROM orders GROUP BY region;",
          "SELECT region, amount FROM orders GROUP BY region;",
          "SELECT SUM(amount) FROM orders GROUP BY;",
        ],
        answer: 1,
        why: "Every selected column is either in GROUP BY (region) or aggregated (SUM(amount)).",
      },
      {
        q: "When does WHERE run relative to GROUP BY?",
        options: ["After grouping", "Before grouping", "At the same time", "Only if HAVING is absent"],
        answer: 1,
        why: "WHERE filters individual rows first; the remaining rows are then grouped.",
      },
    ],
  },

  "sql/having": {
    summary: "HAVING filters groups after aggregation, the way WHERE filters rows before it.",
    explanation: [
      "Once rows are grouped, you often want only some of the groups: regions with revenue over a target, customers with more than three orders. HAVING applies a condition to each group's aggregate values.",
      "Use WHERE for conditions on raw rows and HAVING for conditions on aggregates. A query can have both, and usually should: filter rows early with WHERE, then filter groups with HAVING.",
    ],
    syntax: `SELECT group_column, AGGREGATE(value_column)
FROM table_name
WHERE row_condition
GROUP BY group_column
HAVING AGGREGATE(value_column) > threshold;`,
    examples: [
      {
        title: "Busy customers",
        code: `SELECT customer_id, COUNT(*) AS orders
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 5;`,
        note: "Only customers with five or more orders are returned.",
      },
      {
        title: "WHERE and HAVING together",
        code: `SELECT region, SUM(amount) AS revenue
FROM orders
WHERE status = 'completed'
GROUP BY region
HAVING SUM(amount) > 50000;`,
        note: "WHERE removes non-completed orders; HAVING then keeps regions above 50,000.",
      },
    ],
    scenario: {
      title: "Products that barely sell",
      body: "Operations wants to delist slow products. Group order items by product and keep those with fewer than ten units sold in total.",
      code: `SELECT product_id, SUM(quantity) AS units_sold
FROM order_items
GROUP BY product_id
HAVING SUM(quantity) < 10
ORDER BY units_sold;`,
    },
    mistakes: [
      { mistake: "Putting a row-level condition in HAVING, for example HAVING status = 'completed'.", fix: "It fails or forces needless grouping work. Row conditions belong in WHERE." },
      { mistake: "Using a SELECT alias in HAVING.", fix: "PostgreSQL does not allow it. Repeat the aggregate: HAVING SUM(amount) > 1000." },
    ],
    practice: [
      {
        title: "Repeat buyers",
        prompt: "Return the IDs of customers with at least three completed orders, with their order count.",
        difficulty: "Medium",
        hint: "Filter status in WHERE, count per customer, filter the count in HAVING.",
        solution: `SELECT customer_id, COUNT(*) AS completed_orders
FROM orders
WHERE status = 'completed'
GROUP BY customer_id
HAVING COUNT(*) >= 3;`,
      },
      {
        title: "High average order value",
        prompt: "Which regions have an average completed order amount above 400?",
        difficulty: "Medium",
        hint: "HAVING works with AVG as well as SUM and COUNT.",
        solution: `SELECT region, ROUND(AVG(amount), 2) AS avg_amount
FROM orders
WHERE status = 'completed'
GROUP BY region
HAVING AVG(amount) > 400;`,
      },
    ],
    checks: [
      {
        q: "Which clause filters on SUM(amount)?",
        options: ["WHERE", "HAVING", "ORDER BY", "GROUP BY"],
        answer: 1,
        why: "Aggregates exist only after grouping, and HAVING is the filter that runs after grouping.",
      },
      {
        q: "Where should status = 'completed' go?",
        options: ["HAVING", "WHERE", "GROUP BY", "LIMIT"],
        answer: 1,
        why: "It is a condition on individual rows, so it belongs in WHERE.",
      },
    ],
  },

  "sql/inner-join": {
    summary: "INNER JOIN combines rows from two tables where a key matches, and drops rows with no match on either side.",
    explanation: [
      "Data is split across tables to avoid repetition: an order stores a customer_id, not the customer's name. A join puts the pieces back together by matching a column in one table to a column in the other, stated in the ON clause.",
      "INNER JOIN keeps only pairs that match. An order with a customer_id that is not in customers disappears, and so does a customer with no orders. Give tables short aliases and prefix columns with them so it is clear where each column comes from.",
    ],
    syntax: `SELECT a.column, b.column
FROM table_a AS a
INNER JOIN table_b AS b
  ON b.key = a.key;`,
    examples: [
      {
        title: "Orders with customer names",
        code: `SELECT o.order_id, c.full_name, o.amount
FROM orders o
INNER JOIN customers c
  ON c.customer_id = o.customer_id;`,
        note: "Each order row is paired with its customer's row.",
      },
      {
        title: "Three tables",
        code: `SELECT o.order_id, p.product_name, oi.quantity
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN products p     ON p.product_id = oi.product_id;`,
        note: "JOIN on its own means INNER JOIN. Each join adds one more table.",
      },
    ],
    scenario: {
      title: "Revenue by customer segment",
      body: "Leadership asks which segment brings in the most money. Amounts live in orders and segments live in customers, so you join them and then group.",
      code: `SELECT c.segment, SUM(o.amount) AS revenue
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.segment
ORDER BY revenue DESC;`,
    },
    mistakes: [
      { mistake: "Leaving out the ON condition or joining on the wrong column.", fix: "Every row pairs with every other row and totals explode. Check the row count before and after a join." },
      { mistake: "Summing a header value after joining to detail rows.", fix: "Joining orders to order_items repeats each order's amount once per item. Sum from the detail table, or aggregate before joining." },
    ],
    practice: [
      {
        title: "Orders with city",
        prompt: "Return order_id, order_date and the customer's city for every order.",
        difficulty: "Easy",
        hint: "Join orders to customers on customer_id.",
        solution: `SELECT o.order_id, o.order_date, c.city
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id;`,
      },
      {
        title: "Revenue by category",
        prompt: "Return total line revenue (quantity times unit price) per product category.",
        difficulty: "Medium",
        hint: "Join order_items to products, then group by category.",
        solution: `SELECT p.category,
       SUM(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN products p ON p.product_id = oi.product_id
GROUP BY p.category
ORDER BY revenue DESC;`,
      },
    ],
    checks: [
      {
        q: "A customer has no orders. Do they appear in customers INNER JOIN orders?",
        options: ["Yes, with NULL order columns", "No", "Yes, once per region", "Only with DISTINCT"],
        answer: 1,
        why: "INNER JOIN returns only rows that match on both sides.",
      },
      {
        q: "What does the ON clause specify?",
        options: ["The sort order", "How rows from the two tables are matched", "Which columns to return", "The row limit"],
        answer: 1,
        why: "ON holds the matching condition, usually key = key.",
      },
    ],
  },

  "sql/left-join": {
    summary: "LEFT JOIN keeps every row from the left table and fills in NULLs where the right table has no match.",
    explanation: [
      "Sometimes the rows with no match are the answer: customers who never ordered, products never sold. LEFT JOIN returns all rows from the table named first, with the right table's columns set to NULL when nothing matches.",
      "That makes it the standard tool for finding what is missing: left join, then keep rows where the right side IS NULL. Be careful with WHERE: a condition on a right-table column removes the NULL rows and quietly turns your left join into an inner join.",
    ],
    syntax: `SELECT a.column, b.column
FROM table_a AS a
LEFT JOIN table_b AS b
  ON b.key = a.key;`,
    examples: [
      {
        title: "All customers, with orders if any",
        code: `SELECT c.full_name, o.order_id, o.amount
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.customer_id;`,
        note: "Customers without orders appear once, with NULL in order_id and amount.",
      },
      {
        title: "Find the unmatched rows",
        code: `SELECT c.customer_id, c.full_name
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;`,
        note: "Only customers with no orders at all survive the filter.",
      },
    ],
    scenario: {
      title: "Order counts for every customer, including zero",
      body: "The CRM team wants an order count per customer and needs the zeros too, so they can target people who have not bought yet. A left join keeps those customers, and counting a right-table column gives them 0.",
      code: `SELECT c.customer_id, c.full_name,
       COUNT(o.order_id) AS orders
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.full_name
ORDER BY orders;`,
    },
    mistakes: [
      { mistake: "Filtering the right table in WHERE, for example WHERE o.status = 'completed'.", fix: "Rows with no match have NULL status and are removed. Move the condition into the ON clause to keep them." },
      { mistake: "Using COUNT(*) to count matches.", fix: "COUNT(*) counts the NULL row as 1. Count a right-table column, such as COUNT(o.order_id), to get 0." },
    ],
    practice: [
      {
        title: "Products never ordered",
        prompt: "Return the names of products that do not appear in any order item.",
        difficulty: "Medium",
        hint: "Left join products to order_items and keep rows where the item side is NULL.",
        solution: `SELECT p.product_name
FROM products p
LEFT JOIN order_items oi
  ON oi.product_id = p.product_id
WHERE oi.order_item_id IS NULL;`,
      },
      {
        title: "Completed revenue for every customer",
        prompt: "Return every customer with their total completed order amount. Customers with no completed orders should show 0.",
        difficulty: "Hard",
        hint: "Put the status condition in ON, and use COALESCE to turn NULL into 0.",
        solution: `SELECT c.customer_id, c.full_name,
       COALESCE(SUM(o.amount), 0) AS completed_revenue
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.customer_id
 AND o.status = 'completed'
GROUP BY c.customer_id, c.full_name;`,
      },
    ],
    checks: [
      {
        q: "In customers LEFT JOIN orders, what appears for a customer with no orders?",
        options: ["Nothing; the row is dropped", "One row with NULL order columns", "An error", "One row per region"],
        answer: 1,
        why: "The left table's row is kept and the right table's columns are NULL.",
      },
      {
        q: "Why can WHERE o.status = 'completed' undo a LEFT JOIN?",
        options: [
          "WHERE runs before the join",
          "Unmatched rows have NULL status and fail the condition",
          "LEFT JOIN ignores WHERE",
          "status is a reserved word",
        ],
        answer: 1,
        why: "NULL = 'completed' is not true, so the unmatched rows are filtered out.",
      },
    ],
  },

  "sql/case-when": {
    summary: "CASE WHEN adds if-then logic to a query, to label rows, bucket values or count conditionally.",
    explanation: [
      "CASE checks conditions in order and returns the result for the first one that is true. If none match, it returns the ELSE value, or NULL when there is no ELSE. Every CASE ends with END.",
      "It works anywhere an expression is allowed: in SELECT to create a label, in ORDER BY for a custom sort, and inside aggregates to count or sum only some rows. That last pattern lets one query return several conditional totals side by side.",
    ],
    syntax: `CASE
  WHEN condition_1 THEN result_1
  WHEN condition_2 THEN result_2
  ELSE default_result
END AS column_name`,
    examples: [
      {
        title: "Bucket order sizes",
        code: `SELECT order_id, amount,
       CASE
         WHEN amount >= 1000 THEN 'Large'
         WHEN amount >= 250  THEN 'Medium'
         ELSE 'Small'
       END AS order_size
FROM orders;`,
        note: "Conditions are checked top to bottom, so a 1,500 order is 'Large' and never reaches the second test.",
      },
      {
        title: "Conditional totals",
        code: `SELECT region,
       SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) AS completed,
       SUM(CASE WHEN status = 'refunded'  THEN amount ELSE 0 END) AS refunded
FROM orders
GROUP BY region;`,
        note: "Each SUM adds only the rows its CASE lets through.",
      },
    ],
    scenario: {
      title: "Refund rate by region",
      body: "Customer service suspects one region refunds far more than the others. Count refunded orders with CASE and divide by all orders to get a rate per region.",
      code: `SELECT region,
       ROUND(100.0 * SUM(CASE WHEN status = 'refunded' THEN 1 ELSE 0 END)
             / COUNT(*), 1) AS refund_rate_pct
FROM orders
GROUP BY region
ORDER BY refund_rate_pct DESC;`,
    },
    mistakes: [
      { mistake: "Ordering conditions from loosest to tightest.", fix: "The first true condition wins. Put the most specific test first." },
      { mistake: "Leaving out ELSE and getting unexpected NULLs.", fix: "Add an ELSE whenever every row should receive a value." },
    ],
    practice: [
      {
        title: "Tenure labels",
        prompt: "Label each customer 'New' if they signed up on or after 2024-01-01 and 'Established' otherwise.",
        difficulty: "Easy",
        hint: "One WHEN and an ELSE.",
        solution: `SELECT full_name,
       CASE WHEN signup_date >= '2024-01-01' THEN 'New'
            ELSE 'Established'
       END AS tenure
FROM customers;`,
      },
      {
        title: "Order status mix",
        prompt: "In a single row, return the number of completed, refunded and cancelled orders.",
        difficulty: "Medium",
        hint: "Three SUM(CASE …) expressions and no GROUP BY.",
        solution: `SELECT
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
  SUM(CASE WHEN status = 'refunded'  THEN 1 ELSE 0 END) AS refunded,
  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
FROM orders;`,
      },
    ],
    checks: [
      {
        q: "What does CASE return when no WHEN matches and there is no ELSE?",
        options: ["0", "An empty string", "NULL", "An error"],
        answer: 2,
        why: "A missing ELSE behaves like ELSE NULL.",
      },
      {
        q: "amount is 1,200. Which label does CASE WHEN amount >= 250 THEN 'Medium' WHEN amount >= 1000 THEN 'Large' END give?",
        options: ["Large", "Medium", "NULL", "Both"],
        answer: 1,
        why: "The first true condition wins, and 1,200 >= 250 is checked first.",
      },
    ],
  },

  "sql/subqueries": {
    summary: "A subquery is a query nested inside another, used to compare against a calculated value or a list of values.",
    explanation: [
      "Some questions take two steps: find the average order amount, then find orders above it. A subquery lets you write the first step in brackets inside the second. A subquery that returns one value can be used wherever a value is allowed.",
      "A subquery that returns a column of values works with IN, and one that returns a full table can sit in FROM, where it needs an alias. EXISTS tests whether a subquery returns any row at all, which is often the clearest way to ask 'has at least one'.",
    ],
    syntax: `SELECT columns
FROM table_name
WHERE column > (SELECT AGGREGATE(column) FROM table_name);

SELECT columns
FROM table_name
WHERE key IN (SELECT key FROM other_table WHERE condition);`,
    examples: [
      {
        title: "Above-average orders",
        code: `SELECT order_id, amount
FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders);`,
        note: "The inner query returns one number; the outer query compares every row to it.",
      },
      {
        title: "Customers with a refund",
        code: `SELECT full_name
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.customer_id
    AND o.status = 'refunded'
);`,
        note: "The inner query refers to the outer row (c.customer_id), so it is checked once per customer.",
      },
    ],
    scenario: {
      title: "Customers who bought from the top category",
      body: "Marketing wants to email everyone who has bought an 'Electronics' product. One subquery finds the matching orders; the outer query lists the customers behind them.",
      code: `SELECT DISTINCT o.customer_id
FROM orders o
WHERE o.order_id IN (
  SELECT oi.order_id
  FROM order_items oi
  JOIN products p ON p.product_id = oi.product_id
  WHERE p.category = 'Electronics'
);`,
    },
    mistakes: [
      { mistake: "Using = with a subquery that returns more than one row.", fix: "The query fails. Use IN for a list, or make the subquery return a single value." },
      { mistake: "Using NOT IN when the subquery can return NULL.", fix: "One NULL makes NOT IN return no rows. Use NOT EXISTS instead." },
    ],
    practice: [
      {
        title: "Cheaper than average",
        prompt: "Return products whose unit cost is below the average unit cost.",
        difficulty: "Easy",
        hint: "Compare unit_cost with a single-value subquery.",
        solution: `SELECT product_name, unit_cost
FROM products
WHERE unit_cost < (SELECT AVG(unit_cost) FROM products);`,
      },
      {
        title: "Customers with no orders",
        prompt: "Return customers who have never placed an order, using NOT EXISTS.",
        difficulty: "Medium",
        hint: "The subquery should look for an order belonging to the outer customer.",
        solution: `SELECT c.customer_id, c.full_name
FROM customers c
WHERE NOT EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.customer_id
);`,
      },
    ],
    checks: [
      {
        q: "A subquery in FROM must have…",
        options: ["An ORDER BY", "An alias", "A LIMIT", "A GROUP BY"],
        answer: 1,
        why: "PostgreSQL requires a name for a derived table so its columns can be referenced.",
      },
      {
        q: "Which operator tests a value against a list returned by a subquery?",
        options: ["=", "IN", "LIKE", "BETWEEN"],
        answer: 1,
        why: "IN checks membership in a set of values.",
      },
    ],
  },
};
