years_of_education = this.getField('Years_Of_Education').value
sex = this.getField('Sex').value
ethnicity = this.getField('Ethnicity').value
age = this.getField('ageyrs').value
var yoebeta
var sexbeta
var ethnicbeta

if (years_of_education < 12 ) {
    yoebeta = 1;
}
else if (years_of_education == 12 ) {
    yoebeta = 2;
}
else if (years_of_education > 12 && years_of_education < 16) {
    yoebeta = 3;
}
else if (years_of_education > 15 ) {
    yoebeta = 4;
}

if (sex == "Female") {
    sexbeta = 0;
}
else if (sex == "Male") {
    sexbeta = 1;
}

if (ethnicity == "White") {
    ethnicbeta = 0;
}
else {
    ethnicbeta = 1;
}

// from Kevin Duff, Amir Ramezani,
// Regression-Based Normative Formulae for the Repeatable Battery for the Assessment of Neuropsychological Status for Older Adults,
// Archives of Clinical Neuropsychology, Volume 30, Issue 7, November 2015, Pages 600–604, https://doi.org/10.1093/arclin/acv052

var List_Learning_Duff_SD = 5.56
var List_Learning_Duff_Pred = 40.84 - (age * 0.25) - (sexbeta * 1.70) + (yoebeta * 0.76) - (ethnicbeta * 1.44)
var List_Learning_Duff_Z = (list_learning - List_Learning_Duff_Pred)/List_Learning_Duff_SD


var Story_Memory_Duff_SD = 4.24
var Story_Memory_Duff_Pred = 25.38 - (age * 0.16) - (sexbeta * 0.38) + (yoebeta * 0.73) - (ethnicbeta * 1.83)
var Story_Memory_Duff_Z = (story_memory - Story_Memory_Duff_Pred)/Story_Memory_Duff_SD


var Figure_Copy_Duff_SD = 2.02
var Figure_Copy_Duff_Pred =	22.76 - (age * 0.07) + (sexbeta * 0.08) + (yoebeta * 0.21) - (ethnicbeta * 0.70)
var Line_Orientation_Duff_SD = 	3.36
var Line_Orientation_Duff_Pred = 16.40 - (age * 0.04) + (sexbeta * 1.50) + (yoebeta * 0.48) - (ethnicbeta * 1.60)
var Picture_Naming_Duff_SD = 0.76
var Picture_Naming_Duff_Pred = 10.37 - (age * 0.02) + (sexbeta * 0.19) + (yoebeta * 0.12) - (ethnicbeta * 0.44)
var Semantic_Fluency_Duff_SD =  4.57
var Semantic_Fluency_Duff_Pred = 30.59 - (age * 0.18) - (sexbeta * 1.99) + (yoebeta * 0.34) - (ethnicbeta * 1.79)
var Digit_Span_Duff_SD 	=	2.72
var Digit_Span_Duff_Pred = 12.43 - (age * 0.03) + (sexbeta * 0.42) + (yoebeta * 0.27) - (ethnicbeta * 0.77)
var Coding_Duff_SD = 9.14
var Coding_Duff_Pred = 91.63 - (age * 0.82) - (sexbeta * 3.38) + (yoebeta * 1.57) - (ethnicbeta * 4.80)
var List_Recall_Duff_SD = 	2.44
var List_Recall_Duff_Pred = 12.47 - (age * 0.11) - (sexbeta * 1.25) + (yoebeta * 0.26) - (ethnicbeta * 1.39)
var List_Recognition_Duff_SD = 	1.55
var List_Recognition_Duff_Pred = 22.53 - (age * 0.05) - (sexbeta * 0.64) + (yoebeta * 0.15) - (ethnicbeta * 0.66)
var Story_Recall_Duff_SD = 	2.77
var Story_Recall_Duff_Pred = 16.62 - (age * 0.14) - (sexbeta * 0.68) + (yoebeta * 0.41) - (ethnicbeta * 1.07)
var Figure_Recall_Duff_SD = 4.07
var Figure_Recall_Duff_Pred = 23.98 - (age * 0.17) + (sexbeta * 0.47) + (yoebeta * 0.29) - (ethnicbeta * 2.30)

var Immediate_Memory_Duff_SD =  17.24
var Immediate_Memory_Duff_Pred = 95.54 - (age * 0.13) - (sexbeta * 4.36) + (yoebeta * 2.93) - (ethnicbeta * 6.65)
var Immediate_Memory_Duff_Z = (immediate_memory - Immediate_Memory_Duff_Pred)/Immediate_Memory_Duff_SD


var Visuospatial_Duff_SD = 	16.20
var Visuospatial_Duff_Pred = 103.34 - (age * 0.18) - (sexbeta * 5.20) + (yoebeta * 2.94) - (ethnicbeta * 8.79)
var Visuospatial_Duff_Z = (visuospatial - Visuospatial_Duff_Pred)/Visuospatial_Duff_SD

var Language_Duff_SD =	10.94
var Language_Duff_Pred = 92.77 - (age * 0.01) - (sexbeta * 3.25) + (yoebeta * 1.23) - (ethnicbeta * 5.74)
var Language_Duff_Z = (language - Language_Duff_Pred)/Language_Duff_SD


var Attention_Duff_SD = 15.43
var Attention_Duff_Pred = 106.92 - (age * 0.21) - (sexbeta * 2.07) + (yoebeta * 2.55) - (ethnicbeta * 7.35)
var Attention_Duff_Z = (attention - Attention_Duff_Pred)/Attention_Duff_SD


var Delayed_Memory_Duff_SD = 16.02
var Delayed_Memory_Duff_Pred = 125.23 - (age * 0.43) - (sexbeta * 5.20) + (yoebeta * 2.12) - (ethnicbeta * 9.93)
var Delayed_Memory_Duff_Z = (delayed_memory - Delayed_Memory_Duff_Pred)/Delayed_Memory_Duff_SD

var Total_Scale_Duff_SD =	14.60
var Total_Scale_Duff_Pred = 105.01 - (age * 0.24) - (sexbeta * 2.86) + (yoebeta * 3.24) - (ethnicbeta * 10.33)
var Total_Scale_Duff_Z = (total_scaled_score - Total_Scale_Duff_Pred)/Total_Scale_Duff_SD
