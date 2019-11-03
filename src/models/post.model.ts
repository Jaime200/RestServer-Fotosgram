import { Schema, Document, model} from 'mongoose'

const postSchema = new Schema({
    created:{ 
        type: Date
    },
    mensaje:{
        type: String
    },
    imgs: [{
        type:String
    }],
    coords:{
        type:String //Lat Lng
    },
    usuario:{
        type : Schema.Types.ObjectId,
        ref:'Usuario',
        require: [ true, 'Debe existir una referencia a un usuario' ]
    }
})

postSchema.pre<IPost>('save', function( next ){
    this.created = new Date()
    next();
})



export interface IPost extends Document{
    created :Date;
    mensaje : string;
    imgs: string[]
    coords : string
    usuario : Schema.Types.ObjectId
}


export const Post = model<IPost>('Post', postSchema)