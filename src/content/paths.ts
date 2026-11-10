import type { Level, Tool } from "./types";

const t = (title: string, blurb: string, slug?: string) => ({
  title,
  blurb,
  slug:
    slug ??
    title
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
});

const lv = (name: string, level: Level["level"], topics: Level["topics"]): Level => ({ name, level, topics });

export const tools: Tool[] = [
  {
    slug: "excel",
    name: "Excel",
    lang: "excel",
    tagline: "The analyst's everyday workbench",
    description:
      "Build reliable spreadsheets: formulas that survive copy-paste, lookups, PivotTables and dashboards that answer business questions.",
    difficulty: "Beginner to advanced",
    levels: [
      lv("Excel Fundamentals", "Beginner", [
        t("Formulas & Cell References", "Relative, absolute and mixed references, and why $ matters."),
        t("Sorting & Filtering", "Find the rows that matter without changing the data."),
        t("Core Functions", "SUM, AVERAGE, COUNT, MIN and MAX on real ranges."),
        t("Tables & Formatting", "Turn ranges into structured tables that grow safely."),
      ]),
      lv("Excel Intermediate", "Intermediate", [
        t("IF & Logical Functions", "Branching logic with IF, AND, OR and IFS."),
        t("XLOOKUP & INDEX-MATCH", "Bring columns together from different sheets."),
        t("SUMIFS & COUNTIFS", "Conditional totals across one or many criteria."),
        t("PivotTables", "Summarise thousands of rows in seconds."),
        t("Charts", "Pick the chart that fits the question."),
      ]),
      lv("Excel Advanced", "Advanced", [
        t("Power Query", "Repeatable clean-up steps for messy exports."),
        t("Dynamic Arrays", "FILTER, SORT, UNIQUE and spilled ranges."),
        t("Dashboards", "Combine PivotTables, slicers and charts into one view."),
        t("What-If Analysis", "Goal Seek, data tables and scenarios."),
      ]),
    ],
  },
  {
    slug: "sql",
    name: "SQL",
    lang: "sql",
    tagline: "Ask questions of any database",
    description:
      "Go from your first SELECT to window functions and query tuning, working against a realistic retail database.",
    difficulty: "Beginner to advanced",
    levels: [
      lv("SQL Fundamentals", "Beginner", [
        t("SELECT", "Choose the columns you want from a table."),
        t("WHERE", "Keep only the rows that match a condition."),
        t("ORDER BY", "Sort results so the answer is at the top."),
        t("DISTINCT", "Remove duplicate rows from a result."),
        t("LIMIT", "Return just the first few rows."),
      ]),
      lv("SQL Intermediate", "Intermediate", [
        t("GROUP BY", "Collapse rows into one summary row per group."),
        t("HAVING", "Filter groups after they are aggregated."),
        t("INNER JOIN", "Combine matching rows from two tables."),
        t("LEFT JOIN", "Keep every row on the left, matched or not."),
        t("CASE WHEN", "Add if-then logic inside a query."),
        t("Subqueries", "Use one query's result inside another."),
      ]),
      lv("SQL Advanced", "Advanced", [
        t("CTEs", "Name intermediate steps with WITH."),
        t("Window Functions", "Calculate across related rows without collapsing them."),
        t("Ranking", "ROW_NUMBER, RANK and DENSE_RANK for top-N questions."),
        t("Date Functions", "Truncate, extract and compare dates."),
        t("Query Optimization", "Read a query plan and make slow queries fast."),
      ]),
    ],
  },
  {
    slug: "power-bi",
    name: "Power BI",
    lang: "dax",
    tagline: "Models and reports people actually use",
    description:
      "Shape data in Power Query, build a clean model, write DAX measures and design reports that hold up in a meeting.",
    difficulty: "Beginner to advanced",
    levels: [
      lv("Power BI Fundamentals", "Beginner", [
        t("Connecting to Data", "Import from files and databases, and choose a storage mode."),
        t("Power Query Basics", "Clean and reshape data before it reaches the model."),
        t("Data Modelling & Relationships", "Fact tables, dimension tables and how filters flow."),
        t("Core Visuals", "Bars, lines, cards and tables, and when to use each."),
      ]),
      lv("Power BI Intermediate", "Intermediate", [
        t("DAX Basics", "SUM, COUNTROWS, DIVIDE and the idea of a measure."),
        t("Measures vs Calculated Columns", "Which to use, and what each costs."),
        t("CALCULATE & Filter Context", "Change the filters a measure is evaluated under."),
        t("Time Intelligence", "Year-to-date, prior period and rolling totals."),
        t("Slicers & Interactions", "Let readers explore without breaking the story."),
      ]),
      lv("Power BI Advanced", "Advanced", [
        t("Star Schema Design", "Model for speed and simple DAX."),
        t("Advanced DAX Patterns", "Iterators, variables and context transition."),
        t("Row-Level Security", "Show each viewer only their own data."),
        t("Performance Tuning", "Find and fix slow visuals and measures."),
      ]),
    ],
  },
  {
    slug: "python",
    name: "Python",
    lang: "python",
    tagline: "Analysis you can rerun",
    description:
      "Learn the Python an analyst needs: core syntax, then pandas for cleaning, combining and summarising data.",
    difficulty: "Beginner to advanced",
    levels: [
      lv("Python Fundamentals", "Beginner", [
        t("Variables & Data Types", "Numbers, strings, booleans and how to name things."),
        t("Lists & Dictionaries", "Store and look up collections of values."),
        t("Control Flow", "if, for and while."),
        t("Functions", "Package logic so you can reuse it."),
      ]),
      lv("Python Intermediate", "Intermediate", [
        t("pandas DataFrames", "Load a table and inspect its shape, types and gaps."),
        t("Filtering & Sorting", "Boolean masks, query and sort_values."),
        t("GroupBy & Aggregation", "Split, apply, combine."),
        t("Merging Data", "Join DataFrames the way you join tables."),
        t("Cleaning Data", "Missing values, duplicates and wrong types."),
      ]),
      lv("Python Advanced", "Advanced", [
        t("Visualisation with Matplotlib", "Charts in code, from quick looks to finished figures."),
        t("Time Series", "Resampling, rolling windows and date indexes."),
        t("Exploratory Data Analysis", "A repeatable first pass over any dataset."),
        t("Automating Reports", "Turn a notebook into a scheduled output."),
      ]),
    ],
  },
  {
    slug: "tableau",
    name: "Tableau",
    lang: "tableau",
    tagline: "See patterns, then share them",
    description:
      "Understand how Tableau thinks about data, build charts and dashboards, and write calculations up to LOD expressions.",
    difficulty: "Beginner to advanced",
    levels: [
      lv("Tableau Fundamentals", "Beginner", [
        t("Dimensions & Measures", "The idea behind every Tableau view."),
        t("Connecting to Data", "Live or extract, joins and relationships."),
        t("Basic Charts", "Bars, lines, maps and scatter plots."),
        t("Filters", "Filter types and the order they run in."),
      ]),
      lv("Tableau Intermediate", "Intermediate", [
        t("Calculated Fields", "Row-level and aggregate calculations."),
        t("Dual-Axis & Combo Charts", "Two measures in one view without misleading."),
        t("Parameters", "Let viewers change what a view shows."),
        t("Dashboards & Actions", "Layouts, filter actions and highlight actions."),
      ]),
      lv("Tableau Advanced", "Advanced", [
        t("LOD Expressions", "FIXED, INCLUDE and EXCLUDE."),
        t("Table Calculations", "Running totals, percent of total and rank."),
        t("Performance Optimisation", "Why a workbook is slow and how to fix it."),
        t("Storytelling", "Guide a reader from question to decision."),
      ]),
    ],
  },
];

/** The retail schema every SQL lesson and practice question uses. */
export const sqlSchema = [
  { table: "customers", columns: "customer_id, full_name, segment, city, signup_date" },
  { table: "orders", columns: "order_id, customer_id, order_date, region, status, amount" },
  { table: "order_items", columns: "order_item_id, order_id, product_id, quantity, unit_price" },
  { table: "products", columns: "product_id, product_name, category, unit_cost" },
];
