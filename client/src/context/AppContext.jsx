import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const { isLoaded, isSignedIn } = useUser()
    const { getToken } = useAuth()

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    })

    const [isSearched, setIsSearched] = useState(false)

    const [jobs, setJobs] = useState([])

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)

    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplications] = useState([])

    const [userLoading, setUserLoading] = useState(true)

    const fetchJobs = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/jobs')
            if (data.success) setJobs(data.jobs)
        } catch (error) {
            toast.error(error.message)
        }
    }
    const fetchCompanyData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/company/company',
                { headers: { token: companyToken } }
            )
            if (data.success) setCompanyData(data.company)
        } catch (error) {
            toast.error(error.message)
        }
    }
    const fetchUserData = async () => {
        try {

            setUserLoading(true)

            const token = await getToken()

            const { data } = await axios.get(
                backendUrl + '/api/users/user',
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success && data.user) {
                setUserData(data.user)
            } else {
                throw new Error("User not found")
            }

        } catch (error) {

    try {
        const token = await getToken()

        const { data } = await axios.post(
            backendUrl + '/api/users/register',
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        )

        if (data.success && data.user) {
            setUserData(data.user)
        } else {
            setUserData(null)
        }

    } catch (err) {
        console.log("REGISTER ERROR:", err.response?.data || err.message)
        setUserData(null)
    }
} finally {
            setUserLoading(false)
        }
    }

    const fetchUserApplications = async () => {
        try {
            const token = await getToken()

            const { data } = await axios.get(
                backendUrl + '/api/users/applications',
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) setUserApplications(data.applications)

        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        fetchJobs()

        const storedCompanyToken = localStorage.getItem('companyToken')
        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)
        }
    }, [])

    useEffect(() => {
        if (companyToken) fetchCompanyData()
    }, [companyToken])

    useEffect(() => {

        if (!isLoaded) return

        if (isSignedIn) {
            fetchUserData()
            fetchUserApplications()
        } else {
            setUserData(null)
            setUserApplications([])
            setUserLoading(false)
        }

    }, [isLoaded, isSignedIn])

    const value = {
        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        jobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData,
        backendUrl,
        userData,
        userApplications,
        fetchUserData,
        fetchUserApplications,
        userLoading   // ✅ expose this
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}