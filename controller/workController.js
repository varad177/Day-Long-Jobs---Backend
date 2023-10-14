

import Work from "../model/workModel.js"
import sendEmail from "../utils/sendEmail.js"
import User from "../model/userModel.js"


export const getWork = async (request, response) => {


    try {

        const {days} = request.body.days;
      
        const work = {
            workname: request.body.workname,
            days: request.body.days,
            city: request.body.city,
            email: request.body.email,
            longitude: request.body.longitude,
            latitude: request.body.latitude,
            mobileno: request.body.mobileno,
            desc :request.body.desc,
            worker :request.body.worker,
            date:request.body.date
            


        }

        console.log(work);


        const email = await User.find({});

        for (let i = 0; i < email.length; i++) {


            const subject = `new job at ${request.body.city}`;
            const message = "धन्यवाद";
             sendEmail(email[i].email, subject, message);


        }
      

        const newWork = new Work(work)
        await newWork.save();
        return response.status(200).json({
            message: "work added successfully",
        })
    } catch (error) {
        return response.status(500).json({
            message: "Error while adding the data"
        });

    }
}


export const getworkpost = async (request, response) => {

    try {
        const city = request.query.city;

        const posts = await Work.find({})


        return response.status(200).json(posts);


    } catch (error) {
        response.status(500).json({ message: error.message });

    }

}

export const getpostbyid = async (request, response) => {
    try {
        const id = request.params.id;

        const post = await Work.findById(id)



        return response.status(200).json(post);



    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

export const deletebyid = async (request, response) => {
    try {

        await Work.findByIdAndDelete(request.params.id)
        // if (!post) {
        //   return response.status(404).json({ message: "post not found" });
        // }

        // await post.delete();
        return response.status(200).json({ message: 'post deleted succesfully' });



    } catch (error) {
        return response.status(500).json({ message: error.message });

    }

}