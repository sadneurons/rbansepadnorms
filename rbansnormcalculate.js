

function calculate() {
    var list_recall = parseInt(document.getElementById('listrecall').value)
    var list_recog = parseInt(document.getElementById('listrecog').value)
    var story_recall = parseInt(document.getElementById('storyrecall').value)
    var figure_recall = parseInt(document.getElementById('figurerecall').value)
    var delayed_memory = list_recall + story_recall + figure_recall
    var storylearning = parseInt(document.getElementById('storylearning').value)
    var listlearning = parseInt(document.getElementById('listlearning').value)
    var naming = parseInt(document.getElementById('naming').value)
    var semanticfluency = parseInt(document.getElementById('semanticfluency').value)
    var coding = parseInt(document.getElementById('coding').value)
    var digit_span = parseInt(document.getElementById('digitspan').value)
    var figure_copy = parseInt(document.getElementById('figurecopy').value)
    var line_orientation = parseInt(document.getElementById('lineorientation').value)
    var age = parseInt(document.getElementById('age').value)
    var topf = parseInt(document.getElementById('topf').value)
    var SD = 15

    var list_recall_text = "You scored " + list_recall + "/10 on the free recall of ten words, a sensitive indicator of verbal learning and recall. "
    var list_recog_text = "You scored " + list_recog + "/20 on the cued recall task which taxes delayed memory. "
    var figure_recall_text = "Recalling the complex figure is difficult, and you scored  " + figure_recall + "/20. "
    var story_recall_text = "You remembered " + story_recall + " items out of a possible 12 from the short story. "
    var list_text = "You scored " + listlearning + "/40 on the word list learning task which is a sensitive indicator of your ability to remember new words."
    var story_text = "You scored " + storylearning + "/24 on the short story learning task which is similar."
    var line_orientation_text = "You scored " + line_orientation + "/20 on the line orientation task which involves visuospatial perception."
    var figure_copy_text = "You scored " + figure_copy + "/20 on the figure copy task which tests visual working memory and perception."


    // -------------------------------------------------------------------------------------------
    // some helper functions

    function get_centile(z){
        var c = GetZPercent(z);
        return (100*c).toFixed(1);
    }

    function get_z(index, sd){
        var diff = (index-100)/sd;
    }

    function get_centile_text(centile){
        return "This means that " + centile + "% of healthy people in your age group score worse than you on this test.";
    }


    // -------------------------------------------------------------------------------------------
    // Duf for refactoring
    // Duff_immediate_memory

    function get_new(new_sd, new_intercept, old_index, sexbeta,
                      yoebeta, ethnicbeta, age_factor,
                      sex_factor, yoe_factor, ethnic_factor){
        var new_pred = new_intercept + (age * age_factor) + (sexbeta * sex_factor) + (yoebeta * yoe_factor) + (ethnicbeta * ethnic_factor)
        var new_z = (old_index - new_pred)/new_sd
        var new_index = 100 + (new_z*15)
        var new_centile = get_centile(new_z)
        return [new_z, new_index, new_centile]
    }

    // Duff Immediate Memory
    var duff_im = get_duff(17.24, 95.54,  immediate_memory, sexbeta, yoebeta, ethnicbeta,
    -0.13, -4.36, 2.93, -6.65)

    // Duff Visuospatial
    var duff_vs = get_duff(16.20, 103.34, visuospatial, sexbeta, yoebeta, ethnicbeta,
        -0.18, 5.20, 2.94, -8.79)

    // Duff Language
    var Language_Duff_SD = 10.94
    var Language_Duff_Pred = 92.77 - (age * 0.01) - (sexbeta * 3.25) + (yoebeta * 1.23) - (ethnicbeta * 5.74)
    var Language_Duff_Z = (language - Language_Duff_Pred) / Language_Duff_SD
    var Language_Duff_Index = 100 + (Language_Duff_Z * 15)
    var Language_Duff_centile = (100 * GetZPercent(Language_Duff_Z)).toFixed(1)

    //Duff Attention
    var Attention_Duff_SD = 15.43
    var Attention_Duff_Pred = 106.92 - (age * 0.21) - (sexbeta * 2.07) + (yoebeta * 2.55) - (ethnicbeta * 7.35)
    var Attention_Duff_Z = (attention - Attention_Duff_Pred) / Attention_Duff_SD
    var Attention_Duff_Index = 100 + (Attention_Duff_Z * 15)
    var Attention_Duff_centile = (100 * GetZPercent(Attention_Duff_Z)).toFixed(1)

    //Duff Delayed_Memory
    var Delayed_Memory_Duff_SD = 16.02
    var Delayed_Memory_Duff_Pred = 125.23 - (age * 0.43) - (sexbeta * 5.20) + (yoebeta * 2.12) - (ethnicbeta * 9.93)
    var Delayed_Memory_Duff_Z = (delayed_memory_index - Delayed_Memory_Duff_Pred) / Delayed_Memory_Duff_SD
    var Delayed_Memory_Duff_Index = 100 + (Delayed_Memory_Duff_Z * 15)
    var Delayed_Memory_Duff_centile = (100 * GetZPercent(Delayed_Memory_Duff_Z)).toFixed(1)

    // Total DUFF [chortle]
    var Total_Scale_Duff_SD = 14.60
    var Total_Scale_Duff_Pred = 105.01 - (age * 0.24) - (sexbeta * 2.86) + (yoebeta * 3.24) - (ethnicbeta * 10.33)
    var Total_Scale_Duff_Z = (total_scaled_score - Total_Scale_Duff_Pred) / Total_Scale_Duff_SD
    var Total_Scale_Duff_Index = 100 + (Total_Scale_Duff_Z * 15)
    var Total_Duff_centile = (100 * GetZPercent(Total_Scale_Duff_Z)).toFixed(1)

    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    // pick the right arrays for the Randolph lookups
    if (age > 79) {
        i = 3;
    } else if (age < 79  && age >= 70) {
    var i = 2;
    } else if (69 >= age && age >= 60) {
    var i = 1;
    } else if (59 >= age && age >= 50) {
    var i = 0;
    }
    var mem_array = mem[i];
    var imm_array = immediate[i];
    var visuo_array = visuo[i];
    var language_array = languageArray[i];
    var att_array = attArray[i];
    //DELAYED MEMORY
    var delayed_memory_index = mem_array[delayed_memory][list_recog];
   //----------------------------------------------------------------------------------------------


    if (norm=="randolph") { var title ="Randolph / Manual"
        var plot_data = [trace1, trace2, trace3]
    } else if (norm=="duff") { var title ="Duff (2015)"
        var plot_data = [trace2, trace4, trace5]
    }
    else if (norm=="epada") { var title = "EPAD A"
        var plot_data = [trace2, trace6, trace7]
    } else if (norm=="epadb") { var title = "EPAD B"
        var plot_data = [trace2, trace8, trace9]
    }   else if (norm=="epadc") {  var title = "EPAD C"
        var plot_data = [trace2, trace10, trace11]
    };


    var delayed_memory_text = "This gives a Delayed Memory Index Score of " + delayed_memory_index + ".";
    var memcentile = get_centile(get_z(delayed_memory_index));
    var mem_centile_text = get_centile_text(mem_centile);
    document.getElementById('delayed_memory_letter').innerHTML = "<h2>Delayed memory</h2>" + list_recall_text + list_recog_text + figure_recall_text + story_recall_text + mem_centile_text

    //IMMEDIATE MEMORY
    var immediate_memory = imm_array[listlearning][storylearning]
    var immediate_memory_text = "This gives an Immediate Memory Index Score of :" + immediate_memory
    var immediate_memory_DIFF = immediate_memory - 100
    var immediate_memory_z = immediate_memory_DIFF / SD
    var immcentile = (100 * GetZPercent(immediate_memory_z)).toFixed(1)
    var imm_centile_text = " This means that " + immcentile + "% of healthy people in your age group score worse than you on this subtest."
    document.getElementById('immediate_memory_letter').innerHTML = "<h2>Immediate memory</h2>" + list_text + story_text + imm_centile_text

    //VISUoSPATIAL
    var visuospatial = visuo_array[figure_copy][line_orientation]
    var visuospatial_text = "This gives a Visuospatial/Constructional Index Score of " + visuospatial
    var visuospatial_DIFF = visuospatial - 100
    var visuospatial_z = visuospatial_DIFF / SD
    var visuospatial_centile = (100 * GetZPercent(visuospatial_z)).toFixed(1)
    var visuospatial_centile_text = " This means that " + visuospatial_centile + "% of healthy people in your age group score worse than you on this subtest."
    document.getElementById('visuospatial_letter').innerHTML = "<h2>Visuospatial Function</h2>" + line_orientation_text + figure_copy_text + visuospatial_text + visuospatial_centile_text

    //LANGUAGE
    var naming_text = "You scored " + naming + "/10 on the naming task which is a specific measure of your ability to recall words. "
    var semantic_text = "You scored " + semanticfluency + "/40 on the semantic fluency task which makes demands on you attention and executive function as well as memory. "
    var language = language_array[semanticfluency][naming]
    var language_text = "This gives an Language Index Score of " + language + "."
    var language_DIFF = language - 100
    var language_z = language_DIFF / SD
    var language_centile = (100 * GetZPercent(language_z)).toFixed(1)
    var language_centile_text = " This means that " + language_centile + "% of healthy people in your age group score worse than you on this subtest."
    document.getElementById('language_letter').innerHTML = "<h2>Language function</h2>" + naming_text + semantic_text + language_text + language_centile_text

    //ATTENTION
    digit_span_text = "You scored " + digit_span + "/16 on the digit span task which tests attention and working memory."
    coding_text = "You scored " + coding + "/89 on the digit-symbol coding task which attention and processing speed."
    var attention = att_array[coding][digit_span];
    attention_text = "This gives an Attention Index Score of " + attention + ".";
    var attention_DIFF = attention - 100;
    var attention_Z = attention_DIFF / SD;
    var attention_centile = (100 * GetZPercent(attention_Z)).toFixed(1);
    var attention_centile_text = " This means that " + attention_centile + "% of healthy people in your age group score worse than you on this subtest."
    document.getElementById('attention_letter').innerHTML = "<h2>Attention \& Concentration </h2>" + digit_span_text + coding_text + attention_text + attention_centile_text

    //TOTAL
    var total_index = attention + language + visuospatial + immediate_memory + delayed_memory_index - 200
    total_array = [40, 40, 40, 40, 40, 40, 40, 40, 41, 41, 41, 41, 41, 41, 41, 41, 42, 42, 42, 42, 42, 42, 42, 42, 43, 43, 43, 43, 43, 43, 43, 43, 44, 44, 44, 44, 44, 44, 44, 44, 45, 45, 45, 45, 45, 45, 45, 45, 46, 46, 46, 46, 46, 46, 46, 46, 47, 47, 47, 47, 47, 47, 47, 47, 48, 48, 48, 48, 48, 48, 48, 48, 49, 49, 49, 49, 49, 49, 49, 49, 50, 50, 50, 50, 50, 50, 50, 50, 51, 51, 51, 51, 51, 51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 52, 53, 53, 53, 53, 53, 53, 53, 53, 54, 54, 54, 54, 54, 54, 54, 54, 55, 55, 55, 55, 55, 55, 55, 55, 56, 56, 56, 57, 57, 57, 58, 58, 58, 59, 59, 59, 60, 60, 60, 60, 61, 61, 61, 61, 62, 62, 62, 62, 63, 63, 63, 63, 64, 64, 64, 64, 65, 65, 65, 65, 66, 66, 66, 66, 67, 67, 67, 67, 67, 68, 68, 68, 68, 69, 69, 69, 69, 70, 70, 70, 70, 71, 71, 71, 72, 72, 72, 72, 73, 73, 73, 74, 74, 74, 74, 75, 75, 75, 75, 76, 76, 76, 77, 77, 77, 77, 78, 78, 78, 78, 78, 79, 79, 79, 79, 79, 80, 80, 80, 80, 80, 80, 80, 81, 81, 81, 81, 82, 82, 82, 82, 82, 83, 83, 83, 83, 83, 84, 84, 84, 84, 85, 85, 85, 85, 85, 86, 86, 86, 86, 86, 87, 87, 87, 87, 88, 88, 88, 89, 89, 89, 90, 90, 90, 90, 91, 91, 91, 92, 92, 92, 92, 93, 93, 93, 93, 94, 94, 94, 94, 95, 95, 95, 95, 96, 96, 96, 97, 97, 97, 98, 98, 98, 99, 99, 99, 100, 100, 100, 100, 100, 100, 101, 101, 101, 101, 102, 102, 102, 102, 103, 103, 103, 104, 104, 104, 104, 105, 105, 105, 106, 106, 106, 106, 107, 107, 107, 108, 108, 108, 109, 109, 109, 110, 110, 110, 111, 111, 111, 112, 112, 112, 113, 113, 113, 114, 114, 114, 115, 115, 115, 116, 116, 117, 117, 117, 118, 118, 118, 119, 119, 119, 119, 120, 120, 120, 120, 121, 121, 121, 122, 122, 122, 123, 123, 123, 123, 124, 124, 124, 124, 124, 124, 126, 126, 127, 127, 127, 128, 128, 129, 129, 129, 130, 130, 131, 131, 132, 132, 133, 133, 134, 134, 135, 135, 136, 136, 137, 137, 138, 139, 139, 140, 140, 141, 141, 142, 142, 143, 143, 143, 144, 144, 144, 144, 145, 145, 145, 145, 146, 146, 146, 146, 147, 147, 147, 148, 148, 148, 148, 148, 148, 148, 148, 148, 148, 148, 148, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 149, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 152, 152, 152, 152, 152, 152, 152, 152, 152, 152, 152, 152, 153, 153, 153, 153, 153, 153, 153, 153, 153, 153, 153, 153, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 155, 155, 155, 155, 155, 155, 155, 155, 155, 155, 155, 155, 156, 156, 156, 156, 156, 156, 156, 156, 156, 156, 156, 156, 156, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 158, 158, 158, 158, 158, 158, 158, 158, 158, 158, 158, 158, 158, 159, 159, 159, 159, 159, 159, 159, 159, 159, 159, 159, 159, 159, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160]
    total_scaled_score = total_array[total_index];
    var total_DIFF = total_scaled_score - 100;
    var total_z = total_DIFF / SD;
    var total_centile = (100 * GetZPercent(total_z)).toFixed(1);
    var overall_centile_text = " This means that " + total_centile + "% of healthy people in your age group score worse than you overall."
    document.getElementById('overall_rbans_letter').innerHTML = "<h2>Overall scores</h2>" + overall_centile_text


    var years_of_education = parseInt(document.getElementById('years_of_education').value);
    var sex = document.querySelector('input[name="assigned_gender_at_birth"]:checked').value;
    var ethnicity = document.querySelector('input[name="ethnicity"]:checked').value;

    if (years_of_education < 12) {
        var yoebeta = 1;
    } else if (years_of_education == 12) {
        var yoebeta = 2;
    } else if (years_of_education > 12 && years_of_education < 16) {
        var yoebeta = 3;
    } else if (years_of_education > 15) {
        var yoebeta = 4;
    }
    var sexbeta = 1;
    if (sex == "Female") {
        var sexbeta = 0;
    }
    var ethnicbeta = 1;
    if (ethnicity == "White") {
        var ethnicbeta = 0;
    }
    // Duff_immediate_memory
    var Immediate_Memory_Duff_SD = 17.24
    var Immediate_Memory_Duff_Pred = 95.54 - (age * 0.13) - (sexbeta * 4.36) + (yoebeta * 2.93) - (ethnicbeta * 6.65)
    var Immediate_Memory_Duff_Z = (immediate_memory - Immediate_Memory_Duff_Pred) / Immediate_Memory_Duff_SD
    var Immediate_Memory_Duff_Index = 100 + (Immediate_Memory_Duff_Z * 15)
    var Immediate_MeMory_Duff_centile = (100 * GetZPercent(Immediate_Memory_Duff_Z)).toFixed(1)
    // Duff Visuospatial
    var Visuospatial_Duff_SD = 16.20
    var Visuospatial_Duff_Pred = 103.34 - (age * 0.18) + (sexbeta * 5.20) + (yoebeta * 2.94) - (ethnicbeta * 8.79)
    var Visuospatial_Duff_Z = (visuospatial - Visuospatial_Duff_Pred) / Visuospatial_Duff_SD
    var Visuospatial_Duff_Index = 100 + (Visuospatial_Duff_Z * 15)
    var Visuospatial_Duff_centile = (100 * GetZPercent(Visuospatial_Duff_Z)).toFixed(1)

    // Duff Language
    var Language_Duff_SD = 10.94
    var Language_Duff_Pred = 92.77 - (age * 0.01) - (sexbeta * 3.25) + (yoebeta * 1.23) - (ethnicbeta * 5.74)
    var Language_Duff_Z = (language - Language_Duff_Pred) / Language_Duff_SD
    var Language_Duff_Index = 100 + (Language_Duff_Z * 15)
    var Language_Duff_centile = (100 * GetZPercent(Language_Duff_Z)).toFixed(1)

    //Duff Attention
    var Attention_Duff_SD = 15.43
    var Attention_Duff_Pred = 106.92 - (age * 0.21) - (sexbeta * 2.07) + (yoebeta * 2.55) - (ethnicbeta * 7.35)
    var Attention_Duff_Z = (attention - Attention_Duff_Pred) / Attention_Duff_SD
    var Attention_Duff_Index = 100 + (Attention_Duff_Z * 15)
    var Attention_Duff_centile = (100 * GetZPercent(Attention_Duff_Z)).toFixed(1)

    //Duff Delayed_Memory
    var Delayed_Memory_Duff_SD = 16.02
    var Delayed_Memory_Duff_Pred = 125.23 - (age * 0.43) - (sexbeta * 5.20) + (yoebeta * 2.12) - (ethnicbeta * 9.93)
    var Delayed_Memory_Duff_Z = (delayed_memory_index - Delayed_Memory_Duff_Pred) / Delayed_Memory_Duff_SD
    var Delayed_Memory_Duff_Index = 100 + (Delayed_Memory_Duff_Z * 15)
    var Delayed_Memory_Duff_centile = (100 * GetZPercent(Delayed_Memory_Duff_Z)).toFixed(1)

    // Total DUFF [chortle]
    var Total_Scale_Duff_SD = 14.60
    var Total_Scale_Duff_Pred = 105.01 - (age * 0.24) - (sexbeta * 2.86) + (yoebeta * 3.24) - (ethnicbeta * 10.33)
    var Total_Scale_Duff_Z = (total_scaled_score - Total_Scale_Duff_Pred) / Total_Scale_Duff_SD
    var Total_Scale_Duff_Index = 100 + (Total_Scale_Duff_Z * 15)
    var Total_Duff_centile = (100 * GetZPercent(Total_Scale_Duff_Z)).toFixed(1)


    // EPAD_immediate_memory
    var Immediate_Memory_EPAD_SD = 11.610
    var Immediate_Memory_EPAD_Pred = 97.938 - (age * 0.001) - (sexbeta * 4.672) + (years_of_education * 0.836)
    var Immediate_Memory_EPAD_Z = (immediate_memory - Immediate_Memory_EPAD_Pred) / Immediate_Memory_EPAD_SD
    var Immediate_Memory_EPAD_Index = 100 + (Immediate_Memory_EPAD_Z * 15)
    var Immediate_MeMory_EPAD_centile = (100 * GetZPercent(Immediate_Memory_EPAD_Z)).toFixed(1)
    // EPAD Visuospatial
    var Visuospatial_EPAD_SD = 14.071
    var Visuospatial_EPAD_Pred = 99.731 - (age * 0.105) + (sexbeta * 5.621) + (years_of_education * 0.815)
    var Visuospatial_EPAD_Z = (visuospatial - Visuospatial_EPAD_Pred) / Visuospatial_EPAD_SD
    var Visuospatial_EPAD_Index = 100 + (Visuospatial_EPAD_Z * 15)
    var Visuospatial_EPAD_centile = (100 * GetZPercent(Visuospatial_EPAD_Z)).toFixed(1)

    // EPAD Language
    var Language_EPAD_SD = 9.645
    var Language_EPAD_Pred = 89.154 - (age * 0.098) - (sexbeta * 5.408) + (years_of_education * 0.433)
    var Language_EPAD_Z = (language - Language_EPAD_Pred) / Language_EPAD_SD
    var Language_EPAD_Index = 100 + (Language_EPAD_Z * 15)
    var Language_EPAD_centile = (100 * GetZPercent(Language_EPAD_Z)).toFixed(1)

    //EPAD Attention
    var Attention_EPAD_SD = 14.902
    var Attention_EPAD_Pred = 107.215 - (age * 0.223) - (sexbeta * 0.52) + (years_of_education * 0.638)
    var Attention_EPAD_Z = (attention - Attention_EPAD_Pred) / Attention_EPAD_SD
    var Attention_EPAD_Index = 100 + (Attention_EPAD_Z * 15)
    var Attention_EPAD_centile = (100 * GetZPercent(Attention_EPAD_Z)).toFixed(1)

    //EPAD Delayed_Memory
    var Delayed_Memory_EPAD_SD = 10.534
    var Delayed_Memory_EPAD_Pred = 98.852 - (age * 0.035) - (sexbeta * 2.736) + (years_of_education * 0.682)
    var Delayed_Memory_EPAD_Z = (delayed_memory_index - Delayed_Memory_EPAD_Pred) / Delayed_Memory_EPAD_SD
    var Delayed_Memory_EPAD_Index = 100 + (Delayed_Memory_EPAD_Z * 15)
    var Delayed_Memory_EPAD_centile = (100 * GetZPercent(Delayed_Memory_EPAD_Z)).toFixed(1)

    // Total EPAD
    var Total_Scale_EPAD_SD = 11.153
    var Total_Scale_EPAD_Pred = 96.774 - (age * 0.065) - (sexbeta * 2.297) + (years_of_education * 0.993)
    var Total_Scale_EPAD_Z = (total_scaled_score - Total_Scale_EPAD_Pred) / Total_Scale_EPAD_SD
    var Total_Scale_EPAD_Index = 100 + (Total_Scale_EPAD_Z * 15)
    var Total_EPAD_centile = (100 * GetZPercent(Total_Scale_EPAD_Z)).toFixed(1)

    // EPAD VISIT 2 RBANS B norms // -----------------------------------------------------------------------

    // EPADB_immediate_memory
    var Immediate_Memory_EPADB_SD = 11.238
    var Immediate_Memory_EPADB_Pred = 106.340 - (age * 0.102) - (sexbeta * 3.754) + (years_of_education * 0.749)
    var Immediate_Memory_EPADB_Z = (immediate_memory - Immediate_Memory_EPADB_Pred) / Immediate_Memory_EPADB_SD
    var Immediate_Memory_EPADB_Index = 100 + (Immediate_Memory_EPADB_Z * 15)
    var Immediate_MeMory_EPADB_centile = (100 * GetZPercent(Immediate_Memory_EPADB_Z)).toFixed(1)

    // EPADB Visuospatial
    var Visuospatial_EPADB_SD = 13.673
    var Visuospatial_EPADB_Pred = 97.590 - (age * 0.021) + (sexbeta * 2.972) + (years_of_education * 0.533)
    var Visuospatial_EPADB_Z = (visuospatial - Visuospatial_EPADB_Pred) / Visuospatial_EPADB_SD
    var Visuospatial_EPADB_Index = 100 + (Visuospatial_EPADB_Z * 15)
    var Visuospatial_EPADB_centile = (100 * GetZPercent(Visuospatial_EPADB_Z)).toFixed(1)

    // EPADB Language
    var Language_EPADB_SD = 11.640
    var Language_EPADB_Pred = 92.087 - (age * 0.030) + (sexbeta * 0.171) + (years_of_education * 0.487)
    var Language_EPADB_Z = (language - Language_EPADB_Pred) / Language_EPADB_SD
    var Language_EPADB_Index = 100 + (Language_EPADB_Z * 15)
    var Language_EPADB_centile = (100 * GetZPercent(Language_EPADB_Z)).toFixed(1)

    //EPADB Attention
    var Attention_EPADB_SD = 14.251
    var Attention_EPADB_Pred = 105.842 - (age * 0.234) - (sexbeta * 0.014) + (years_of_education * 0.931)
    var Attention_EPADB_Z = (attention - Attention_EPADB_Pred) / Attention_EPADB_SD
    var Attention_EPADB_Index = 100 + (Attention_EPADB_Z * 15)
    var Attention_EPADB_centile = (100 * GetZPercent(Attention_EPADB_Z)).toFixed(1)

    //EPADB Delayed_Memory
    var Delayed_Memory_EPADB_SD = 11.198
    var Delayed_Memory_EPADB_Pred = 104.564 - (age * 0.063) - (sexbeta * 2.892) + (years_of_education * 0.609)
    var Delayed_Memory_EPADB_Z = (delayed_memory_index - Delayed_Memory_EPADB_Pred) / Delayed_Memory_EPADB_SD
    var Delayed_Memory_EPADB_Index = 100 + (Delayed_Memory_EPADB_Z * 15)
    var Delayed_Memory_EPADB_centile = (100 * GetZPercent(Delayed_Memory_EPADB_Z)).toFixed(1)

    // Total EPADB
    var Total_Scale_EPADB_SD = 11.318
    var Total_Scale_EPADB_Pred = 101.151 - (age * 0.103) - (sexbeta * 1.139) + (years_of_education * 0.953)
    var Total_Scale_EPADB_Z = (total_scaled_score - Total_Scale_EPADB_Pred) / Total_Scale_EPADB_SD
    var Total_Scale_EPADB_Index = 100 + (Total_Scale_EPADB_Z * 15)
    var Total_EPADB_centile = (100 * GetZPercent(Total_Scale_EPAD_Z)).toFixed(1)

    // EPAD VISIT 3 RBANS C norms // -----------------------------------------------------------------------

    // EPADC_immediate_memory
    var Immediate_Memory_EPADC_SD =11.403
    var Immediate_Memory_EPADC_Pred = 101.753 - (age * 0.118) - (sexbeta * 4.297) + (years_of_education * 0.888)
    var Immediate_Memory_EPADC_Z = (immediate_memory - Immediate_Memory_EPADC_Pred) / Immediate_Memory_EPADC_SD
    var Immediate_Memory_EPADC_Index = 100 + (Immediate_Memory_EPADC_Z * 15)
    var Immediate_MeMory_EPADC_centile = (100 * GetZPercent(Immediate_Memory_EPADC_Z)).toFixed(1)

    // EPADC Visuospatial
    var Visuospatial_EPADC_SD = 13.941
    var Visuospatial_EPADC_Pred = 107.891 - (age * 0.197) + (sexbeta * 3.834) + (years_of_education * 0.594)
    var Visuospatial_EPADC_Z = (visuospatial - Visuospatial_EPADC_Pred) / Visuospatial_EPADC_SD
    var Visuospatial_EPADC_Index = 100 + (Visuospatial_EPADC_Z * 15)
    var Visuospatial_EPADC_centile = (100 * GetZPercent(Visuospatial_EPADC_Z)).toFixed(1)

    // EPADC Language
    var Language_EPADC_SD = 9.538
    var Language_EPADC_Pred = 84.341 + (age * 0.097) + (sexbeta * 0.959) + (years_of_education * 0.401)
    var Language_EPADC_Z = (language - Language_EPADC_Pred) / Language_EPADC_SD
    var Language_EPADC_Index = 100 + (Language_EPADC_Z * 15)
    var Language_EPADC_centile = (100 * GetZPercent(Language_EPADC_Z)).toFixed(1)

    //EPADC Attention
    var Attention_EPADC_SD = 13.936
    var Attention_EPADC_Pred = 109.514 - (age * 0.255) - (sexbeta * 0.484) + (years_of_education * 0.795)
    var Attention_EPADC_Z = (attention - Attention_EPADC_Pred) / Attention_EPADC_SD
    var Attention_EPADC_Index = 100 + (Attention_EPADC_Z * 15)
    var Attention_EPADC_centile = (100 * GetZPercent(Attention_EPADC_Z)).toFixed(1)

    //EPADC Delayed_Memory
    var Delayed_Memory_EPADC_SD = 10.299
    var Delayed_Memory_EPADC_Pred = 105.565 - (age * 0.131) - (sexbeta * 2.604) + (years_of_education * 0.827)
    var Delayed_Memory_EPADC_Z = (delayed_memory_index - Delayed_Memory_EPADC_Pred) / Delayed_Memory_EPADC_SD
    var Delayed_Memory_EPADC_Index = 100 + (Delayed_Memory_EPADC_Z * 15)
    var Delayed_Memory_EPADC_centile = (100 * GetZPercent(Delayed_Memory_EPADC_Z)).toFixed(1)

    // Total EPADC
    var Total_Scale_EPADC_SD = 11.163
    var Total_Scale_EPADC_Pred = 102.230 - (age * 0.163) - (sexbeta * 0.798) + (years_of_education * 0.975)
    var Total_Scale_EPADC_Z = (total_scaled_score - Total_Scale_EPADC_Pred) / Total_Scale_EPADC_SD
    var Total_Scale_EPADC_Index = 100 + (Total_Scale_EPADC_Z * 15)
    var Total_EPADC_centile = (100 * GetZPercent(Total_Scale_EPAD_Z)).toFixed(1)
    // Want to graph the centile scores to mimic the RBANS cover
    // so 6 columns, a line graph
//------------------------------------------------------------------------------------------------------------


    //TOPF
    var fsiq = (29.991 + 2.0942600*topf + (-0.0404559*topf*topf) + (0.000340705*topf*topf*topf) +
        years_of_education*1.4617126 + 4.925*(sexbeta + 1)).toFixed(0)
    document.getElementById('topf_letter').innerHTML = "<h2>Test of Premorbid Functioning (TOPF)</h2>" + "The TOPF is a reading/vocabularu test meant to test " +
        "your premorbid ability. You scored " + topf + " out of 70 correct pronounciations " + " which estimates your IQ at around " + fsiq + "."


    //EFFORT INDEX
    // An Effort Index for the Repeatable Battery for the Assessment of Neuropsychological Status
    // (RBANS), The Clinical Neuropsychologist, 21:5, 841-854, DOI: 10.1080/13854040600850958

    if (digit_span < 5) {
        var digit_effort = 6;
    } else if (digit_span == 5) {
        var digit_effort = 5;
    } else if (digit_span == 6) {
        var digit_effort = 3;
    } else if (digit_span == 7) {
        var digit_effort = 2;
    } else if (digit_span > 7 && digit_span < 17) {
        var digit_effort = 0;
    }

    if (list_recog < 10) {
        var recog_effort = 6;
    } else if (list_recog == 10) {
        var recog_effort = 5;
    } else if (list_recog > 10 && list_recog < 13) {
        var recog_effort = 4;
    } else if (list_recog > 12 && list_recog < 15) {
        var recog_effort = 3;
    } else if (list_recog > 14 && list_recog < 17) {
        var recog_effort = 2;
    } else if (list_recog == 17) {
        var recog_effort = 1;
    } else if (list_recog > 17 && list_recog < 21) {
        var recog_effort = 0;
    }

    var silverberg_EI = digit_effort + recog_effort
    silverberg_table = "\n" +
        "<table class=\"tg\">\n" +
        "<thead>\n" +
        "  <tr>\n" +
        "    <th class=\"tg-0lax\">Cut-off</th>\n" +
        "    <th class=\"tg-0lax\">MTBI</th>\n" +
        "    <th class=\"tg-0lax\">Controls</th>\n" +
        "    <th class=\"tg-0lax\">Clinical<br> Malingerers</th>\n" +
        "    <th class=\"tg-0lax\">Sim-naive<br>malingerers</th>\n" +
        "    <th class=\"tg-0lax\">Sim-coached<br>malingerers</th>\n" +
        "  </tr>\n" +
        "</thead>\n" +
        "<tbody>\n" +
        "  <tr>\n" +
        "    <td class=\"tg-0lax\">&gt;0 </td>\n" +
        "    <td class=\"tg-0lax\">0.781</td>\n" +
        "    <td class=\"tg-0lax\">0.964</td>\n" +
        "    <td class=\"tg-0lax\">0.933</td>\n" +
        "    <td class=\"tg-0lax\">0.958</td>\n" +
        "    <td class=\"tg-0lax\">0.857</td>\n" +
        "  </tr>\n" +
        "  <tr>\n" +
        "    <td class=\"tg-0lax\">&gt;1</td>\n" +
        "    <td class=\"tg-0lax\">0.813</td>\n" +
        "    <td class=\"tg-0lax\">0.964</td>\n" +
        "    <td class=\"tg-0lax\">0.667</td>\n" +
        "    <td class=\"tg-0lax\">0.917</td>\n" +
        "    <td class=\"tg-0lax\">0.750</td>\n" +
        "  </tr>\n" +
        "  <tr>\n" +
        "    <td class=\"tg-0lax\">&gt;2</td>\n" +
        "    <td class=\"tg-0lax\">0.906</td>\n" +
        "    <td class=\"tg-0lax\">0.964</td>\n" +
        "    <td class=\"tg-0lax\">0.667</td>\n" +
        "    <td class=\"tg-0lax\">0.792</td>\n" +
        "    <td class=\"tg-0lax\">0.5</td>\n" +
        "  </tr>\n" +
        "  <tr>\n" +
        "    <td class=\"tg-0lax\">&gt;3</td>\n" +
        "    <td class=\"tg-0lax\">1.00</td>\n" +
        "    <td class=\"tg-0lax\">1.00</td>\n" +
        "    <td class=\"tg-0lax\">0.533</td>\n" +
        "    <td class=\"tg-0lax\">0.708</td>\n" +
        "    <td class=\"tg-0lax\">0.464</td>\n" +
        "  </tr>\n" +
        "</tbody>\n" +
        "</table>"
    document.getElementById('silverberg_index_letter').innerHTML = "<h2>Effort indices</h2>" + "The Silverberg effort index was " + silverberg_EI + "." + silverberg_table

    // Randolph / Novitski Effort Index
    //RBANS ES = (List Recognition − (List Recall + Story Recall (learning here) + Figure Recall)) + Digit Span

    var novitski_ES = digit_span + (list_recog - (list_recall + storylearning + figure_recall));
    document.getElementById('silverberg_index_letter').innerHTML = "<h2>Effort indices</h2>" + "The Silverberg effort index was " + silverberg_EI + "." + silverberg_table + "The Novitski Effort Scale is " + novitski_ES + "."

    //Cortical - subcortical score (Beatty 2003)
    // [(Visuospatial/Construction + Attention)/2] − [(Language + Delayed Memory)/2].
    var corticalsub = (visuospatial + attention)/2 - (language + delayed_memory_index)/2
    document.getElementById('cortical-subcortical').innerHTML = "<h2>Cortical-subcortical index</h2>" + "The cortical - subcortical index is " + corticalsub + " where scores above 0 are said to predict a cortical pattern."


    var results_table = "<table>\n" +
        "<thead>\n" +
        "  <tr>\n" +
        "    <th>Domain</th>\n" +
        "    <th>Immediate /<br>Memory</th>\n" +
        "    <th>Constructional / <br>Visuospatial</th>\n" +
        "    <th>Language</th>\n" +
        "    <th>Attention</th>\n" +
        "    <th>Delayed<br>Memory</th>\n" +
        "    <th>Total Scale</th>\n" +
        "  </tr>\n" +
        "</thead>\n" +
        "<tbody>\n" +
        "  <tr>\n" +
        "    <td>Index <br>Scores</td>\n" +
        "    <td>"+immediate_memory+"</td>\n" +
        "    <td>"+visuospatial+"</td>\n" +
        "    <td>"+language+"</td>\n" +
        "    <td>"+attention+"</td>\n" +
        "    <td>"+delayed_memory_index+"</td>\n" +
        "    <td>"+total_scaled_score+"</td>\n" +
        "  </tr>\n" +
        "  <tr>\n" +
        "    <td>CI</td>\n" +
        "    <td></td>\n" +
        "    <td></td>\n" +
        "    <td></td>\n" +
        "    <td></td>\n" +
        "    <td></td>\n" +
        "    <td></td>\n" +
        "  </tr>\n" +
        "  <tr>\n" +
        "    <td>Percentile</td>\n" +
        "    <td>"+immcentile+"</td>\n" +
        "    <td>"+visuospatial_centile+"</td>\n" +
        "    <td>"+language_centile+"</td>\n" +
        "    <td>"+attention_centile+"</td>\n" +
        "    <td>"+memcentile+"</td>\n" +
        "    <td>"+total_centile+"</td>\n" +
        "  </tr>\n" +
        "  <tr>\n" +
        "    <td>Duff Index</td>\n" +
        "    <td>"+Math.round(Immediate_Memory_Duff_Index, 2)+"</td>\n" +
        "    <td>"+Math.round(Visuospatial_Duff_Index, 2)+"</td>\n" +
        "    <td>"+Math.round(Language_Duff_Index, 2)+"</td>\n" +
        "    <td>"+Math.round(Attention_Duff_Index, 2)+"</td>\n" +
        "    <td>"+Math.round(Delayed_Memory_Duff_Index, 2)+"</td>\n" +
        "    <td>"+Math.round(Total_Scale_Duff_Index)+"</td>\n" +
        "  </tr>\n" +
        "  <tr>\n" +
        "    <td>Duff <br>Percentile</td>\n" +
        "    <td>"+Math.round(Immediate_MeMory_Duff_centile, 3)+"</td>\n" +
        "    <td>"+Math.round(Visuospatial_Duff_centile, 3)+"</td>\n" +
        "    <td>"+Math.round(Language_Duff_centile, 3)+"</td>\n" +
        "    <td>"+Math.round(Attention_Duff_centile, 3)+"</td>\n" +
        "    <td>"+Math.round(Delayed_Memory_Duff_centile, 3)+"</td>\n" +
        "    <td>"+Math.round(Total_Duff_centile, 3)+"</td>\n" +
        "  </tr>\n" +
        "</tbody>\n" +
        "</table>"

    document.getElementById('results_table').innerHTML = results_table;





    document.getElementById('references').innerHTML = "<h1>References</h1>" +
        "<ol>" +
        "<li>Duff K, Ramezani A. Regression-Based Normative Formulae for the Repeatable Battery for the Assessment of Neuropsychological Status for Older Adults. Arch Clin Neuropsychol. 2015 Nov;30(7):600-4. doi: 10.1093/arclin/acv052. Epub 2015 Aug 18. PMID: 26289055.</li>" +
        "<li>Duff K, Patton D, Schoenberg MR, Mold J, Scott JG, Adams RL. Age- and education-corrected independent normative data for the RBANS in a community dwelling elderly sample. Clin Neuropsychol. 2003 Aug;17(3):351-66. doi: 10.1076/clin.17.3.351.18082. PMID: 14704885.</li>" +
        "<li>Novitski J, Steele S, Karantzoulis S, Randolph C. The Repeatable Battery for the Assessment of Neuropsychological Status effort scale. Arch Clin Neuropsychol. 2012 Mar;27(2):190-5. doi: 10.1093/arclin/acr119. Epub 2012 Jan 25. PMID: 22277124.</li>" +
        "<li>Silverberg ND, Wertheimer JC, Fichtenberg NL. An effort index for the Repeatable Battery For The Assessment Of Neuropsychological Status (RBANS). Clin Neuropsychol. 2007 Sep;21(5):841-54. doi: 10.1080/13854040600850958. PMID: 17676548.</li>" +
        "</ol>"


    TESTER = document.getElementById('tester');


    var trace1 = {
        x: ["Immediate Memory", "Visuospatial/Constructional", "Language", "Attention", "Delayed Memory"],
        y: [immediate_memory, visuospatial, language, attention, delayed_memory_index],

        mode: 'lines+markers',
        error_y: {
            type: "scatter",
            array: [0, 0, 0, 0, 0],
            visible: true
        },
        marker: {
            color: 'rgb(17, 157, 255)',
            size: 10,
            line: {
                color: 'rgb(128, 0, 128)',
                width: 2,
            },
        },


    };

    var trace2 = {
        x: ["Immediate Memory", "Visuospatial/Constructional", "Language", "Attention", "Delayed Memory"],
        y: [81, 96, 92, 82, 78],
        name: 'yaxis2 data',
        yaxis: 'y2',
        type: 'scatter',
        opacity: 0.0,
    };

    var trace3 = {
        x: ["Total Scale"],
        y: [total_scaled_score],
        name: 'overall',
        xaxis: 'x2',
        yaxis: 'y3',
        mode: 'lines+markers',
        error_y: {
            type: "scatter",
            array: [0, 0, 0, 0, 0],
            visible: true
        },
        marker: {
            color: 'rgb(17, 157, 255)',
            size: 10,
            line: {
                color: 'rgb(128, 0, 128)',
                width: 2,
                dash: 'dash',
            },
        },
    };

    var trace4 = {
        x: ["Immediate Memory", "Visuospatial/Constructional", "Language", "Attention", "Delayed Memory"],
        y: [Immediate_Memory_Duff_Index, Visuospatial_Duff_Index, Language_Duff_Index, Attention_Duff_Index, Delayed_Memory_Duff_Index],
        mode: 'lines+markers',
        error_y: {
            type: "scatter",
            array: [0, 0, 0, 0, 0],
            visible: true
        },
        dash: 'dash',
        marker: {
            color: 'rgb(255, 102, 0)',
            size: 10,
            line: {
                color: 'rgb(128, 0, 128)',
                width: 2,
            },
        },


    };

    var trace5 = {
        x: ["Total Scale Duff"],
        y: [Total_Scale_Duff_Index],
        name: 'overall',
        xaxis: 'x2',
        yaxis: 'y3',
        mode: 'lines+markers',
        error_y: {
            type: "scatter",
            array: [0, 0, 0, 0, 0],
            visible: true
        },
        marker: {
            color: 'rgb(255, 102, 0)',
            size: 10,
            line: {
                color: 'rgb(128, 0, 128)',
                width: 2,
            },
        },
    };

    var trace6 = {
        x: ["Immediate Memory", "Visuospatial/Constructional", "Language", "Attention", "Delayed Memory"],
        y: [Immediate_Memory_EPAD_Index, Visuospatial_EPAD_Index, Language_EPAD_Index, Attention_EPAD_Index, Delayed_Memory_EPAD_Index],
        mode: 'lines+markers',
        error_y: {
            type: "scatter",
            array: [0, 0, 0, 0, 0],
            visible: true
        },
        dash: 'dash',
        marker: {
            color: 'rgb(12,12,12)',
            size: 10,
            line: {
                color: 'rgb(235,52,52)',
                width: 2,
            },
        },


    };

    var trace7 = {
        x: ["Total Scale EPAD"],
        y: [Total_Scale_EPAD_Index],
        name: 'overall',
        xaxis: 'x2',
        yaxis: 'y3',
        mode: 'lines+markers',
        error_y: {
            type: "scatter",
            array: [0, 0, 0, 0, 0],
            visible: true
        },
        marker: {
            color: 'rgb(12,12,12)',
            size: 10,
            line: {
                color: 'rgb(235, 52, 52)',
                width: 2,
            },
        },
    };

    var trace8 = {
        x: ["Immediate Memory", "Visuospatial/Constructional", "Language", "Attention", "Delayed Memory"],
        y: [Immediate_Memory_EPADB_Index, Visuospatial_EPADB_Index, Language_EPADB_Index, Attention_EPADB_Index, Delayed_Memory_EPADB_Index],
        mode: 'lines+markers',
        error_y: {
            type: "scatter",
            array: [0, 0, 0, 0, 0],
            visible: true
        },
        dash: 'dash',
        marker: {
            color: 'rgb(56,80,3)',
            size: 10,
            line: {
                color: 'rgb(201,52,235)',
                width: 2,
            },
        },


    };

    var trace9 = {
        x: ["Total Scale EPAD"],
        y: [Total_Scale_EPADB_Index],
        name: 'overall',
        xaxis: 'x2',
        yaxis: 'y3',
        mode: 'lines+markers',
        error_y: {
            type: "scatter",
            array: [0, 0, 0, 0, 0],
            visible: true
        },
        marker: {
            color: 'rgb(195,235,52)',
            size: 10,
            line: {
                color: 'rgb(201,52,235)',
                width: 2,
            },
        },
    };

    var trace10 = {
        x: ["Immediate Memory", "Visuospatial/Constructional", "Language", "Attention", "Delayed Memory"],
        y: [Immediate_Memory_EPADC_Index, Visuospatial_EPADC_Index, Language_EPADC_Index, Attention_EPADC_Index,
            Delayed_Memory_EPADC_Index],
        mode: 'lines+markers',
        error_y: {
            type: "scatter",
            array: [0, 0, 0, 0, 0],
            visible: true
        },
        dash: 'dash',
        marker: {
            color: 'rgb(56,80,3)',
            size: 10,
            line: {
                color: 'rgb(201,52,235)',
                width: 2,
            },
        },


    };

    var trace11 = {
        x: ["Total Scale EPAD"],
        y: [Total_Scale_EPADC_Index],
        name: 'overall',
        xaxis: 'x2',
        yaxis: 'y3',
        mode: 'lines+markers',
        error_y: {
            type: "scatter",
            array: [0, 0, 0, 0, 0],
            visible: true
        },
        marker: {
            color: 'rgb(195,235,52)',
            size: 10,
            line: {
                color: 'rgb(201,52,235)',
                width: 2,
            },
        },
    };

    norm = document.getElementById("norm").value;

    if (norm=="randolph") { var title ="Randolph / Manual"
        var plot_data = [trace1, trace2, trace3]
    } else if (norm=="duff") { var title ="Duff (2015)"
        var plot_data = [trace2, trace4, trace5]
    }
    else if (norm=="epada") { var title = "EPAD A"
        var plot_data = [trace2, trace6, trace7]
    } else if (norm=="epadb") { var title = "EPAD B"
        var plot_data = [trace2, trace8, trace9]
    }   else if (norm=="epadc") {  var title = "EPAD C"
    var plot_data = [trace2, trace10, trace11]
    };


    var layout = {

        title: 'RBANS Indices (' + title + ")",
        showlegend: false,
        xaxis: {
            domain: [0, 0.8],
            title: 'Cognitive domain',
            titlefont: {
                family: 'Arial, sans-serif',
                size: 16,
                color: 'lightgrey'
            },
            autotick: false,
            ticks: 'outside',
            zeroline: true,
            tick0: 0,
            dtick: 0.25,
            ticklen: 0,
            tickwidth: 4,
            tickcolor: '#000',
            type: 'category',
        },
        yaxis: {
            title: 'Index score',
            titlefont: {
                family: 'Arial, sans-serif',
                size: 18,
                color: 'lightgrey'
            },
            autotick: false,
            ticks: 'outside',
            tick0: 0,
            dtick: 5,
            ticklen: 0,
            tickwidth: 0,
            tickcolor: '#000',
            range: [40, 160],

        },
        yaxis3: {
            title: 'Percentile',
            titlefont: {
                family: 'Arial, sans-serif',
                size: 18,
                color: 'lightgrey'
            },
            autotick: false,
            ticks: 'outside',
            tick0: 0,
            dtick: 5,
            ticklen: 0,
            tickwidth: 0,
            tickcolor: '#000',
            range: [40, 160],
            overlaying: 'y',
            side: 'right',
            dtick: 5,
            tickmode: "array", // If "array", the placement of the ticks is set via `tickvals` and the tick text is `ticktext`.
            tickvals: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160],
            ticktext: ['<0.1', '<0.1', '<0.1', '0.1', '0.4', '1', '2', '5', '9', '14', '25', '37', '50', '63',
                '75', '84', '91', '95', '98', '99', '99.6', '99.9', '>99.9', '>99.9', '>99.9'],
        },
        yaxis2: {
            title: 'Percentile',
            titlefont: {
                family: 'Arial, sans-serif',
                size: 18,
                color: 'lightgrey'
            },
            autotick: false,
            ticks: 'outside',
            tick0: 0,
            dtick: 5,
            ticklen: 0,
            tickwidth: 0,
            tickcolor: '#000',
            range: [40, 160],
            overlaying: 'y',
            side: 'right',
            dtick: 5,
            tickmode: "array", // If "array", the placement of the ticks is set via `tickvals` and the tick text is `ticktext`.
            tickvals: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160],
            ticktext: ['<0.1', '<0.1', '<0.1', '0.1', '0.4', '1', '2', '5', '9', '14', '25', '37', '50', '63',
                '75', '84', '91', '95', '98', '99', '99.6', '99.9', '>99.9', '>99.9', '>99.9'],
        },
        xaxis2: {
            domain: [0.9, 1],
            anchor: 'y3',
            autotick: true,
        },
//Line Horizontal
        shapes: [

            {
                type: 'rect',
                xref: 'x',
                yref: 'y',
                x0: 0,
                y0: 115,
                x1: 4,
                y1: 85,
                line: {
                    color: 'rgb(204, 255, 204)',
                    width: 0
                },
                fillcolor: 'rgb(204, 255, 204)',
                opacity: 0.2,
            },
            {
                type: 'rect',
                xref: 'x',
                yref: 'y',
                x0: 0,
                y0: 85,
                x1: 4,
                y1: 70,
                line: {
                    color: 'rgb(153, 255, 153)',
                    width: 0
                },
                fillcolor: 'rgb(153, 255, 153)',
                opacity: 0.2,
            },

            {
                type: 'rect',
                xref: 'x',
                yref: 'y',
                x0: 0,
                y0: 70,
                x1: 4,
                y1: 55,
                line: {
                    color: 'rgb(77, 255, 77)',
                    width: 0
                },
                fillcolor: 'rgb(77, 255, 77)',
                opacity: 0.2,
            },
            {
                type: 'rect',
                xref: 'x',
                yref: 'y',
                x0: 0,
                y0: 115,
                x1: 4,
                y1: 130,
                line: {
                    color: 'rgb(153, 255, 153)',
                    width: 0
                },
                fillcolor: 'rgb(153, 255, 153)',
                opacity: 0.2,
            },

            {
                type: 'rect',
                xref: 'x',
                yref: 'y',
                x0: 0,
                y0: 130,
                x1: 4,
                y1: 145,
                line: {
                    color: 'rgb(77, 255, 77)',
                    width: 0
                },
                fillcolor: 'rgb(77, 255, 77)',
                opacity: 0.2,
            },
            {
                type: 'rect',
                xref: 'x',
                yref: 'y',
                x0: 0,
                y0: 145,
                x1: 4,
                y1: 160,
                line: {
                    color: 'rgb(0, 204, 0)',
                    width: 0
                },
                fillcolor: 'rgb(0, 204, 0)',
                opacity: 0.2,
            },
            {
                type: 'rect',
                xref: 'x',
                yref: 'y',
                x0: 0,
                y0: 55,
                x1: 4,
                y1: 40,
                line: {
                    color: 'rgb(0, 204, 0)',
                    width: 0
                },
                fillcolor: 'rgb(0, 204, 0)',
                opacity: 0.2,
            },
            {
                type: 'rect',
                x0: 0,
                y0: 100,
                x1: 4,
                y1: 100,
                line: {
                    color: 'rgb(227, 63, 120)',
                    width: 2,
                    dash: 'dash',
                },
                fillcolor: 'rgb(0, 204, 0)',
                opacity: 0.99,


            },
            {
                type: 'rect',
                x0: 0,
                y0: fsiq,
                x1: 4,
                y1: fsiq,
                line: {
                    color: 'rgb(101, 80, 180)',
                    width: 2,
                    dash: 'dash',
                },
                fillcolor: 'rgb(0, 204, 0)',
                opacity: 0.99,


            },


        ],
    };

    Plotly.newPlot('tester', plot_data, layout);

    document.getElementById('graph_legend').innerHTML =
        "<p style='color:rgb(101, 80, 180)' ><em>-------- TOPF Estimated FSIQ</em></p>" +
        "<p style='color:rgb(227, 63, 120)' ><em>-------- Pop mean (Randolph)</em></p>";
}