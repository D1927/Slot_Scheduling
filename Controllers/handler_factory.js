const api_feature = require("./../Utilities/features_of_api")
const app_error = require("./../Utilities/error_class")
const catch_async = require("./../Utilities/catch_error_for_async")

// To create new model 
exports.create_document = (Model) => catch_async(async(req , res , next) => {
    const doc = await Model.create(req.body)

    res
        .status(201)
        .json({
            status : "Success" ,
            message : `New ${Model.modelName} created !` ,
            data : {
                [Model.modelName] : doc
            }
        })
}) 

// To get all documents 
exports.get_all_document = (Model) => catch_async(async(req , res , next) => {
    const features = new api_feature(Model.find() , req.query).filter().sort().field().page()

    const doc = await features.query 

    res
        .status(200)
        .json({
            status : "Success" ,
            message : `Total ${doc.length} ${Model.modelName} are as follows :- ` ,
            data : {
                [Model.modelName] : doc
            }
        })
})

// To get document using id 
exports.get_document_by_id = (Model) => catch_async(async(req , res , next) => {
    let query = Model.findById(req.params.id)

    const doc = await query
    if (!doc)
        return next(new app_error(`No ${Model.modelName} found with that ID! ` , 404))
    
    res
        .status(200)
        .json({
            status : "Success" ,
            message : `The required ${Model.modelName} is :- ` ,
            data : {
                [Model.modelName] : doc
            }
        })
})

// To delete document using id 
exports.delete_document_by_id = (Model) => catch_async(async(req , res , next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc)
        return next(new app_error(`No ${Model.modelName} found with that ID!` , 404))

    res
        .status(204)
        .send()
})
