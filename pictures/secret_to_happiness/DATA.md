# Data Processing Methodology

> Part of the [Secret to Happiness](../README.md) research project — a multi-dimensional investigation into the structural determinants of global well-being across 150+ countries and 13 years (2011–2023).

---

## Overview

This directory contains the complete data engineering pipeline for the project. The [`DataProcessing.ipynb`](DataProcessing.ipynb) notebook systematically ingests, validates, reshapes, and enriches 12+ raw datasets from multiple international sources (World Bank, Our World in Data, Transparency International, and the UN) into a unified, analysis-ready panel.

The pipeline prioritises **statistical integrity, temporal consistency, and reproducibility** — ensuring that every merged variable shares the same `[Country, Year]` primary key before entering any analytical or visual workflow.

---

## Source Datasets & Transformations

| # | Dataset | Source | Variable(s) Produced | Output File |
|---|---------|--------|----------------------|-------------|
| 1 | Corruption Perceptions Index | Transparency International | `Corruption_Index` | `cpi2024.csv` |
| 2 | Education Expenditure | World Bank | `Education_Expenditure_Pct_GDP` | `Education Expenditure.csv` |
| 3 | Fertility Rate | World Bank | `Fertility_Rate` | `Fertility_Rate_Merged.csv` |
| 4 | Final Consumption Per Capita | World Bank | `Consumption_Per_Capita` | `Final_Consumption_Per_Capita_Merged.csv` |
| 5 | GDP per Capita (PPP) | Our World in Data | `GDP_per_capita_PPP`, `Life_Satisfaction` | `GDP_Happiness_Panel.csv` |
| 6 | Health Expenditure Per Capita | World Bank | `Health_Expenditure_Per_Capita` | `Health_Expenditure_Per_Capita_Merged.csv` |
| 7 | Intentional Homicides | World Bank | `Homicide_Rate` | `Homicide_Rate_Merged.csv` |
| 8 | Inflation of Consumer Prices | Our World in Data | `Inflation_Consumer_Prices_Annual_Pct`, `Inflation_Category` | `improved_inflation_data.csv` |
| 9 | Internet Users | World Bank / ITU | `Internet_Users_Pct` | `merged_internet_users_data.csv` |
| 10 | Life Expectancy at Birth | Our World in Data | `Life_Expectancy`, `LE_Yearly_Change` | *(enhanced in memory)* |
| 11 | Mean Years of Schooling | UNDP HDI | `Mean_Years_Schooling` | *(enhanced in memory)* |
| 12 | Happiness (Cantril Ladder) | Our World in Data | `Happiness_Score`, `Global_Percentile_Rank` | `enhanced_happiness_data.csv` |
| 13 | Overweight / Obesity Prevalence | Our World in Data | `Overweight_Pct` | `enhanced_obesity_data.csv` |
| 14 | Population | World Bank | `Population`, `Yearly_Growth_Rate` | `merged_population_data.csv` |
| 15 | Poverty Rate | Our World in Data | `Poverty_Rate` | `enhanced_poverty_data.csv` |
| 16 | Suicide Rate | WHO / Our World in Data | `Suicide_Rate` | `merged_suicide_data.csv` |

---

## Core Processing Operations

### 1. Format Standardization

Raw exports from Transparency International arrive as tab-separated text files. The pipeline converts these before any further processing:

```python
df = pd.read_csv("cpi2024_raw.txt", sep="\t", engine="python")
df.to_csv("cpi2024.csv", index=False, encoding="utf-8")
```

All downstream files are output in `utf-8` encoding. Inputs from the World Bank are handled with explicit `cp1252` overrides to prevent encoding errors on legacy exports.

---

### 2. Wide-to-Long Reshaping (World Bank format)

World Bank datasets distribute temporal data in "Wide" format — each year occupies a column header such as `2011 [YR2011]`. The pipeline standardizes all of these into a unified "Long" format using `pandas.DataFrame.melt()`:

```python
year_cols = [col for col in df.columns if any(y in col for y in ['199', '200', '201', '202'])]

df_long = df.melt(
    id_vars=['Country Name', 'Country Code'],
    value_vars=year_cols,
    var_name='Year',
    value_name='Variable_Name'
)

# Extract integer year from labels like "2011 [YR2011]"
df_long['Year'] = df_long['Year'].str.extract(r'(\d{4})').astype(int)
```

This transformation is applied to: Education Expenditure, Fertility Rate, Consumption Per Capita, Health Expenditure, Homicide Rate, and Population.

---

### 3. Cross-Source Dataset Merging

Each panel is independently reshaped and then merged on `[Country, Year]` using outer joins, preserving maximum geographic coverage without introducing false zeros:

```python
merged = pd.merge(
    df_meta_long, df_data_long,
    on=['Country Name', 'Country Code', 'Year'],
    how='outer',
    suffixes=('', '_drop')
)
merged = merged.drop(columns=[c for c in merged.columns if c.endswith('_drop')])
```

---

### 4. Statistical Feature Engineering

Beyond raw values, several datasets are enriched with derived analytical features to support time-series and comparative analysis:

| Feature Type | Examples |
|---|---|
| Year-over-year change | `LE_Yearly_Change`, `Yearly_Change` |
| Rolling averages | `LE_5yr_Avg`, `Rolling_Avg_3yr`, `Inflation_3yr_Avg` |
| Period-over-period change | `LE_5yr_Change`, `LE_10yr_Change`, `Change_5yr`, `Decade_Change` |
| Global percentile rank | `Global_Percentile_Rank` (within-year ranking) |
| Deviation from global mean | `Deviation_From_Global_Avg` |
| Categorical flags | `Inflation_Category` (Deflation / Low / Moderate / High / Hyperinflation) |
| Threshold flags | `High_Obesity`, `Very_High_Happiness`, `Extreme_Poverty` |

For Life Expectancy, growth rate acceleration and deviation from the global yearly mean are computed to distinguish structural improvements from developmental stagnation.

---

### 5. Inflation Categorisation

Consumer price inflation is not treated as a linear scalar. The pipeline assigns a categorical label to each annual observation:

```python
def categorize_inflation(value):
    if value < 0:   return 'Deflation'
    elif value < 2: return 'Low'
    elif value < 5: return 'Moderate'
    elif value < 10: return 'High'
    else:           return 'Hyperinflation'
```

A 3-year rolling average (`Inflation_3yr_Avg`) and year-over-year directional flag (`YoY_Increase`) are also appended, enabling the analysis to distinguish episodic price shocks from structural instability.

---

### 6. Outlier Retention Policy

Rather than blindly removing statistical outliers, the pipeline applies **contextual review**. Extreme values are preserved when they are factually plausible:

- Hyperinflation episodes (e.g., Venezuela, Zimbabwe) are **retained** as they represent genuine economic phenomena relevant to the happiness analysis.
- Rows are only removed when the critical index columns (`Country`, `Year`, primary variable) are simultaneously absent.

---

## Data Quality Notes

- **Missing value handling**: Forward and backward filling (`ffill`, `bfill`) is applied within country groups for variables with expected temporal continuity. Targeted imputation is used for lagged variables.
- **Regional aggregates removed**: GDP panel and other OWID datasets contain regional entries (e.g., "Sub-Saharan Africa"). These are removed by filtering for rows with a valid ISO `Code` value.
- **Duplicate deduplication**: Population data merged from two complementary World Bank exports is de-duplicated by `[Country, Country Code, Year]` before concatenation.

---

## Final Analysis Panel

All processed datasets are joined downstream into the primary analysis file used throughout the visualisation and modelling notebooks:

**`HappinesssGlobalData_v6.csv`** — located in the root directory.

This file serves as the single source of truth for all analytical work and contains:
- ~150 countries across all world regions
- 13-year temporal span (2011–2023)
- 20+ harmonised variables across economic, institutional, demographic, health, and well-being dimensions

---

[Back to Main Project Overview](../README.md)
