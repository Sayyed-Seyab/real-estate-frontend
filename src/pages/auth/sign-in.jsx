import { StoreContext } from "@/context/Context";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useContext, useEffect, useState,  } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export function SignIn() {
  const {setAgentId,data,password, agentid, url, SetTostMsg,adminData, setAdminData} = useContext(StoreContext)
   const navigate = useNavigate();
   const [loading, setloading] = useState(true)
   const [Btnloading, setBtnloading] = useState(false)

  const [formData, SetFormData] = useState({
    email:"",
    password:""
  })

  const handleChange = (e)=>{
    const {name, value} = e.target
    SetFormData({...formData, [name]: value})
  }

  const setLocalStorageWithExpiry = (key, value, ttl) => {
    const now = new Date();
  
    const item = {
      value: value,
      expiry: now.getTime() + ttl, // Current time + Time-to-live (TTL)
    };
  
    localStorage.setItem(key, JSON.stringify(item));
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
  
    try {
      const response = await axios.post(`${data.url}/api/admin/login`, formData);
  
      console.log(response);
      
  
      if (response.data.token) {
        setBtnloading(true);
            SetTostMsg(response.data.message);
            localStorage.setItem("token", response.data.token);

            // Fetch admin data immediately after login
            const adminResponse = await axios.get(`${data.url}/api/admin/admin`, {
                headers: { Authorization: `Bearer ${response.data.token}` },
            });

            // Store in context
            setAdminData(adminResponse.data.message);

            setBtnloading(false);
            navigate('/dashboard/');
       
       
       
          // Pass token in the headers for the verify token request
        //   const verifyResponse = await axios.get(`${url}/api/admin/verifytoken`,{
        //     headers: {
        //       "Content-Type": "application/json",
        //       agentid,
        //       password,
        //       token,
             
        //     },
        //   });
        //   console.log(verifyResponse);
        //   if(verifyResponse.data.success){
        //    // Save verifyResponse data to localStorage for 2 minutes
        //    //24 hours 24 * 60 * 60 * 1000
        // setLocalStorageWithExpiry('adminData', verifyResponse.data, 1 * 60 * 60 * 1000);

        // const storedAdminData = localStorage.getItem('adminData');

        // if (storedAdminData) {
        //  setadmin(JSON.parse(storedAdminData));
           
        // } 
        
        // const AdminData = localStorage.getItem('adminData');
        // const Data = JSON.parse(AdminData)
        // if (Data) {
        //   const a = setadmin(Data);
        //   console.log(Data)
        //   setAgentId(Data.value.agentid)
        //     SetTostMsg(`Welcome to Dashboard ${verifyResponse.data.name}`);
        //     setBtnloading(false)
        //   navigate('/dashboard');
        //   }// Handle success
          
      
      // }else{
      //   toast.error(response.data.message);
      // }
    }else{
      toast.error(response.data.message);
    }
    }catch (error) {
      console.log('Login Error:', error);
    }
  };
  
  // useEffect(()=>{
  //   console.log(formData)
  // },[formData])

  useEffect(() => {
    // Simulating an async check, you can replace it with actual async operations if needed
    setTimeout(() => {
        setloading(false);
    }, 2000); // Adjust the delay as per your needs
   
    if(adminData){
      
     navigate('/dashboard')
   }
}, [adminData]);

    if(loading ){
        return   <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    }

  return (
    <section className="m-8 flex justify-center gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form  
        onSubmit={handleSubmit}
         className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              value={FormData.email}
              onChange={handleChange}
              name="email"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              value={FormData.password}
              onChange={handleChange}
              name="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          {/* <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          /> */}
           <Button type="submit" className="mt-6 flex justify-center items-center" fullWidth>
        {Btnloading ? (
          <>
            <span className="mr-2">Loading...</span>
            <div className="flex items-center justify-center h-1">
        <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-blue-500 border-solid"></div>
      </div>
          </>
        ) : (
          "SIGN IN"
        )}
      </Button>

          {/* <div className="flex items-center justify-between gap-2 mt-6">
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  Subscribe me to newsletter
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">
                Forgot Password
              </a>
            </Typography>
          </div>
          <div className="space-y-4 mt-8">
            <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth>
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1156_824)">
                  <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                  <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                  <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                  <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
                </g>
                <defs>
                  <clipPath id="clip0_1156_824">
                    <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                  </clipPath>
                </defs>
              </svg>
              <span>Sign in With Google</span>
            </Button>
            <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth>
              <img src="/img/twitter-logo.svg" height={24} width={24} alt="" />
              <span>Sign in With Twitter</span>
            </Button>
          </div>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography> */}
        </form>

      </div>
      {/* <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div> */}

    </section>
  );
}

export default SignIn;
