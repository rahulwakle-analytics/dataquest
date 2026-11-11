import type { Lesson } from "../types";

/** First lesson of the Power BI, Python and Tableau paths. The remaining topics are outlined in paths.ts and not yet written. */
export const starters: Record<string, Lesson> = {
  "power-bi/connecting-to-data": {
    summary: "Every Power BI report starts with Get Data, and the storage mode you choose decides how fresh and how fast the report is.",
    explanation: [
      "Power BI Desktop connects to files, databases and online services through Get Data. After you pick a source you can load it as it is or open Power Query to clean it first. Cleaning first is almost always worth it.",
      "Import mode copies the data into the report file, which makes visuals fast but means the data is only as fresh as the last refresh. DirectQuery leaves the data in the source and queries it live, which keeps it current but makes every visual wait on the database. Start with Import unless the data is too large or must be real-time.",
    ],
    syntax: `Home > Get data > choose a source > Transform Data (clean first) or Load

Storage mode
  Import       data copied into the model, refreshed on a schedule
  DirectQuery  data stays in the source, queried on every interaction`,
    examples: [
      { title: "Load a CSV export", code: `Get data > Text/CSV > sales_2024.csv > Transform Data`, note: "Check column types in Power Query before loading. Dates and amounts are often read as text." },
      { title: "Connect to a database", code: `Get data > PostgreSQL database > server, database > Import`, note: "Select only the tables you need. Every extra column makes the model larger." },
    ],
    scenario: {
      title: "A weekly sales report from two sources",
      body: "Orders come from the company database and sales targets live in a spreadsheet the finance team maintains. You connect to both in Import mode, set a daily refresh, and relate them on region so actuals and targets can sit in one chart.",
    },
    mistakes: [
      { mistake: "Loading every table and column 'in case it is useful'.", fix: "Remove unused columns in Power Query. Smaller models refresh faster and are easier to work in." },
      { mistake: "Choosing DirectQuery by default.", fix: "It makes each visual wait on the source. Use it only when the data is too big to import or must be live." },
    ],
    practice: [
      {
        title: "Pick a storage mode",
        prompt: "A report over 2 million sales rows is viewed each morning and the data changes overnight. Which storage mode would you choose, and why?",
        difficulty: "Easy",
        hint: "How fresh does the data need to be during the day?",
        solution: `Import, with a scheduled refresh early each morning. The data changes only overnight, 2 million rows fits comfortably in an imported model, and visuals respond quickly.`,
      },
      {
        title: "Fix a wrong data type",
        prompt: "After loading a CSV, the Amount column is left-aligned and SUM is unavailable for it. What happened and how do you fix it?",
        difficulty: "Easy",
        hint: "Look at the icon in the column header in Power Query.",
        solution: `The column was loaded as text. In Power Query, select the column and set its data type to Decimal Number (or Fixed Decimal Number for currency), then Close & Apply.`,
      },
    ],
    checks: [
      {
        q: "In Import mode, when does the report show new source data?",
        options: ["Immediately", "After the next refresh", "Never", "Only in Desktop"],
        answer: 1,
        why: "Imported data is a copy. It updates when the dataset is refreshed.",
      },
      {
        q: "What is the main cost of DirectQuery?",
        options: ["Larger file size", "Visuals wait on the source database", "No relationships allowed", "No slicers"],
        answer: 1,
        why: "Each interaction sends queries to the source, so speed depends on it.",
      },
    ],
  },

  "python/variables-and-data-types": {
    summary: "Variables give names to values, and every value has a type that decides what you can do with it.",
    explanation: [
      "A variable is a name that points at a value. You create one with =, and you can reuse the name wherever you need the value. Good names describe what the value means, such as monthly_revenue, not x.",
      "The types you meet first are int (whole numbers), float (decimals), str (text) and bool (True or False). Type matters: '5' + '5' joins two strings into '55', while 5 + 5 adds to 10. Use type() to check, and int(), float() or str() to convert.",
    ],
    syntax: `name = value

type(value)     # check a type
int("42")       # convert text to a whole number
float("3.5")    # convert text to a decimal
str(42)         # convert a number to text`,
    examples: [
      {
        title: "Create and use variables",
        code: `units_sold = 120
unit_price = 4.5
revenue = units_sold * unit_price
print(revenue)  # 540.0`,
        note: "An int multiplied by a float gives a float.",
      },
      {
        title: "Convert text to a number",
        code: `raw = "1250"
amount = int(raw)
print(amount + 50)  # 1300`,
        note: "Values read from files often arrive as text and must be converted before arithmetic.",
      },
    ],
    scenario: {
      title: "A quick margin calculation",
      body: "A product sells for 80 and costs 52 to make. You store both in named variables and calculate the margin percentage, so the calculation reads like the business rule it represents.",
      code: `price = 80
cost = 52
margin_pct = (price - cost) / price * 100
print(round(margin_pct, 1))  # 35.0`,
    },
    mistakes: [
      { mistake: "Doing arithmetic on numbers stored as text.", fix: "'100' * 2 gives '100100'. Convert with int() or float() first." },
      { mistake: "Using = when you mean to compare.", fix: "= assigns a value. == tests whether two values are equal." },
    ],
    practice: [
      {
        title: "Average order value",
        prompt: "Total revenue is 18,400 from 230 orders. Store both in variables and print the average order value.",
        difficulty: "Easy",
        hint: "Divide one variable by the other.",
        solution: `total_revenue = 18400
orders = 230
average_order_value = total_revenue / orders
print(average_order_value)  # 80.0`,
      },
      {
        title: "Clean a text amount",
        prompt: "A value arrives as the string \"2,450.75\". Convert it to a float.",
        difficulty: "Medium",
        hint: "Remove the comma with .replace() before converting.",
        solution: `raw = "2,450.75"
amount = float(raw.replace(",", ""))
print(amount)  # 2450.75`,
      },
    ],
    checks: [
      {
        q: "What does '5' + '5' evaluate to?",
        options: ["10", "'55'", "An error", "'10'"],
        answer: 1,
        why: "Both values are strings, and + joins strings together.",
      },
      {
        q: "What is the type of 7 / 2 in Python 3?",
        options: ["int", "float", "str", "bool"],
        answer: 1,
        why: "The / operator always returns a float; 7 / 2 is 3.5.",
      },
    ],
  },

  "tableau/dimensions-and-measures": {
    summary: "Tableau sorts every field into a dimension or a measure, and that split decides how a view is built.",
    explanation: [
      "Dimensions are the things you slice by: region, category, order date. They are usually text or dates, and placing one in a view splits the marks into groups. Measures are the numbers you add up: sales, quantity, profit. Placing one in a view aggregates it, by default with SUM.",
      "So a view is always 'this measure, broken down by these dimensions'. Fields also carry a second property: blue pills are discrete and create headers, green pills are continuous and create an axis. A date can be either, which is why the same field can give you separate bars per year or a continuous line.",
    ],
    syntax: `Dimension on Rows or Columns   splits the view into groups
Measure on Rows or Columns     aggregates (SUM by default) and draws an axis
Blue pill                      discrete: headers
Green pill                     continuous: axis`,
    examples: [
      { title: "Sales by region", code: `Columns: Region     Rows: SUM(Sales)`, note: "One bar per region. Tableau sums sales within each." },
      { title: "Monthly trend", code: `Columns: MONTH(Order Date) (continuous)     Rows: SUM(Sales)`, note: "A green date pill gives a continuous time axis and a line." },
    ],
    scenario: {
      title: "Which category is unprofitable where?",
      body: "A manager wants to see profit for each product category in each region. Put Category on Rows, Region on Columns and SUM(Profit) on Color and Text. The two dimensions define the grid and the measure fills each cell.",
    },
    mistakes: [
      { mistake: "Leaving an ID field such as Order ID as a measure.", fix: "Tableau sums it, which is meaningless. Convert it to a dimension." },
      { mistake: "Reading an average as if it were a total.", fix: "Check the aggregation shown on the pill. SUM, AVG and COUNT give very different pictures." },
    ],
    practice: [
      {
        title: "Classify the fields",
        prompt: "Classify each as a dimension or a measure: Customer Name, Quantity, Ship Date, Discount, Postal Code.",
        difficulty: "Easy",
        hint: "Would adding the values together mean anything?",
        solution: `Dimensions: Customer Name, Ship Date, Postal Code. Measures: Quantity, Discount. Postal Code is numeric but identifies a place, so it is a dimension; Discount is usually averaged, not summed.`,
      },
      {
        title: "Build a view",
        prompt: "Describe where to place fields to show average order quantity for each customer segment as bars.",
        difficulty: "Easy",
        hint: "One dimension, one measure, and change the aggregation.",
        solution: `Segment on Columns, Quantity on Rows, then change the pill's aggregation from SUM to Average, giving AVG(Quantity) per segment.`,
      },
    ],
    checks: [
      {
        q: "What happens by default when you add a measure to a view?",
        options: ["It is listed row by row", "It is aggregated, usually with SUM", "It becomes a filter", "It is converted to text"],
        answer: 1,
        why: "Measures are aggregated to the level of detail set by the dimensions in the view.",
      },
      {
        q: "What does a green pill indicate?",
        options: ["A dimension", "A continuous field that draws an axis", "A filter", "A calculated field"],
        answer: 1,
        why: "Green means continuous; blue means discrete.",
      },
    ],
  },
};
