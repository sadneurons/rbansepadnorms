# README FILE for Regression-Based Normative Formulae for the Repeatable Battery for the Assessment of Neuropsychological Status (RBANS) from the European Prevention of Alzheimer’s Disease Study (EPAD);   

Dunne, Ritchie, Burns 2022

## Introduction
The paper was prepared using the ADDI workbench (https://portal.addi.ad-datainitiative.org/) which provides RStudio and a relatively up-to-date version of R. The data are provided as .csv files and extracted to **"tibbles"** using the *tidyverse* library of packages. You can apply to access this data, and if you include it in the same directory as the files below, then the scripts **should** just work.

## Contents
## Descriptions
functions.R: *convenience functions*  
eda.R : *main data analysis script*  
DraftRBANSEPADNormsAug2022.Rmd : *Manuscript in RMarkdown*  
load_packages.R : *convenience script to load packages*  
required_packages.R : *list of requried packages*  
SupplementaryTables.html : *HTML rendering of the 19 supplementary tables including the ECDF lookups*  
SupplementaryTables.Rmd : *RMarkdown file for creation of supplementary tables*  
Tables.Rmd: *RMarkdown file for creation of main tables (1-4)*  
references.bib : *BIBTEX format references*  
README.html : *the html version of this file*  
README.md: *this file*  
model_checking.html : *Heavy graphical model checking detail*

## Structure and run order
The file 'eda.R' contains the main extraction, cleaning and analysis functions. It is obviously difficult to understand all of these without access to the data, but the file is provided with line-by line comments to guide the reader. The Manuscript File "DraftRBANSEPADNormsAug2022.RMD" uses the *source* command to run *'eda.r'* as do the other *RMD* files, in order to prevent de-linking the data. This is not the most efficient method of running the files, but it does mean that with access to the data, all tables and supplementary tables can be recreated using simply the *knit* command/button in RStudio. If it means your having another cup of coffee while the script builds then... I'm buying.

## Practicalities
I recommend for the purposes of your own time and effort that you knit the documents to HTML format rather than *docx* as I have not included the template files used to create line and page numbering, double spacing etc. Your knit document won't look very nice and may be difficult to read. Although, the content should be 99% the same and the tables and data will obviously all be identical, but it will just be nicer to look at in HTML and you can use your favourite browser.

## Model checking
The model checking script produces a 40MB graphics-laden file. I did not include this in the paper submission but it is here. Frank Harrell at Vanderbilt and many others have very strong opinions on the subjective nature of graphical model checking procedures. To quote Frank "In the evening I think: That will do and then I look again in the morning and I'm deeply dissatisfied". So they are subjective. However, for the main analyses, on the Index values, the assumption of normality will be (is) met by the underlying data because the original manual makes sure the indices are normed. All we're doing is adding predictors. Leverage looks reasonable for these too. The best defense of the analysis is that it is strongly theoretically driven by the previous work of Duff and Olaithe, and no peeking, p-hacking or covariate wrangling was necessary.

## Roads not taken
For the other predicted variables, another option would be quantile regression. Also, the models are linear, and might benefit from additional complexity using restricted cubic spline functions to allow age, for example, to have non-linear effects. Another option other than the lookup tables would be nomograms. However, I felt that these levels of complexity would be a barrier to understanding of people using the calculator (for example), and that transparency was key. 

## Stars
Please forgive me. I would have liked not to use these in the tables, and I personally object to their ubiquity, but my experience is that their absence is more noted by reviewers than their presence. They are easily ignored, and as I mention in the text, the purpose of the models is *prediction*, not the measurement of impact of covariates, although I have indulged in that a little, to my shame. 

## References
References are provided as a .bib file. To read these seperately you can use JabREF (https://www.jabref.org/)  or similar free software. A significant number of references in this file do not appear in the document but they have been included for the reader's convenience and for the purposes of completeness of scholarship.

## Github
The ADDI workbench does not allow Github access. This means I have created the Github site **after** finishing the data analysis. This may be frustrating if you want to see a blow-by-blow rehashing or line-audit of the coding process. However, the Javascript-powered calculator will be made available on the Github *pages* site for the forseeable future, along with all these scripts, and that means that future updates can be tracked, at least. OR you can fork it and make it look prettier, or download it for off-line use if you wish.

## Calculator
The calculator uses the regression norms published in Duff's work, as well as the three versions here published and will also calculate the original Randolph norms for comparison. It uses Plotly for graphing, which means graphs can be stored/downloaded locally for use in patient reports (for example). **THE END USER IS RESPONSIBLE FOR CHECKING THE ACCURACY OF ALL CALCULATIONS AND NO CLAIM IS MADE ABOUT THE USE OF THIS CALCULATOR AS A MEDICAL DEVICE.** It is provided as a convenience. The calculator uses client-side Javascript which means no data will leave the computer on which you enter it. There is no function to add patient or participant identifiers. Such additional functionality is left up to the end user. Also my JS and CSS is fairly beginner-level, so if you want to contribute pull requests to make it either fancier looking or more efficient without breaking it, please feel free.

## Licence
The EPAD data were difficult and expensive to collect. It is perfectly reasonable that access is limited to sincere scientists with specific projects, to avoid the kind of p-hacking and fishing that goes on in large healthcare datasets. However, the Javascript code in the calculator, all my R code, and anything else you can find here is all open source and released to you under the MIT licence below:

---
**Copyright 2022 Dr. Ross A. Dunne**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

--- 
