function loFunction(field_1_name, field_1_value, field_2_name, field_2_value, sum_field_name){

    first_value = this.getField(field_1_name).value
    second_value = this.getField(field_2_name).value

    total_score = 0

    if (first_value == field_1_value) {
        total_score++;
    }

    if (second_value == field_2_value) {
        total_score++;
    }
    this.getField(sum_field_name).value = total_score
    return total_score;
}

loFunction("LOSampleResponse1", 1, "LOSampleResponse2", 7, "LOSampleResponseSum")
loFunction("LOResponse1A", 10, "LOResponse1B", 12, "LOResponse1Sum")
loFunction("LOResponse2A", 4, "LOResponse2B", 11, "LOResponse2Sum")
loFunction("LOResponse3A", 6, "LOResponse3B", 9, "LOResponse3Sum")
loFunction("LOResponse4A", 8, "LOResponse4B", 13, "LOResponse4Sum")
loFunction("LOResponse5A", 2, "LOResponse5B", 4, "LOResponse5Sum")
loFunction("LOResponse6A", 1, "LOResponse6B", 6, "LOResponse6Sum")
loFunction("LOResponse7A", 3, "LOResponse7B", 10, "LOResponse7Sum")
loFunction("LOResponse8A", 5, "LOResponse8B", 8, "LOResponse8Sum")
loFunction("LOResponse9A", 1, "LOResponse9B", 3, "LOResponse9Sum")
loFunction("LOResponse10A", 11, "LOResponse10B", 13, "LOResponse10Sum")
