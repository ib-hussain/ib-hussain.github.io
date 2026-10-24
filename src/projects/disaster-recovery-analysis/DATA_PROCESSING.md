# Data Operations and Transformations

This document details the data engineering, cleaning, and merging operations performed to construct the computational indicators for disaster resilience, primarily focusing on the Disaster Impact Index (DII) and the Resilience Recovery Score (RRS). These operations prepared the final analytical datasets used in the [visualisations](pictures/dashboard.html).

## 1. Disaster Impact Index (DII) Operations
The operations for DII were executed in `DII/DataCleaningDII.ipynb` to standardise natural disaster records and integrate them with macroeconomic and demographic indicators.

### Standardisation
- **Date Formatting**: Extracted and standardised `Year`, `Start Month`/`Day`, and `End Month`/`Day` into unified `startDate` and `endDate` columns.
- **Geospatial Formatting**: Created a spatial `coordinates` column by combining `Latitude` and `Longitude`.
- **Population Data Normalisation**: Unified the population estimation columns from the UN World Population Prospects dataset and filtered out future projection years to keep only historical data up to 2024.

### Data Merging & Feature Engineering
- **Macroeconomic Integration**: Merged the cleaned disaster records with "GDP per capita (PPP)" data using an inner join on Country Code and Year.
- **Demographic Integration**: Merged the dataset with the cleaned population data.
- **Affected Population Metric**: Computed a new feature, `affected_population`, derived by calculating the percentage of `Total Deaths` relative to the total national `population`. 
- **Final Output**: The resulting dataset (`DII_v5.csv`) contained fully integrated event, economic, and demographic data.

## 2. Resilience Recovery Score (RRS) Operations
The operations for RRS were executed in `RRS/DataCleaningRRS.ipynb` to model the post-disaster GDP rebound dynamics and integrate them with institutional and human development scores.

### Standardisation
- **Governance Metrics**: Standardised the Worldwide Governance Indicators (WGI). Shifted the `GovIndex` by adding 2.5 and scaling by 20. Converted standard errors into percentage values (`ErrorPercent`).
- **Human Development Index (HDI)**: Converted the HDI values to a percentage scale (`HDI_percent`).
- **Geodata Enrichment**: Mapped standard ISO-3 country codes to full country names using the `pycountry` library.

### Macroeconomic Integration & Recovery Engineering
- **Initial Merging**: Performed sequential inner joins aligning Governance Index, GDP per capita annual growth, and HDI data by ISO code and Year.
- **Recovery Time Calculation**: 
  - Computed a pre-disaster GDP growth baseline using the average growth of the 3 years preceding each disaster.
  - Calculated `recovery_years`, representing the number of years required for post-disaster GDP growth to return to or exceed the pre-disaster baseline. Non-recovering states were capped at the current year differential.
- **Pre & Post GDP Averages**: Engineered `GDP_GrowthPre` (3-year mean before disaster) and `GDP_GrowthPost` (3-year mean after disaster).

### RRS Computation
The final Resilience Recovery Score (RSS) was computed using the formal project equation:
`RSS = ((GDP_GrowthPost - GDP_GrowthPre) / recovery_years) + ((HDI + GovIndex_ErrorPercent) / 2)`
Missing values across mandatory macroeconomic and institutional features were dropped, resulting in `RSS_v9.csv`.

## 3. Final Dataset Integration
To produce the final master dataset for interactive visual analysis, `DII_v5.csv` and `RSS_v9.csv` were row-synchronised:
- Filtered records to post-1998 events.
- Generated intra-year row identifiers (`ID`) to account for multiple disasters per country per year.
- Merged via inner join on `Year`, `Country`, and `ID`, culminating in `RSS_v11.csv` (7,038 valid disaster-year observations).

---
Explore the results of these data operations in our interactive visualisations:
- [Interactive Dashboard](pictures/dashboard.html)
- [Global Resilience Map](pictures/geo_map.html)
- [Regional Trends over Time](pictures/line_chart.html)
- [HDI vs GDP Scatter Plot](pictures/scatter_plot.html)
