# Quantifying National Resilience: A Data-Driven Assessment Using the Resilience Recovery Score

## Overview
Understanding how nations withstand, absorb, and recover from disasters is a critical challenge in modern risk analytics. This project develops a data-driven framework for measuring national resilience using multisource global datasets spanning 1998–2023. By integrating disaster event records, macroeconomic growth indicators, and socio-institutional variables, the study introduces and evaluates the **Resilience Recovery Score (RRS)**. It explores why some countries bounce back rapidly from disasters while others remain trapped in prolonged economic stagnation.

For an in-depth breakdown of our methodology, data exploration, index failure analysis, and complete hypothesis evaluations, please read the full **[report](docs/Report.pdf)**.

## Key Insights & Visualisations
The analysis reveals that while economic development provides an enabling environment, **governance quality and modern administrative capacity act as a decisive multiplier** in accelerating post-disaster recovery.

Explore our interactive findings deployed via GitHub Pages, or view the static structural previews below:

### [Global Resilience Dashboard](pictures/dashboard.html)
A comprehensive, unified view integrating spatial, temporal, and relational dimensions of global resilience. It allows dynamic cross-filtering by hazard type, region, and year to explore how different components of resilience interact simultaneously.
![Global Resilience Dashboard](pictures/dashboard.png)

### [Choropleth Map: Risk & Resilience Gradients](pictures/geo_map.html)
Visualises the geospatial distribution of the RRS across nations. The continuous colour scaling makes it immediately clear that Western Europe and parts of East Asia maintain strong recovery capacity, while South Asia, Sub-Saharan Africa, and Latin America frequently display prolonged economic downturns following hazard events.
![Choropleth Map](pictures/geo%20maps%20for%20risk%20and%20resilience%20gradients.png)

### [Temporal Evolution of Resilience](pictures/line_chart.html)
Tracks how major world regions' post-disaster recovery capacities have fluctuated over the last 25 years (1998-2023). This highlights year-on-year volatility, showing that even economically stable regions experience deep structural vulnerability during compounded global shocks.
![Temporal Evolution of Resilience](pictures/Evolution%20of%20resilience.png)

### [Multivariate Scatter Plot](pictures/scatter_plot.html)
Investigates the structural relationship between human development (HDI), baseline GDP growth, and the Resilience Recovery Score. It clearly illustrates that prosperity (HDI) supports recovery, but does not guarantee it. Several high-HDI nations still plot poorly when governance structures are weak or strained.
![Multivariate Scatter Plot](pictures/scatter%20plot%20showing%20relationship%20between%20gdp%20and%20hdi.png)

## Conceptual Framework & Methodology
The project initially investigated three computational indicators:
1. **Disaster Impact Index (DII)**: Attempted to merge natural disaster records with GDP and demographics. It suffered from structural failure due to extreme numerical compression.
2. **Resilience Recovery Score (RRS)**: The most viable index, focusing on the differential GDP growth before and after disasters combined with governance and HDI metrics.

Data operations involved extensive data cleaning, multi-source fusion, and computation of recovery timelines. The fully merged and temporally aligned dataset (`RSS_v11.csv`) contains over 7,000 disaster-year observations. 
**For a detailed walkthrough of the scripts, data pipelines, and engineered features, see our [data processing guide](DATA_PROCESSING.md).**

## Major Findings & Hypotheses Validated

### Hypothesis A: The Development–Resilience Link
*Does higher economic development inevitably translate into stronger disaster recovery?*
**Results:** Partially supported. Higher levels of economic prosperity and Human Development (HDI) generally underpin a stronger baseline for recovery. However, development alone does not guarantee resilience. Numerous high-HDI states exhibit depressed RRS levels if recovery dynamics are sluggish or macroeconomic structure is fragile.

### Hypothesis B: The Disproportionate Leverage of Governance Capacity
*Does modern governance capacity have a stronger impact on the RRS than economic factors alone?*
**Results:** Strongly supported. Across maps, timelines, and scatter plots, governance emerges as the primary differentiator. Countries with advanced administrative coordination, effective early-warning infrastructures, and technological integration recover faster, even in the face of continuous severe hazards, far outpacing the advantages of pure economic wealth.

## Research Team

- [**Sameer Khan**](https://github.com/Sameer-Khan08) - [sameer.khan@gmail.com](mailto:sameer.khan@gmail.com)
  - Conducted data visualisation design and dashboard implementation.
  - Advised on data engineering strategies and statistical transformations.
  - Sourced 50% of the project datasets and co-authored the final report.

- [**Ibrahim Hussain**](https://github.com/ib-hussain) - [ibrahimbeaconarion@gmail.com](mailto:ibrahimbeaconarion@gmail.com)
  - Engineered datasets and managed multi-source data fusion (DII & RRS).
  - Designed the colour encodings and qualitative labels for the visualisations.
  - Sourced 50% of the project datasets.
  - Authored the abstract, introduction, methodology, and evaluation sections of the final report.

---

## Related Research

See also: 
- [Visualizations on Social & Electoral Trends](https://github.com/ib-hussain/social-electoral-dynamics)
- [Investigating the Secret To Happiness](https://github.com/ib-hussain/secret_to_happiness)