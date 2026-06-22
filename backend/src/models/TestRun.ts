import mongoose ,{Schema,model,Document} from "mongoose";

export interface ITestRun extends Document{
    projectId :  mongoose.Types.ObjectId 
    status : 'PASSED' | 'FAILED' | 'RUNNING'
    mismatchPercentage : number
    totalPixelsCompared : number
    mismatchPixelsCount : number
    stagingUrl?: string    
    productionUrl?: string   
    stagingScreenshotUrl : string,
    productionScreenshotUrl : string,
    diffScreenshotUrl : string,
    visualBugs : Array<{
       element : string
       description : string
       location : {
         x : number
         y : number
         width : number
         height : number
       }

       aiSuggestion? : {
        explanation : string
        cssFix : string
       }
    }>

    createdAt : Date
}


const TestRunSchema = new Schema<ITestRun>({
    projectId : {
        type : Schema.Types.ObjectId,
        ref : 'Project',
        required : [true,"Project refrence is required"]
    },

    status : {
        type : String,
        enum : ['PASSED','FAILED','RUNNING'],
        required : true,
    },
   
     stagingUrl: { type: String, required: false },    
    productionUrl: { type: String, required: false },  
  mismatchPercentage: { type: Number, required: true },
  totalPixelsCompared: { type: Number, required: true },
  mismatchPixelsCount: { type: Number, required: true },
  stagingScreenshotUrl: { type: String, required: true },
  productionScreenshotUrl: { type: String, required: true },
  diffScreenshotUrl: { type: String, required: true },
  
  visualBugs : [
    {
        element : {type : String, required : true},
         description : {type : String, required : true},
         location : {
            x : {type : Number, required : true},
            y : {type : Number, required : true},
            width : {type : Number, required : true},
            height : {type : Number, required : true}
         },
         aiSuggestion : {
            explanation : {type : String},
            cssFix : {type : String},
         } 
    }
  ],

  createdAt : {
      type : Date,
      default : Date.now
  }


})



export default model<ITestRun>('TestRun',TestRunSchema)