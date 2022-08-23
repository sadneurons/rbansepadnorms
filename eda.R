#----------------------------------------------------------------------------
#
# Regression-based normative data for the Repeatable Battery for the Assessment
# of Neuropsychological Status  (RBANS) from the European Prevention of 
# Alzheimer Disease Study (EPAD)
#
#=============================================================================
# TABLE OF CONTENTS
#=============================================================================
# LOAD FUNCTIONS
# LOAD LIBRARIES
# IMPORT DATA
# CLEAN DATA
# - inclusion / exclusion
# - character to numeric conversion
# MERGE DATA
# BUILD TABLE ONE
# ==============
# BUILD GAUSSIAN MODELS
# CHECK GAUSSIAN MODELS
# BULD TABLES 2-4 FOR INDICES
# BETA REGRESSION FOR SKEWED VARIABLES
# MAKE ECDF LOOKUP TABLES FOR SKEWED VARIABLES
# OUTPUT SUPPLEMENTARY TABLES 
# ============================================================================#


# LOAD FUNCTIONS AND LIBRARIES

source('./functions.R')
# install necessary packages
#source('required_packages.R') --- # uncomment for first run
## load required packages
source('./load_packages.R')

##------------ READ IN THE DATA --------------## 

#### read in RBANS file and seperate into A, B and C versions
PATH = "/files/rbans_epad_norms/fair-epad-rbans--norms-2377/"
rbans <- read_csv(paste(PATH, 'v_imi_epadlcs_rbans.csv', sep="")) 
rbans_a <- rbans %>%  filter(visit=="V1") # first visit RBANS A
rbans_b <- rbans %>%  filter(visit=="V2") # second visit RBANS B
rbans_c <- rbans %>%  filter(visit=="V3") # third visit RBANS C

##--- read in MMSE data in order to better 
## -- describe the sample and exclude scores >24
#--- select only necessary column
mmse <- read_csv(paste(PATH, "v_imi_epadlcs_mmse.csv", 
                       sep="")) 
# not done at visit 2
mmse_a <- mmse %>% filter(visit=="V1") %>% select(patient_id, mmse_total)
mmse_c <- mmse %>% filter(visit=="V3") %>% select(patient_id, mmse_total) 

##--- read in patient attributes (demographics)
demog <- read_csv(paste(PATH, "v_imi_epadlcs_socio_demographics.csv", 
                        sep="")) %>% 
    select(patient_id, sex, age_years, age_months, 
           years_education, ethnicity, site_name) 

##--- read in the cdr total/global score
cdr_glob <- read_csv(paste(PATH, "v_imi_epadlcs_cdr.csv", sep=""))
cdr_glob_a <- cdr_glob %>% filter(visit=="V1") %>%  
  select(patient_id, cdr_global_score)  # just use global score  
cdr_glob_b <- cdr_glob %>%  filter(visit=="V2") %>%  
  select(patient_id, cdr_global_score)  # just use global score  
cdr_glob_c <- cdr_glob %>%  filter(visit=="V3") %>%  
  select(patient_id, cdr_global_score)  # just use global score  


##--- read in csf results to exclude those with Elecsys AB < 1000
##---- or ptau181 >27
csf <- read_csv(paste(PATH, "v_imi_epadlcs_csf.csv",sep=""))

### ---- CLEANING ------------------## 
## if the CSF was above the ceiling (1700) it was recalculated manually
csf$recalc <- gsub(" PG/ML",  "", x=csf$abeta_1_42_comments) # strip units
csf$recalc <- gsub("Recalculated result = ",  "", x=csf$recalc) # strip text
csf$recalc <- as.numeric(csf$recalc) # coerce to numeric
csf$abeta_1_42_result <- csf_cleaner(csf$abeta_1_42_result) #strip "<" and ">"
csf$abeta_1_42_result<- replace_function(csf$abeta_1_42_result, csf$recalc) # replace 1700 with recalculated answer
## clean the ptau result
csf$ptau_result
csf$ptau_res_new <- gsub( "<8", "8", csf$ptau_result) |> as.numeric()
head(csf)

# select out csf values for visit 1
csf_select_a <- csf %>%  filter(visit=="V1") %>%   select(patient_id, ptau_res_new, ttau_result, abeta_1_42_result) 
# select out csf values for visit 3 (nobody had CSF at visit 2 )
csf_select_c <- csf %>%  filter(visit=="V3") %>%   select(patient_id, ptau_res_new, ttau_result, abeta_1_42_result) 
csf_samples_visit_3 <- sum(!is.na(csf_select_c$abeta_1_42_result)) # how many ppl had new samples at visit 3?



##--- Read in medical history ---------------------
medhx <- read_csv(paste(PATH, "v_imi_epadlcs_medical_history.csv",sep="")) 
excluded_due_to_HI <- medhx %>% filter(grepl("Head injury", medical_history_term)) %>% select(patient_id)

#----- Check medications --------------------------------------
medications <- read_csv(paste(PATH, "v_imi_epadlcs_current_medication.csv",sep="")) 
# make a list of antipsychotics
antipsychotics <- c("QUETIAPINE", "FLUPENTHIXOL", "OLANZAPINE",
                    "CLOZAPINE", "PROMAZINE", "RISPERIDONE", "ARIPIPRAZOLE", 
                    "PALIPERIDONE")
# exclude people on that list
ANTIPSYCH <- medications[medications$whodd_prefname %in% antipsychotics, 1]
# or on benzos
BENZOS <- medications %>% 
  filter(grepl("*azepam", 
               whodd_prefname, 
               fixed=FALSE, 
               ignore.case=TRUE)) %>% 
  select(whodd_drugcode) %>%
  unique()

##########---- Simplify and standardise Ethnicity column for output -- ###################
demog$ethnicity <- as.factor(demog$ethnicity)
levels(demog$ethnicity) <- c("Asian", "Black/African", "Caucasian/White", "Caucasian/White", 
                                        "Asian", "Mixed race", "Hispanic", "Hispanic", "Hispanic", 
                                        "Black/African", "Mixed race", "Black/African", "Other", "Asian", "Other", 
                                        "Caucasian/White")
##########--- Merge the dataframes ---#####################
merge_function <- function(rbans_df, cdr_df, csf_df, mmse_df){
  merge_rbans <- merge(demog, rbans_df, by="patient_id")
  merge_rbans <- merge(cdr_df, merge_rbans, by="patient_id")
  merge_rbans <- merge(csf_df, merge_rbans, by="patient_id")
  merge_rbans <- merge(mmse_df, merge_rbans, by="patient_id")
  merge_rbans$HI <- merge_rbans$patient_id %in% excluded_due_to_HI$patient_id
  merge_rbans$BENZOS <- merge_rbans$patient_id %in% BENZOS
  merge_rbans$ANTIPSYCH <- merge_rbans$patient_id %in% ANTIPSYCH
  return(merge_rbans)
}

merge_rbans_a <- merge_function(rbans_a, cdr_glob_a, csf_select_a, mmse_a)
merge_rbans_b <- merge_function(rbans_b, cdr_glob_b, csf_select_a, mmse_a) # not an error - csf/mmse not done at time b
merge_rbans_c <- merge_function(rbans_c, cdr_glob_c, csf_select_c, mmse_c) 

str(merge_rbans_a) #2096 observations of 38 variables
str(merge_rbans_b) #1596 observations of 38 variables
str(merge_rbans_c) #1225 observations of 38 variables
#-----------------------------------------------------------
##---remove visit variable as it occurs mutliple times
merge_rbans_a <- merge_rbans_a %>% select(-starts_with('visit')) 
merge_rbans_b <- merge_rbans_b %>% select(-starts_with('visit')) 
merge_rbans_c <- merge_rbans_c %>% select(-starts_with('visit')) 
# ---------------------------------------------------------
## --- FINISHED MERGING -----------------------------------
#################
#-- create a useful vector of subtest (and index) names for the tables
subtest_names <- c("List learning", "Story memory", "Figure copy",
                   "Line orientation", "Picture naming", "Semantic Fluency",
                   "Digit span", "Coding", "List recall", "List recognition",
                   "Story recall", "Figure recall", "Immediate Memory", 
                   "Visuo/constructional",
                   "Language", "Attention", "Delayed Memory")

#--- FURTHER CLEAN THE DATA ----------------------------------------
## On inspection 995 is  a CODE (?MISSING), not a number
## let's replace it with NA
# are there 995s in columns other than the RBANS columns? No
rbans_a_cleaned <- as_tibble(lapply(merge_rbans_a, replace_995)) # see functions.R
rbans_b_cleaned <- as_tibble(lapply(merge_rbans_b, replace_995)) # see functions.R
rbans_c_cleaned <- as_tibble(lapply(merge_rbans_c, replace_995)) # see functions.R
# filter ** in ***  included values

filter_wrapper <- function(df){
  # filter in  CDR scores == 0
  cdr_frame <- df %>% filter(cdr_global_score==0)
  # filter in  MMSE scores greater than or equal to 24
  cdr_frame <- cdr_frame %>% filter(mmse_total>=24)
  # filter in only people whose age is not "na"!
  cdr_frame <- cdr_frame %>% filter(!is.na(age_years))
  #-- filter in  people without a history of Head Injury
  cdr_frame <- cdr_frame %>% filter(!HI)
  ##-- filter in  those NOT on benzos
  cdr_frame <- cdr_frame %>% filter(!BENZOS)
  ##- filter in those NOT on antipsychotics
  cdr_frame <- cdr_frame %>% filter(!ANTIPSYCH)
  # -- return the value
  return(cdr_frame)
}

#  I know I could have done this as a list with lapply()
# but sometimes explicit is better than implicit
### filter **in** ABeta negative AND ptau negative participants by patient ID
### generate a list of participants positive each time CSF was analysed
negative_V1 <- rbans_a_cleaned %>% filter(abeta_1_42_result>=1000 & ptau_res_new<=27) %>% select(patient_id)
negative_V3 <- rbans_c_cleaned %>% filter(abeta_1_42_result>=1000 & ptau_res_new<=27) %>% select(patient_id)
## -- include those negative at V1 (filter IN)
abeta_negative_a <- filter_wrapper(rbans_a_cleaned) %>% filter(patient_id %in% negative_V1$patient_id)
#### include those negative at V1 (Filter IN)
abeta_negative_b <- filter_wrapper(rbans_b_cleaned) %>% filter(patient_id %in% negative_V1$patient_id)
### this one is more tricky. Include those currently negative AND who were negative at V1
abeta_negative_c <- filter_wrapper(rbans_c_cleaned) %>% filter(abeta_1_42_result>=1000 || is.na(abeta_1_42_result)) %>% 
  filter(patient_id %in% negative_V1$patient_id) %>% filter(ptau_res_new<=27 || is.na(ptau_res_new)) # assuming highly unlikely to become CSF +ve in 12 months!

dim(abeta_negative_a)
dim(abeta_negative_b)
dim(abeta_negative_c)
#--------FINISHED CLEANING ----------------------------------------------------
index_names <- abeta_negative_a %>% select(starts_with('rbans')) %>% names()
index_names <- rev(index_names) # remember later you reversed them!

# get a clean list of model names
clean_index_names <- gsub("_", " ", index_names)
clean_index_names <- gsub("rbans ", "", clean_index_names) %>%
  R.utils::capitalize()


###--------------------------- MAKE TABLE ONE ----------------------###

rbans_a_cleaned$Included <- rbans_a_cleaned$patient_id %in% abeta_negative_a$patient_id
rbans_b_cleaned$Included <- rbans_b_cleaned$patient_id %in% abeta_negative_b$patient_id
rbans_c_cleaned$Included <- rbans_c_cleaned$patient_id %in% abeta_negative_c$patient_id

maxage <- max(abeta_negative_a$age_years, na.rm=T)
minage <- min(abeta_negative_a$age_years, na.rm=T)

max_t_tau <- max(as.numeric(abeta_negative_a$ttau_result))
median_t_tau <- median(as.numeric(abeta_negative_a$ttau_result))
sd_t_tau <- sd(as.numeric(abeta_negative_a$ttau_result))
### YOU NEED TO PUT THESE ALL IN ONE BIG TABLE 
## FOR THE TABLES PACKAGE TO USE IT PROPERLY

tibble_one_a <- rbans_a_cleaned %>% select (mmse_total, cdr_global_score, 
                                      sex, age_years, years_education, 
                                      abeta_1_42_result, ptau_res_new, HI, ethnicity, Included) %>% 
  mutate(cdr_global_score = as_factor(cdr_global_score),
         Included = as_factor(Included),
         mmse_total = as.numeric(mmse_total))


tibble_one_a$Visit <- rep("Visit 1", 2096)
tibble_one_b <- rbans_b_cleaned %>% select (mmse_total, cdr_global_score, 
                                            sex, age_years, years_education, 
                                            abeta_1_42_result, ptau_res_new, HI, ethnicity, Included) %>% mutate(cdr_global_score = as_factor(cdr_global_score),
                                                                                                   Included = as_factor(Included),
                                                                                                   mmse_total = as.numeric(mmse_total))
tibble_one_b$Visit <- rep("Visit 2", 1596)

tibble_one_c <- rbans_c_cleaned %>% select (mmse_total, cdr_global_score, 
                                            sex, age_years, years_education, 
                                            abeta_1_42_result, ptau_res_new, HI, ethnicity, Included) %>% mutate(cdr_global_score = as_factor(cdr_global_score),
                                                                                                   Included = as_factor(Included),
                                                                                                   mmse_total = as.numeric(mmse_total))
tibble_one_c$Visit <- rep("Visit 3", 1225)

tibble_1 <- rbind(tibble_one_a, tibble_one_b, tibble_one_c)


names(tibble_1)<-c("MMSE", "CDR Total", "Sex", "Age (Yrs)", 
                   "Years of education", "CSF Abeta", "CSF pTau181", "Head Injury", "Ethnicity", "Included", "Visit")
levels(tibble_1$Included)<-c("Excluded", "Included")

table_one <- tibble_1 %>%  tbl_strata(strata = Visit, ~.x %>%
                             tbl_summary(by = Included, missing = "always") %>%
                             modify_header(all_stat_cols() ~ "**{level}**")
                         ) %>% italicize_levels() %>% as_flex_table()

table_one

##########################################################################
# ----- Create Linear Mixed Effect Models with random intercept for site--
#
#       Kludge below to apply the models to each dataframe
#
##########################################################################
formulas <- lapply(index_names,
                   reformulate, # this is a very handy little function, if a bit of a kludge
                   termlabels="sex + age_years + age_years + years_education + (1|site_name)")

normal_models_a <- lapply(formulas, FUN=lmer, data=abeta_negative_a)
normal_models_b <- lapply(formulas, FUN=lmer, data=abeta_negative_b)
normal_models_c <- lapply(formulas, FUN=lmer, data=abeta_negative_c)
names(normal_models_a) <-  clean_index_names
names(normal_models_b) <-  clean_index_names
names(normal_models_c) <-  clean_index_names

# table two ( [13:19] denotes just the INDEX models, not the subtests)
table_two <- normal_models_a[13:19] %>% modelsummary(stars=TRUE, coef_rename=c(
  "sexm" = "Male sex", "age_years" = "Age (yrs)", "years_education" = "Education (yrs)"))

# table_three
table_three <- normal_models_b[13:19] %>% modelsummary(stars=TRUE, coef_rename=c(
  "sexm" = "Male sex", "age_years" = "Age (yrs)", "years_education" = "Education (yrs)"))

# table_four

table_four <- normal_models_c[13:19] %>% modelsummary(stars=TRUE, coef_rename=c(
  "sexm" = "Male sex", "age_years" = "Age (yrs)", "years_education" = "Education (yrs)"))

#### see model checking markdown file for model checking 

 #### - Time between assessments ------------
dates_A <- rbans_a_cleaned %>% select(patient_id, assessment_date)
dates_B <- rbans_b_cleaned %>% select(patient_id, assessment_date)
dates_C <- rbans_c_cleaned %>% select(patient_id, assessment_date)

dates_AB <- merge(dates_A, dates_B, by="patient_id")
str(dates_AB)
dates_BC <- merge(dates_B, dates_C, by="patient_id")
str(dates_BC)

dates_AB<- dates_AB %>% mutate(days_between = assessment_date.y - assessment_date.x )
dates_BC<- dates_BC %>% mutate(days_between = assessment_date.y - assessment_date.x )

time_a_to_b <- mean(dates_AB$days_between, na.rm=TRUE)
sd_a_to_b <- sd(dates_AB$days_between, na.rm=TRUE)

time_b_to_c <- mean(dates_BC$days_between, na.rm=TRUE)
sd_b_to_c <- sd(dates_BC$days_between, na.rm=TRUE)

########################################################################
#
#   MODEL CHECKING FOR ABOVE IS IN MODELCHECKING.RMD
#   AS IT WAS 40MB PRINTED OUT FEEL FREE TO EMAIL FOR 
#   A PRINTED VERSION ross.dunne@manchester.ac.uk
#
#======================================================================#
#
#### ---- now use the beta zero inflated models for the four we've found to have terribly 
#### ---- left skewed residuals on visual inspection
## predicted values form this model
# will take the form: inv.logit(intercept + B.age + B.sex + B.educational_attainment) x 20
# [ x 20 due to scaling for the beta regression (initially divided by 20.0001 to scale)]

run_betas <- function(df){

beta_model_figcopy <- glmmTMB(rbans_figure_copy/20.0001 ~ sex + age_years +  years_education + (1|site_name), 
                           family=beta_family(link="logit"), ziformula=~1,  data=df, na.action=na.exclude) 

beta_model_line <- glmmTMB(rbans_line_orientation/20.0001 ~ sex + age_years +  years_education + (1|site_name), 
                           family=beta_family(link="logit"), ziformula=~1,  data=df, na.action=na.exclude) 

beta_model_listrecog <- glmmTMB(rbans_list_recognition/20.0001 ~ sex + age_years +  years_education + (1|site_name), 
                           family=beta_family(link="logit"), ziformula=~1,  data=df, na.action=na.exclude) 

beta_model_picnaming <- glmmTMB(rbans_picture_naming/10.0001 ~ sex + age_years +  years_education + (1|site_name), 
                                family=beta_family(link="logit"), ziformula=~1,  data=df, na.action=na.exclude)

returned_list <- list(beta_model_figcopy, beta_model_line, beta_model_listrecog, beta_model_picnaming)
return(returned_list)
}


betas_list_a <- run_betas(abeta_negative_a) # gives eigenvalue warning
betas_list_b <- run_betas(abeta_negative_b)
betas_list_c <- run_betas(abeta_negative_c)

betas_list_a %>% lapply(performance) 
betas_list_b %>% lapply(performance) 
betas_list_c %>% lapply(performance) 

betas_list_a %>% lapply(summary)
betas_list_b %>% lapply(summary)
betas_list_c %>% lapply(summary)

model_names_betas <- c("Figure copy", "Line orientation", "List recognition", "Picture naming")
names(betas_list_a)<- model_names_betas
names(betas_list_b)<- model_names_betas
names(betas_list_c)<- model_names_betas


supplementary_table_x <- modelsummary(betas_list_a, coef_omit = "Intercept", gof_map = NA, stars=TRUE, 
             coef_rename=coef_rename, output='flextable') 

supplementary_table_x


supplementary_table_y <- modelsummary(betas_list_b, coef_omit = "Intercept", gof_map = NA, stars=TRUE, 
                                      coef_rename=coef_rename, output='flextable') 

supplementary_table_y

supplementary_table_z <- modelsummary(betas_list_c, coef_omit = "Intercept", gof_map = NA, stars=TRUE, 
                                      coef_rename=coef_rename, output='flextable') 

supplementary_table_z


  #--------------- Generate ECDFs --------------------
# ---- But only on the significant divisions

abeta_negative_a$decade <- floor(abeta_negative_a$age_years/10) %>% as.character() %>% factor(labels=c("50-59", "60-69","70-79","80-89"))
abeta_negative_a$years_education_grouped <- cut(abeta_negative_a$years_education, c(5, 10, 15, 20, 25, 35)) %>%
  factor(labels=c("5-9", "10-14","15-19","20-25", "25+"))


abeta_negative_b$decade <- floor(abeta_negative_b$age_years/10) %>% as.character() %>% factor(labels=c("50-59", "60-69","70-79","80-89"))
abeta_negative_b$years_education_grouped <- cut(abeta_negative_b$years_education, c(5, 10, 15, 20, 25, 35)) %>%
  factor(labels=c("5-9", "10-14","15-19","20-25", "25+"))

abeta_negative_c$decade <- floor(abeta_negative_c$age_years/10) %>% as.character() %>% factor(labels=c("50-59", "60-69","70-79","80-89"))
abeta_negative_c$years_education_grouped <- cut(abeta_negative_c$years_education, c(5, 10, 15, 20, 25, 35)) %>%
  factor(labels=c("5-9", "10-14","15-19","20-25", "25+"))

# ----------------------------------------------
# for figure copy A, only age and yoe are significant
ecdf_figure_copy_a <- abeta_negative_a %>% group_by(decade, years_education_grouped) %>% 
  summarise(ecdfFun = list(ecdf(rbans_figure_copy)))

# for line_orientation A, only sex and yoe are significant
ecdf_line_orientation_a <- abeta_negative_a %>% group_by(sex, years_education_grouped) %>% 
  summarise(ecdfFun = list(ecdf(rbans_line_orientation)))

#list_recognition does not require adjustment
ecdf_list_recognition_a <- abeta_negative_a %>% summarise(ecdfFun = list(ecdf(rbans_list_recognition)))

# picture naming does not require adjustment
ecdf_picture_naming_a <- abeta_negative_a %>% summarise(ecdfFun = list(ecdf(rbans_picture_naming)))

#=================== FORM B ==================================

# for line_orientation B, only sex and yoe are significant
ecdf_line_orientation_b <- abeta_negative_b %>% group_by(sex, years_education_grouped) %>% 
  summarise(ecdfFun = list(ecdf(rbans_line_orientation)))

#list_recognition does not require adjustment
ecdf_list_recognition_b <- abeta_negative_b %>% summarise(ecdfFun = list(ecdf(rbans_list_recognition)))

# picture naming does not require adjustment
ecdf_picture_naming_b <- abeta_negative_b%>% summarise(ecdfFun = list(ecdf(rbans_picture_naming)))

# figure copy does not require adjustment for form B

ecdf_figure_copy_b <- abeta_negative_b%>% summarise(ecdfFun = list(ecdf(rbans_figure_copy)))


# ================ FORM C =====================================

# for line_orientation C, all 3 of only sex , age and yoe are significant
ecdf_line_orientation_c <- abeta_negative_c %>% group_by(sex, years_education_grouped) %>% 
  summarise(ecdfFun = list(ecdf(rbans_line_orientation)))

#list_recognition does not require adjustment
ecdf_list_recognition_c <- abeta_negative_c %>% summarise(ecdfFun = list(ecdf(rbans_list_recognition)))

# picture naming does not require adjustment
ecdf_picture_naming_c <- abeta_negative_c%>% summarise(ecdfFun = list(ecdf(rbans_picture_naming)))

# figure copy C requries adjustment for age and sex

ecdf_figure_copy_c <- abeta_negative_c %>% 
  group_by(decade, sex) %>% 
  summarise(ecdfFun = list(ecdf(rbans_figure_copy)))

#===============================================================
ecdf_maker<-function(df, max){
listylist <- list()
for(i in 1:length(df$ecdfFun)){
  s<-df$ecdfFun[[i]](max:1)
  out<-round(100*s, 1)
  listylist[[i]] <- out
}
ecdf_table <- cbind(do.call("rbind", listylist), df) %>% select(-ecdfFun)
return(ecdf_table)
}

ecdf_lo_a<- ecdf_maker(ecdf_line_orientation_a, 20)
names(ecdf_lo_a) <- c(c(20:1), "Sex", "YOE bounds")
supplementary_table_one <- flextable(ecdf_lo_a)
supplementary_table_one
ecdf_figcopy_a <- ecdf_maker(ecdf_figure_copy_a, 20)
names(ecdf_figcopy_a) <- c(c(20:1), "Age", "YOE bounds")
supplementary_table_two <- flextable(ecdf_figcopy_a)
supplementary_table_two 
ecdf_list_recog_a <- ecdf_maker(ecdf_list_recognition_a, 20)
names(ecdf_list_recog_a) <- c(c(20:1))
supplementary_table_three <- flextable(ecdf_list_recog_a)
supplementary_table_three

ecdf_picture_naming_a <- ecdf_maker(ecdf_picture_naming_a, 10)
names(ecdf_picture_naming_a) <- c(c(10:1))
supplementary_table_four <- flextable(ecdf_picture_naming_a)
supplementary_table_four

## =================================================================
# For Form B#-----------------------------------------------------------------------
ecdf_lo_b<- ecdf_maker(ecdf_line_orientation_b, 20)
names(ecdf_lo_b) <- c(c(20:1), "Sex", "YOE bounds")
supplementary_table_five <- flextable(ecdf_lo_b)
supplementary_table_five
ecdf_figcopy_b <- ecdf_maker(ecdf_figure_copy_b, 20)
names(ecdf_figcopy_b) <- c(c(20:1))
supplementary_table_six <- flextable(ecdf_figcopy_b)
supplementary_table_six 

ecdf_list_recog_b <- ecdf_maker(ecdf_list_recognition_b, 20)
names(ecdf_list_recog_b) <- c(c(20:1))
supplementary_table_seven <- flextable(ecdf_list_recog_b)
supplementary_table_seven

ecdf_picture_naming_b <- ecdf_maker(ecdf_picture_naming_b, 10)
names(ecdf_picture_naming_b) <- c(c(10:1))
supplementary_table_eight <- flextable(ecdf_picture_naming_b)
supplementary_table_eight

### FORM C
#
ecdf_lo_c<- ecdf_maker(ecdf_line_orientation_c, 20)
names(ecdf_lo_c) <- c(c(20:1), "Sex", "YOE bounds")
supplementary_table_nine <- flextable(ecdf_lo_c)
supplementary_table_nine
ecdf_figcopy_c <- ecdf_maker(ecdf_figure_copy_c, 20)
names(ecdf_figcopy_c) <- c(c(20:1),  "Age" ,"Sex")
supplementary_table_ten <- flextable(ecdf_figcopy_c)
supplementary_table_ten 

ecdf_list_recog_c <- ecdf_maker(ecdf_list_recognition_c, 20)
names(ecdf_list_recog_c) <- c(c(20:1))
supplementary_table_eleven <- flextable(ecdf_list_recog_c)
supplementary_table_eleven

ecdf_picture_naming_c <- ecdf_maker(ecdf_picture_naming_c, 10)
names(ecdf_picture_naming_c) <- c(c(10:1))
supplementary_table_twelve <- flextable(ecdf_picture_naming_c)
supplementary_table_twelve
##### normal modesl for other raw scores
names(normal_models_a)

supplementary_table_thirteen <- normal_models_a[c(1:3, 6, 8, 9, 11, 12)] %>% modelsummary(stars=TRUE, coef_rename=c(
  "sexm" = "Male sex", "age_years" = "Age (yrs)", "years_education" = "Education (yrs)"))
supplementary_table_thirteen

supplementary_table_fourteen <- normal_models_b[c(1:3, 6, 8, 9, 11, 12)] %>% modelsummary(stars=TRUE, coef_rename=c(
  "sexm" = "Male sex", "age_years" = "Age (yrs)", "years_education" = "Education (yrs)"))
supplementary_table_fourteen

supplementary_table_fifteen<- normal_models_c[c(1:3, 6, 8, 9, 11, 12)] %>% modelsummary(stars=TRUE, coef_rename=c(
  "sexm" = "Male sex", "age_years" = "Age (yrs)", "years_education" = "Education (yrs)"))
supplementary_table_fifteen


#### Z score to percentile lookup

z1 <- seq(0, 3, 0.1)
z2 <- seq(0, 0.09, 0.01)
z3<- rep(z2, each=31)
z4 <- rep(z1, 10)
zlook <- as_tibble(cbind(z3, z4))
zlook$p <- 100*round(pnorm(zlook$z3 + zlook$z4), 4)

zlook$z3 <- as.character(zlook$z3)
zlook$z4 <- as.character(zlook$z4)

ztable <- zlook %>% pivot_wider( names_from = z3, values_from=p) %>% flextable() %>% theme_zebra()
##
