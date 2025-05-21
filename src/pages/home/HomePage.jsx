import { useAuth } from '../../context/AuthContext';
import Login from '../../auth/Login';

export default function HomePage() {

    const {user} = useAuth();
    console.log(user);


    return(
        <>
        {user ? <h1 className="text-4xl font-bold text-center my-6 text-black bg-clip-text  drop-shadow-lg"> {'Welcome,  ' + user.user_metadata.full_name} </h1> : <Login />  }
      
        </>
    )
}