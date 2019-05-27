import express from 'express';
import multer from 'multer';
import { upload } from '../../helpers';
import {
  addCourse,
  getCoursesList,
  getCourse,
  editCourse,
  deleteCourse,
} from '../../controllers/courseMainController';

const router = express.Router();

router
  .route('/single')
  .get(getCourse)
  .post(upload, addCourse)
  .put(upload, editCourse)
  .delete(deleteCourse);

router.route('/').get(getCoursesList);

export default router;
