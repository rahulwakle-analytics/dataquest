import type { Lesson } from "../types";

/** The remaining Beginner-level lessons for Power BI, Python and Tableau. */
export const beginner: Record<string, Lesson> = {
  /* ------------------------------------------------------------ Power BI */
  "power-bi/power-query-basics": {
    summary: "Power Query cleans and reshapes data before it reaches the model, and records every step so the clean-up repeats on each refresh.",
    objectives: ["Open the Power Query Editor and read the Applied Steps list", "Fix data types, remove columns and filter rows", "Explain why transformations belong in Power Query"],
    explanation: [
      "Raw exports are rarely ready to analyse: dates arrive as text, there are blank rows, and one column holds two pieces of information. Power Query is the part of Power BI where you fix this. You open it with Transform Data.",
      "Each change you make is saved as a step in the Applied Steps pane. Nothing is changed in the source file. When the data refreshes, Power Query runs the same steps again on the new data, so you clean a messy file once, not every month.",
    ],
    syntax: `Home > Transform data            opens the Power Query Editor
Right-click a column header      change type, remove, split, replace values
Filter arrow on a column         keep or remove rows
Applied Steps (right pane)       click a step to see the data at that point
Home > Close & Apply             load the result into the model`,
    examples: [
      { title: "Fix a date stored as text", code: `Select the OrderDate column > Data Type > Date`, note: "If some rows show Error, the text is in a different date format. Use Change Type > Using Locale and pick the format of the source." },
      { title: "Split one column into two", code: `Select "Region - Store" > Split Column > By Delimiter > " - "`, note: "You get one column for region and one for store, which lets you filter and group by either." },
    ],
    scenario: {
      title: "A monthly export that is always messy",
      body: "Finance sends a sales export each month with two header rows, a total row at the bottom and amounts stored as text. You remove the top row, promote headers, filter out the total row and set the amount to a decimal number. Next month you replace the file and click Refresh: every step runs again.",
    },
    mistakes: [
      { mistake: "Cleaning the data by hand in Excel before every refresh.", fix: "Do it once in Power Query so it repeats automatically and is documented in the steps." },
      { mistake: "Leaving the automatic Changed Type step unchecked.", fix: "Power BI guesses types from the first rows. Check each column's type icon, especially IDs, dates and amounts." },
    ],
    practice: [
      { title: "Remove a total row", difficulty: "Easy", prompt: "A table has a final row where the Product column contains the word Total. How do you stop it being loaded?", hints: ["Think about filtering rows, not deleting a row number.", "Use the filter arrow on the Product column.", "Untick Total, or use Text Filters > Does Not Equal > Total."], solution: "Filter the Product column to exclude the value Total. Filtering by value keeps working when the number of rows changes; removing the bottom row by position would also work but is more fragile.", explanation: "A filter step describes a rule, so it still applies when next month's file has more rows." },
      { title: "Amounts loaded as text", difficulty: "Medium", prompt: "An Amount column contains values such as 1,250.50 but loads as text, with some rows reading n/a. Describe the steps to make it numeric.", hints: ["Deal with the non-numeric text first.", "Replace Values can turn n/a into null.", "Then set the data type to Decimal Number."], solution: "Use Replace Values to change n/a to null, then set the column's data type to Decimal Number (or Fixed Decimal Number for currency). Rows that were n/a become blank instead of errors.", explanation: "Changing the type first would turn n/a into errors. Replacing it with null first leaves clean blanks that aggregations ignore." },
    ],
    interview: [
      { q: "Why transform data in Power Query instead of in DAX?", a: "Power Query runs once at refresh, so the model stores clean data and reports stay fast. It also keeps a visible list of steps. DAX is for calculations that depend on what the user has filtered." },
      { q: "What happens to your Power Query steps when the source data changes?", a: "They are applied again to the new data on refresh. This is why steps should be written as rules, such as filtering by value, and not depend on fixed row positions." },
    ],
    checks: [
      { q: "Where are your transformations recorded?", options: ["In the source file", "In the Applied Steps pane", "In a DAX measure", "They are not recorded"], answer: 1, why: "Each action becomes a named step that is replayed on every refresh." },
      { q: "Does Power Query change the original source file?", options: ["Yes, immediately", "Yes, on Close & Apply", "No", "Only for Excel files"], answer: 2, why: "Power Query reads the source and transforms a copy. The source is never modified." },
    ],
  },

  "power-bi/data-modelling-and-relationships": {
    summary: "A data model connects tables through relationships so one filter can flow across them, and a good model makes every later step simpler.",
    objectives: ["Tell fact tables from dimension tables", "Create a one-to-many relationship", "Explain how filters flow through a model"],
    explanation: [
      "Most models have two kinds of table. Fact tables record events: one row per sale, order or visit, with numbers to add up. Dimension tables describe things: one row per product, customer or date, with the labels you slice by.",
      "A relationship links a column in a dimension to the matching column in a fact table, for example Products[ProductID] to Sales[ProductID]. It is one-to-many: one product, many sales. Filters flow from the one side to the many side, so choosing a category in the Products table filters the Sales rows. A fact table in the middle with dimensions around it is called a star schema.",
    ],
    syntax: `Model view                         drag a key from the dimension to the fact table
Cardinality                        One to many (1:*) in almost every case
Cross filter direction             Single: dimension filters fact
Star schema                        one fact table surrounded by dimension tables`,
    examples: [
      { title: "Link sales to products", code: `Products[ProductID] (1)  →  Sales[ProductID] (*)`, note: "A bar chart of Sales amount by Products[Category] now works, because each sale can find its category." },
      { title: "Add a date table", code: `Dates[Date] (1)  →  Sales[OrderDate] (*)`, note: "A dedicated date table gives you month, quarter and year columns and is required for time-intelligence calculations." },
    ],
    scenario: {
      title: "Sales against targets",
      body: "Sales are recorded per order and targets are set per region per month. The two tables cannot be joined row to row. You relate both to a shared Regions table and a shared Dates table. A single visual can then show actual and target side by side, filtered by the same region and month.",
    },
    mistakes: [
      { mistake: "Loading one wide, flat table with everything in it.", fix: "Split descriptive columns into dimension tables. The model gets smaller and measures get simpler." },
      { mistake: "Setting relationships to filter in both directions to make a visual work.", fix: "Bidirectional filters cause ambiguous results and slow models. Keep single direction and fix the model shape instead." },
    ],
    practice: [
      { title: "Fact or dimension?", difficulty: "Easy", prompt: "Classify each table: Orders (one row per order line), Customers, Calendar, Returns (one row per returned item), Stores.", hints: ["Does the table record events or describe things?", "Events repeat for the same customer or product; descriptions have one row each.", "Two of the five are fact tables."], solution: "Fact tables: Orders and Returns. Dimension tables: Customers, Calendar and Stores.", explanation: "Orders and Returns record things that happened and hold values to aggregate. The others each describe one entity per row and provide the labels to slice by." },
      { title: "Why is every bar the same height?", difficulty: "Medium", prompt: "A chart of total sales by product category shows the same value for every category. What is the most likely cause and the fix?", hints: ["The measure is ignoring the category.", "What lets a filter on Products reach Sales?", "Check Model view."], solution: "There is no active relationship between Products and Sales, so the category does not filter the sales rows and each bar shows the grand total. Create a one-to-many relationship from Products[ProductID] to Sales[ProductID].", explanation: "Without a relationship the two tables are independent, so the category on the axis cannot filter Sales." },
    ],
    interview: [
      { q: "What is a star schema and why is it recommended in Power BI?", a: "One fact table in the centre related to dimension tables around it. Filters flow in one clear direction, DAX stays simple, and the engine compresses and queries it efficiently." },
      { q: "What does one-to-many mean in a relationship?", a: "Each value appears once in the dimension table and many times in the fact table. One product row relates to many sales rows." },
    ],
    checks: [
      { q: "Which table is a dimension?", options: ["Sales transactions", "Website visits", "Products", "Payments"], answer: 2, why: "Products describes entities, one row each. The others record events." },
      { q: "In a single-direction one-to-many relationship, filters flow…", options: ["From the many side to the one side", "From the one side to the many side", "In both directions", "Not at all"], answer: 1, why: "A selection in the dimension filters the related rows in the fact table." },
    ],
  },

  "power-bi/core-visuals": {
    summary: "A handful of visuals cover most reporting needs. Choosing by the question being asked matters more than knowing every chart type.",
    objectives: ["Match a visual to the question it answers", "Build a bar chart, line chart, card and table", "Avoid common chart choices that mislead"],
    explanation: [
      "Start from the question. Comparing categories calls for a bar chart. Showing change over time calls for a line chart. A single headline number belongs in a card. Exact values that people need to look up belong in a table or matrix.",
      "You build a visual by dragging fields into its wells: a dimension on the axis and a measure in the values. Keep each visual to one idea, sort bars by value unless the categories have a natural order, and give the visual a title that says what it shows.",
    ],
    syntax: `Compare categories      Bar or column chart   Axis: category     Values: measure
Trend over time         Line chart            Axis: date         Values: measure
One headline number     Card                  Fields: measure
Exact values            Table or matrix       Rows, Columns, Values
Part of a whole         Stacked bar, or a pie with very few slices`,
    examples: [
      { title: "Revenue by region", code: `Clustered bar chart   Y-axis: Region   X-axis: Total Revenue   Sort: descending`, note: "Horizontal bars leave room for long labels, and sorting shows the ranking at a glance." },
      { title: "Monthly trend", code: `Line chart   X-axis: Dates[Month]   Y-axis: Total Revenue`, note: "Use the date table's month column so the months appear in calendar order." },
    ],
    scenario: {
      title: "A one-page sales overview",
      body: "A sales manager wants to open one page on Monday and know where things stand. You place three cards across the top for revenue, orders and average order value, a line chart of revenue by month, a bar chart by region and a slicer for year. Every visual answers one question.",
    },
    mistakes: [
      { mistake: "Using a pie chart with many slices.", fix: "People compare lengths far better than angles. Use a sorted bar chart once there are more than three or four categories." },
      { mistake: "Putting two measures with very different scales on one axis.", fix: "The smaller measure flattens into a line at the bottom. Use separate visuals, or a secondary axis with clear labels." },
    ],
    practice: [
      { title: "Pick the visual", difficulty: "Easy", prompt: "Choose a visual for each: (a) total customers this year, (b) sales for each of twelve product categories, (c) weekly orders over two years.", hints: ["Ask what each question is: one number, a comparison or a trend.", "Twelve categories is too many for a pie.", "Time goes on a line."], solution: "(a) A card. (b) A bar chart sorted by sales. (c) A line chart with the date on the x-axis.", explanation: "One value needs no chart, categories are compared by bar length, and a line shows direction over time." },
      { title: "Fix a misleading chart", difficulty: "Medium", prompt: "A column chart of revenue by month has a y-axis starting at 950,000, making a 3% rise look like a doubling. What do you change, and when might a non-zero axis be acceptable?", hints: ["Bars encode value by their length.", "Where must a bar's baseline be?", "Lines are read differently from bars."], solution: "Start the axis at zero for the column chart, because bar length represents the value. A non-zero axis can be acceptable on a line chart, where the reader follows the slope, provided the axis is clearly labelled.", explanation: "Truncating a bar chart's axis exaggerates differences. With lines the eye reads change, not length, so a tighter range can be honest when labelled." },
    ],
    interview: [
      { q: "How do you decide which chart to use?", a: "From the question: bars to compare categories, lines for change over time, a card for one number, and a table when people need exact values. Then remove anything that does not help answer it." },
      { q: "When is a pie chart acceptable?", a: "When showing parts of a whole with two or three slices and the message is a rough share. For anything more detailed, a bar chart is easier to read." },
    ],
    checks: [
      { q: "Which visual best shows revenue for each month of the last two years?", options: ["Pie chart", "Card", "Line chart", "Table only"], answer: 2, why: "A line shows the direction and pattern of change over time." },
      { q: "Why sort a bar chart by value?", options: ["It loads faster", "It makes the ranking obvious", "Power BI requires it", "It changes the totals"], answer: 1, why: "Sorted bars let the reader see the order of categories without comparing each pair." },
    ],
  },

  /* -------------------------------------------------------------- Python */
  "python/lists-and-dictionaries": {
    summary: "Lists hold items in order and dictionaries hold values by name. Together they are how Python stores collections of data.",
    objectives: ["Create, index and change a list", "Store and look up values in a dictionary", "Choose the right structure for a task"],
    explanation: [
      "A list is an ordered collection written in square brackets. You reach an item by its position, counting from 0, so sales[0] is the first item. Lists can grow with append and be cut into slices such as sales[1:3].",
      "A dictionary stores pairs of key and value in curly brackets. You look a value up by its key, such as prices['pen'], which is clearer and faster than searching a list. A table of data is often represented as a list of dictionaries, one dictionary per row.",
    ],
    syntax: `sales = [120, 95, 143]          # list
sales[0]                        # first item: 120
sales.append(80)                # add to the end
len(sales)                      # number of items

prices = {"pen": 1.2, "pad": 3.5}   # dictionary
prices["pen"]                       # look up by key: 1.2
prices["ink"] = 4.0                 # add or update`,
    examples: [
      { title: "Work with a list", code: `monthly = [1200, 950, 1430, 800]
print(monthly[0])       # 1200
print(monthly[-1])      # 800, the last item
print(sum(monthly) / len(monthly))  # 1095.0`, note: "Negative positions count from the end. sum and len work on any list of numbers." },
      { title: "Look up with a dictionary", code: `stock = {"notebook": 40, "stapler": 12}
stock["stapler"] -= 2
print(stock["stapler"])           # 10
print(stock.get("ruler", 0))      # 0, no error`, note: "get returns a default when the key is missing, where square brackets would raise a KeyError." },
    ],
    scenario: {
      title: "Totalling an order",
      body: "An order arrives as a list of rows, each a dictionary with a product, quantity and price. You read each row's values by name and add up quantity times price.",
      code: `order = [
    {"product": "pen", "qty": 10, "price": 1.2},
    {"product": "pad", "qty": 4, "price": 3.5},
]
total = sum(row["qty"] * row["price"] for row in order)
print(total)  # 26.0`,
    },
    mistakes: [
      { mistake: "Asking for item 3 of a three-item list.", fix: "Positions start at 0, so the last item is at position 2. Use [-1] for the last item." },
      { mistake: "Reading a dictionary key that may not exist with square brackets.", fix: "That raises KeyError. Use .get(key, default) when a key can be missing." },
    ],
    practice: [
      { title: "Best and worst month", difficulty: "Easy", prompt: "Given sales = [1200, 950, 1430, 800, 1675], print the highest value, the lowest value and the difference between them.", hints: ["Python has built-in functions for largest and smallest.", "max(sales) and min(sales).", "Subtract one from the other."], solution: `sales = [1200, 950, 1430, 800, 1675]
print(max(sales))               # 1675
print(min(sales))               # 800
print(max(sales) - min(sales))  # 875`, explanation: "max and min scan the list once each. The difference is the range of the data." },
      { title: "Count by category", difficulty: "Medium", prompt: "Given regions = ['North', 'South', 'North', 'East', 'North', 'South'], build a dictionary that maps each region to how many times it appears.", hints: ["Start with an empty dictionary and loop over the list.", "For each region, add 1 to its current count.", "counts.get(region, 0) gives 0 the first time a region is seen."], solution: `regions = ["North", "South", "North", "East", "North", "South"]
counts = {}
for region in regions:
    counts[region] = counts.get(region, 0) + 1
print(counts)  # {'North': 3, 'South': 2, 'East': 1}`, explanation: "get supplies 0 for a region not yet in the dictionary, so the same line handles the first and every later occurrence. This is the logic behind GROUP BY and COUNT." },
    ],
    interview: [
      { q: "What is the difference between a list and a dictionary?", a: "A list keeps items in order and you access them by position. A dictionary maps keys to values and you access them by key. Use a list for a sequence and a dictionary for lookups." },
      { q: "How do you safely read a key that might be missing?", a: "With .get(key, default), which returns the default instead of raising a KeyError, or by checking with the in operator first." },
    ],
    checks: [
      { q: "Given items = ['a', 'b', 'c'], what is items[1]?", options: ["'a'", "'b'", "'c'", "An error"], answer: 1, why: "Positions start at 0, so position 1 is the second item." },
      { q: "What does {'x': 1}.get('y', 0) return?", options: ["1", "None", "0", "KeyError"], answer: 2, why: "The key 'y' is missing, so get returns the default, 0." },
    ],
  },

  "python/control-flow": {
    summary: "if statements choose between actions and loops repeat them. With these you can apply a rule to every row of a dataset.",
    objectives: ["Write if, elif and else branches", "Repeat work with for and while loops", "Combine a loop with a condition"],
    explanation: [
      "An if statement runs a block of code only when a condition is true. elif adds further conditions and else catches everything left. Python uses indentation to show which lines belong to each branch, so the spacing is part of the code.",
      "A for loop runs a block once for each item in a collection, which is how you process every value in a list. A while loop repeats as long as a condition stays true. Most data work uses for. Putting an if inside a for lets you count, filter or label items.",
    ],
    syntax: `if condition:
    ...
elif other_condition:
    ...
else:
    ...

for item in collection:
    ...

while condition:
    ...`,
    examples: [
      { title: "Label a value", code: `amount = 620
if amount >= 500:
    size = "Large"
elif amount >= 150:
    size = "Medium"
else:
    size = "Small"
print(size)  # Large`, note: "Conditions are checked from the top and the first true one wins, exactly like CASE WHEN in SQL." },
      { title: "Loop and filter", code: `orders = [120, 640, 80, 510, 300]
large = []
for amount in orders:
    if amount >= 500:
        large.append(amount)
print(large)  # [640, 510]`, note: "The loop visits each order and the if decides whether to keep it." },
    ],
    scenario: {
      title: "Flagging stock to reorder",
      body: "You have current stock levels and a reorder point for each product. A loop checks every product and prints the ones that have fallen to or below their reorder point.",
      code: `stock = {"notebook": 8, "stapler": 30, "lamp": 2}
reorder_at = {"notebook": 10, "stapler": 12, "lamp": 5}
for product, units in stock.items():
    if units <= reorder_at[product]:
        print("Reorder", product)
# Reorder notebook
# Reorder lamp`,
    },
    mistakes: [
      { mistake: "Inconsistent indentation inside a block.", fix: "Python raises IndentationError or runs lines in the wrong branch. Use four spaces per level throughout." },
      { mistake: "Putting the loosest condition first.", fix: "With amount >= 150 first, an amount of 900 is labelled Medium and the Large branch never runs. Test the tightest condition first." },
    ],
    practice: [
      { title: "Count the refunds", difficulty: "Easy", prompt: "Given statuses = ['completed', 'refunded', 'completed', 'cancelled', 'refunded'], count how many are 'refunded' using a loop.", hints: ["Start a counter at 0.", "Loop over the list and compare each value with 'refunded'.", "Add 1 inside the if."], solution: `statuses = ["completed", "refunded", "completed", "cancelled", "refunded"]
refunds = 0
for status in statuses:
    if status == "refunded":
        refunds += 1
print(refunds)  # 2`, explanation: "The counter rises only when the condition is true. statuses.count('refunded') gives the same result, but the loop shows the logic." },
      { title: "Total of completed orders", difficulty: "Medium", prompt: "Given a list of dictionaries with keys status and amount, sum the amount of rows whose status is 'completed'.", hints: ["Loop over the rows.", "Read each row's status with row['status'].", "Add row['amount'] to a running total when it matches."], solution: `orders = [
    {"status": "completed", "amount": 120},
    {"status": "refunded", "amount": 80},
    {"status": "completed", "amount": 310},
]
total = 0
for row in orders:
    if row["status"] == "completed":
        total += row["amount"]
print(total)  # 430`, explanation: "This is a WHERE filter followed by SUM, written by hand: the if is the filter and the running total is the aggregate." },
    ],
    interview: [
      { q: "What is the difference between a for loop and a while loop?", a: "A for loop runs once for each item in a collection, so the number of repetitions is known. A while loop repeats until a condition becomes false, which suits cases where you cannot know the count in advance." },
      { q: "Why does indentation matter in Python?", a: "Indentation defines which lines belong to an if, a loop or a function. Changing it changes what the program does, and inconsistent indentation is an error." },
    ],
    checks: [
      { q: "x = 200. Which branch runs in: if x > 500 … elif x > 100 … else …?", options: ["The if branch", "The elif branch", "The else branch", "None"], answer: 1, why: "200 is not above 500 but is above 100, so the elif branch runs." },
      { q: "How many times does 'for n in [3, 6, 9]:' run its block?", options: ["Once", "Three times", "Nine times", "Until stopped"], answer: 1, why: "A for loop runs once per item, and the list has three items." },
    ],
  },

  "python/functions": {
    summary: "A function packages a piece of logic under a name so you can reuse it, test it and read your code more easily.",
    objectives: ["Define a function with parameters", "Return a value from a function", "Explain why functions reduce errors"],
    explanation: [
      "You define a function with def, a name, and parameters in brackets. The indented lines below are its body. return sends a result back to whoever called it. Calling the function runs the body with the values you pass in.",
      "Functions matter in analysis because the same calculation tends to be needed in many places. If margin is calculated in one function, a correction is made once. A function with a clear name also documents what the code is doing.",
    ],
    syntax: `def function_name(parameter_1, parameter_2=default):
    """What the function does."""
    result = ...
    return result

value = function_name(argument_1, argument_2)`,
    examples: [
      { title: "A reusable calculation", code: `def margin_pct(price, cost):
    return (price - cost) / price * 100

print(margin_pct(80, 52))   # 35.0
print(margin_pct(120, 90))  # 25.0`, note: "The formula is written once and used with different inputs." },
      { title: "A default value", code: `def with_tax(amount, rate=0.2):
    return round(amount * (1 + rate), 2)

print(with_tax(100))        # 120.0
print(with_tax(100, 0.05))  # 105.0`, note: "rate is used as 0.2 unless the caller supplies another value." },
    ],
    scenario: {
      title: "One definition of order size",
      body: "Three reports each label orders as Small, Medium or Large, and they disagree because each wrote its own thresholds. Putting the rule in one function gives every report the same answer.",
      code: `def order_size(amount):
    if amount >= 500:
        return "Large"
    if amount >= 150:
        return "Medium"
    return "Small"

print([order_size(a) for a in [90, 220, 700]])
# ['Small', 'Medium', 'Large']`,
    },
    mistakes: [
      { mistake: "Printing inside a function instead of returning.", fix: "print shows a value but gives nothing back, so the caller receives None. Use return when the result is needed elsewhere." },
      { mistake: "Relying on variables defined outside the function.", fix: "Pass what the function needs as parameters. It is then predictable and can be reused anywhere." },
    ],
    practice: [
      { title: "Average order value", difficulty: "Easy", prompt: "Write a function average_order_value(revenue, orders) that returns revenue divided by orders.", hints: ["Start with def and two parameters.", "The body is a single division.", "Use return, not print."], solution: `def average_order_value(revenue, orders):
    return revenue / orders

print(average_order_value(18400, 230))  # 80.0`, explanation: "The function takes two inputs and returns the result so it can be stored or used in a further calculation." },
      { title: "Guard against zero", difficulty: "Medium", prompt: "Improve the function so it returns 0 when orders is 0 instead of raising an error.", hints: ["Dividing by zero raises ZeroDivisionError.", "Check orders before dividing.", "Return early when it is 0."], solution: `def average_order_value(revenue, orders):
    if orders == 0:
        return 0
    return revenue / orders

print(average_order_value(0, 0))  # 0`, explanation: "The early return handles the special case, and the normal calculation runs only when it is safe. Real data always contains cases like a day with no orders." },
    ],
    interview: [
      { q: "What is the difference between print and return?", a: "print displays a value on screen. return hands a value back to the caller so it can be stored or used. A function without return gives back None." },
      { q: "Why write functions in analysis code?", a: "To avoid repeating logic, so a rule is defined and corrected in one place; to make code readable through descriptive names; and to make each piece testable on its own." },
    ],
    checks: [
      { q: "What does a function return if it has no return statement?", options: ["0", "An empty string", "None", "An error"], answer: 2, why: "Python returns None when a function ends without a return." },
      { q: "def f(a, b=2): return a * b. What is f(5)?", options: ["5", "7", "10", "An error"], answer: 2, why: "b takes its default value of 2, so the result is 5 times 2." },
    ],
  },

  /* ------------------------------------------------------------- Tableau */
  "tableau/connecting-to-data": {
    summary: "Tableau connects to files and databases, and the choice between a live connection and an extract decides how fresh and how fast a workbook is.",
    objectives: ["Connect Tableau to a file or database", "Choose between a live connection and an extract", "Combine tables with relationships"],
    explanation: [
      "On the Connect pane you pick a source: an Excel or CSV file, or a database server. Tableau then shows the Data Source page, where you drag tables onto the canvas and check that each field has the right type.",
      "A live connection queries the source every time a view changes, so it is always current but only as fast as the source. An extract is a compressed snapshot stored by Tableau, which is fast and works offline but is only as fresh as its last refresh. When you add more than one table, Tableau links them with relationships, which combine tables at the level each view needs and avoid the duplication a join can cause.",
    ],
    syntax: `Connect pane             choose a file or server
Data Source page         drag tables to the canvas; check field types
Connection: Live         queries the source on every interaction
Connection: Extract      a stored snapshot, refreshed on demand or on a schedule
Relationships            the lines ("noodles") linking tables on a shared field`,
    examples: [
      { title: "Connect to a CSV", code: `Connect > Text file > retail_orders.csv > check that order_date is a date`, note: "The small icon above each column shows its type. Click it to change a date that was read as text." },
      { title: "Relate two tables", code: `Drag orders, then customers > relate on customer_id = customer_id`, note: "The relationship stays flexible: a view using only order fields is not affected by the customers table." },
    ],
    scenario: {
      title: "A dashboard for a weekly meeting",
      body: "A team reviews sales each Monday from a database that slows down during business hours. You connect with an extract refreshed early on Monday morning. The dashboard responds instantly in the meeting and the numbers are as of that morning, which is what a weekly review needs.",
    },
    mistakes: [
      { mistake: "Using a live connection to a slow database for a dashboard many people use.", fix: "Every click waits on the database. Use an extract unless the data must be current to the minute." },
      { mistake: "Joining a header table to a detail table and summing the header value.", fix: "The join repeats the header row and inflates the total. Use relationships, which aggregate each table at its own level." },
    ],
    practice: [
      { title: "Live or extract?", difficulty: "Easy", prompt: "Choose live or extract for each: (a) a monitor showing warehouse orders as they arrive, (b) a monthly finance report on five million rows.", hints: ["How current must each one be?", "How much does speed matter?", "One needs the present moment; the other needs a fixed month."], solution: "(a) Live, because the purpose is to show the current state. (b) An extract, refreshed after month end: the data is fixed for the period and an extract makes five million rows respond quickly.", explanation: "Choose live when freshness is the point and an extract when speed and stability matter more." },
      { title: "A doubled total", difficulty: "Medium", prompt: "After joining orders to order_items, the sum of the orders amount field is about twice the true revenue. Explain why and give a fix.", hints: ["How many rows does one order have after the join?", "The order amount now appears on each of those rows.", "Tableau has a way of combining tables that avoids this."], solution: "Each order is repeated once per item, so its amount is counted several times. Replace the join with a relationship, or calculate revenue from the item table as quantity times unit price.", explanation: "A join produces one row per matching pair, repeating header values. A relationship keeps each table at its own level of detail." },
    ],
    interview: [
      { q: "What is the difference between a live connection and an extract?", a: "A live connection queries the source on each interaction, so data is current but performance depends on the source. An extract is a snapshot stored in Tableau's own format: fast and available offline, but it must be refreshed." },
      { q: "How do relationships differ from joins in Tableau?", a: "A join merges tables into one fixed table before analysis, which can duplicate rows. A relationship keeps tables separate and combines them per view at the right level of detail, so totals are not inflated." },
    ],
    checks: [
      { q: "Which connection type always shows the latest data in the source?", options: ["Extract", "Live", "Both", "Neither"], answer: 1, why: "A live connection queries the source every time the view changes." },
      { q: "What is the main advantage of an extract?", options: ["It is always current", "It is fast and works offline", "It needs no data source", "It prevents all errors"], answer: 1, why: "An extract is a compressed local snapshot, so views respond quickly without contacting the source." },
    ],
  },

  "tableau/basic-charts": {
    summary: "In Tableau you build a chart by placing fields on shelves. Knowing what Rows, Columns and the Marks card do lets you make any standard chart.",
    objectives: ["Build bar, line and scatter charts from shelves", "Use the Marks card for colour, size and labels", "Pick the chart that fits the question"],
    explanation: [
      "A Tableau view has two main shelves. Fields on Columns run across and fields on Rows run down. Put a dimension on one and a measure on the other and you get bars. Put a date on Columns and a measure on Rows and you get a line.",
      "The Marks card adds further detail. Dropping a field on Color splits or shades the marks, Size scales them, and Label prints values. Show Me suggests chart types for the selected fields, which is useful while learning, but understanding the shelves lets you fix a chart when it comes out wrong.",
    ],
    syntax: `Bar chart        Columns: SUM(Sales)            Rows: Category
Line chart       Columns: MONTH(Order Date)     Rows: SUM(Sales)
Scatter plot     Columns: SUM(Sales)            Rows: SUM(Profit)     Detail: Product
Marks card       Color, Size, Label, Detail, Tooltip`,
    examples: [
      { title: "Sorted bar chart", code: `Rows: Category   Columns: SUM(Sales)   then click the sort-descending button`, note: "Horizontal bars with the largest first make the ranking readable immediately." },
      { title: "Trend split by segment", code: `Columns: MONTH(Order Date)   Rows: SUM(Sales)   Color: Segment`, note: "Colour draws one line per segment, so you can compare their trends on the same axis." },
    ],
    scenario: {
      title: "Which products make sales but lose money?",
      body: "A manager suspects some popular products are unprofitable. A scatter plot with sales on one axis and profit on the other, one mark per product, shows the answer directly: marks far to the right but below zero sell well and lose money.",
    },
    mistakes: [
      { mistake: "Accepting whatever Show Me produces.", fix: "Check which fields are on which shelf and whether each pill is discrete or continuous. That is where a wrong chart comes from." },
      { mistake: "Encoding too much at once with colour, size and shape together.", fix: "Each added encoding makes a chart harder to read. Use one or two, and only when they answer the question." },
    ],
    practice: [
      { title: "Build a chart from a description", difficulty: "Easy", prompt: "Describe the shelves for a chart of average discount by region, as vertical bars.", hints: ["Vertical bars mean the measure runs up the Rows shelf.", "The dimension goes on Columns.", "Change the aggregation from SUM."], solution: "Region on Columns and Discount on Rows, with the pill's aggregation changed to Average so it reads AVG(Discount).", explanation: "The dimension creates one bar per region and the measure sets the height. Discount is a rate, so it is averaged, not summed." },
      { title: "From bars to a comparison", difficulty: "Medium", prompt: "You have monthly sales as one line. How do you compare this year with last year on the same chart?", hints: ["You want two lines sharing a January-to-December axis.", "The axis should show the month only, not the full date.", "Something must separate the years."], solution: "Put MONTH(Order Date) on Columns as a discrete month, SUM(Sales) on Rows, and YEAR(Order Date) on Color. Each year becomes its own line across the same twelve months.", explanation: "Using only the month part aligns both years on one axis, and colour distinguishes them." },
    ],
    interview: [
      { q: "How would you show the relationship between two measures?", a: "With a scatter plot: one measure on each axis and a dimension on Detail so each mark is one item. Adding a trend line helps show the direction of the relationship." },
      { q: "What is the Marks card used for?", a: "It controls how marks look and what detail they carry: colour, size, label, tooltip and level of detail. Placing a dimension on it can split the marks without changing the axes." },
    ],
    checks: [
      { q: "Which shelves give a horizontal bar chart of sales by category?", options: ["Columns: Category, Rows: SUM(Sales)", "Rows: Category, Columns: SUM(Sales)", "Both on Rows", "Both on Color"], answer: 1, why: "The measure on Columns makes bars extend horizontally, one per category on Rows." },
      { q: "What does dropping a dimension on Color do to a line chart?", options: ["Changes the total", "Draws one line per value of the dimension", "Removes the axis", "Filters the data"], answer: 1, why: "Colour splits the marks by that dimension, giving a separate line for each value." },
    ],
  },

  "tableau/filters": {
    summary: "Filters limit what a view shows. Tableau has several kinds, and they are applied in a fixed order that explains most surprising results.",
    objectives: ["Add dimension, measure and date filters", "Show a filter so viewers can use it", "Explain why the order of filters matters"],
    explanation: [
      "Dragging a field to the Filters shelf restricts the data in a view. A dimension filter keeps chosen categories. A measure filter keeps a range of values. A date filter can be a fixed range or relative, such as the last three months. Showing the filter puts a control on the view for readers to change.",
      "Tableau applies filters in a set sequence called the order of operations. Extract and data source filters come first, then context filters, then dimension filters, then measure filters. This matters for results such as a top ten: a normal dimension filter on region does not apply before the top ten is chosen unless you add it to context.",
    ],
    syntax: `Filters shelf            drag a field here to filter the view
Show Filter              right-click the pill to give viewers a control
Order of operations      Extract > Data source > Context > Dimension > Measure
Add to Context           right-click a filter so it applies before top-N and other filters
Apply to Worksheets      share one filter across several sheets`,
    examples: [
      { title: "Keep two regions", code: `Drag Region to Filters > tick North and West`, note: "Only rows from those regions are used. Totals in the view change accordingly." },
      { title: "A rolling date window", code: `Drag Order Date to Filters > Relative dates > Last 3 months`, note: "The window moves forward automatically, so the view stays current without editing." },
    ],
    scenario: {
      title: "Top ten customers within a region",
      body: "A regional manager wants the top ten customers in the West. With a top-ten filter on customer and an ordinary filter on region, Tableau finds the top ten overall and then keeps those in the West, perhaps only three. Adding the region filter to context makes it apply first, so the top ten is calculated within the West.",
    },
    mistakes: [
      { mistake: "Expecting a region filter to apply before a top-N filter.", fix: "Both are dimension filters and top-N is evaluated without the other. Add the region filter to context." },
      { mistake: "Filtering one sheet on a dashboard and assuming the others follow.", fix: "A filter belongs to one worksheet by default. Use Apply to Worksheets to share it." },
    ],
    practice: [
      { title: "Choose the filter type", difficulty: "Easy", prompt: "Which kind of filter do you use for each: (a) only Furniture and Technology, (b) orders with sales above 1,000, (c) the current year to date?", hints: ["Categories, numbers and dates each have their own filter dialog.", "One of these is a relative date filter.", "Sales above a value filters on a measure."], solution: "(a) A dimension filter on Category. (b) A measure filter on Sales with a minimum of 1,000. (c) A relative date filter on Order Date set to year to date.", explanation: "The field's type decides the filter type, and a relative date filter keeps moving with the calendar." },
      { title: "Explain a short top ten", difficulty: "Medium", prompt: "A view filtered to the East region and to the top ten products by sales shows only four products. Why, and how do you get ten?", hints: ["Which filter is applied first?", "The top ten is being chosen across all regions.", "There is a way to make one filter run earlier."], solution: "Tableau picks the top ten products across all regions and then the East filter removes those with no place in the East, leaving four. Right-click the Region filter and choose Add to Context, so the top ten is calculated from East rows only.", explanation: "Context filters run before top-N in the order of operations, which changes the set the top ten is drawn from." },
    ],
    interview: [
      { q: "What is a context filter and when do you need one?", a: "A filter that Tableau applies before other dimension filters, including top-N and fixed level-of-detail calculations. You need one when another filter should be evaluated only within the filtered subset." },
      { q: "What is Tableau's order of operations?", a: "The sequence in which filters and calculations are applied: extract filters, data source filters, context filters, dimension filters, measure filters, then table calculation filters. It explains why two filters can give a different result from the one expected." },
    ],
    checks: [
      { q: "Which is applied first?", options: ["Measure filter", "Dimension filter", "Context filter", "Table calculation filter"], answer: 2, why: "Of these, context filters come first in the order of operations." },
      { q: "A filter on a dashboard changes only one chart. Why?", options: ["The data is wrong", "By default a filter applies to a single worksheet", "Dashboards cannot be filtered", "The filter is a measure"], answer: 1, why: "Filters are per worksheet unless you apply them to other sheets." },
    ],
  },
};
