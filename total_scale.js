

var SD = 15
var DIFF = total_scaled_score - 100
var Z = DIFF/SD


var centile = (100*GetZPercent(Z)).toFixed(1)

this.getField('RBANSTotalCentile').value = centile


