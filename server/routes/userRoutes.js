import express from 'express'
import { 
    applyForJob, 
    getUserData, 
    getUserJobApplications, 
    updateUserResume,
    registerUser // ✅ added
} from '../controllers/userController.js'
import upload from '../config/multer.js'

const router = express.Router()

// Get user Data
router.get('/user', getUserData)

// ✅ ADD THIS (was missing)
router.post('/register', registerUser)

// Apply for a job
router.post('/apply', applyForJob)

// Get applied jobs data
router.get('/applications', getUserJobApplications)

// Update user profile (resume)
router.post('/update-resume', upload.single('resume'), updateUserResume)

export default router;