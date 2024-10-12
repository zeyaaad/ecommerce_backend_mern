export default class ApiFeatures{

    constructor(Query,req){
        this.Query = Query;
        this.req= req
    }
    pangination(){
        let limit=16
        let page=this.req.page * 1 || 1;
        if(page<1) page=1;
        let skip=(page-1)*limit;
        this.page=page
        this.limit=limit
        this.Query.skip(skip).limit(limit)
        return this
    }
    filter(){
        let filterObj={...this.req};
        let exStrings=["page","sort","keyword","fields"];
        exStrings.forEach((q)=>{
            delete filterObj[q];
        })
        filterObj=JSON.stringify(filterObj);
        filterObj=filterObj.replace(/\bgt|gte|lt|lte\b/g,match=> `$${match}`);
        filterObj=JSON.parse(filterObj);
        this.Query.find(filterObj)
        return this
    }

    sort(){
        if(this.req.sort) {
            let sortBy=this.req.sort.split(",").join(" ");
            this.Query.sort(sortBy);
        }
        return this
    }

    search(){
        if (this.req.keyword) {
        this.Query.find({
            $or: [
                { title: { $regex: this.req.keyword, $options: "i" } },
                { name: { $regex: this.req.keyword, $options: "i" } },
                { description: { $regex: this.req.keyword, $options: "i" } }
            ]
        });
    }
    return this
    }
    fields(){
        if(this.req.fields){
            let fields=this.req.fields.split(",").join(" ");
            this.Query.select(fields)
        }
        return this

    }

}