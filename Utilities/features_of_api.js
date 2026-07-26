const qs = require("qs") 

class api_feature {
    constructor(query , query_str) {
        this.query = query 
        this.query_str = query_str 
    }

    filter () { // For filtering 
        let query_obj = qs.parse(this.query_str) 

        const exclude_fields = ["fields" , "sort" , "limit" , "page"] 
        exclude_fields.forEach(el => delete query_obj[el]) 

        let query_str = JSON.stringify(query_obj) 
        query_str = query_str.replace((/\b(gte|gt|lte|lt)\b/g) , matching_char => `$${matching_char}`) 

        this.query = this.query.find(JSON.parse(query_str)) 
        return this
    }

    sort () { // For sorting
        if (this.query_str.sort) { 
            const sort_of = this.query_str.sort.split(",").join(" ") 
            this.query = this.query.sort(sort_of)
        } 
        else 
            this.query = this.query.sort("-createdAt")
        return this
    }

    field () { // Limit Fields
        if (this.query_str.fields) {
            const field_of = this.query_str.fields.split(",").join(" ") 
            this.query = this.query.select(field_of) 
        }
        else
            this.query = this.query.select("-__v") 
        return this
    }

    page () { // Pagination
        const page = this.query_str.page * 1 || 1
        const limit = this.query_str.limit * 1 || 10
        const skip = (page - 1) * limit // 
        
        this.query = this.query.limit(limit).skip(skip) 
        return this
    }
}

module.exports = api_feature