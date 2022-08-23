
predictFunction <- function(model, index){
  z_scores <- (index - predict(model, rbans_cleaned))/summary(model)$sigma
  new_index <- 100 + (z_scores*15)
  return(new_index)
}


get_r_squared <- function(model_name){
  rsq <- summary(model_name)$r.squared
  return(rsq)
}

get_f_statistic <- function(model_name){
  fstat <- summary(model_name)$fstatistic[1]
  return(fstat)
}

get_df <- function(model_name){
  df <- summary(model_name)$df[2]
  return(df)
}

get_sigma <- function(model_name){
  sigma <- summary(model_name)$sigma
  return(sigma)
}

get_coefficients <- function(model_name){
  coef <- model_name$coefficients
  return(coef)
}

csf_cleaner <- function(abeta_vector){
  abeta_vector[abeta_vector == ">1700"] <- "1700"
  abeta_vector[abeta_vector == "<200"] <- "200"
  return(as.numeric(abeta_vector))
}

replace_function <- function(column1, column2){
  for(i in 1:length(column1)){
    if (is.na(column1[i])){
      # do nothing
    }
    else if (column1[i]==1700){
      column1[i] <- column2[i]
    }
  }
  return(column1)
}

get_results <- function(list_of_models){
  rsq <- lapply(list_of_models, FUN=get_r_squared) %>% unlist()
  fstat <- lapply(list_of_models, FUN=get_f_statistic) %>% unlist()
  df <- lapply(list_of_models, FUN=get_df) %>% unlist()
  sigma <- lapply(list_of_models, FUN=get_sigma) %>% unlist()
  coef <- lapply(list_of_models, FUN=get_coefficients)
  coef_tibble <- as_tibble(do.call(rbind, coef))  
  results <- cbind(coef_tibble,
    rsq, fstat, df, sigma)
  return(as_tibble(results))
}


replace_995 <- function(vector){
  v <- vector
  v[v == 995] <- NA
  return(v)
  
}

get_index <- function(data_frame,
                      age_years,
                      down,
                      across){
  age_group = 10*floor(age_years/10)
  val <- data_frame[data_frame[,1]==age_group,][down+1,across+2]
  return(as.numeric(val))
}



