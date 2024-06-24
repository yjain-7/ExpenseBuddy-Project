import logo from './EB.png'; // Importing the image file

export default function Header() {
    return (
        <>
            <div className="flex justify-between items-center">
                <div><img src={logo} alt="ExpenseBuddy" width="200" height="200" className="pt-3"/></div>
                <div className="flex space-x-4 pr-4 pt-3">
                    <Button name="Login"></Button>
                    <Button name="SignUp"></Button>
                </div>

            </div>
        </>
    );
}

function Button({ name , redirect}) {
    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {name}
        </button>
    )
}

