/** Learning objectives and interview questions for lessons written before those sections existed. */
type Extra = { objectives: string[]; interview: { q: string; a: string }[] };
const x = (objectives: string[], ...qa: [string, string][]): Extra => ({ objectives, interview: qa.map(([q, a]) => ({ q, a })) });

export const extras: Record<string, Extra> = {
  "sql/select": x(
    ["Choose specific columns from a table", "Rename and calculate columns with AS", "Explain why SELECT * is avoided in finished queries"],
    ["Why is SELECT * discouraged in production queries?", "It returns columns you do not need, which costs time and memory, and the result changes shape when someone alters the table. Listing columns documents what the query depends on."],
    ["What is a column alias and where can you use it?", "A name given to a column or expression with AS. It labels the output and can be used in ORDER BY, but not in WHERE, because WHERE runs before the SELECT list is evaluated."],
  ),
  "sql/where": x(
    ["Filter rows with comparison operators", "Combine conditions with AND, OR and brackets", "Use IN, BETWEEN, LIKE and IS NULL correctly"],
    ["How do you test for missing values?", "With IS NULL or IS NOT NULL. Comparing with = NULL never returns true, because NULL means unknown and is not equal to anything, including itself."],
    ["In what order are AND and OR evaluated?", "AND binds more tightly than OR, so a OR b AND c means a OR (b AND c). Use brackets to make the intended grouping explicit."],
  ),
  "sql/order-by": x(
    ["Sort results ascending and descending", "Sort by several columns with different directions", "Explain why order is undefined without ORDER BY"],
    ["Is the order of rows guaranteed without ORDER BY?", "No. The database may return rows in any order, and that order can change between runs. If order matters, state it."],
    ["How does sorting by two columns work?", "Rows are sorted by the first column. The second is used only to order rows that tie on the first. Each column has its own ASC or DESC."],
  ),
  "sql/distinct": x(
    ["Remove duplicate rows from a result", "Count unique values with COUNT(DISTINCT …)", "Recognise when DISTINCT is hiding a join problem"],
    ["What is the difference between COUNT(*) and COUNT(DISTINCT customer_id)?", "COUNT(*) counts rows. COUNT(DISTINCT customer_id) counts different customers, so a customer with ten orders adds one, not ten."],
    ["Does DISTINCT apply to one column or the whole row?", "The whole row. SELECT DISTINCT region, status returns each unique pair of values."],
  ),
  "sql/limit": x(
    ["Return a fixed number of rows", "Combine ORDER BY and LIMIT for top-N questions", "Page through results with OFFSET"],
    ["How do you get the top five rows by a value?", "ORDER BY that value descending, then LIMIT 5. Add a tie-breaker to ORDER BY so the result is the same every run."],
    ["What happens if two rows tie at the cut-off?", "LIMIT keeps an arbitrary one. Add a second sort column, or use RANK in a window function if tied rows should all be kept."],
  ),
  "sql/group-by": x(
    ["Summarise rows with SUM, COUNT, AVG, MIN and MAX", "Group by one or more columns", "Apply the rule that links SELECT and GROUP BY"],
    ["Which columns may appear in SELECT when you use GROUP BY?", "Only columns listed in GROUP BY and aggregate expressions. Any other column has many values per group, so the database cannot choose one."],
    ["What is the difference between COUNT(*) and COUNT(column)?", "COUNT(*) counts rows. COUNT(column) counts rows where that column is not NULL."],
  ),
  "sql/having": x(
    ["Filter groups on aggregate values", "Decide whether a condition belongs in WHERE or HAVING", "Use both in one query"],
    ["What is the difference between WHERE and HAVING?", "WHERE filters rows before grouping and cannot use aggregates. HAVING filters groups after aggregation. Row conditions belong in WHERE, where they also reduce the work."],
    ["How would you find customers with more than three orders?", "GROUP BY customer_id and add HAVING COUNT(*) > 3."],
  ),
  "sql/inner-join": x(
    ["Combine two tables on a key", "Join three or more tables", "Spot row multiplication after a join"],
    ["What does an INNER JOIN return?", "Only the combinations of rows where the join condition matches in both tables. Rows without a match on either side are dropped."],
    ["Why can a total be too high after a join?", "Joining a header table to a detail table repeats each header row once per detail row. Summing a header value then counts it several times. Aggregate before joining, or sum from the detail table."],
  ),
  "sql/left-join": x(
    ["Keep unmatched rows with LEFT JOIN", "Find missing matches with IS NULL", "Avoid turning a LEFT JOIN into an INNER JOIN by accident"],
    ["How do you find customers with no orders?", "LEFT JOIN customers to orders and keep rows where an orders column IS NULL, or use NOT EXISTS."],
    ["Why might a LEFT JOIN behave like an INNER JOIN?", "A WHERE condition on the right table removes the unmatched rows, because their values are NULL. Put the condition in the ON clause instead."],
  ),
  "sql/case-when": x(
    ["Create labels and buckets with CASE", "Order conditions correctly", "Count and sum conditionally inside aggregates"],
    ["How do you count rows that meet a condition without filtering the query?", "SUM(CASE WHEN condition THEN 1 ELSE 0 END), or COUNT(*) FILTER (WHERE condition) in PostgreSQL. This lets one query return several conditional counts."],
    ["What does CASE return if nothing matches?", "The ELSE value, or NULL if there is no ELSE."],
  ),
  "sql/subqueries": x(
    ["Compare rows with a calculated value", "Filter with IN and EXISTS", "Recognise correlated subqueries"],
    ["What is a correlated subquery?", "A subquery that refers to a column of the outer query, so it is evaluated for each outer row. EXISTS checks are usually correlated."],
    ["Why can NOT IN return no rows unexpectedly?", "If the subquery returns a NULL, NOT IN evaluates to unknown for every row. NOT EXISTS does not have this problem."],
  ),
  "sql/ctes": x(
    ["Break a query into named steps with WITH", "Chain several CTEs", "Choose between a CTE and a subquery"],
    ["Why use a CTE instead of a subquery?", "Readability and reuse. A CTE names an intermediate result, reads top to bottom, and can be referenced more than once in the same statement."],
    ["How long does a CTE exist?", "Only for the single statement it is part of."],
  ),
  "sql/window-functions": x(
    ["Explain how a window function differs from GROUP BY", "Use PARTITION BY and ORDER BY inside OVER", "Calculate running totals and previous-row comparisons"],
    ["What is the difference between GROUP BY and a window function?", "GROUP BY returns one row per group. A window function calculates over a group of rows but returns a value on every row, so the detail is kept."],
    ["How would you calculate month-over-month change?", "Aggregate to months, then subtract LAG(revenue) OVER (ORDER BY month) from revenue."],
  ),
  "sql/ranking": x(
    ["Number rows with ROW_NUMBER, RANK and DENSE_RANK", "Explain how each treats ties", "Solve top-N-per-group questions"],
    ["What is the difference between RANK and DENSE_RANK?", "Both give tied rows the same number. RANK then skips numbers (1, 2, 2, 4); DENSE_RANK does not (1, 2, 2, 3)."],
    ["How do you get the latest order for each customer?", "ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) in a CTE, then keep rows where the number is 1."],
  ),
  "sql/date-functions": x(
    ["Group data by period with DATE_TRUNC", "Extract parts of a date", "Calculate intervals between dates"],
    ["How do you report revenue by month across several years?", "Group by DATE_TRUNC('month', order_date). EXTRACT(MONTH …) alone would merge the same month from different years."],
    ["Why avoid BETWEEN for timestamp ranges?", "The upper bound stops at midnight, so the last day is mostly excluded. Use >= start AND < the day after the end."],
  ),
  "sql/query-optimization": x(
    ["Read a query plan with EXPLAIN", "Recognise filters that prevent index use", "Choose columns for an index"],
    ["A query is slow. What do you check first?", "The plan from EXPLAIN ANALYZE: whether large tables are scanned in full, how many rows each step handles, and whether filters could use an index."],
    ["Why can wrapping a column in a function slow a query?", "An index on the column cannot be used when the filter is on a function of it. Rewrite the condition as a range on the bare column."],
  ),
  "excel/formulas-and-cell-references": x(
    ["Write formulas that refer to cells", "Choose relative, absolute or mixed references", "Predict how a formula changes when copied"],
    ["What is the difference between A1, $A$1, A$1 and $A1?", "A1 moves in both directions when copied. $A$1 never moves. A$1 keeps the row fixed and $A1 keeps the column fixed."],
    ["When do you need a mixed reference?", "When a formula is copied both across and down and each input lies along one edge, such as prices down a column and quantities across a row: =$A2*B$1."],
  ),
  "excel/sorting-and-filtering": x(
    ["Sort by one or several columns", "Filter rows by value and condition", "Avoid breaking rows apart when sorting"],
    ["What is the risk of sorting a single selected column?", "Only that column moves, so its values no longer line up with the rest of each row. Select one cell in the data, or expand the selection when asked."],
    ["Does SUM ignore filtered-out rows?", "No. SUM includes hidden rows. SUBTOTAL(109, range) totals only the visible ones."],
  ),
  "excel/core-functions": x(
    ["Total, average and count ranges", "Choose between COUNT and COUNTA", "Combine functions in one formula"],
    ["What is the difference between COUNT, COUNTA and COUNTBLANK?", "COUNT counts numeric cells, COUNTA counts non-empty cells, and COUNTBLANK counts empty ones."],
    ["How does AVERAGE treat blank cells and zeros?", "Blanks are ignored; zeros are included. A missing value entered as 0 will pull the average down."],
  ),
  "excel/tables-and-formatting": x(
    ["Convert a range into a table", "Write structured references", "Separate a cell's value from its format"],
    ["Why use an Excel Table instead of a plain range?", "It expands as rows are added, so formulas, PivotTables and charts built on it stay complete. Structured references are also easier to read."],
    ["Does formatting a cell change its value?", "No. A cell showing 12.5% still holds 0.125. Calculations use the stored value."],
  ),
  "power-bi/connecting-to-data": x(
    ["Connect Power BI to a file or database", "Choose between Import and DirectQuery", "Check data types before loading"],
    ["When would you choose DirectQuery over Import?", "When data is too large to import or must be current to the minute. Otherwise Import is faster and supports more features."],
    ["Why remove unused columns before loading?", "Every column increases model size and refresh time. A smaller model is faster and easier to work in."],
  ),
  "python/variables-and-data-types": x(
    ["Create and name variables", "Identify int, float, str and bool", "Convert between types"],
    ["What is the difference between = and ==?", "= assigns a value to a name. == compares two values and returns True or False."],
    ["Why does '5' + 5 raise an error?", "One value is a string and the other an integer, and Python will not guess which you meant. Convert with int('5') or str(5)."],
  ),
  "tableau/dimensions-and-measures": x(
    ["Classify fields as dimensions or measures", "Explain how each shapes a view", "Tell discrete from continuous fields"],
    ["What is the difference between a dimension and a measure?", "Dimensions are categories that split the view into groups. Measures are numbers that are aggregated within those groups."],
    ["What do blue and green pills mean?", "Blue is discrete and creates headers. Green is continuous and creates an axis."],
  ),
};
