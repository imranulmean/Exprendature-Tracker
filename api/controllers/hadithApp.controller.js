import { hadithAppActivation } from "../models/hadithAppActivation.model.js";
import HadithBlog from "../models/hadithBlog.model.js";

export const checkActivation = async (req, res) => {
    try {

        const { deviceId } = req.body;

        if (!deviceId || deviceId === undefined || deviceId === "" || deviceId === 'undefined') {
            return res.status(400).json({
                success: false,
                message: "Device ID is required"
            });
        }

        let device = await hadithAppActivation.findOne({ deviceId });

        // First installation
        if (!device) {

            const today = new Date();

            const trialEnd = new Date(today);
            trialEnd.setDate(trialEnd.getDate() + 30);

            device = await hadithAppActivation.create({
                deviceId,
                firstInstall: today,
                trialStart: today,
                trialEnd,
                activated: 1
            });

        } else {

            if (new Date() > device.trialEnd) {
                device.activated = 0;
                await device.save();
            }

        }

        return res.json({
            success: true,
            message: "Activation information",
            data: {
                deviceId: device.deviceId,
                firstInstall: device.firstInstall,
                trialStart: device.trialStart,
                trialEnd: device.trialEnd,
                activated: device.activated
            }
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

export const getAllDevice = async(req, res)=>{
    try{
        let devices = await hadithAppActivation.find({}).sort({updatedAt:-1});
        res.json({ success: true, message:devices });
    }catch(err){
        res.json({success: false, message: err.message })
    }    
} 

export const extendActivation = async(req, res)=>{
    const { deviceId, extentionDays } = req.body;
    try{
        let device = await hadithAppActivation.findOne({ deviceId });
        if (!device) {
            return res.json({success: false, message:"No device Found"});
        }
        const today = new Date();
        const trialEnd = new Date(today);
        trialEnd.setDate(trialEnd.getDate() + Number(extentionDays));
        device.trialStart = today;
        device.trialEnd = trialEnd;
        device.activated = 1;
        await device.save();
        res.json({ success: true, message:device });
    }catch(err){
        res.json({success: false, message: err.message })
    }
}

export const deleteDevice = async(req, res)=>{
    const { deviceId } = req.body;
    try{
        let device = await hadithAppActivation.findOneAndDelete({ deviceId });
        if (!device) {
            return res.json({success: false, message:"No device Found"});
        }
        res.json({ success: true, message:"Device Deleted" });
    }catch(err){
        res.json({success: false, message: err.message })
    }
}

export const getDevsPhone= async(req, res) =>{
    const { deviceId } = req.body;
    try{
        let device = await hadithAppActivation.findOne({ deviceId });
        if (!device) {
            return res.json({success: false, message:"No device Found"});
        }
        const nums=[
            {
                'name':"Number 1",
                'num':'+8801771946713' 
            },
            {
                'name':"Number 2",
                'num':'+8801918686394' 
            },             
        ];

        res.json({ success: true, message:nums });
    }catch(err){
        res.json({success: false, message: err.message })
    }
}


export const getHadithBlogs = async(req, res)=>{
    try{

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const q = req.query.q || "all";

        let filter = {};

        if (q !== "all") {
            filter = {
                tags: {
                    $regex: `^${q}$`,
                    $options: "i"
                }
            };
        }

        const total = await HadithBlog.countDocuments(filter);

        const hadithBlogs = await HadithBlog
            .find(
                filter,
                "userId title shortDesc tags createdAt updatedAt"
            )
            .skip(skip)
            .limit(limit)
            .sort({ updatedAt: -1 });

        return res.json({
            success: true,
            message: hadithBlogs,
            totalPages: Math.ceil(total / limit),
            total,
            page,
            limit
        });
        
    }catch(error){
        res.json({success: false, message: error.message});
    }
}

export const getSingleHadithBlog = async(req, res)=>{
    try{
        const { id }= req.params;
        const hadithBlog= await HadithBlog.findOne({ _id: id });
        res.json({success: true, message: hadithBlog});
    }catch(error){
        res.json({success: false, message: error.message});
    }
}

export const createHadithBlog = async(req, res)=>{
    try{
        const newHadithBlog= new HadithBlog(req.body);
        await newHadithBlog.save();
        res.json({success: true, message: 'Blog Created'});
    }catch(error){
        res.json({success: false, message: error.message});
    }

} 

export const updateHadithBlog = async(req, res)=>{
    try{
        const existingBlog= await HadithBlog.findByIdAndUpdate(
            {_id: req.body._id},
            { $set: req.body }, 
            { new:true }
        );
        res.json({success: true, message: 'Blog Update'});
    }catch(error){
        res.json({success: false, message: error.message});
    }
}

export const deleteHadithBlog = async(req, res)=>{
    try{
        const {blogId} = req.body;
        const existingBlog= await HadithBlog.findByIdAndDelete({_id:blogId});
        res.json({success: true, message: 'Blog Deleted'});
    }catch(error){
        res.json({success: false, message: error.message});
    }
}

export const getUniqueHadithBlogTags = async (req, res) => {

    try {

        const tags = await HadithBlog.aggregate([
            { $unwind: "$tags" },
            {
                $group: {
                    _id: { $toLower: "$tags" },
                    tag: { $first: "$tags" }
                }
            },
            { $sort: { tag: 1 } }
        ]);

        res.json({ success: true, message: tags.map(item => item.tag)});

    } catch (error) {

        res.json({ success: false, message: error.message });

    }
};
