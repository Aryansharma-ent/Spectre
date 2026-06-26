import { Document, Schema,model } from "mongoose";

interface IProject extends Document {
    name: string;
    stagingUrl: string;
    productionUrl: string;
    createdAt: Date;
    apikey? : string
}

const ProjectModel = new Schema<IProject>({
    name: {
        type: String,
        required: [true, "Project name is required"],
        trim: true,
    },
    stagingUrl: {
        type: String,
        required: [true,"Staging URL is required"],
        trim : true
    },
    productionUrl: {
        type: String,
        required: [true,"Production URL is required"],
        trim : true
    },

    createdAt : {
        type : Date,
        default : Date.now
    },
    apikey : {
        type : String,
        trim : true,
    }
});


export default model<IProject>('Project',ProjectModel) ;