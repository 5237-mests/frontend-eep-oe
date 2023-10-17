import React, { useState, useContext } from 'react';
import {Helmet} from 'react-helmet';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/esm/Button'
import {StatesContext} from './StatesContext'
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import '../CSS/Login.css';
import favicon from '../assets/images/favicon-16x16.png'
import API from './API'

function Login() {
  const con=process.env.REACT_APP_API;
  console.log(con);
  const {setLogged, setUserid, setIsAuthenticated, setIsAdmin} = useContext(StatesContext)
  
  const {
    register,
    handleSubmit
    
  } = useForm();

  const [data, setData] = useState({})
  let [err, setErr] = useState(false);
  let navigate = useNavigate()

  // function which collect or update data from user
  const updateData = (e) =>{
      setData({
          ...data, [e.target.name]:e.target.value
      })
  }

  // function which checks user is eligble for exam?
  const sendData = async ()=>{   
    const csrf = await API.get(`auth/getcsrf/`)  
     //free to get csrf
    API.defaults.headers["X-CSRFToken"] = `${csrf.data.csrftoken}`; // for all post req
    const logResp = await API.post(`auth/login`, data) //try to login user
    if (logResp.status === 200)
    {
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", true); 
      const resp = await API.get(`api/users/${data.username}/`)  // get who is logged in isAdmin is_staff
      setLogged(true)
      setUserid(data.username)
      const superuser = resp.data.is_superuser
      if (superuser)
      {
        setIsAdmin(true)
        localStorage.setItem("isAdmin", true)
      }
      else {
        setIsAdmin(false)
        localStorage.setItem("isAdmin", false)
      }
      localStorage.setItem("logged", true)
      localStorage.setItem("userid", data.username)
      navigate("/")
    }
    else{
      setIsAuthenticated(false);
      localStorage.setItem("isAuthenticated", false);
      localStorage.setItem("logged", false);
      setLogged(false);
      setErr(true);
    }
  }

  return (
   <div>
      <Helmet>
        <title >Login Page</title>
        <link rel="icon" type="image/png" href={favicon} sizes="16x16"/>
      </Helmet>
      <div className='log'>
        <div className=' py-5 ms-auto me-auto'>
          {
            <Form className='formlog' onSubmit={handleSubmit(sendData)}>
                {err && <span className='text-danger'>UserName and or Password is Incorrect</span>}
                <div className='container'>
                    <div className='row'>
                      <Form.Group className="mb-3 " controlId="formBasicEmail">
                        <Form.Label className='row'>UserName: 
                          <Form.Control  type="text" {...register('username', { required: true })} onChange={updateData}/>
                        </Form.Label>  
                      </Form.Group>
                    </div>

                    <div className='row'>
                      <Form.Group className="mb-3 " controlId="formBasicPassword">
                        <Form.Label className='row'>Password: 
                          <Form.Control  type="password" {...register('password', { required: true })} onChange={updateData}/>
                        </Form.Label>
                      </Form.Group>
                    </div>

                    <div className='row pb-3'>
                      <Button variant="primary" type="submit" onClick={sendData}>
                        Login
                      </Button>
                    </div>
                    
                    <p className='text-light'> Don't have an account? <Link to='/register'>SignUp</Link></p>
                    <p className='text-light'> Forget password? <Link to='/reset-password'>reset password</Link></p>
                </div>

            </Form>
          }
        </div>
      </div>
  </div>
  )
}

export default Login;
