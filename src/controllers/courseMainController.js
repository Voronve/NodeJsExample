import fs from 'fs';
import CourseMain from '../models/CourseMain.js';
import Client from '../models/Client';
import {prepareIcon} from '../helpers';

exports.getCoursesList = async (req, res) => {
    try {
        const data = await CourseMain.find();
        if(!data.length){
            res.status(200).send('Курсів не знайдено');
            return;
        }
        res.status(200).send(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.addCourse = async (req, res) => {
    try{
        const {name, description, price, time} = req.body;
        if(!name || !description || !req.files.icon){
            res.status(400).send('Будь ласка, введіть всі дані');
            return;
        }else{
            let icon = null;
            if (req.files) {
                icon = req.files.icon[0].path.split('public')[1];
            };
            let cource = new CourseMain({name, description, price, time, icon});
            cource.save(); 
            res.status(200).send(cource);
        } 
    } 
    catch (err) {
        res.sendStatus(500);
    }
};

exports.getCourse = async (req, res) => {
    const { id } = req.query;
    try{
        const course = await CourseMain.findById(id);
        if(course){  
            res.status(200).send(course);
        }else{
            res.send('Курсів не знайдено');
        }
    }catch (err){
        res.sendStatus(500);
    }
};

exports.editCourse = async (req, res) => {
    try{
        let id = req.query.id;
        let{name, description, price, time, icon} = req.body;
        console.log(req.body);
        if (req.files.icon) {
            icon = await prepareIcon(id, req.files.icon, CourseMain/*'Cource'*/);
        }
        console.log('Second breakpoint', icon);
        await CourseMain.findByIdAndUpdate(id, {
            $set: {
                name,
                time,
                price,
                description,
                icon,
            },
        });
        let course = await CourseMain.findById(id);
        res.status(200).send(course);
    }catch(err){
        res.sendStatus(500);
    }
};

exports.deleteCourse = async(req, res) =>{
    try{
        let id = req.query.id;
        console.log(req.query.id);
        let clientsId;
        //Спочатку знаходимо в курсі, який треба видалити, ід-хи
        //всіх клієнтів цього курсу, і видаляєм їх   
        let course = await CourseMain.findById(id);
        console.log(course);
        clientsId = course.client;
        console.log(clientsId);
        clientsId.forEach((clientId) => {
            console.log(clientId);
            Client.findByIdAndRemove(clientId, (err, removedClient) =>{
                console.log(removedClient);
            });
        });
         
        //Потім видаляємо сам курс (окремо видаливши прив'язані до нього 
        // зображення).
        await CourseMain.findByIdAndRemove(id, (err, deletedCourse) =>{
            if(deletedCourse.icon){
                fs.unlink('public' + deletedCourse.icon, (err) => { if (err) console.log(err) });
            }
            res.status(200).send(deletedCourse);
        });
    }
    catch(err){
        res.sendStatus(500);
    }
};