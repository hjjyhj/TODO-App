import React, {useState} from 'react'

const Auth = () => {
  const [isLogIn, setIsLogIn] = useState(true)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [error, setError] = useState(null)

  const viewLogin = (status) => {
    setError(null)
    setIsLogIn(status)
  }

  const handlesubmit = async (e, endpoint) => {
    email.preventDefault()
    if (!isLogIn && password !== confirmPassword) {
      setError('Make sure password match')
      return
    }
    
    await fetch (`${process.env.REACT_APP_SERVERURL}/${endpoint}`)
  }
  return (

    <div className="auth-container">
      <div className="auth-container-box">
        <form>
          <h2>{isLogIn ? 'Please log in' : 'Please sign up'}</h2>
          <input type="email" placeholder='email'/>
          <input type="password" placeholder='password'/>
          {!isLogIn && <input type="password" placeholder='confirm password'/>}
          <input type="submit" className="create" onClick = {(e) => handlesubmit(e, isLogIn ? 'login' : 'signup')}/>
          {error && <p>{error}</p>}
        </form>
        <div className="auth-options">
          <button 
            onClick={() => viewLogin(false)}
            style={{backgroundColor: !isLogIn ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}
          >Sign Up</button>
          <button 
            onClick={() => viewLogin(true)}
            style={{backgroundColor: isLogIn ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}
          >Log In</button>
        </div>

      </div>
    </div>
  )
}

export default Auth